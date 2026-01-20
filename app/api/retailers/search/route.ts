import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SearchRetailersSchema } from './schema';

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // // 1. Authentication Check
  // const {
  //   data: { user },
  //   error: authError,
  // } = await supabase.auth.getUser();

  // if (authError || !user) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  // 2. Validate Query Parameters
  const { searchParams } = new URL(request.url);
  const paramsResult = SearchRetailersSchema.safeParse({
    productGroup: searchParams.get('productGroup'),
    page: searchParams.get('page') || undefined, 
  });

  if (!paramsResult.success) {
    return NextResponse.json(
      { error: 'Invalid parameters', details: paramsResult.error.format() },
      { status: 400 }
    );
  }

  const { productGroup, page } = paramsResult.data;
  const PAGE_SIZE = 10;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // 3. Database Query
  const adminSupabase = await createClient(process.env.SUPABASE_SECRET_KEY);

  let query = adminSupabase.from('retailers').select('*');
  
  if (productGroup) {
      const terms = productGroup.split(/\s+/).filter(Boolean);
      if (terms.length > 0) {
        // Construct an OR filter for each term using ILIKE
        // category->>product ilike %term1% OR category->>product ilike %term2% ...
        const orFilter = terms
          .map(term => `category->>product.ilike.%${term}%`)
          .join(',');
        query = query.or(orFilter);
      }
  }
  
  const { data: retailers, error: dbError } = await query.range(from, to);

  if (dbError) {
    console.error('Database error:', dbError);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

  return NextResponse.json({
    data: retailers,
    page,
    limit: PAGE_SIZE
  });
}
