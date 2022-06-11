import { useSelector, useDispatch } from "react-redux";
import Head from 'next/head';
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession, getSession } from 'next-auth/react';
import { toast } from "react-toastify";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { isFile, checkIfFilesAreTooBig, checkIfFilesAreCorrectType, checkIfFilesLength, checkListfile } from 'helpers/validateFile'
import UploadImage from 'components/Form-control/UploadImage'
import UploadMultiFile from 'components/Form-control/UploadMultiFile'
import UploadVideo from 'components/Form-control/UploadVideo'
import InputField from 'components/Form-control/InputField'
import SelectField from 'components/Form-control/SelectField'
import MultipleSelectField from 'components/Form-control/MultipleSelectField'
import { saveFile, deleteFile, saveMultiFile } from 'features/storageSlice';
import { updateTutor } from 'features/registerTutorSlice';
import Cookies from 'js-cookie'
import * as cookie from 'cookie'

const supportedVideoFormat = ['video/mpeg', 'video/mp4']
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];
const listBanks = [
    { 'realname': 'Ngân hàng Vietcombank', '_id': 'Ngân hàng Vietcombank' },
    { 'realname': 'Ngân hàng Đông Á', '_id': 'Ngân hàng Đông Á' },
    { 'realname': 'Ngân hàng Quân đội MB', '_id': 'Ngân hàng Quân đội MB' },
    { 'realname': 'Ngân hàng vietinbank', '_id': 'Ngân hàng vietinbank' }
]

const schema = yup.object().shape({
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

export const getServerSideProps = async (ctx) => {

    const session = await getSession(ctx)

    const response = await axios.get(`${process.env.NEXT_PUBLIC_DB_URL}/tutor/${session ? session.uid : JSON.parse(ctx.req.cookies.userInfo).user.uid}`)

    if (response.error) {
        return {
            props: null,
        }
    }

    const tutorData = response.data.data
    return {
        props: { tutorData },
    }

}

const tutorAccount = ({ tutorData }) => {

    const dispatch = useDispatch();

    const { user } = useSelector(
        (state) => state.user
    );

    const [defaultCertificates, setDefaultCertificates] = useState(tutorData.certificates)

    const { data: session, status } = useSession();

    const router = useRouter();

    const loading = status === "loading" ? true : false

    const defaultValues = {
        infomation: tutorData ? tutorData.infomation : '',
        phone: tutorData ? tutorData.phone : '',
        account: tutorData ? tutorData.account : '',
        bank: tutorData ? tutorData.bank : '',
        certificates: tutorData ? tutorData.certificates : [],
        imageUrl: tutorData ? tutorData.imageUrl : null,
        include: tutorData ? tutorData.include : [],
        videoUrl: tutorData ? tutorData.videoUrl : null,
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
        try {
            //lấy token
            const token = session ? session.accessToken : Cookies.get("userInfo") && JSON.parse(Cookies.get("userInfo")).accessToken
            //cập nhật dữ liệu
            const saveData = { ...data };
            if (isFile(data.imageUrl[0])) {
                let imageData = new FormData();
                imageData.append("file", data.imageUrl[0]);

                //xóa file cũ đã lưu trữ
                // const oldImageUrl = tutorData.imageUrl.split("/", 8)[7].split("?")[0]
                // dispatch(deleteFile(oldImageUrl))

                //lưu file mới
                let dataimageUrl = await dispatch(saveFile(imageData));
                dataimageUrl = dataimageUrl.payload
                saveData.imageUrl = dataimageUrl
            }
            if (isFile(data.videoUrl[0])) {
                let videoData = new FormData();
                videoData.append("file", data.videoUrl[0]);

                // //xóa file cũ đã lưu trữ
                // const oldVideoUrl = tutorData.videoUrl.split("/", 8)[7].split("?")[0]
                // dispatch(deleteFile(oldVideoUrl))

                //lưu file mới
                let dataVideoUrl = await dispatch(saveFile(videoData));
                dataVideoUrl = dataVideoUrl.payload
                saveData.videoUrl = dataVideoUrl
            }
            if (checkListfile(data.certificates)) {
                const listcertificates = []

                // //xóa file cũ đã lưu trữ
                // for (let i = 0; i < tutorData.certificates.length; i++) {
                //     const id = tutorData.certificates[i].dataUrl.split("/", 8)[7].split("?")[0]
                //     dispatch(deleteFile(id))
                // }

                //Lưu file vào firebase
                let formData = new FormData();
                for (let i = 0; i < data.certificates.length; i++) {
                    formData.append("files", data.certificates[i]);
                };
                const dataImage = await dispatch(saveMultiFile(formData))

                for (let i = 0; i < data.certificates.length; i++) {
                    listcertificates.push({ dataUrl: dataImage.payload[i], name: data.certificates[i].name })
                };
                saveData.certificates = listcertificates
            }

            await dispatch(updateTutor({ ...saveData, ...{token: token}, ...{uid: tutorData.uid} }));

        }
        catch (error) {
            toast.error(error)
        }
    };


    if (user && user.role !== "tutor" || session && session.role !== "tutor") {
        router.push("/")
    }

    return (
        <>
            <Head>
                <title>Thông tin gia sư</title>
                <link rel="icon" href="/favicon.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={true} />
                <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>
            <main>
                <section className="sm:w-[90%] w-[95%] h-full flex flex-wrap items-center mx-auto my-5 ">
                    <div className="flex flex-col w-full -space-y-1 border-b border-gray-300 py-4">
                        <h1 className="font-semibold text-gray-800 text-lg sm:text-2xl">Quản lí thông tin gia sư</h1>
                        {/* <p className="text-gray-700 text-xs ">{user?.username}</p> */}
                    </div>
                </section>
                {loading ?
                    <div className="w-full">
                        <img src="/Images/loading2.gif" alt="loading" className="text-center flex items-center justify-center mx-auto mt-3 " />
                    </div>
                    :
                    <div class="container mx-auto px-10 mb-10">
                        <form onSubmit={handleSubmit(onHandleSubmit)}>
                            <div class="grid grid-cols-2 gap-10">
                                <div>
                                    <UploadVideo control={control} register={register} errors={errors} videoSource={tutorData.videoUrl} cache={false} name="videoUrl" value={formCoverVideoValue} label={"Upload video giới thiệu bản thân"} />
                                    <UploadImage control={control} register={register} errors={errors} imageSource={tutorData.imageUrl} cache={false} name="imageUrl" value={formCoverImageValue}></UploadImage>
                                </div>
                                <div>
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
                                        include={tutorData.include}
                                    />
                                    <UploadMultiFile control={control} register={register} errors={errors} name="certificates" value={formCoverCertificates} cache={false} setDefaultCertificates={setDefaultCertificates} certificatesData={defaultCertificates} />
                                </div>
                            </div>
                            <div className="flex flex-col justify-center items-center mt-4">
                                <button
                                    className="w-[50%] rounded-lg text-red-100 bg-red-500 h-10 transition-colors duration-150 hover:bg-red-800"
                                    variant="contained"
                                    disabled={isSubmitting}
                                    color="error"
                                    type="submit"
                                // startIcon={isSubmitting && <CircularProgress size={20} />}
                                >
                                    Cập nhật thông tin
                                </button>
                            </div>
                        </form>
                    </div>
                }
            </main>
        </>
    )
}

export default tutorAccount
