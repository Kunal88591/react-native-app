import type { ProductsResponse } from '../types/product';

const BASE_URL = 'https://dummyjson.com';

interface FetchProductsParams {
  limit: number;
  skip: number;
}

export async function fetchProducts(
  params: FetchProductsParams,
): Promise<ProductsResponse> {
  const searchParams = new URLSearchParams({
    limit: String(params.limit),
    skip: String(params.skip),
  });

  const response = await fetch(`${BASE_URL}/products?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as ProductsResponse;
}
