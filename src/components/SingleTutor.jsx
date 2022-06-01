import Image from "next/image";
import { useRouter } from 'next/dist/client/router';
import { GoPrimitiveDot } from "react-icons/go"
import {VscError} from "react-icons/vsc"

const SingleTutor = ({ tutor }) => {

    const router = useRouter();
    // const [color] = useState(product.color);

    return (
        <>
            {/* <Link href={`/tutor/${tutor?._id}`} > */}
            <div className="my-5 max-w-[22rem] items-center justify-center relative opacity-100 transition border-4 shadow-lg overflow-hidden">
                {/* tutor image  */}
                <div className="flex-1 flex sm:space-x-0 relative max-w-[22rem] ">
                    {/* image  */}
                    {/* large screen  */}
                    <div className="flex flex-col p-2">
                        {tutor.user_tutor.imageUrl && <Image src={tutor.user_tutor.imageUrl} width="150rem" height="170rem" className="border-2 border-solid border-zinc-800" objectFit="contain" />}
                        {tutor.online === true && <div className="flex items-center justify-center gap-2 text-green-500 font-medium"><GoPrimitiveDot />Online</div>}
                        {tutor.online === false && <div className="flex items-center justify-center gap-2 text-red-800 font-medium"><VscError />Offline</div>}
                    </div>
                    {/* mobile devices  */}
                    {/* <div className="inline-flex sm:hidden  mr-4 cursor-pointer" onClick={() => router.push(`/tutors/${tutor?._id}`)}>
                            <Image src={tutor.imageUrl} width="90rem" height="70rem" objectFit="contain" />
                        </div> */}
                    {/* details div  */}
                    <div className=" sm:p-2 sm:flex-1 my-3 flex flex-col text-left gap-5 items-start sm:space-y-0 space-y-0 tracking-wide">
                        {/* tutor name  */}
                        <h1 className="text-sm sm:text-base w-[10rem] truncate"><b>{tutor.user_tutor.fullName}</b></h1>
                        {/* color  */}
                        <div class="flex items-center">
                            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                            <p class="ml-2 text-sm font-bold text-gray-900 dark:text-white">4.95</p>
                            <span class="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
                            <a href="#" class="text-sm font-medium text-gray-900 dark:text-white">73 reviews</a>
                        </div>
                        <div className="flex items-center gap-1 text-[13px] sm:text-base"><GoPrimitiveDot className="text-lg text-gray-600" />{(tutor.user_tutor.status[tutor.user_tutor.status.length - 1] === "New") && "Mới gia nhập"}</div>
                        <div className="flex gap-2">
                            <button class="flex gap-2 justify-center items-center bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 inline-flex items-center cursor-pointer" onClick={() => router.push(`/tutorlist/${tutor.uid}`)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-person-fill" viewBox="0 0 16 16">
                                    <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm-1 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm-3 4c2.623 0 4.146.826 5 1.755V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-1.245C3.854 11.825 5.377 11 8 11z" />
                                </svg>
                                <span>Profile</span>
                            </button>

                            <button class={`flex gap-2 justify-center items-center hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 inline-flex items-center cursor-pointer ${!tutor.online ? "cursor-not-allowed bg-gray-400" : "bg-gray-300"}`} disabled={!tutor.online} onClick={() => { console.log("deptrai") }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone" viewBox="0 0 16 16">
                                    <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
                                </svg>
                                <span>Call</span>
                            </button>
                        </div>
                        {/* <div className="flex items-center text-[13px] sm:text-base"><GoPrimitiveDot className="text-lg text-gray-600" />{tutor.category.realname} </div> */}
                    </div>
                </div>


            </div>
            {/* </Link> */}


        </>
    )
}

export default SingleTutor
