import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "./signin";
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from "next/router";
import { useSession } from 'next-auth/react';
import SearchCourseHistory from 'components/FilterCourseHistory/SearchCourseHistory'
import { usePaginateLessonMessage } from 'hooks/usePaginateLessonMessage'
import { setUnreadLesson } from 'features/chatTutorSlice';
import { toast } from "react-toastify";
import moment from 'moment'
import Cookies from 'js-cookie'

const lessonMessage = () => {

    const dispatch = useDispatch();

    const { user } = useSelector(
        (state) => state.user
    );

    const { data: session, status } = useSession();
    const router = useRouter();
    const { query } = router;

    const loading = status === "loading" ? true : false

    const {
        lessonMessages: data,
        totalLessonMessages,
        error,
        isLoading,
        isLoadingMore,
        size,
        setSize,
        isReachingEnd
    } = usePaginateLessonMessage(session ? session.uid : user && user.user.uid)

    useEffect(() => {
        // const uid = user ? user.user.uid : session && session.uid
        dispatch(setUnreadLesson());
    }, []);

    console.log("data", data)

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

    let body = null

    if (isLoading || loading) {
        body = (
            <div className="w-full">
                <img src="/Images/loading2.gif" alt="loading" className="text-center flex items-center justify-center mx-auto mt-3 " />
            </div>)

    } else if (data && data.length === 0) {
        body = (
            <>
                <div className="flex items-center justify-center w-full h-full my-16 flex-col">
                    <Image src="/Images/history-course.png" objectFit="contain" width="300rem" height="200rem" />
                    <p className="my-10 text-sm sm:text-lg tracking-wide text-center text-gray-700">Lịch sử thông báo lịch học đang trống.</p>
                    {/* <button type="button" onClick={() => router.push('/productlist')} className="bg-themePink py-2.5 px-5 w-max mx-auto text-base sm:text-lg transition shadow-md hover:font-medium">Danh sách sản phẩm</button> */}
                </div>
            </>
        )
    } else {
        body = (
            <>
                {/* inside main section  */}
                <section className="flex  w-full h-full">
                    <div className="flex flex-col w-full py-6 px-6 flex-3">
                        <div className="flex w-full justify-end">
                            {/* <p className="text-gray-700 text-sm sm:text-base">Showing <strong>All Orders</strong></p> */}
                            {data && data.length > 0 &&
                                <>
                                    <SearchCourseHistory onChange={handleSearch} />
                                    {/* <FilterOrder onChange={handleFilter} type="type" /> */}
                                </>
                            }
                        </div>
                        {/* main order div  */}
                        <div class="flex items-center justify-center overflow-x-auto w-[85%] shadow-md sm:rounded-lg mt-10 mb-5 ml-[5%]">
                            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" class="px-6 py-3">
                                            #
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            Nội dung
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data && data.map((lessonMessage, index) => {
                                        if (user && user.role === "tutor" || Cookies.get("sessionRole") === "tutor") {
                                            return (
                                                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                    <td class="px-6 py-4">
                                                        {index + 1}
                                                    </td>
                                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                                        {lessonMessage.type === "booked" && lessonMessage.tutor.uid === user.user.uid &&
                                                            <span><span className="font-semibold">{lessonMessage.user.fullName}</span>{"  đặt lịch với bạn từ " + moment(new Date(lessonMessage.start)).format('DD/MM/YYYY, h:mm:ss a') + " đến " + moment(new Date(lessonMessage.start)).format('DD/MM/YYYY, h:mm:ss a')}</span>
                                                        }
                                                        {lessonMessage.type === "tutorremoved" && lessonMessage.tutor.uid === user.user.uid &&
                                                            <span>{"Bạn đã hủy lịch học từ " + moment(new Date(lessonMessage.start)).format('DD/MM/YYYY, h:mm:ss a') + " đến " + moment(new Date(lessonMessage.start)).format('DD/MM/YYYY, h:mm:ss a')}</span>
                                                        }
                                                    </th>
                                                </tr>
                                            )
                                        } else {
                                            return (
                                                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                    <td class="px-6 py-4">
                                                        {index + 1}
                                                    </td>
                                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                                        {lessonMessage.type === "booked" && lessonMessage.user.uid === user.user.uid &&
                                                            <span>{"Bạn đặt lịch từ " + moment(new Date(lessonMessage.start)).format('DD/MM/YYYY, h:mm:ss a') + " đến " + moment(new Date(lessonMessage.start)).format('DD/MM/YYYY, h:mm:ss a') + " với gia sư "}<span className="font-semibold">{lessonMessage.tutor.fullName}</span></span>
                                                        }
                                                        {lessonMessage.type === "removed" && lessonMessage.user.uid === user.user.uid &&
                                                            <span>{"Gia sư "}<span className="font-semibold">{lessonMessage.tutor.fullName}</span>{" đã hủy lịch học với bạn từ " + moment(new Date(lessonMessage.start)).format('DD/MM/YYYY, h:mm:ss a') + " đến " + moment(new Date(lessonMessage.start)).format('DD/MM/YYYY, h:mm:ss a')}</span>
                                                        }
                                                    </th>
                                                </tr>
                                            )
                                        }
                                    })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </>
        )
    }

    if (!user && !session && !loading) {
        return <Redirect to="/signin" />
    }

    return (
        <>
            <Head>
                <title>lesson mesage history</title>
                <link rel="icon" href="/favicon.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={true} />
                <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>
            <main>
                {/* <Announcement />
                <Navbar /> */}

                {/* orders section  */}
                <section className="sm:w-[90%] w-[95%] h-full flex flex-wrap items-center mx-auto my-10 ">
                    <div className="flex flex-col w-full -space-y-1 border-b border-gray-300 py-4">
                        <h1 className="font-semibold text-gray-800 text-lg sm:text-2xl">Danh sách thông báo lịch học</h1>
                        {/* <p className="text-gray-700 text-xs ">{user?.username}</p> */}
                    </div>
                    {body}

                    {data && data.length > 0 && <button
                        className={`rounded-lg custombutton2 ml-[45%] p-2 ${isReachingEnd ?
                            'cursor-not-allowed'
                            : data.length === 0 && 'invisible'}`}
                        disabled={isLoadingMore || isReachingEnd || data.length === 0}
                        onClick={() => setSize(size + 1)}
                    >
                        {isLoadingMore
                            ? "Loading..."
                            : isReachingEnd
                                ? "No more"
                                : `Tải thêm (${totalLessonMessages - data.length})`}
                    </button>}
                </section>
            </main>
        </>
    )
}

export default lessonMessage
