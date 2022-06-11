import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "./signin";
import Head from 'next/head';
import { Component, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from 'next-auth/react';
import CheckoutWizard from 'components/CheckoutWizard'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import InputField from 'components/Form-control/InputField'
import MultipleSelectField from 'components/Form-control/MultipleSelectField'
import UploadVideo from 'components/Form-control/UploadVideo'
import UploadImage from 'components/Form-control/UploadImage'
import SelectField from 'components/Form-control/SelectField'
import UploadMultiFile from 'components/Form-control/UploadMultiFile'
import { confirmStepOne } from 'features/registerTutorSlice';
import { toast } from "react-toastify";
import { isFile, checkIfFilesAreTooBig, checkIfFilesAreCorrectType, checkIfFilesLength } from 'helpers/validateFile'

const supportedVideoFormat = ['video/mpeg', 'video/mp4']
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];
const listBanks = [
    { 'realname': 'Ngân hàng Vietcombank', '_id': 'Ngân hàng Vietcombank' },
    { 'realname': 'Ngân hàng Đông Á', '_id': 'Ngân hàng Đông Á' },
    { 'realname': 'Ngân hàng Quân đội MB', '_id': 'Ngân hàng Quân đội MB' },
    { 'realname': 'Ngân hàng vietinbank', '_id': 'Ngân hàng vietinbank' }
]

const schema = yup.object().shape({
    fullName: yup
        .string()
        .required('Cần nhập tên')
        .test('checkName', 'Tên cần lớn hơn 3 ký tự và nhỏ hơn 50 ký tự', (value) => value.trim().length >= 3 && value.trim().length <= 50),
    infomation: yup.string()
        .required('Cần có mô tả sản phẩm')
        .test('checkDescription', 'Miêu tả cần nhỏ hơn 1000 ký tự', (value) => value.trim().length > 0 && value.trim().length <= 1000),
    include: yup.array()
        .min(1, 'Cần chọn ít nhất một mục')
        .max(3)
        .required('Cần có trạng thái sản phẩm').nullable(),
    phone: yup
        .number('Chỉ được nhập số')
        .typeError('Chỉ được nhập số')
        .required('Cần nhập số điện thoại'),
    account: yup
        .number('Chỉ được nhập số')
        .typeError('Chỉ được nhập số')
        .required('Cần nhập số tài khoản ngân hàng'),
    bank: yup.string().required('Cần chọn một ngân hàng'),
    imageUrl: yup
        .mixed()
        .nullable()
        .notRequired()
        .test('fileType', 'Chỉ chấp nhận file image', (value) => {
            if (value && isFile(value[0])) {
                return SUPPORTED_FORMATS.includes(value[0].type);
            }

            return true;
        }),
    certificates: yup.mixed().notRequired()
        .nullable()
        .test('checkFileType', 'Chỉ được nhập file PDF hoặc DOCX', checkIfFilesAreCorrectType)
        .test('checkFileSize', 'Kích thước file quá lớn', checkIfFilesAreTooBig)
        .test('checkFileSize', 'Cần nhập ít nhất một chứng chỉ', checkIfFilesLength),
    videoUrl: yup.mixed()
        .nullable()
        .notRequired()
        .test('fileType', 'Chỉ chấp nhập file video', (value) => {
            if (value && isFile(value[0])) {
                return supportedVideoFormat.includes(value[0].type);
            }

            return true;
        }),
});

const registerTutor = () => {

    const dispatch = useDispatch();

    const { user } = useSelector(
        (state) => state.user
    );

    const { data: session, status } = useSession();

    const { stepOne } = useSelector(
        (state) => state.registerTutor
    );

    const loading = status === "loading" ? true : false


    const dataInclude = stepOne.include || []

    const router = useRouter();

    const defaultValues = {
        fullName:  stepOne.infomation ? stepOne.infomation : '',
        infomation: stepOne.infomation ? stepOne.infomation : '',
        phone: stepOne.infomation ? stepOne.phone : '',
        account: stepOne.infomation ? stepOne.account : '',
        bank: stepOne.infomation ? stepOne.bank : '',
        certificates: null,
        imageUrl: null,
        include: stepOne.infomation ? stepOne.include : [],
        videoUrl: null,
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
    const formCoverImageValue = watch('imageUrl');
    const formCoverCertificates = watch('certificates')

    const onHandleSubmit = async (data) => {
        if (!stepOne.imageUrl || !stepOne.videoUrl || !stepOne.certificates) {
            toast.info("Thiếu ảnh hoặc video profile")
            return false
        } else {
            const { videoUrl, imageUrl, certificates, ...res } = data
            await dispatch(confirmStepOne({ ...stepOne, ...res }))
            reset(defaultValues);
            router.push("/registerStepTwo");
        }
    };

    if (!user && !session && !loading) {
        return <Redirect to="/signin" />
    }

    if (user && user.role === "waitingtutor" || session && session.role === "waitingtutor") {
        router.push("/registerStepThree")
    }

    if (user && user.role === "tutor" || session && session.role === "tutor") {
        router.push("/")
    }

    return (
        <>
            <Head>
                <title>Register Step One</title>
                <link rel="icon" href="/favicon.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={true} />
                <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>
            <main>
                <section className="sm:w-[90%] w-[95%] h-full flex flex-wrap items-center mx-auto my-5 ">
                    <div className="flex flex-col w-full -space-y-1 border-b border-gray-300 py-4">
                        <h1 className="font-semibold text-gray-800 text-lg sm:text-2xl">Đăng kí làm gia sư</h1>
                        {/* <p className="text-gray-700 text-xs ">{user?.username}</p> */}
                    </div>
                </section>
                {loading ?
                    <div className="w-full">
                        <img src="/Images/loading2.gif" alt="loading" className="text-center flex items-center justify-center mx-auto mt-3 " />
                    </div>
                    : (user && user.role === "user" || session && session.role === "user") &&
                    <>
                        <CheckoutWizard activeStep={(user || session) ? 1 : 0} />
                        <div className="flex flex-col justify-center items-center mb-20">
                            <div className="w-[35%]">
                                <form onSubmit={handleSubmit(onHandleSubmit)}>
                                    <InputField
                                        control={control}
                                        errors={errors}
                                        name="fullName"
                                        label="Tên/biệt hiệu..."
                                        type="text"
                                        row={1}
                                    />
                                    <InputField
                                        control={control}
                                        errors={errors}
                                        name="infomation"
                                        label="Giới thiệu bản thân..."
                                        type="text"
                                        row={4}
                                    />
                                    <InputField
                                        control={control}
                                        errors={errors}
                                        name="phone"
                                        label="Số điện thoại"
                                        type="number"
                                        row={1}
                                    />
                                    <InputField
                                        control={control}
                                        errors={errors}
                                        name="account"
                                        label="Số thẻ ngân hàng"
                                        type="number"
                                        row={1}
                                    />
                                    <SelectField
                                        control={control}
                                        errors={errors}
                                        name="bank"
                                        label="Chọn ngân hàng"
                                        values={listBanks}
                                        disable={false}
                                    />
                                    <MultipleSelectField
                                        control={control}
                                        errors={errors}
                                        name="include"
                                        label="Lĩnh vực giảng dạy"
                                        include={dataInclude}
                                    />
                                    <UploadImage control={control} register={register} errors={errors} imageSource={stepOne.imageUrl && stepOne.imageUrl} cache={true} name="imageUrl" value={formCoverImageValue}></UploadImage>
                                    <UploadVideo control={control} register={register} errors={errors} videoSource={stepOne.videoUrl && stepOne.videoUrl} cache={true} name="videoUrl" value={formCoverVideoValue} label={"Upload video giới thiệu bản thân"} />
                                    <UploadMultiFile control={control} register={register} errors={errors} cache={true} name="certificates" value={formCoverCertificates} certificatesData={[]} />
                                    <button
                                        className="w-full rounded-lg text-red-100 bg-red-500 h-10 transition-colors duration-150 hover:bg-red-800"
                                        variant="contained"
                                        disabled={isSubmitting}
                                        color="error"
                                        type="submit"
                                    // startIcon={isSubmitting && <CircularProgress size={20} />}
                                    >
                                        Bước tiếp theo
                                    </button>
                                </form>
                            </div>
                        </div>
                    </>}
            </main>
        </>
    )
}

export default registerTutor
