import Head from 'next/head';
import Tutors from 'components/Tutors';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

const tutorlist = () => {
    // fetch the category name passed as parameter in the url , we will use useRouter hook of nextjs
    const router = useRouter();

    const { user } = useSelector(
        (state) => state.user
    );

    const { tutors } = useSelector(
        (state) => state.chatTutor
    );

    const { data: session, status } = useSession();

    const loading = status === "loading" ? true : false

    // store the filters in a state with an empty object
    const [filters, setFilters] = useState({});

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

                <section className='min-h-[45rem]'>
                    {/* title  */}
                    <h1 className="m-5 font-bold text-xl sm:text-3xl mb-10">Danh sách gia sư</h1>
                    <div>
                        {/* filtercontainer  */}
                    </div>
                    <Tutors />
                </section>
            </main>
        </>
    )
}

export default tutorlist