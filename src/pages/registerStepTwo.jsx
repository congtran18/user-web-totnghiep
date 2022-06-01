import { useSelector, useDispatch } from "react-redux";
import Head from 'next/head';
import { useRouter } from "next/router";
import { useSession } from 'next-auth/react';
import { toast } from "react-toastify";
import CheckoutWizard from 'components/CheckoutWizard'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import InputField from 'components/Form-control/InputField'
import { confirmStepTwo, registerTutor } from 'features/registerTutorSlice';
import Cookies from 'js-cookie'

const schema = yup.object().shape({
    questionone: yup.string()
        .required('Cần trả lời câu hỏi đầu tiên')
        .test('checkDescription1', 'Câu trả lời cần nhỏ hơn 1000 ký tự', (value) => value.trim().length > 0 && value.trim().length <= 1000),
    questiontwo: yup.string()
        .required('Cần trả lời câu hỏi thứ hai')
        .test('checkDescription2', 'Câu trả lời cần nhỏ hơn 1000 ký tự', (value) => value.trim().length > 0 && value.trim().length <= 1000),
    chooseCb: yup.bool().oneOf([true], 'Xác nhận điều khoản'),
});

const registerStepTwo = () => {

    const dispatch = useDispatch();

    const { user } = useSelector(
        (state) => state.user
    );

    const { stepTwo, stepOne } = useSelector(
        (state) => state.registerTutor
    );

    const { data: session, status } = useSession();

    const router = useRouter();


    const loading = status === "loading" ? true : false


    const defaultValues = {
        questionone: stepTwo.questionone ? stepTwo.questionone : '',
        questiontwo: stepTwo.questionone ? stepTwo.questiontwo : '',
        chooseCb: false,
    };

    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues,
        resolver: yupResolver(schema)
    });

    const onHandleSubmit = async (data) => {
        const {chooseCb , ...res} = data
        await dispatch(confirmStepTwo({ ...res }))
        const token = session ? session.accessToken : Cookies.get("userInfo") && JSON.parse(Cookies.get("userInfo")).accessToken
        const successdata = await dispatch(registerTutor({ ...stepOne, ...res, ...{ token: token }, ...{ user: user ? user.user.email : session && session.user.email }, ...{ uid: user ? user.user.uid : session && session.uid } }))
        if (successdata.payload.user) {
            router.push("/registerStepThree");
        }
    };

    const handeBack = () => {
        router.push("/registerStepOne");
        toast.info("Quay lại bước 2")
    }

    if (!user && !session && !loading) {
        router.push("/signin")
    }
    if (!stepOne.infomation) {
        router.push("/registerStepOne")
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
                <title>Register Step Two</title>
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
                        <CheckoutWizard activeStep={2} />
                        <div className="flex flex-col gap-y-3 justify-center items-center mb-20">
                            <div className="w-[35%]">
                                <form onSubmit={handleSubmit(onHandleSubmit)}>
                                    <InputField
                                        control={control}
                                        errors={errors}
                                        name="questionone"
                                        label="Tại sao bạn muốn trở thành gia sư..."
                                        type="text"
                                        row={4}
                                    />
                                    <InputField
                                        control={control}
                                        errors={errors}
                                        name="questiontwo"
                                        label="Chia sẻ kinh nghiệm dạy học của bạn..."
                                        type="text"
                                        row={4}
                                    />
                                    <div className='mb-8'>
                                        <label className='block ml-2 pt-4'
                                        >Bằng cách tích vào đây tôi chấp nhập tất cả các <b className="text-black">Điều khoản</b>
                                            <input
                                                type="checkbox"
                                                name="selectCheckbox"
                                                id="selectCheckbox"
                                                {...register('chooseCb')}
                                                className='ml-2 text-xl'
                                            />
                                        </label>
                                        {errors.chooseCb && <p className='text-sm text-red-600 mx-2'>{errors.chooseCb.message}</p>}
                                    </div>
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
                            <button
                                className="w-[35%] rounded-lg text-blue-100 bg-blue-500 h-10 transition-colors duration-150 hover:bg-blue-800"
                                variant="contained"
                                disabled={isSubmitting}
                                onClick={handeBack}
                                color="error"
                                type="submit"
                            // startIcon={isSubmitting && <CircularProgress size={20} />}
                            >
                                Quay lại
                            </button>
                        </div>
                    </>}
            </main>
        </>
    )
}

export default registerStepTwo
