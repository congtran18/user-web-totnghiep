import React, { useState } from "react";
import moment from 'moment'
import { RiDeleteBin2Fill } from "react-icons/ri";
import Cookies from 'js-cookie'
import { deleteReviewTutor, getReviewTutor } from 'features/reviewTutorSlice';
import { useDispatch } from 'react-redux';

const SingleVote = ({ vote, ableDelete }) => {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);

    console.log("ableDelete", ableDelete)

    const handleDeleteReview = async (idTutor) => {
        const token = Cookies.get("userInfo") ? JSON.parse(Cookies.get("userInfo")).accessToken : Cookies.get("sessionToken") && Cookies.get("sessionToken")
        await dispatch(deleteReviewTutor({ token: token, id: idTutor }))
        await dispatch(getReviewTutor(idTutor));
        setShowModal(false)
    }

    return (
        <>
            <div className='pt-4 px-5 pb-2 mb-2 border-b-2'>
                <div className='flex justify-between'>
                    <div className='font-bold text-md' >{vote.user_vote.fullName}</div>
                    <div className='text-slate-400 text-md'>{moment(new Date(vote.createdAt)).format('DD/MM/YYYY, h:mm:ss a')}</div>
                </div>
                <div>
                    <ul class="flex justify-start my-1">
                        {[...Array(vote.rating)].map((x, index) => (
                            <>
                                <li>
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" class="w-4 text-yellow-500 mr-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                        <path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>
                                    </svg>
                                </li>
                            </>
                        ))}
                        {[...Array(5 - vote.rating)].map((x, index) => (
                            <>
                                <li>
                                    <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="star" class="w-4 text-yellow-500" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                        <path fill="currentColor" d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z"></path>
                                    </svg>
                                </li>
                            </>
                        ))}
                    </ul>
                </div >
                <div className='text-sm flex justify-between'>
                    <span>{vote.comment}</span>
                    {ableDelete && <div div className='hover:text-red-500 cursor-pointer' onClick={() => setShowModal(true)}><RiDeleteBin2Fill size="20px" /></div>}
                </div>
            </div >

            {
                showModal && <div id="popup-modal" class="justify-center flex items-center overflow-y-auto overflow-x-hidden fixed  z-50 md:inset-0 h-modal md:h-full">
                    <div class="relative p-2 w-full max-w-md h-full md:h-auto">
                        <div class="border-2 relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" onClick={() => setShowModal(false)} data-modal-toggle="popup-modal">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            </button>
                            <div class="p-4 text-center">
                                <svg class="mx-auto mb-4 w-12 h-12 text-gray-400 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <h3 class="mb-5 text-md font-normal text-gray-500 dark:text-gray-400">Xác nhận xóa comment</h3>
                                <button data-modal-toggle="popup-modal" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2" onClick={() => handleDeleteReview(vote.to)}>
                                    Xác nhận
                                </button>
                                <button data-modal-toggle="popup-modal" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600" onClick={() => setShowModal(false)}>Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default SingleVote;
