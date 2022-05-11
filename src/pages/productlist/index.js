import Head from 'next/head';
import Newsletter from '../../components/Newsletter';
import Products from '../../components/Products';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import FilterBy from "../../components/FilterProduct/FilterBy"
import SearchBox from "../../components/FilterProduct/SearchBox"
import axios from "axios";
import Cookies from 'js-cookie'
import { toast } from "react-toastify";

export async function getStaticProps() {

    //   const token = JSON.parse(JSON.parse(Cookies.get("persist:root")).auth).user.accessToken;
    //   const config = {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   };

    let types = await axios.get(`${process.env.NEXT_PUBLIC_DB_URL}/typeProduct`);

    types = types.data.data

    return {
        props: {
            types,
        },
    }
}

const productlist = ({ types }) => {
    // fetch the category name passed as parameter in the url , we will use useRouter hook of nextjs
    const router = useRouter();

    // store the filters in a state with an empty object
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState("Newest");
    const { query } = router;

    const handleTypeSort = (id) => {
        try {
            const path = router.pathname;
            let newParams = {};
            if (id) {
                const temp = { ...query, type: id };
                const { category, page, ...rest } = temp;
                newParams = rest;
            } else {
                const { type, page, category, ...rest } = query;
                newParams = rest;
            }
            if (typeof window !== 'undefined') {
                router.push({
                    pathname: path,
                    query: newParams,
                })
            }
        } catch (error) {
            console.log("error", error)
            toast.error(error)
        }
    };

    const handleCategorySort = (id) => {
        try {
            const path = router.pathname;
            let newParams = {};
            if (id) {
                newParams = { ...query, page: 1, category: id };
            } else {
                const { category, page, ...rest } = query;
                newParams = rest;
            }

            router.push({
                pathname: path,
                query: newParams,
            })
        } catch (error) {
            toast.error(error)
        }
    };

    const handleSort = (id) => {
        try {
            const path = router.pathname;
            let newParams = {};

            if (id) {
                newParams = { ...query, page: 1, sort: id };
            } else {
                const { sort, page, ...rest } = query;
                newParams = rest;
            }

            router.push({
                pathname: path,
                query: newParams,
            })
        } catch (error) {
            toast.error(error)
        }
    };

    const handleSearch = (value) => {
        try {
            const path = router.pathname;
            let newParams = {};

            if (value.length === 0) {
                const { realname, page, ...rest } = query;
                newParams = rest;
            } else {
                newParams = { ...query, page: 1, realname: value };
            }

            router.push({
                pathname: path,
                query: newParams,
            })
        } catch (error) {
            toast.error(error)
        }
    };

    const handlePageChange = (e, page) => {
        try {
            const path = router.pathname;
            const newParams = { ...query, page };

            router.push({
                pathname: path,
                query: newParams,
            })
        } catch (error) {
            toast.error(error)
        }
    };

    function removeFilters() {
        setFilters({});
    }


    return (
        <>
            <Head>
                <title>Danh sach san pham </title>
                <link rel="icon" href="/favicon.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={true} />
                <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>
            <main>
                {/* <Announcement />
                <Navbar /> */}

                <section>
                    {/* title  */}
                    <h1 className="m-5 font-bold text-xl sm:text-3xl">Danh sach san pham</h1>
                    {/* filtercontainer  */}
                    <div className="flex m-5 justify-between my-5 mb-10 items-center">
                        <div className="flex sm:flex-row sm:space-x-3 flex-col space-y-2 sm:space-y-0 ">
                            {/* filter text  */}
                            <FilterBy
                                types={types}
                                handleTypeSort={handleTypeSort}
                                handleCategorySort={handleCategorySort}
                                handleSort={handleSort}
                            />

                        </div>
                        {/* remove filter button  */}
                        {Object.keys(filters).length !== 0 && <button type="button" className="flex items-center justify-center tracking-wide bg-red-600 text-white md:px-3 md:py-2 px-2 py-1.5 transition font-medium text-xs md:text-base md:relative md:right-0 md:top-0 absolute right-8 top-72" onClick={removeFilters}>Remove Filters</button>}


                        <div className="flex sm:space-x-3 space-y-2 sm:space-y-0 flex-col sm:flex-row">
                            {/* filter text  */}
                            <SearchBox onChange={handleSearch} />
                        </div>
                    </div>
                    <Products params={router.query} handlePageChange={handlePageChange} />
                </section>
                <section>
                    <Newsletter />
                </section>
            </main>
        </>
    )
}

export default productlist
