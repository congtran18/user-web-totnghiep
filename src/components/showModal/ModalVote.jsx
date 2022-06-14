/* eslint-disable object-curly-newline */
import React from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import InputField from 'components/Form-control/InputField'
import SelectField from 'components/Form-control/SelectField'
import { toast } from "react-toastify";
import { createReviewTutor } from 'features/reviewTutorSlice'
import Cookies from 'js-cookie'
import axios from 'axios';

const schema = yup.object().shape({
    rating: yup
        .number()
        .typeError('Cần chọn đánh giá')
        .required('Cần chọn đánh giá'),
    comment: yup.string()
        .required('Cần có góp ý')
        .test('checkDescription', 'Miêu tả cần nhỏ hơn 1000 ký tự', (value) => value.trim().length > 0 && value.trim().length <= 1000),
});

const selectVote = [
    { 'realname': 'Tệ', '_id': 1 },
    { 'realname': 'Nhàm chán', '_id': 2 },
    { 'realname': 'Bình thường', '_id': 3 },
    { 'realname': 'Tốt', '_id': 4 },
    { 'realname': 'Xuất sắc', '_id': 5 }
]

const ModalVote = ({ tutorUid, showModal, setShowModal }) => {

    const dispatch = useDispatch();

    // const { types, isLoading, isError, message } = useSelector(
    //     (state) => state.type
    // );

    const defaultValues = {
        rating: '',
        comment: '',
    };

    const {
        control,
        register,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm({
        defaultValues,
        resolver: yupResolver(schema),
    });

    const onHandleSubmit = async (data) => {
        try {

            const token = Cookies.get("userInfo") ? JSON.parse(Cookies.get("userInfo")).accessToken : Cookies.get("sessionToken") && Cookies.get("sessionToken")

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const check = await axios.get(`${process.env.NEXT_PUBLIC_DB_URL}/videocall/check-called/${tutorUid}`, config);

            console.log("check", check.data)
            if (check.data) {

                await dispatch(createReviewTutor({ ...{ token: token }, ...{ to: tutorUid }, ...data }))

            } else {
                toast.error("Bạn chưa từng học gia sư này")
            }

        } catch (error) {
            toast.error(error)
        }
        // await new Promise((res) => {
        //     setTimeout(() => {
        //         res();
        //     }, 100);
        // });
        reset(defaultValues);
        setShowModal(false);
    };

    return (
        <>
            {showModal && <div id="popup-modal" class="justify-center flex items-center overflow-y-auto overflow-x-hidden fixed  z-50 md:inset-0 h-modal md:h-full">
                <div class="relative p-2 w-full max-w-md h-full md:h-auto">
                    <div class="border-2 relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" onClick={() => setShowModal(false)} data-modal-toggle="popup-modal">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        </button>
                        <div class="p-4 text-center">
                            <svg class="mx-auto mb-2 w-12 h-12 text-gray-400 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" /></svg>
                            <h3 class="mb-5 text-md font-normal text-gray-500 dark:text-gray-400">Đánh giá gia sư</h3>
                            <form onSubmit={handleSubmit(onHandleSubmit)}>
                                <SelectField
                                    control={control}
                                    errors={errors}
                                    name="rating"
                                    label="Đánh giá"
                                    values={selectVote}
                                    disable={false}
                                />
                                <InputField
                                    control={control}
                                    errors={errors}
                                    name="comment"
                                    label="Bình luận..."
                                    type="text"
                                    row={3}
                                />
                                <button data-modal-toggle="popup-modal" type="submit" disabled={isSubmitting} class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2 mt-4">
                                    Đánh giá
                                </button>
                                <button data-modal-toggle="popup-modal" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600" onClick={() => setShowModal(false)}>Đóng</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    );
}


export default ModalVote;
