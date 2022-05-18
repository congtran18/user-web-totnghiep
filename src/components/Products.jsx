import { useEffect, useState } from "react";
import SingleProduct from "./SingleProduct";
import Image from "next/image";
import { useRouter } from 'next/dist/client/router';
import { useGetProductsQuery } from '../features/productSlice'
import Pagination from '@mui/material/Pagination'

const Products = ({ params, handlePageChange }) => {

    const router = useRouter();
    const { query } = router;

    const { data, isLoading, isFetching, isError } = useGetProductsQuery(params)

    console.log("data", data)

    let body = null

    if (isLoading) {
        body = (
            <div className="w-full">
                <img src="/Images/loading2.gif" alt="loading" className="text-center flex items-center justify-center mx-auto mt-3 " />
            </div>)
    } else if (data && data.data.product?.length === 0) {
        <div className="h-full w-full flex items-center justify-center flex-col my-12">
            <Image src="/Images/blank.svg" objectFit="contain" width="300rem" height="300rem" />
            <p className="my-8 text-gray-700 tracking-wide text-sm sm:text-lg font-medium capitalize">No products found for </p>
            <button type="button" onClick={() => router.push('/productlist')} className="bg-themePink py-2.5 px-5 w-max mx-auto text-sm sm:text-lg transition shadow-md hover:font-medium">Danh sách sản phẩm</button>
        </div>
    }
    else {
        body = (
            <>
                <section className="flex flex-wrap items-center gap-3 ml-2">
                    {data && data.data.product?.map((product) => (
                        <SingleProduct key={product._id} product={product} />
                    ))}

                </section>
                <div className="flex flex-row flex-nowrap justify-center mt-10 mb-5" >
                    <Pagination
                        page={Number(query.page) || 1}
                        count={data.data.total || 1}
                        onChange={handlePageChange}
                        showFirstButton
                        showLastButton
                        color="primary"
                    />
                </div>
            </>
        )
    }



    return (
        <>
            {body}
        </>
    )
}

export default Products
