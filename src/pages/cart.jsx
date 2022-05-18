import Head from 'next/head';
import { useState, useEffect } from "react";
import Image from "next/image";
import { VscAdd, VscRemove } from "react-icons/vsc";
import { BsHeart } from "react-icons/bs";
import { BsBag } from "react-icons/bs";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router'
import { deleteProduct, decreaseQuantity, increaseQuantity, getTotals } from '../features/cartSlice';
import { BsCheck } from "react-icons/bs";
import { GoPrimitiveDot } from "react-icons/go"
import CostFormat from 'helper/CostFormat'
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from "react-toastify";
const stripePromise = loadStripe('pk_test_51KcBufBq3agEdPRyoKhKR3gQqcye5Tqh1RZkKjUdyYrr1fGFUg24ERPYNmiSPfuph2ALjLfAaKPJBf9Ptwekehkq00FBCdw5VW');

const Cart = () => {
    const cart = useSelector((state) => state.cart);
    const router = useRouter();
    const dispatch = useDispatch();
    const [stripeClientToken, setStripeClientToken] = useState(null);
    const wishlist = useSelector((state) => state.wishlist.products);
    const { user } = useSelector(
        (state) => state.user
    );

    const { data: session } = useSession();

    const createCheckoutSession = async () => {
        if (!user && !session) {
            toast.info("Hãy đăng nhập trước!")
            router.push("/signin")
        } 
        else{
            const stripe = await stripePromise;

            // Call the backend to create a checkout session
            const checkoutSession = await axios.post(`${process.env.NEXT_PUBLIC_DB_URL}/stripe`, {
                items: cart.products.map((product) => {
                    return {
                        category : product.category.realname,
                        type : product.type.realname,
                        cost : product.cost/23000,
                        mainImage: product.mainImage,
                        realname: product.realname,
                        idProduct: product._id,
                        quantity: product.productQuantity
                    }
                }),
                email: session ? session.user.email : user.email,                           
            });

            // Redirect user to Stripe Checkout
            const result = await stripe.redirectToCheckout({
                sessionId: checkoutSession.data.id,
            });

            if (result.error) alert(result.error.message);
        }
    };

    useEffect(() => {
        dispatch(getTotals())
    }, [cart, dispatch])

    function handleDelete(index) {
        dispatch(deleteProduct(index))
    }

    function decQuantity(index) {
        dispatch(decreaseQuantity(index))
    }
    function incQuantity(index) {
        dispatch(increaseQuantity(index))
    }


    return (
        <>
            <Head>
                <title>Cart</title>
                <link rel="icon" href="/favicon.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={true} />
                <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>
            <main>

                <section className="bg-[whitesmoke] w-full ">
                    {/* wrapper div  */}
                    {cart.cartTotalQuantity !== 0 ?
                        <div className="px-5 py-5 text-center ">
                            {/* heading  */}
                            <h1 className="text-xl sm:text-3xl  tracking-wide  bg-white pt-4">GIỎ HÀNG</h1>
                            {/* top div  */}
                            <div className="flex justify-between items-center sm:px-5 sm:py-8 px-2 py-5  bg-white">
                                {/* top button  */}
                                <button className="mx-4 tracking-wide text-sm sm:text-base flex items-center cursor-pointer hover:underline" onClick={() => router.push('/productlist')} ><IoMdArrowRoundBack style={{ marginRight: "5px" }} />Tiếp tục mua sách</button>
                                {/* <p className="mx-4 tracking-wide text-sm sm:text-base flex items-center cursor-pointer"><BsBag style={{ marginRight: "5px" }} />Shopping Bag ({cart.cartTotalQuantity})</p> */}
                                {/* top texts div  */}
                                <div className="sm:flex hidden ">
                                    <p className="mx-4 tracking-wide text-sm sm:text-base flex items-center cursor-pointer hover:underline"><BsBag style={{ marginRight: "5px" }} />Giỏ hàng ({cart.cartTotalQuantity})</p>
                                    <p className="mx-4 tracking-wide text-sm sm:text-base flex items-center cursor-pointer hover:underline" onClick={() => router.push('/wishlist')}><BsHeart style={{ marginRight: "5px" }} /> {`Yêu thích (${wishlist?.length})`}</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:p-5 p-0 justify-between  my-3">
                                {/* info div  */}
                                <div className="flex-3 ">
                                    <div className="flex flex-col sm:flex-row justify-between mb-3 py-3 px-4 bg-white invisible sm:visible" >
                                        <div className="flex-1 flex sm:space-x-0 relative ">
                                            <div className="tracking-wide font-bold">
                                                Thông tin sản phẩm
                                            </div>
                                            <div className="flex-1 flex sm:items-center gap-[7.5rem] justify-end">
                                                <div className="font-bold tracking-wide ">Số lượng</div>
                                                <div className="font-bold tracking-wide">Giá</div>
                                                <div className="font-bold tracking-wide mr-6">Xóa</div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* product div  */}
                                    {cart.products?.map((product, index) => (
                                        <div className="flex flex-col sm:flex-row justify-between mb-3 py-3 px-4 bg-white" key={new Date().getTime() + product._id + Math.random() * 100}>
                                            {/* product detail div  */}
                                            <div className="flex-1 flex sm:space-x-0 relative ">
                                                {/* image  */}
                                                {/* large screen  */}
                                                <MdDelete size="1.5rem" cursor="pointer" className="inline-flex sm:hidden absolute right-0" onClick={() => handleDelete(index)} />

                                                <div className="sm:inline-flex hidden cursor-pointer border-2 border-solid border-[hsla(0, 100%, 50%, 0.2)]" onClick={() => router.push(`/products/${product?._id}`)}>
                                                    <Image src={product.mainImage} width="150rem" height="140rem" className="border-2 border-solid border-zinc-800" objectFit="contain" />
                                                </div>
                                                {/* mobile devices  */}
                                                <div className="inline-flex sm:hidden  mr-4 cursor-pointer" onClick={() => router.push(`/products/${product?._id}`)}>
                                                    <Image src={product.mainImage} width="90rem" height="70rem" objectFit="contain" />
                                                </div>
                                                {/* details div  */}
                                                <div className="sm:p-4 sm:flex-1  flex flex-col text-left justify-around items-start sm:space-y-2 space-y-1 tracking-wide">
                                                    {/* product name  */}
                                                    <h1 className="text-sm sm:text-base"><b>{product.realname}</b></h1>
                                                    <div className="flex items-center text-[13px] sm:text-base"><BsCheck className="text-lg text-gray-600" /><p>{product.status}</p></div>
                                                    {/* color  */}
                                                    <div className="flex items-center text-[13px] sm:text-base"><GoPrimitiveDot className="text-lg text-gray-600" />{product.type.realname}</div>
                                                    <div className="flex items-center text-[13px] sm:text-base"><GoPrimitiveDot className="text-lg text-gray-600" />{product.category.realname} </div>
                                                </div>
                                            </div>
                                            {/* pricedetail div  */}
                                            <div className="flex-1 flex justify-center flex-col mt-4 sm:mt-0  sm:items-center">
                                                {/* amount container  */}
                                                <div className="flex items-center sm:justify-end justify-between space-x-0 sm:space-x-16  sm:text-xl">
                                                    <div className="flex items-center space-x-3 ml-[110px] sm:ml-0 ">
                                                        <VscRemove cursor="pointer" className="hover:font-extrabold hover:scale-110 transition-all h-4" onClick={() => decQuantity(index)} />
                                                        <p className="bg-themePink sm:p-4 p-2 text-center text-xl rounded-full w-14">{product.productQuantity}</p>
                                                        <VscAdd cursor="pointer" className="hover:font-extrabold hover:scale-110 transition-all h-4 " onClick={() => incQuantity(index)} />
                                                    </div>
                                                    <p className="font-light sm:text-2xl text-xl w-28 tracking-wide ">{CostFormat((product.cost * product.productQuantity).toString())}đ</p>
                                                    <MdDelete size="1.5rem" cursor="pointer" className="sm:inline-flex hidden" onClick={() => handleDelete(index)} />
                                                </div>
                                                {/* actual price  */}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* summary div  */}
                                <div className="flex-1 p-5  sm:ml-5 h-[57vh]  mt-5 sm:mt-0 text-left bg-white border-double border-t-[7px] border-gray-600 sm:border-none shadow-md">
                                    {/* title  */}
                                    <h1 className="text-base sm:text-2xl tracking-wide mb-8">ORDER SUMMARY</h1>
                                    {/* summary item  */}
                                    <div className="my-4 flex justify-between">
                                        <h1>Số lượng</h1>
                                        <p>{cart.cartTotalQuantity} sp</p>
                                    </div>
                                    <div className="my-4 flex justify-between font-semibold text-xl mb-8 tracking-wide">
                                        <h1>Tổng giá</h1>
                                        <p>{CostFormat(cart.cartTotalAmount.toString())}đ</p>
                                    </div>

                                    <button
                                        role='link'
                                        onClick={createCheckoutSession}
                                        // disabled={!session}
                                        className={`custombutton text-sm w-full my-5 ml-0`}
                                    >
                                        Thanh toán
                                    </button>
                                </div>
                            </div>

                        </div> :
                        <div className="flex flex-col  p-5  justify-between  my-3">
                            <Image src="/Images/emptycart.svg" height="200rem" width="200rem" objectFit="contain" />
                            <p className="mt-8 tracking-wide font-light text-center text-base sm:text-xl mb-10">Giỏ hàng hiện đang trống!</p>
                            <button type="button" onClick={() => router.push('/productlist')} className="bg-themePink py-2.5 px-5 w-max mx-auto text-base sm:text-lg transition shadow-md hover:font-medium">Danh sách sản phẩm</button>
                        </div>}
                </section>
                <div className="w-full h-5 bg-white shadow-md" />
            </main>
        </>
    )
}

export default Cart