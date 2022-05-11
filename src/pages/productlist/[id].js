import Head from 'next/head';
import Image from 'next/image';
import Newsletter from '../../components/Newsletter';
import axios from "axios";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, getTotals } from '../../Redux/cartSlice';
import { addToWishlist } from "../../Redux/wishlistSlice";
import { BsBag } from "react-icons/bs";
import { FiHeart } from "react-icons/fi";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';




export const getStaticPaths = async () => {
    // const response = await axios.get(`${process.env.NEXT_PUBLIC_DB_URL}/product`);
    const response = await axios.get('https://server-web-totnghiep.herokuapp.com/api/product');

    const data = response.data.data.product;

    console.log("data", data)

    const paths = data?.map((element) => {
        return {
            params: {
                id: element._id
            }
        }
    })

    console.log("paths",paths)

    return {
        paths: paths,
        fallback: true
    }
};

export const getStaticProps = async (context) => {

    try {

        const id = context.params.id

        const response = await axios.get(`https://server-web-totnghiep.herokuapp.com/api/product/${id}`)
        const data = response.data.data;

        return {
            props: {
                product: data,
            }
        }

    } catch (error) {
        console.log(error);
        return {
            props: {
                product: null
            }
        }
    }

}

const Product = ({ product }) => {

    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const wishlist = useSelector((state) => state.wishlist.products);
    const user = useSelector((state) => state.user.currentUser);

    useEffect(() => {
        dispatch(getTotals())

    }, [cart, dispatch])



    function handleAddToCart() {
        dispatch(addProduct({ ...product }))
    };

    async function handleAddToWishlist() {
        const myObj = {
            userId: user?.id,
            products: [{
                _id: product?._id,
                realname: product?.realname,
                status: product?.status,
                mainImage: product?.mainImage,
                cost: product?.cost
            }]
        };
        // try {
        //     if (!user) {
        //         toast.info('Hãy đăng nhập')
        //     } else {
        //         const response = await axios.post('https://martiniapi.herokuapp.com/api/wishlist', myObj, {
        //             headers: {
        //                 'auth-token': user?.authToken
        //             }
        //         });
        //         dispatch(addToWishlist(product))
        //         toast.success('Sản phẩm đã được thêm vào danh sách yêu thích')
        //     }

        // } catch (error) {
        //     console.log(error);
        // }
    };

    return (
        <>
            <Head>
                <title>Buy {product.type.realname} {product.realname}</title>
                <link rel="icon" href="/favicon.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={true} />
                <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>
            <main>
                {/* <Navbar />
                <Announcement /> */}

                <section className="flex sm:p-10 py-8 px-5 sm:max-w-[80%] w-full mx-auto flex-col sm:flex-row ">
                    {/* image container  */}
                    {product.mainImage &&
                        <div className="flex-1 self-center sm:self-start  my-2 sm:my-3 mb-4 sm:mb-0">
                            <Image src={product?.mainImage} height="420rem" width="320rem" objectFit="cover" />
                        </div>}
                    {/* info container  */}
                    <div className="flex-1 ">
                        {/* title  */}
                        <h1 className="font-semibold sm:my-2 my-2 text-xl sm:text-3xl tracking-wide">{product?.status.toUpperCase()}</h1>
                        <h1 ></h1>
                        <h1 className="font-normal sm:mb-5 mb-3 text-[15px] sm:text-[25px] tracking-wide text-gray-600">{product?.realname}</h1>
                        <p className="text-2xl sm:text-3xl tracking-wide font-extralight mb-5 sm:mb-7">&#8377; {product?.cost}</p>
                        {/* description  */}

                        {/* add to cart container  */}
                        <div className="flex items-center sm:mb-9 space-x-6">
                            {/* amount container  */}

                            {/* add to cart button  */}
                            <button type="button" className="bg-themePink sm:p-3 p-2 tracking-wide font-medium text-sm sm:text-base hover:bg-themePink transition-all flex-1 flex items-center justify-center" onClick={handleAddToCart}><BsBag style={{ marginRight: "8px" }} />ADD TO CART</button>
                            <button type="button" className="border sm:p-3 p-2 tracking-wide font-medium text-sm sm:text-base hover:border-black transition-all flex-1 flex items-center justify-center disabled:pointer-events-none disabled:bg-gray-200 disabled:text-white" onClick={handleAddToWishlist} disabled={wishlist?.findIndex((item) => item._id === product._id) >= 0} ><FiHeart style={{ marginRight: "8px" }} />WISHLIST</button>
                        </div>

                        <p className="hidden sm:inline-flex text-gray-500 tracking-wide text-sm sm:text-base mb-4 font-normal text-justify">{product?.description}</p>
                        {/* price  */}
                    </div>
                </section>
                <p className="inline-flex sm:hidden px-7 text-justify text-gray-500 tracking-wide text-xs  sm:text-base mb-4 font-normal">{product?.description}</p>
                <section>
                    <Newsletter />
                </section>
            </main>
        </>
    )
}

export default Product;
