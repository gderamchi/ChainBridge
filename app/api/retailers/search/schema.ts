import { z } from 'zod';

export const SearchRetailersSchema = z.object({
  productGroup: z.string().describe("The product category to filter by (e.g., 'Functional', 'Cotton')"),
  page: z.coerce.number().int().min(1).default(1).describe("Page number for pagination")
});

export type SearchRetailersParams = z.infer<typeof SearchRetailersSchema>;
