
import React, { useEffect } from 'react'
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { logout } from "features/userSlice";
import { useState } from "react";
import { VscPackage } from "react-icons/vsc";
import { FiHeart } from "react-icons/fi";
import { BiLogOut, BiMessageDetail } from "react-icons/bi";
import { AiOutlineProfile, AiOutlineMessage } from "react-icons/ai";
import { resetWishlist } from 'features/wishlistSlice';
import Image from "next/image";
import { useSession } from 'next-auth/react';
import { useTheme } from "next-themes";
import { BsFillMoonFill, BsFillSunFill, BsBag } from "react-icons/bs";
import { RiFolderHistoryLine } from "react-icons/ri"
import Cookies from 'js-cookie'

const Navbar = () => {

    // get quantity from the cart state in redux store using useselector hook 
    const router = useRouter();
    const dispatch = useDispatch();
    const quantity = useSelector((state) => state.cart.cartTotalQuantity);
    const { user } = useSelector(
        (state) => state.user
    );

    const { unread } = useSelector(
        (state) => state.chatTutor
    );

    const { data: session, status } = useSession();

    const loading = status === "loading" ? true : false

    const { systemTheme, theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const renderThemeChanger = () => {
        if (!mounted) return null;

        const currentTheme = theme === "system" ? systemTheme : theme;

        if (currentTheme === "dark") {
            return (
                <BsFillSunFill
                    size={18}
                    className="mx-2 md:mx-5"
                    role="button"
                    onClick={() => setTheme("light")}
                />
            );
        } else {
            return (
                <BsFillMoonFill
                    size={18}
                    className="mx-2 md:mx-5"
                    role="button"
                    onClick={() => setTheme("dark")}
                />
            );
        }
    };

    const wishlist = useSelector((state) => state.wishlist.products);

    // state for toggleling user profile 
    const [profiletoggle, setProfiletoggle] = useState(false);

    const handleLogout = async () => {
        dispatch(logout());
        // signOut()
        await new Promise((res) => {
            setTimeout(() => {
                res();
            }, 300);
        });
        // router.push('/signin')
        dispatch(resetWishlist());
    }

    if (session && !Cookies.get("sessionToken")) {
        Cookies.set("sessionToken", session.accessToken)
        Cookies.set("sessionRole", session.role)
        router.reload()
    }


    return (
        <header className="flex sm:h-18 h-14 sm:px-5 px-2 py-5 justify-between items-center shadow-md " >
            <div className="flex-grow flex items-center ">
                <Link href="/"><h2 className='text-gray-800 font-heading uppercase font-bold mx-5 text-xl cursor-pointer'>DO AN TN</h2></Link>
                {<div>
                    <Link href="/productlist"><a className="link" >Mua sách</a></Link>
                    <Link href="/course"><a className={`link ${(user && user.role === "tutor" || Cookies.get("sessionRole") === "tutor") && "hidden"}`} >Mua khóa học</a></Link>
                    <Link href="/tutorlist"><a className={`link ${(user && user.role === "tutor" || Cookies.get("sessionRole") === "tutor") && "hidden"}`}>Học tiếng anh</a></Link>
                    <Link href="/registerStepOne"><a className={`link ${(user && user.role === "tutor" || Cookies.get("sessionRole") === "tutor") && "hidden"}`}>Đăng ký dạy</a></Link>
                </div>}
                {(user && user.role === "tutor" || session && session.role === "tutor") && <div>
                    {/* <Link href="/productlist"><a className="link" >Mua sách</a></Link> */}
                    <Link href="/tutorCalendar"><a className="link" >Lịch dạy</a></Link>
                </div>}
            </div>
            {/* <div className="hidden flex-grow items-center md:flex justify-center cursor-pointer ">
                <Link href="/"><Image src="/Images/martinilogo.jpg" objectFit='contain' height={55} width={150}/></Link>
            </div> */}
            <div className="flex flex-grow items-center md:hidden justify-center cursor-pointer ">
                <Link href="/"><Image src="/Images/mlogo.png" objectFit='cover' height={50} width={70} /></Link>
            </div>
            <div className="flex-grow items-center flex sm:space-x-7 space-x-4 sm:justify-end justify-end sm:tracking-wide sm:text-base text-xs relative w-[45%]">
                <BsBag fontSize="1.5rem" cursor="pointer" className={`absolute ${!user && !session && !loading ? "right-[40%]" : "right-[20%]"} sm:w-7 w-[18px]`} onClick={() => router.push('/cart')} />
                {quantity > 0 && <span className={`absolute hidden ${!user && !session && !loading ? "right-[38%]" : "right-[19%]"} -top-2 h-6 w-6 rounded-full  bg-purple-600 text-white font-semibold text-xs sm:flex items-center justify-center transition`}>{quantity}</span>}

                <AiOutlineMessage fontSize="1.8rem" cursor="pointer" className={`absolute ${!user && !session && !loading ? "right-[30%]" : "right-[10%]"} sm:w-7 w-[18px]`} onClick={() => router.push('/chatPage')} />
                {unread && unread.count > 0 && <span className={`absolute hidden ${!user && !session && !loading ? "right-[28%]" : "right-[9%]"} -top-2 h-6 w-6 rounded-full  bg-red-600 text-white font-semibold text-xs sm:flex items-center justify-center transition`}>{unread.count}</span>}

                {!user && !session && !loading && <div className=" flex gap-3 py-1">
                    <Link href="/register" >Đăng ký</Link>
                    <Link href="/signin" >Đăng nhập</Link>
                </div>
                }
                {/* user logo or avatar  */}

                {session && !loading && < Image onClick={() => setProfiletoggle(!profiletoggle)} src={session.user.image} height="40rem" width="40rem" objectFit="cover" className="cursor-pointer rounded-full flex items-center justify-center ml-4" />}
                {(user) && < Image onClick={() => setProfiletoggle(!profiletoggle)} src={user.user.imageUrl} height="40rem" width="40rem" objectFit="cover" className="cursor-pointer rounded-full flex items-center justify-center ml-4" />}
                {(user || session) && profiletoggle &&
                    <div className="absolute flex flex-col sm:w-48 w-40 drop-shadow-md p-3 sm:right-0 sm:top-14 right-0 top-10 z-50 rounded-lg bg-white transition-all ">
                        <p className="text-xs sm:text-[14px] tracking-wide mb-2">Welcome <strong>{session ? session.user.name.toUpperCase() : user.user.fullName.toUpperCase()}</strong></p>
                        <hr />
                        {(user && user.role === "tutor" || session && session.role === "tutor") && <div className="w-full flex items-center my-3 cursor-pointer hover:bg-themePink p-1 rounded-lg transition-all" onClick={() => router.push('/tutorAccount')}><AiOutlineProfile size="1.1rem" /> <p className="sm:text-sm text-xs font-medium ml-3">Tài khoản</p></div>}
                        <div className="w-full flex items-center my-3 cursor-pointer hover:bg-themePink p-1 rounded-lg transition-all" onClick={() => router.push('/chatPage')}><BiMessageDetail size="1.1rem" /> <p className="sm:text-sm text-xs font-medium ml-3">Tin nhắn</p></div>
                        <div className="w-full flex items-center my-3 cursor-pointer hover:bg-themePink p-1 rounded-lg transition-all" onClick={() => router.push('/courseHistory')}><RiFolderHistoryLine size="1.1rem" /> <p className="sm:text-sm text-xs font-medium ml-3">Lịch sử học</p></div>
                        <div className="w-full flex items-center my-3 cursor-pointer hover:bg-themePink p-1 rounded-lg transition-all" onClick={() => router.push('/orders')}><VscPackage size="1.1rem" /> <p className="sm:text-sm text-xs font-medium ml-3">Hóa đơn</p></div>
                        {/* <div className="w-full flex items-center my-2 cursor-pointer hover:bg-themePink p-1 rounded-lg transition-all" onClick={() => router.push('/wishlist')}><FiHeart size="1.1rem" /> <p className="sm:text-sm text-xs font-medium ml-3">Yêu thích ({wishlist.length})</p></div> */}
                        <div className="w-full flex items-center my-2 cursor-pointer hover:bg-themePink p-1 rounded-lg transition-all" onClick={handleLogout}><BiLogOut size="1.1rem" /> <p className="sm:text-sm text-xs font-medium ml-3">Đăng xuất</p></div>
                    </div>}


                {/* custom badge for cart quantity  */}
                {/* ko can  */}
                {quantity > 0 && <span className="flex absolute -right-2 -top-1 h-4 w-4 rounded-full  bg-purple-600 text-white font-semibold text-[9px] sm:hidden items-center justify-center transition ">{quantity}</span>}


            </div>
        </header>
    )
}

export default Navbar
