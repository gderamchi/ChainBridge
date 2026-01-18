# Retailer Search API Specification

## Overview
This API allows authenticated clients to retrieve a list of available product groups and search for retailers based on those groups.

## Endpoints

### 1. Get Product Groups
Returns the list of all available product categories.

- **URL:** `/api/product-groups`
- **Method:** `GET`
- **Authentication:** Supabase JWT (Bearer Token) required.
- **Response:**
  - Status: 200 OK
  - Body: JSON Array of strings (from `productGroups.json`)

### 2. Search Retailers
Search for retailers that match a specific product group.

- **URL:** `/api/retailers/search`
- **Method:** `GET`
- **Authentication:** Supabase JWT (Bearer Token) required.
- **Query Parameters:**
  - `productGroup` (required): The product group to filter by. Matches against `category->>product` in the database.
  - `page` (optional): Page number for pagination (default: 1).
- **Constraints:**
  - **Limit:** Max 10 results per request.
- **Database Query Logic:**
  - Use Supabase JSONB filtering: `.contains('category', { 'product': productGroup })` or text search on the JSON key `.eq('category->>product', productGroup)`.

## Middleware
- **Rate Limiting Placeholder:**
  - A middleware function intercepting these routes.
  - Current logic: `next()` (Allow all).
  - Designed to easily swap in a rate-limiting library (e.g., `upstash/ratelimit`) later.

## Validation & Schemas (LLM/MCP Ready)
All endpoints must use **Zod** for request validation. The schemas should be exported to be easily consumable by LLM agents or MCP servers.

### Search Query Schema
```typescript
import { z } from 'zod';

export const SearchRetailersSchema = z.object({
  productGroup: z.string().describe("The product category to filter by returned by the /product-groups endpoint (e.g., 'Functional', 'Cotton')"),
  page: z.coerce.number().int().min(1).default(1).describe("Page number for pagination")
});
```

## Authentication
- Validates standard Supabase JWT sent in the `Authorization` header.
