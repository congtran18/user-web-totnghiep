import Image from "next/image";
import { BsCheck } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { getWishlist } from "features/wishlistSlice";
import axios from "axios";
import { toast } from "react-toastify";
import CostFormat from 'helpers/CostFormat'

const SingleProduct = ({ product }) => {


    // const [color] = useState(product.color);
    const [size, setSize] = useState(null);
    const [addpopup, setAddpopup] = useState(false);
    const [popupmessage, setPopupmessage] = useState(false);
    const wishlist = useSelector((state) => state.wishlist.products);
    const user = useSelector((state) => state.user.currentUser);

    const [currentImage, setCurrentImage] = useState(product.mainImage && product.mainImage)


    const dispatch = useDispatch();

    function handleClick() {
        setAddpopup(true)
    };

    function handleAddtocart() {
        if (size !== null) {
            setPopupmessage(false)
            setAddpopup(false)
        }
        else {
            setPopupmessage(true)
        }
    }

    function handleClose() {
        setSize(null)
        setPopupmessage(false)
        setAddpopup(false)
    };

    async function getWishlistFromServer() {
        try {
            const response = await axios.get(`https://martiniapi.herokuapp.com/api/wishlist/find/${user?.id}`, {
                headers: {
                    'auth-token': user?.authToken
                }
            });
            dispatch(getWishlist(response.data))
            return response.data
        } catch (error) {
            console.log(error);
        }
    }

    async function handleAddToWishlist() {
        const myObj = {
            userId: user?.id,
            products: [{
                _id: product?._id,
                title: product?.title,
                brand: product?.brand,
                img: product?.img,
                price: product?.price
            }]
        };
        try {
            if (!user) {
                toast.info('Please Signin first', {
                    position: "top-center",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored"
                })
            } else {
                const response = await axios.post(`https://martiniapi.herokuapp.com/api/wishlist`, myObj, {
                    headers: {
                        'auth-token': user?.authToken
                    }
                });
                toast.success('Product added to wishlist', {
                    position: "top-center",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored"
                });
                if (response) {
                    getWishlistFromServer();
                }

            }

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Link href={`/productlist/${product?._id}`} >
                <a className="my-5 w-80 flex flex-col items-center justify-center cursor-pointer relative opacity-100 transition border-4 shadow-lg overflow-hidden">

                    {/* product image  */}
                    {product.mainImage && <Image onMouseOver={() => setCurrentImage(product.slideImage[0] ? product.slideImage[0].data : product.mainImage)} onMouseOut={() => setCurrentImage(product.mainImage)} src={currentImage} height="280rem" width="320rem" objectFit="cover" className="z-20" />}
                    {/* product info div  */}
                    {/* details  */}
                    {product.status && (
                        product.status === "Nổi bật" ?
                            <div className="absolute top-[5px] right-[-26px] text-black z-30  bg-blue-400 font-medium h-[30px] w-[95px] flex items-center justify-center rotate-[45deg]">
                                <p className="text-sm">{product.status}</p>
                                {/* <p className="uppercase text-[9px] font-semibold -rotate-90 ">
                                    off
                                </p> */}
                            </div> : (product.status === "Mới" && <div className="absolute top-[5px] right-[-26px] text-black z-30  bg-red-400 font-medium h-[30px] w-[95px] flex items-center justify-center rotate-[45deg]">
                                <p className="text-sm">{product.status}</p>
                                {/* <p className="uppercase text-[9px] font-semibold -rotate-90 ">
                                    off
                                </p> */}
                            </div>)
                    )}
                    <div className="flex flex-wrap flex-col items-center my-3 justify-between">
                        <h1 className="text-18 sm:text-18 font-semibold ">{product?.realname}</h1>
                        <div className="flex items-center">
                            <BsCheck className="text-lg text-gray-600" />
                            <p className="text-xs sm:text-sm font-light text-gray-600 tracking-wide text-center  mb-1">{product?.type.realname}</p>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold ">{CostFormat(product?.cost.toString())}đ</p>
                        <button
                        >
                            <AiOutlineHeart className="text-xl  text-[#19110B]" />
                        </button>
                    </div>


                </a>
            </Link>


        </>
    )
}

export default SingleProduct
