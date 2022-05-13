import Head from 'next/head';
import Link from "next/link";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from 'features/userSlice';
import { useRouter } from 'next/router';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from "react-toastify";
import { signIn, useSession } from 'next-auth/react';


export function Redirect({ to }) {
    const router = useRouter();
    useEffect(() => {
        router.push(to)
    }, [to])
    return null;
};

const SigninSchema = yup.object().shape({
    email: yup
        .string()
        .email("Định dạng email")
        .required('Nhập tên đăng nhập')
        .test('checkName', 'Tên cần lớn hơn 3 ký tự và nhỏ hơn 50 ký tự', (value) => value.trim().length >= 3 && value.trim().length <= 50),
    password: yup
        .string()
        .required('Nhập mật khẩu')
        .test('checkName', 'Tên cần lớn hơn 3 ký tự và nhỏ hơn 50 ký tự', (value) => value.trim().length >= 3 && value.trim().length <= 50),
});

const Signin = () => {

    const dispatch = useDispatch();
    const { isFetching } = useSelector((state) => state.user);
    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.user
    );

    const { data: session } = useSession();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ resolver: yupResolver(SigninSchema) });


    async function handleLogin(data) {
        try {
            await dispatch(loginUser(data))
        } catch (e) {
            toast.error("Kiểm tra lại thông tin đăng nhập")
        }
    }

    async function handleLoginGoogle(e) {
        e.preventDefault()
        signIn("google", { callbackUrl: '/' })
    }

    async function handleLoginFacebook(e) {
        e.preventDefault()
        signIn("facebook", { callbackUrl: '/' })    
    }

    //  to redirect the user to homepage if logged in 
    if (user || session) {
        return <Redirect to="/" />
    }

    return (
        <>
            <Head>
                <title>DOAN TN - Đăng nhập</title>
                <link rel="icon" href="/favicon.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={true} />
                <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>
            {/* <Navbar /> */}
            <main className="w-full h-screen  signin_gradient ">
                <section className="sm:p-7 p-5 sm:w-[35%] w-[80%] bg-gray-100 opacity-75 border-black border rounded-lg">
                    {/* heading  */}
                    <h1 className="text-base text-center sm:text-left sm:text-2xl  tracking-wide mb-4 ml-[35%]">Đăng nhập</h1>
                    {/* form  */}
                    <form className="flex  flex-col" onSubmit={handleSubmit(handleLogin)} >

                        <input {...register("email")} placeholder="Email" className="flex-1 min-w-[40%] my-2 border border-black sm:p-2 p-2 mx-2 outline-none text-sm sm:text-base rounded-md" />
                        {errors.email && <p className='text-sm text-red-600 mx-2'>{errors.email.message}</p>}
                        <input {...register("password")} type="password" placeholder="Password" className="flex-1 min-w-[40%] my-2 border border-black sm:p-2 p-2 mx-2 outline-none text-sm sm:text-base rounded-md" />
                        {errors.password && <p className='text-sm text-red-600 mx-2'>{errors.password.message}</p>}
                        <button className="w-32 sm:p-2 p-2 bg-themePink tracking-wide hover:font-medium transition-all text-sm sm:text-base self-center sm:self-start mt-4 mb-2 disabled:bg-gray-200 disabled:cursor-not-allowed" disabled={isFetching}>Đăng nhập</button>
                    </form>
                    {/* links  */}
                    <div className="flex items-center sm:space-x-5 space-y-2  sm:space-y-0 mt-4 text-gray-500 font-light text-sm sm:text-base tracking-wide underline transition-all flex-col sm:flex-row ">
                        <Link href="#">Quên mật khẩu</Link>
                        <Link href="/register">Tạo tài khoản</Link>
                    </div>

                    <button onClick={handleLoginGoogle} className="flex w-full h-11 bg-blue-200 mt-4 items-center"  ><FcGoogle size="32" className = "ml-5"/><p className="ml-[16%]">Đăng nhập bằng Google</p></button>
                    <button onClick={handleLoginFacebook} className="flex w-full h-11 bg-blue-200 mt-2 items-center" ><FaFacebook size="32" className = "ml-5"/><p className="ml-[16%]">Đăng nhập bằng Facebook</p></button>
                </section>
            </main>
        </>
    )
}

export default Signin
