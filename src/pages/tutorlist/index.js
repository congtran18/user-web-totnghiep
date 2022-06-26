import Head from 'next/head';
import Tutors from 'components/Tutors';
import { useRouter } from 'next/dist/client/router';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from "../signin";
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
// import VideoChat from "components/video-chat/VideoChat";
import dynamic from 'next/dynamic';

const VideoChat = dynamic(
    () => import('components/video-chat/VideoChat'),
    {
        ssr: false,
    }
);

const tutorlist = () => {
    // fetch the category name passed as parameter in the url , we will use useRouter hook of nextjs
    const router = useRouter();

    const { user } = useSelector(
        (state) => state.user
    );

    const { data: session, status } = useSession();

    const loading = status === "loading" ? true : false

    // store the filters in a state with an empty object
    const [filters, setFilters] = useState({});

    if (!user && !session && !loading) {
        return <Redirect to="/signin" />
    }

    if (user && user.role === "tutor" || session && session.role === "tutor") {
        router.push("/")
    }

    return (
        <>
            <Head>
                <title>Danh sách gia sư</title>
                <link rel="icon" href="/favicon.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={true} />
                <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>
            <main>
                {/* <Announcement />
                <Navbar /> */}
                {loading ?
                    <div className="w-full">
                        <img src="/Images/loading2.gif" alt="loading" className="text-center flex items-center justify-center mx-auto mt-3 " />
                    </div> :

                    <section className='min-h-[45rem]'>
                        {/* title  */}
                        <h1 className="m-5 font-bold text-xl sm:text-3xl mb-10">Danh sách gia sư</h1>
                        <div>
                            {/* filtercontainer  */}
                        </div>
                        <Tutors />
                    </section>}
                <VideoChat onReady={false} isTutor={false} />
            </main>
        </>
    )
}

export default tutorlist
