# Retailer Search API Roadmap

## Phase 1: Product Groups Endpoint
- [x] Create `/app/api/product-groups/route.ts`.
- [x] Import `scripts/data/productGroups.json`.
- [x] Implement GET handler returning the JSON data.
- [x] Ensure Supabase Auth client validation is in place.

## Phase 2: Retailer Search Endpoint
- [ ] Create `/app/api/retailers/search/schema.ts` defining the Zod schema.
- [ ] Create `/app/api/retailers/search/route.ts`.
- [ ] Implement Supabase client initialization (server-side).
- [ ] Validate request Query Params using the Zod schema.
- [ ] Implement DB query: Select from `retailers` where `category->>product` equals the query param.
- [ ] Apply pagination (Limit 10, Offset based on page).
- [ ] Apply RLS policies or server-side auth check to ensure only authenticated users can access.

## Phase 3: Middleware & Security
- [ ] Update `middleware.ts` to include a specific path matcher for `/api/*`.
- [ ] Create a placeholder function `checkRateLimit(req)` that returns true.
- [ ] Integrate this check into the middleware flow for the search endpoints.
