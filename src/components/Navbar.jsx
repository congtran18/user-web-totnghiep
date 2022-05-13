
import React, { useEffect, useRef, useMemo } from 'react'
import { BsBag } from "react-icons/bs";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { logout } from "features/userSlice";
import { useState } from "react";
import { VscPackage } from "react-icons/vsc";
import { FiHeart } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import { resetWishlist } from 'features/wishlistSlice';
import Image from "next/image";
import { useSession, signIn, signOut } from 'next-auth/react';
import { toast } from "react-toastify";
import CredentialsProvider from "next-auth/providers/credentials"
import Cookies from 'js-cookie'


const Navbar = () => {

    // get quantity from the cart state in redux store using useselector hook 
    const router = useRouter();
    const dispatch = useDispatch();
    const quantity = useSelector((state) => state.cart.cartTotalQuantity);
    const { user } = useSelector(
        (state) => state.user
    );

    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const dataUser = useRef()

    const { data: session, loading } = useSession();

    useEffect(() => {
        console.log("vo day1")
        if (session && !Cookies.get("isloggin")) {
            Cookies.set("isloggin", true)
            console.log("vo day2")
        }
    }, [session])


    // dataUser = session && session.user.email.match(mailformat) && session.user.email


    // const userData = user ? (user.user ? user.user : JSON.parse(JSON.parse(user)).user) : null

    const wishlist = useSelector((state) => state.wishlist.products);

    // state for toggleling user profile 
    const [profiletoggle, setProfiletoggle] = useState(false);

    function handleLogout() {
        dispatch(logout());
        // signOut()
        dispatch(resetWishlist());
    }


    return (
        <header className="flex sm:h-18 h-14 sm:px-5 px-2 py-5 justify-between items-center shadow-md " >
            <div className="flex-grow flex items-center ">
                <Link href="/"><h2 className='text-gray-800 font-heading uppercase font-bold mx-5 text-xl cursor-pointer'>DO AN TN</h2></Link>
                <Link href="/productlist"><a className="link" >Mua sách</a></Link>
                <Link href="/productlist/top"><a className="link" >Mua khóa học</a></Link>
                <Link href="/productlist/dress"><a className="link">Học tiếng anh</a></Link>
                <Link href="/productlist/footwear"><a className="link">Giảng viên</a></Link>
            </div>
            {/* <div className="hidden flex-grow items-center md:flex justify-center cursor-pointer ">
                <Link href="/"><Image src="/Images/martinilogo.jpg" objectFit='contain' height={55} width={150}/></Link>
            </div> */}
            <div className="flex flex-grow items-center md:hidden justify-center cursor-pointer ">
                <Link href="/"><Image src="/Images/mlogo.png" objectFit='cover' height={50} width={70} /></Link>
            </div>
            <div className="flex-grow items-center flex sm:space-x-7 space-x-4 sm:justify-end justify-end sm:tracking-wide sm:text-base text-xs relative">
                {!session && <>
                    <Link href="/register" >Đăng ký</Link>
                    <Link href="/signin" >Đăng nhập</Link>
                </>
                }
                {/* user logo or avatar  */}
                {session && <div className="sm:h-10 sm:w-10 h-7 w-7 cursor-pointer font-medium rounded-full bg-themePink flex items-center justify-center text-center" onClick={() => setProfiletoggle(!profiletoggle)}>{session.user.name.slice(0, 1).toUpperCase()}</div>}
                {session && profiletoggle &&
                    <div className="absolute flex flex-col sm:w-48 w-40 drop-shadow-md p-3 sm:right-0 sm:top-14 right-0 top-10 z-50 rounded-lg bg-white transition-all ">
                        <p className="text-xs sm:text-[14px] tracking-wide mb-2">Welcome <strong>{session.user.name.toUpperCase()}</strong></p>
                        <hr />
                        <div className="w-full flex items-center my-3 cursor-pointer hover:bg-themePink p-1 rounded-lg transition-all" onClick={() => router.push('/orders')}><VscPackage size="1.1rem" /> <p className="sm:text-sm text-xs font-medium ml-3">Tài khoản</p></div>
                        <div className="w-full flex items-center my-2 cursor-pointer hover:bg-themePink p-1 rounded-lg transition-all" onClick={() => router.push('/wishlist')}><FiHeart size="1.1rem" /> <p className="sm:text-sm text-xs font-medium ml-3">Yêu thích ({wishlist.length})</p></div>
                        <div className="w-full flex items-center my-2 cursor-pointer hover:bg-themePink p-1 rounded-lg transition-all" onClick={handleLogout}><BiLogOut size="1.1rem" /> <p className="sm:text-sm text-xs font-medium ml-3">Đăng xuất</p></div>
                    </div>}

                <BsBag fontSize="1.5rem" cursor="pointer" className="sm:w-7 w-[18px]" onClick={() => router.push('/cart')} />

                {/* custom badge for cart quantity  */}
                {quantity > 0 && <span className="hidden absolute -right-2 -top-2 h-6 w-6 rounded-full  bg-purple-600 text-white font-semibold text-xs sm:flex items-center justify-center transition">{quantity}</span>}
                {quantity > 0 && <span className="flex absolute -right-2 -top-1 h-4 w-4 rounded-full  bg-purple-600 text-white font-semibold text-[9px] sm:hidden items-center justify-center transition ">{quantity}</span>}


            </div>
        </header>
    )
}

export default Navbar
