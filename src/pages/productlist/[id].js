import Head from 'next/head';
import { GrFormSubtract } from "react-icons/gr";
import { GrFormAdd } from "react-icons/gr";
import Newsletter from 'components/Newsletter';
import axios from "axios";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, getTotals } from 'features/cartSlice';
import CostFormat from 'helper/CostFormat'
import { addToWishlist } from "features/wishlistSlice";
import { BsBag } from "react-icons/bs";
import { FiHeart } from "react-icons/fi";
import { BsCheck } from "react-icons/bs";
import SimilarProduct from 'components/SimilarProduct';
import ImageGallery from 'react-image-gallery';
import { useRouter } from 'next/router'
import "react-image-gallery/styles/css/image-gallery.css";

export const getStaticPaths = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_DB_URL}/product`);

    const data = response.data.data.product;

    const paths = data?.map((element) => {
        return {
            params: {
                id: element._id
            }
        }
    })

    return {
        paths: paths,
        fallback: true
    }
};

export const getStaticProps = async (context) => {

    try {

        const id = context.params.id

        const response = await axios.get(`${process.env.NEXT_PUBLIC_DB_URL}/product/${id}`)
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

    const router = useRouter()

    if (router.isFallback) {
        return <div className="w-full">
            <img src="/Images/loading2.gif" alt="loading" className="text-center flex items-center justify-center mx-auto mt-3 " />
        </div>
    }

    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const wishlist = useSelector((state) => state.wishlist.products);
    const user = useSelector((state) => state.user.currentUser);
    const slideImage = []
    const [counter, setCounter] = useState(1);

    const incrementHandler = () => {
        setCounter((prevCounter) => prevCounter + 1); // NOT MUTATE STATE
      };
    
      const decrementHandler = () => {
        setCounter((prevCounter) => (counter > 1 ? prevCounter - 1 : 1));
      };
    

    const setupSlideImage = () => {

        slideImage.push(
            {
                original: product.mainImage,
                thumbnail: product.mainImage,
                originalHeight: 400,
                originalWidth: 200
            }
        )

        product.slideImage.length > 0 && product.slideImage.map((image) => {
            return (
                slideImage.push(
                    {
                        original: image.data,
                        thumbnail: image.data,
                    }
                )
            )
        })

    }

    setupSlideImage()

    const properties = {
        thumbnailPosition: "left",
        useBrowserFullscreen: false,
        originalHeight: "10%",
        showIndex: true,
        useTranslate3D: false,
        slideOnThumbnailOver: true,
        // showBullets: true,
        showPlayButton: false,
        items: slideImage
    };

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

                <section className="flex sm:p-10 py-8 px-5 sm:max-w-[90%] w-full mx-auto flex-col sm:flex-row justify-between gap-11">
                    {/* image container  */}
                    {product.mainImage &&
                        <div className="flex-1 self-center sm:self-start items-start my-2 sm:my-3 mb-4 sm:mb-0">
                            <ImageGallery {...properties} />
                        </div>}
                    {/* info container  */}
                    <div className="flex-1 ">
                        {/* title  */}
                        <h1 className="font-semibold sm:my-2 my-2 text-xl sm:text-3xl tracking-wide">{product?.realname.toUpperCase()}</h1>
                        <div className="flex items-center my-4">
                            <BsCheck className="text-lg text-gray-600" />
                            <p className="text-xs sm:text-xl font-light text-gray-600 tracking-wide text-center">{product?.type.realname}</p>
                        </div>
                        <div className="flex items-center my-5 gap-4">
                            {product.include && product.include.map((item) => {
                                return (
                                    <div className="border border-red-400 border-2 p-1">{item}</div>
                                )
                            })}
                        </div>
                        <p className="text-2xl sm:text-3xl tracking-wide font-extralight mb-5 sm:mb-7"> {CostFormat(product?.cost.toString())}vnđ</p>
                        {/* description  */}

                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-5 text-lg">
                                <p className="">Số lượng:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                <p className="font-semibold">{counter}</p>
                            </div>
                            <div className="flex items-center gap-[22px] px-[15px] py-[13px] bg-background-grayfa">
                                <button onClick={decrementHandler}>
                                    <GrFormSubtract className="text-2xl" />
                                </button>
                                <div>{counter}</div>
                                <button onClick={incrementHandler}>
                                    <GrFormAdd className="text-2xl" />
                                </button>
                            </div>
                        </div>

                        {/* add to cart container  */}
                        <div className="flex items-center sm:mb-9 space-x-6">
                            {/* amount container  */}

                            {/* add to cart button  */}
                            <button type="button" className="bg-emerald-700 sm:p-3 p-2 tracking-wide font-medium text-sm text-white m:text-base hover:bg-emerald-200 hover:text-black transition-all flex-1 flex items-center justify-center" onClick={handleAddToCart}><BsBag style={{ marginRight: "8px" }} />THÊM VÀO GIỎ HÀNG</button>
                            <button type="button" className="border sm:p-3 p-2 tracking-wide font-medium text-sm sm:text-base hover:border-black transition-all flex-1 flex items-center justify-center disabled:pointer-events-none disabled:bg-gray-200 disabled:text-white" onClick={handleAddToWishlist} disabled={wishlist?.findIndex((item) => item._id === product._id) >= 0} ><FiHeart style={{ marginRight: "8px" }} />WISHLIST</button>
                        </div>

                        <p className="hidden sm:inline-flex text-gray-500 tracking-wide text-sm sm:text-base mb-4 font-normal text-justify">{product?.description}</p>
                        {/* price  */}
                    </div>
                </section>
                <p className="inline-flex sm:hidden px-7 text-justify text-gray-500 tracking-wide text-xs  sm:text-base mb-4 font-normal">{product?.description}</p>
                <section>
                    <h1 className="text-center tracking-wider font-medium mt-14 mb-10 bg-themePink p-2.5 text-base sm:text-xl ">Sản phẩm liên quan</h1>
                    <SimilarProduct typeProduct={product?.type._id} />
                </section>
                <section>
                    <Newsletter />
                </section>
            </main>
        </>
    )
}

export default Product;
