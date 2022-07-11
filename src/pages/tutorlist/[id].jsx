import Head from 'next/head';
import axios from "axios";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "react-image-gallery/styles/css/image-gallery.css";
import { AiOutlineFileText } from "react-icons/ai";
import ReactPlayer from 'react-player'
import { useRouter } from 'next/router'
import CalendarScreen from 'components/calendar/CalendarScreen'
import ModalVote from 'components/showModal/ModalVote'
import ModalAccuse from 'components/showModal/ModalAccuse'
import SingleVote from 'components/SingleVote'
import { getReviewTutor } from 'features/reviewTutorSlice';
import { percentRating, averageRating } from 'helpers/calculator-rating'
import { LinearProgress } from '@mui/material';
import { useSession } from 'next-auth/react';

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
    const dispatch = useDispatch();

    const { user } = useSelector(
        (state) => state.user
    );

    const { data: session } = useSession();

    const [showModalVote, setShowModalVote] = useState(false)
    const [showModalAccuse, setShowModalAccuse] = useState(false)

    const { reviewTutors, isLoading, total } = useSelector(
        (state) => state.reviewTutor
    );

    // If the page is not yet generated, this will be displayed
    // initially until getStaticProps() finishes running
    if (router.isFallback) {
        return <div className="w-full">
            <img src="/Images/loading2.gif" alt="loading" className="text-center flex items-center justify-center mx-auto mt-3 " />
        </div>
    }

    useEffect(() => {
        // const uid = user ? user.user.uid : session && session.uid
        (async () => {
            if (showModalVote === false) {
                await dispatch(getReviewTutor(tutor.uid));
            }
        })();
        // console.log(percentRating(reviewTutors).filter((value) => value.rating === 4)[0].percent)
    }, [showModalVote]);

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
                        <h1 className="font-medium text-gray-800 text-lg sm:text-2xl">Thông tin gia sư</h1>
                        {/* <p className="text-gray-700 text-xs ">{user?.username}</p> */}
                    </div>
                </section>
                <div className='p-10 flex flex-col justify-center items-center mb-[8rem]'>
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
                        <div className="text-2xl flex font-medium">{tutor?.fullName}</div>
                        <div className="text-md flex">{tutor?.infomation}</div>
                        <div className="flex items-center gap-2 my-2">
                            <div className="text-xl font-medium text-neutral-700">Kinh nghiệm: </div>
                            {tutor?.status && tutor.status.map((item) => {
                                return (
                                    <div className="text-white bg-red-500 border-1 rounded-md p-[4px]">{item === "New" ? "Mới gia nhập" : "Lâu năm"}</div>
                                )
                            })}
                        </div>
                        <div className="flex items-center gap-2 my-2 font-medium text-neutral-700">
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
                                <div className="text-xl font-medium text-neutral-700">Các chứng chỉ: </div>
                                {tutor?.certificates && tutor.certificates.map((item) => {
                                    return (
                                        <div onClick={() => window.open(item.dataUrl.toString())} className="flex items-center gap-1 hover:underline hover:text-red-500 cursor-pointer my-1"><AiOutlineFileText />{item.name}</div>
                                    )
                                })}
                            </div>
                        </div>

                        {
                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="text-xl mt-8 mb-4 font-medium text-neutral-700">Đánh giá </div>
                                    <div className="flex gap-2 ">
                                        <button type="submit" class="cursor-pointer bg-white text-gray-800 font-bold rounded border border-b-4 border-green-500 hover:border-red-500 hover:bg-red-500 hover:text-white shadow-md py-1 px-3 inline-flex items-center" onClick={() => setShowModalVote(true)}>
                                            <span class="mr-2">Đánh giá</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                        </button>
                                        <button type="button" class="cursor-pointer bg-white text-gray-800 font-bold rounded border border-b-4 border-green-500 hover:border-red-500 hover:bg-red-500 hover:text-white shadow-md py-1 px-3 inline-flex items-center" onClick={() => setShowModalAccuse(true)}>
                                            <span class="mr-2">Tố cáo</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-emoji-angry-fill" viewBox="0 0 16 16">
                                                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM4.053 4.276a.5.5 0 0 1 .67-.223l2 1a.5.5 0 0 1 .166.76c.071.206.111.44.111.687C7 7.328 6.552 8 6 8s-1-.672-1-1.5c0-.408.109-.778.285-1.049l-1.009-.504a.5.5 0 0 1-.223-.67zm.232 8.157a.5.5 0 0 1-.183-.683A4.498 4.498 0 0 1 8 9.5a4.5 4.5 0 0 1 3.898 2.25.5.5 0 1 1-.866.5A3.498 3.498 0 0 0 8 10.5a3.498 3.498 0 0 0-3.032 1.75.5.5 0 0 1-.683.183zM10 8c-.552 0-1-.672-1-1.5 0-.247.04-.48.11-.686a.502.502 0 0 1 .166-.761l2-1a.5.5 0 1 1 .448.894l-1.009.504c.176.27.285.64.285 1.049 0 .828-.448 1.5-1 1.5z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div class="grid grid-cols-12 h-[50vh]">
                                    <div className="col-span-6">
                                        <div className="flex items-center mb-3">
                                            {[...Array(Math.floor(averageRating(reviewTutors)))].map((x, index) => (
                                                <>
                                                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                                </>
                                            ))}
                                            {[...Array(5 - Math.floor(averageRating(reviewTutors)))].map((x, index) => (
                                                <>
                                                    <svg className="w-5 h-5 text-gray-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                                </>
                                            ))}
                                            <p className="ml-2 text-sm font-medium text-gray-900 dark:text-white">{averageRating(reviewTutors).toFixed(2)} trên 5</p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{total} lượt đánh giá</p>
                                        <div className="flex items-center gap-3 mt-4">
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-500">5 sao</span>
                                            <LinearProgress sx={{ width: '50%', mr: 1, height: '25px', borderRadius: '2%' }} variant="determinate" value={percentRating(reviewTutors).filter((value) => value.rating === 5).length > 0 ? Math.round(percentRating(reviewTutors).filter((value) => value.rating === 5)[0].percent) : 0} />
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-500">{percentRating(reviewTutors).filter((value) => value.rating === 5).length > 0 ? (Math.round(percentRating(reviewTutors).filter((value) => value.rating === 5)[0].percent) + "%" + " " + "(" + Math.round(percentRating(reviewTutors).filter((value) => value.rating === 5)[0].count) + " " + "lượt" + ")") : "0% (0 lượt)"}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-4">
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-500">4 sao</span>
                                            <LinearProgress sx={{ width: '50%', mr: 1, height: '25px', borderRadius: '2%' }} variant="determinate" value={percentRating(reviewTutors).filter((value) => value.rating === 4).length > 0 ? Math.round(percentRating(reviewTutors).filter((value) => value.rating === 4)[0].percent) : 0} />
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-500">{percentRating(reviewTutors).filter((value) => value.rating === 4).length > 0 ? (Math.round(percentRating(reviewTutors).filter((value) => value.rating === 4)[0].percent) + "%" + " " + "(" + Math.round(percentRating(reviewTutors).filter((value) => value.rating === 4)[0].count) + " " + "lượt" + ")") : "0% (0 lượt)"}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-4">
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-500">3 sao</span>
                                            <LinearProgress sx={{ width: '50%', mr: 1, height: '25px', borderRadius: '2%' }} variant="determinate" value={percentRating(reviewTutors).filter((value) => value.rating === 3).length > 0 ? Math.round(percentRating(reviewTutors).filter((value) => value.rating === 3)[0].percent) : 0} />
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-500">{percentRating(reviewTutors).filter((value) => value.rating === 3).length > 0 ? (Math.round(percentRating(reviewTutors).filter((value) => value.rating === 3)[0].percent) + "%" + " " + "(" + Math.round(percentRating(reviewTutors).filter((value) => value.rating === 3)[0].count) + " " + "lượt" + ")") : "0% (0 lượt)"}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-4">
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-500">2 sao</span>
                                            <LinearProgress sx={{ width: '50%', mr: 1, height: '25px', borderRadius: '2%' }} variant="determinate" value={percentRating(reviewTutors).filter((value) => value.rating === 2).length > 0 ? Math.round(percentRating(reviewTutors).filter((value) => value.rating === 2)[0].percent) : 0} />
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-500">{percentRating(reviewTutors).filter((value) => value.rating === 2).length > 0 ? (Math.round(percentRating(reviewTutors).filter((value) => value.rating === 2)[0].percent) + "%" + " " + "(" + Math.round(percentRating(reviewTutors).filter((value) => value.rating === 2)[0].count) + " " + "lượt" + ")") : "0% (0 lượt)"}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-4">
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-500">1 sao</span>
                                            <LinearProgress sx={{ width: '50%', mr: 1, height: '25px', borderRadius: '2%' }} variant="determinate" value={percentRating(reviewTutors).filter((value) => value.rating === 1).length > 0 ? Math.round(percentRating(reviewTutors).filter((value) => value.rating === 1)[0].percent) : 0} />
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-500">{percentRating(reviewTutors).filter((value) => value.rating === 1).length > 0 ? (Math.round(percentRating(reviewTutors).filter((value) => value.rating === 1)[0].percent) + "%" + " " + "(" + Math.round(percentRating(reviewTutors).filter((value) => value.rating === 1)[0].count) + " " + "lượt" + ")") : "0% (0 lượt)"}</span>
                                        </div>
                                    </div>
                                    <div className="col-span-6 border-2 overflow-scroll">
                                        {reviewTutors.map((vote) => {

                                            return (vote.user_vote.uid === (user ? user.user.uid : session && session.uid)) ? <SingleVote vote={vote} ableDelete = {true}/> : <SingleVote vote={vote} ableDelete = {false}/>

                                        })}
                                    </div>
                                </div>
                            </div>
                        }

                        <div >
                            <div className="text-xl mt-8 mb-4 font-medium text-neutral-700">Lịch làm việc </div>
                            <CalendarScreen uidTutor={tutor?.uid} action={false} />
                        </div>

                        <ModalVote tutorUid={tutor.uid} showModal={showModalVote} setShowModal={setShowModalVote} />
                        <ModalAccuse tutorUid={tutor.uid} showModal={showModalAccuse} setShowModal={setShowModalAccuse} />
                    </div>
                </div>
            </main>
        </>
    )
}

export default Tutor;
