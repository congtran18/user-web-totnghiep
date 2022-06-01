import { useSelector } from "react-redux";
import Head from 'next/head';
import { useRouter } from "next/router";
import { useSession } from 'next-auth/react';
import CheckoutWizard from 'components/CheckoutWizard'

const registerStepTwo = () => {

    const { user } = useSelector(
        (state) => state.user
    );

    const { stepOne, stepTwo } = useSelector(
        (state) => state.registerTutor
    );

    const { data: session, status } = useSession();

    const router = useRouter();

    const loading = status === "loading" ? true : false


    if (!user && !session && !loading) {
        router.push("/signin")
    }
    if (!stepOne.infomation) {
        router.push("/registerStepOne")
    }
    if (!stepTwo.questionone) {
        router.push("/registerStepTwo")
    }

    if (user && user.role === "tutor" || session && session.role === "tutor") {
        router.push("/")
    }

    return (
        <>
            <Head>
                <title>Register Step Three</title>
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
                    : (user && user.role === "waitingtutor" || session && session.role === "waitingtutor") &&
                    <>
                        <CheckoutWizard activeStep={3} />
                        <div className="flex flex-col justify-center items-center mb-20">
                            <div className="w-[38%]">
                                <p className="text-lg text-red-500 font-bold mt-20 border p-2">Yêu cầu đăng kí của bạn đang chờ được admin phê duyệt...</p>
                            </div>
                        </div>
                    </>}
            </main>
        </>
    )
}

export default registerStepTwo
