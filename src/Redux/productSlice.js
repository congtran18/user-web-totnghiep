import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.NEXT_PUBLIC_DB_URL

export const apiSlice = createApi({
    reducerPath: 'apiSlice',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (params) => {
                return {
                    url: `product?limit=8`,
                    params: params,
                }
            },
        }),
    })
})

export const { useGetProductsQuery } = apiSlice