import Head from 'next/head';
import axios from "axios";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, getTotals } from 'features/cartSlice';
import "react-image-gallery/styles/css/image-gallery.css";
import { AiOutlineFileText } from "react-icons/ai";
import ReactPlayer from 'react-player'
import { useRouter } from 'next/router'
import CalendarScreen from 'components/calendar/CalendarScreen'

export const getStaticPaths = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_DB_URL}/tutor`);

    const data = response.data.data.tutor;

    const paths = data?.map((element) => {
        return {
            params: {
                id: element.uid
            }
        }
    })

    return {
        paths: paths,
        fallback: true
    }
};

export const getStaticProps = async (context) => {

    try {

        const id = context.params.id

        const response = await axios.get(`${process.env.NEXT_PUBLIC_DB_URL}/tutor/${id}`)
        const data = response.data.data;

        return {
            props: {
                tutor: data,
            }
        }

    } catch (error) {
        console.log(error);
        return {
            props: {
                tutor: null
            }
        }
    }

}

const Tutor = ({ tutor }) => {

    const router = useRouter()

    // If the page is not yet generated, this will be displayed
    // initially until getStaticProps() finishes running
    if (router.isFallback) {
        return <div className="w-full">
            <img src="/Images/loading2.gif" alt="loading" className="text-center flex items-center justify-center mx-auto mt-3 " />
        </div>
    }

    return (
        <>
            <Head>
                <title>Tutor Profile</title>
                <link rel="icon" href="/favicon.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={true} />
                <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>
            <main>
                <section className="sm:w-[90%] w-[95%] h-full flex flex-wrap items-center mx-auto my-5 ">
                    <div className="flex flex-col w-full -space-y-1 border-b border-gray-300 py-4">
                        <h1 className="font-semibold text-gray-800 text-lg sm:text-2xl">Thông tin gia sư</h1>
                        {/* <p className="text-gray-700 text-xs ">{user?.username}</p> */}
                    </div>
                </section>
                <div className='p-10 flex flex-col justify-center items-center'>
                    <div className="m-auto w-[60rem] space-y-4">
                        <div className="mb-4">
                            {tutor && <ReactPlayer
                                url={tutor?.videoUrl}
                                playing={true}
                                controls={true}
                                playIcon
                                width='60rem'
                                height='90%'
                            />}
                        </div>
                        <div className="text-2xl flex font-bold">{tutor?.fullName}</div>
                        <div className="text-md flex">{tutor?.infomation}</div>
                        <div className="flex items-center gap-2 my-2">
                            <div className="text-xl">Kinh nghiệm: </div>
                            {tutor?.status && tutor.status.map((item) => {
                                return (
                                    <div className="text-white bg-red-500 border-1 rounded-md p-[4px]">{item === "New" ? "Mới gia nhập" : "Lâu năm"}</div>
                                )
                            })}
                        </div>
                        <div className="flex items-center gap-2 my-2">
                            <div className="text-xl">Lĩnh vực hiểu biết: </div>
                            {tutor?.include && tutor.include.map((item) => {
                                return (
                                    <div className="text-white bg-blue-500 border-1 rounded-md p-[4px]">{item}</div>
                                )
                            })}
                        </div>
                        {/* <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', my: 2, gap: '3px' }}>
                                <Box><TextMute>Các chứng chỉ:</TextMute></Box>
                                {tutor.certificates && tutor.certificates.map((item, index) => {
                                    return (
                                        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', '&:hover': { color: 'red', textDecoration: 'underline', backgroundColor: 'white' }, }} onClick={() => window.open(item.dataUrl.toString())}><AttachmentIcon />&nbsp;&nbsp;<span>{item.name}</span></Box>
                                    )
                                })}
                            </Box> */}
                        <div>
                            <div className="my-2 gap-1">
                                <div className="text-xl">Các chứng chỉ: </div>
                                {tutor?.certificates && tutor.certificates.map((item) => {
                                    return (
                                        <div onClick={() => window.open(item.dataUrl.toString())} className="flex items-center gap-1 hover:underline hover:text-red-500 cursor-pointer my-1"><AiOutlineFileText />{item.name}</div>
                                    )
                                })}
                            </div>
                        </div>
                        <div>
                            <div className="text-xl mt-8 mb-4">Lịch làm việc </div>
                            <CalendarScreen uidTutor={tutor?.uid} action={false} />
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Tutor;
