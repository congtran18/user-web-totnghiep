/* eslint-disable object-curly-newline */
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import InputField from 'components/Form-control/InputField'
import { toast } from "react-toastify";
import UploadVideo from 'components/Form-control/UploadVideo'
import { createWarningTutor } from 'features/reviewTutorSlice'
import { isFile } from 'helpers/validateFile'
import { saveFile } from 'features/storageSlice';
import Cookies from 'js-cookie'
import axios from 'axios';

const supportedVideoFormat = ['video/mpeg', 'video/mp4']

const schema = yup.object().shape({
    videoUrl: yup.mixed()
        .nullable()
        .notRequired()
        .test('fileType', 'Chỉ chấp nhập file video', (value) => {
            if (value && isFile(value[0])) {
                return supportedVideoFormat.includes(value[0].type);
            }

            return true;
        }),
    comment: yup.string()
        .required('Cần có góp ý')
        .test('checkDescription', 'Miêu tả cần nhỏ hơn 1000 ký tự', (value) => value.trim().length > 0 && value.trim().length <= 1000),
});

const ModalAccuse = ({ tutorUid, showModal, setShowModal }) => {

    const dispatch = useDispatch();

    // const { types, isLoading, isError, message } = useSelector(
    //     (state) => state.type
    // );

    const defaultValues = {
        videoUrl: null,
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

    const formCoverVideoValue = watch('videoUrl');

    const onHandleSubmit = async (data) => {
        try {

            const token = Cookies.get("userInfo") ? JSON.parse(Cookies.get("userInfo")).accessToken : Cookies.get("sessionToken") && Cookies.get("sessionToken")

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const check = await axios.get(`${process.env.NEXT_PUBLIC_DB_URL}/videocall/check-called/${tutorUid}`, config);

            console.log("check", check.data.data)
            if (check.data.data) {


                var videoData = new FormData();

                videoData.append("file", data.videoUrl[0]);

                let dataVideo = await dispatch(saveFile(videoData));

                dataVideo = dataVideo.payload

                data.videoUrl = dataVideo

                await dispatch(createWarningTutor({ ...{ token: token }, ...{ to: tutorUid }, ...data }))

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
                            <svg class="mx-auto mb-2 w-12 h-12 text-gray-400 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683zm6.991-8.38a.5.5 0 1 1 .448.894l-1.009.504c.176.27.285.64.285 1.049 0 .828-.448 1.5-1 1.5s-1-.672-1-1.5c0-.247.04-.48.11-.686a.502.502 0 0 1 .166-.761l2-1zm-6.552 0a.5.5 0 0 0-.448.894l1.009.504A1.94 1.94 0 0 0 5 6.5C5 7.328 5.448 8 6 8s1-.672 1-1.5c0-.247-.04-.48-.11-.686a.502.502 0 0 0-.166-.761l-2-1z" /></svg>
                            <h3 class="mb-5 text-md font-normal text-gray-500 dark:text-gray-400">Tố cáo gia sư</h3>
                            <form onSubmit={handleSubmit(onHandleSubmit)}>
                                <UploadVideo control={control} register={register} errors={errors} videoSource={null} cache={false} name="videoUrl" value={formCoverVideoValue} label={"Upload video làm bằng chứng"} />
                                <InputField
                                    control={control}
                                    errors={errors}
                                    name="comment"
                                    label="Bình luận..."
                                    type="text"
                                    row={3}
                                />
                                <button data-modal-toggle="popup-modal" type="submit" disabled={isSubmitting} class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2 mt-4">
                                    Tố cáo
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


export default ModalAccuse;
