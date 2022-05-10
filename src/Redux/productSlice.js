import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = "http://localhost:5001/api"


export const apiSlice = createApi({
    reducerPath: 'apiSlice',
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5001/api" }),
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