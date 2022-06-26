import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "./signin";
import Head from 'next/head';
import { Component, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession, getSession } from 'next-auth/react';
import CostFormat from 'helpers/CostFormat'
import { loadStripe } from '@stripe/stripe-js';
import { toast } from "react-toastify";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export const getServerSideProps = async (ctx) => {

    try {

        const session = await getSession(ctx)

        const response = await axios.get(`${process.env.NEXT_PUBLIC_DB_URL}/users/check-minutes/${session ? session.uid : JSON.parse(ctx.req.cookies.userInfo).user.uid}`)

        // axios.get(`${process.env.NEXT_PUBLIC_DB_URL}/users/check-minutes/${me}`);
        if (response.error) {
            return {
                props: null,
            }
        }

        const dataLeft = response.data.data
        return {
            props: { dataLeft },
        }
    } catch {
        return {
            props: null,
        }
    }

}

const course = ({ dataLeft }) => {

    const { user } = useSelector(
        (state) => state.user
    );

    const { data: session, status } = useSession();

    const router = useRouter();

    const loading = status === "loading" ? true : false

    const [price, setprice] = useState(0)
    const [description, setDescription] = useState("...")

    const createCheckoutSession = async () => {
        if (!user && !session) {
            toast.info("Hãy đăng nhập trước!")
            router.push("/signin")
        } else if (price === 0) {
            toast.info("Hãy chọn khóa học!")
        }
        else {
            const stripe = await stripePromise;

            // Call the backend to create a checkout session
            const checkoutSession = await axios.post(`${process.env.NEXT_PUBLIC_DB_URL}/stripe/course`, {
                type: price === 500000 ? "1 month" : price === 1200000 ? "3 month" : "6 month",
                cost: price / 23000,
                email: user ? user.user.email : !loading && session && session.user.email,
            });

            // Redirect user to Stripe Checkout
            const result = await stripe.redirectToCheckout({
                sessionId: checkoutSession.data.id,
            });

            if (result.error) alert(result.error.message);
        }
    };

    const handelSelect = (value) => {
        if (value === "1") {
            setprice(500000);
            setDescription("Khi đăng kí khóa học này học viên sẽ có 30p mỗi ngày trong vòng một tháng để call và học với giảng viên")
        } else if (value === "2") {
            setprice(1200000);
            setDescription("Khi đăng kí khóa học này học viên sẽ có 30p mỗi ngày trong vòng ba tháng để call và học với giảng viên")
        } else if (value === "3") {
            setprice(2000000)
            setDescription("Khi đăng kí khóa học này học viên sẽ có 30p mỗi ngày trong vòng một tháng để call và học với giảng viên")
        } else {
            setprice(0)
            setDescription("...")
        }
    }

    if (!user && !session && !loading) {
        return <Redirect to="/signin" />
    }

    if (user && user.role === "tutor" || session && session.role === "tutor") {
        router.push("/")
    }

    return (
        <>
            <Head>
                <title>Course</title>
                <link rel="icon" href="/favicon.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={true} />
                <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>
            <main>
                {/* <Announcement />
                <Navbar /> */}

                {/* orders section  */}

                <section className="sm:w-[90%] w-[95%] h-full flex flex-wrap items-center mx-auto my-5 ">
                    <div className="flex flex-col w-full -space-y-1 border-b border-gray-300 py-4">
                        <h1 className="font-semibold text-gray-800 text-lg sm:text-2xl">Đăng kí khóa học</h1>
                        {/* <p className="text-gray-700 text-xs ">{user?.username}</p> */}
                    </div>
                </section>
                {loading ?
                    <div className="w-full">
                        <img src="/Images/loading2.gif" alt="loading" className="text-center flex items-center justify-center mx-auto mt-3 " />
                    </div>
                    : <div className="flex flex-col justify-center items-center">
                        <div className="m-auto">
                            <div className="my-5 max-w-sm font-bold">
                                Số ngày học còn lại: &nbsp; <span className="text-amber-700">{dataLeft.daysleft} ngày</span>
                            </div>
                            <div className="my-5 max-w-sm font-bold">
                                Thời gian còn lại trong ngày: &nbsp; <span className="text-amber-700">{dataLeft.daysleft < 1 ? 0 : Math.round(dataLeft.minutes / 1000) < 0 ? 0 : Math.round(dataLeft.minutes / 1000)} giây</span>
                            </div>
                            <div className="mb-10 mt-10 xl:w-96">
                                <select onChange={e => handelSelect(e.target.value)} className="form-select block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                                    <option value="" selected>Chọn khóa học</option>
                                    <option value="1">30 phút/ngày, 1 tháng</option>
                                    <option value="2">30 phút/ngày, 3 tháng</option>
                                    <option value="3">30 phút/ngày, 6 tháng</option>
                                </select>
                            </div>
                            <div className="my-5 max-w-sm font-bold">
                                Mô tả: &nbsp; <span className="text-amber-700">{description}</span>
                            </div>
                            <div className="my-5 max-w-sm font-bold">
                                Giá trị: &nbsp; <span className="text-amber-700">{CostFormat(price.toString())}đ</span>
                            </div>
                            <button
                                role='link'
                                className={`rounded-lg custombutton p-2 mb-10`}
                                onClick={createCheckoutSession}
                            >
                                Mua khóa học
                            </button>
                        </div>
                    </div>}
            </main>
        </>
    )
}

export default course
