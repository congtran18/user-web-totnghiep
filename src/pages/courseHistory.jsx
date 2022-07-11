import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "./signin";
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from "next/router";
import { useSession } from 'next-auth/react';
import moment from 'moment'
import SortCourseHistory from 'components/FilterCourseHistory/SortCourseHistory'
import SearchCourseHistory from 'components/FilterCourseHistory/SearchCourseHistory'
import { usePaginateCourseHistory } from 'hooks/usePaginateCourseHistory'
import { toast } from "react-toastify";
import { RiDeleteBin2Fill } from "react-icons/ri";
import ModalViewComment from 'components/showModal/ModalViewComment'
import Cookies from 'js-cookie'

import { deleteFile } from 'features/storageSlice';
import { deleteCourseHistory } from 'features/courseHistorySlice';


const courseHistory = () => {

    const dispatch = useDispatch();

    const { user } = useSelector(
        (state) => state.user
    );

    const [showModal, setShowModal] = useState(false);
    const [showModalViewComment, setShowModalViewComment] = useState(false);
    const [commentData, setCommentData] = useState();
    const [idVideo, setIdVideo] = useState();
    const [urlVideo, setUrlVideo] = useState();

    const { data: session, status } = useSession();
    const router = useRouter();
    const { query } = router;

    const loading = status === "loading" ? true : false

    const {
        videocalls: data,
        totalVideocalls,
        error,
        isLoading,
        isLoadingMore,
        size,
        setSize,
        isReachingEnd
    } = usePaginateCourseHistory(session ? session.uid : user && user.user.uid)

    const handleChooseCourse = (id, url) => {
        setShowModal(true)
        setIdVideo(id)
        setUrlVideo(url)
    }

    const handleChooseComment = (data) => {
        setCommentData(data)
        setShowModalViewComment(true)
    }

    const handleDeleteCourse = async (id, videoUrl) => {
        const token = Cookies.get("userInfo") ? JSON.parse(Cookies.get("userInfo")).accessToken : Cookies.get("sessionToken") && Cookies.get("sessionToken")
        await dispatch(deleteCourseHistory({ token: token, id: id }))
        const idDelete = videoUrl.split("/", 8)[7].split("?")[0]
        await dispatch(deleteFile(idDelete))
        setSize(size)
        setShowModal(false)
    }

    const handleSort = (id) => {
        try {
            const path = router.pathname;
            let newParams = {};

            if (id) {
                newParams = { ...query, sort: id };
            } else {
                const { sort, ...rest } = query;
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
                    <p className="my-10 text-sm sm:text-lg tracking-wide text-center text-gray-700">Lịch sử buổi học đang trống.</p>
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
                                    <SortCourseHistory onChange={handleSort} sort="sort" />
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
                                            Gia sư
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            Ngày học
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            Link buổi học
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            Đánh giá
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            Xóa
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data && data.map((videocall, index) => (
                                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td class="px-6 py-4">
                                                {index + 1}
                                            </td>
                                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                                {videocall.user_videocall.fullName}
                                            </th>
                                            <td class="px-6 py-4">
                                                {moment(new Date(videocall.create_at)).format('DD/MM/YYYY, h:mm:ss a')}
                                            </td>
                                            <td onClick={() => window.open(videocall.videoUrl.toString())} class="hover:underline hover:text-red-500 cursor-pointer px-6 py-4">
                                                Link
                                            </td>
                                            <td onClick={handleChooseComment.bind(null, videocall.comment)} class="hover:underline hover:text-red-500 cursor-pointer px-6 py-4">
                                                Xem
                                            </td>
                                            <td class="px-6 py-4 hover:text-red-500 cursor-pointer" onClick={handleChooseCourse.bind(null, videocall._id, videocall.videoUrl)}>
                                                <RiDeleteBin2Fill size="1.4rem" />
                                            </td>
                                        </tr>
                                    ))
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
                <title>Course history</title>
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
                        <h1 className="font-semibold text-gray-800 text-lg sm:text-2xl">Danh sách các buổi học</h1>
                        {/* <p className="text-gray-700 text-xs ">{user?.username}</p> */}
                    </div>
                    {body}


                    {showModal && <div id="popup-modal" class="justify-center flex items-center overflow-y-auto overflow-x-hidden fixed  z-50 md:inset-0 h-modal md:h-full">
                        <div class="relative p-2 w-full max-w-md h-full md:h-auto">
                            <div class="border-2 relative bg-white rounded-lg shadow dark:bg-gray-700">
                                <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" onClick={() => setShowModal(false)} data-modal-toggle="popup-modal">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                </button>
                                <div class="p-4 text-center">
                                    <svg class="mx-auto mb-4 w-12 h-12 text-gray-400 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <h3 class="mb-5 text-md font-normal text-gray-500 dark:text-gray-400">Xác nhận xóa buổi học</h3>
                                    <button data-modal-toggle="popup-modal" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2" onClick={() => handleDeleteCourse(idVideo, urlVideo)}>
                                        Xác nhận
                                    </button>
                                    <button data-modal-toggle="popup-modal" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600" onClick={() => setShowModal(false)}>Đóng</button>
                                </div>
                            </div>
                        </div>
                    </div>}

                    <ModalViewComment comment={commentData} showModal={showModalViewComment} setShowModal={setShowModalViewComment} />
                    

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
                                : `Tải thêm (${totalVideocalls - data.length})`}
                    </button>}
                </section>
            </main>
        </>
    )
}

export default courseHistory
