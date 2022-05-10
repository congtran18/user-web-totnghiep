
import Head from 'next/head';
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

const products = () => {

    const dispatch = useDispatch();
    const router = useRouter()

    const params = router.query

    return (
        <>
            <Head>
                <title>Admin Dashboard</title>
                <link rel="icon" href="/favicon.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={true} />
                <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>
            <main className="w-full h-screen" >
            <section>
                {/* right side section  */}
                <div className="grid gap-x-4 items-start lg:grid-cols-[180px_1fr] sm:grid-cols-1">
                     {/* <ProductList productsList={productsList} /> */}
                </div>
                </section>
            </main>

        </>
    )
}

export default products;
