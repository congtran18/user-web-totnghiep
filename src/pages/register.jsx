import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, loginUser } from '../features/userSlice';
import { Redirect } from './signin';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from "react-toastify";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'


const Register = () => {

    const { data: session } = useSession();

    const router = useRouter();

    const dispatch = useDispatch();

    const { user } = useSelector(
        (state) => state.user
    );

    const SignupSchema = yup.object().shape({
        fullName: yup
            .string()
            .required('Nhập tên người dùng')
            .test('checkName', 'Tên cần lớn hơn 3 ký tự và nhỏ hơn 50 ký tự', (value) => value.trim().length >= 3 && value.trim().length <= 50),
        email: yup
            .string()
            .email("Định dạng email")
            .required('Nhập email đăng nhập')
            .test('checkName', 'Email cần lớn hơn 3 ký tự và nhỏ hơn 50 ký tự', (value) => value.trim().length >= 3 && value.trim().length <= 50),
        password: yup
            .string()
            .required('Nhập mật khẩu')
            .test('checkName', 'Tên cần lớn hơn 3 ký tự và nhỏ hơn 50 ký tự', (value) => value.trim().length >= 3 && value.trim().length <= 50),
        confirmPwd: yup
            .string()
            .required('Nhập mật khẩu xác nhận')
            .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp'),
        chooseCb: yup.bool().oneOf([true], 'Xác nhận điều khoản'),
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ resolver: yupResolver(SignupSchema) });



    async function handleRegister(data) {
        try {
            const { confirmPwd, chooseCb, ...rest } = data
            await dispatch(registerUser(rest))

            if (Cookies.get("userInfo")) {
                const { fullName, ...restLogin} = rest
                dispatch(loginUser(restLogin))
            }

        } catch (e) {
            toast.error("Tài khoản bị trùng")
        }
    };

    if (user || session) {
        return <Redirect to="/" />
    }


    return (
        <>
            <Head>
                <title>Đăng kí tài khoản</title>
                <link rel="icon" href="/favicon.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={true} />
                <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>
            {/* <Navbar /> */}

            <main className="w-full h-screen  register_gradient ">
                <section className="sm:p-7 p-5 sm:w-[35%] w-[80%] bg-gray-100 opacity-75 border-black border rounded-lg">
                    {/* heading  */}
                    <h1 className="text-base text-center sm:text-left sm:text-2xl  tracking-wide mb-4 ml-[25%]">Đăng kí tài khoản</h1>
                    {/* form  */}
                    <form className="flex flex-col" onSubmit={handleSubmit(handleRegister)} >
                        <input {...register("fullName")} type="text" placeholder="Usename" className="flex-1 min-w-[40%] my-2 border border-black sm:p-2 p-2 mx-2 outline-none text-sm sm:text-base rounded-md" />
                        {errors.fullName && <p className='text-sm text-red-600 mx-2'>{errors.fullName.message}</p>}
                        <input {...register("email")} type="email" placeholder="Email" className="flex-1 min-w-[40%] my-2 border border-black sm:p-2 p-2 mx-2 outline-none text-sm sm:text-base rounded-md" />
                        {errors.email && <p className='text-sm text-red-600 mx-2'>{errors.email.message}</p>}
                        <input {...register("password")} type="password" placeholder="Password" className="flex-1 min-w-[40%] my-2 border border-black sm:p-2 p-2 mx-2 outline-none text-sm sm:text-base rounded-md" />
                        {errors.password && <p className='text-sm text-red-600 mx-2'>{errors.password.message}</p>}
                        <input {...register("confirmPwd")} type="password" placeholder="Confirm Password" className="flex-1 min-w-[40%] my-2 border border-black sm:p-2 p-2 mx-2 outline-none text-sm sm:text-base rounded-md" />
                        {errors.confirmPwd && <p className='text-sm text-red-600 mx-2'>{errors.confirmPwd.message}</p>}
                        <label className='block ml-2 pt-4'
                        >Bằng cách tích vào đây tôi chấp nhập các <b className="text-black">Điều khoản cá nhân</b>
                            <input
                                type="checkbox"
                                name="selectCheckbox"
                                id="selectCheckbox"
                                {...register('chooseCb')}
                                className='ml-2 text-xl'
                            />
                        </label>
                        {errors.chooseCb && <p className='text-sm text-red-600 mx-2'>{errors.chooseCb.message}</p>}
                        <button className="w-32 sm:p-2 p-2 bg-themePink tracking-wide hover:font-medium transition-all text-xs sm:text-base self-center sm:self-start disabled:bg-gray-200 disabled:cursor-not-allowed mt-4 ml-2">Đăng kí</button>
                    </form>


                </section>
            </main>
        </>
    )
}

export default Register
