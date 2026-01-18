# Retailer Search API Roadmap

## Phase 1: Product Groups Endpoint
- [x] Create `/app/api/product-groups/route.ts`.
- [x] Import `scripts/data/productGroups.json`.
- [x] Implement GET handler returning the JSON data.
- [x] Ensure Supabase Auth client validation is in place.

## Phase 2: Retailer Search Endpoint
- [x] Create `/app/api/retailers/search/schema.ts` defining the Zod schema.
- [x] Create `/app/api/retailers/search/route.ts`.
- [x] Implement Supabase client initialization (server-side).
- [x] Validate request Query Params using the Zod schema.
- [x] Implement DB query: Select from `retailers` where `category->>product` equals the query param.
- [x] Apply pagination (Limit 10, Offset based on page).
- [x] Apply RLS policies or server-side auth check to ensure only authenticated users can access.

## Phase 3: Middleware & Security
- [x] Update `middleware.ts` to include a specific path matcher for `/api/*`.
- [x] Create a placeholder function `checkRateLimit(req)` that returns true.
- [x] Integrate this check into the middleware flow for the search endpoints.
