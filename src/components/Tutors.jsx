import { useEffect, useState } from "react";
import SingleTutor from "./SingleTutor";
import Image from "next/image";
import { useRouter } from 'next/dist/client/router';
import { useDispatch, useSelector } from 'react-redux';
import { filterListTutors } from 'features/chatTutorSlice';

const Tutors = () => {

    const router = useRouter();

    const dispatch = useDispatch();
    const { tutors } = useSelector(
        (state) => state.chatTutor
    );

    const { users } = useSelector(
        (state) => state.chatTutor
    );

    // const ListTutors = tutors
    const [filterTutor, setFilterTutor] = useState(tutors)

    useEffect(() => {
        setFilterTutor(tutors)
    }, [tutors])

    let body = null

    const handelStatus = (value) => {
        if (value) {
            setFilterTutor(tutors.filter(filterTutor => filterTutor.online === JSON.parse(value.toLowerCase())))
        } else {
            setFilterTutor(tutors)
        }
    }

    const handelSelect = (value) => {
        if (value) {
            setFilterTutor(tutors.filter(filterTutor => filterTutor.user_tutor[0].status.includes(value)))
        } else {
            setFilterTutor(tutors)
        }
    }

    const handelSearch = (value) => {
        if (value) {
            setFilterTutor(tutors.filter(filterTutor => filterTutor.user_tutor[0].fullName.includes(value)))
        } else {
            setFilterTutor(tutors)
        }
    }

    if (tutors?.length === 0) {
        <div className="h-full w-full flex items-center justify-center flex-col my-12">
            <Image src="/Images/blank.svg" objectFit="contain" width="300rem" height="300rem" />
            <p className="my-8 text-gray-700 tracking-wide text-sm sm:text-lg font-medium capitalize">No products found for </p>
            <button type="button" onClick={() => router.push('/productlist')} className="bg-themePink py-2.5 px-5 w-max mx-auto text-sm sm:text-lg transition shadow-md hover:font-medium">Danh sách sản phẩm</button>
        </div>
    }
    else {
        body = (
            <>
                <div className="grid grid-cols-11 gap-4">
                    <div class="item1 col-span-2 border-r-2 mt-4 h-[35rem]">
                        <div class="flex justify-center">
                            <div class="mb-3 w-[80%]">
                                <div class="input-group relative flex flex-wrap items-stretch w-full mb-4 rounded">
                                    <input onChange={e => handelSearch(e.target.value)} type="search" class="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Tìm theo tên..." aria-label="Search" aria-describedby="button-addon2" />
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-center">
                            <div class="mb-3 w-[80%]">
                                <select onChange={e => handelStatus(e.target.value)} class="form-select block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                                    {/* <option selected>Trạng thái</option> */}
                                    <option value="" selected>Trạng thái</option>
                                    <option value="true">Online</option>
                                    <option value="false">Offline</option>
                                </select>
                            </div>
                        </div>
                        <div class="flex justify-center mt-3">
                            <div class="mb-3 w-[80%]">
                                <select onChange={e => handelSelect(e.target.value)} class="form-select block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                                    <option value="" selected>Lọc gia sư</option>
                                    <option value="New">Mới gia nhập</option>
                                    <option value="EXP">Có kinh nghiệm</option>
                                    <option value="GOOD">Gia sư giỏi</option>
                                </select>
                            </div>
                        </div>
                        <div class="flex justify-center mt-3">
                            <div class="mb-3 w-[80%]">
                                <button
                                    // role='link'
                                    // onClick={createCheckoutSession}
                                    // disabled={!session}
                                    className={`custombutton text-sm w-full my-2 ml-0 `}
                                >
                                    Call ngẫu nhiên
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 ml-2 item2 col-span-9 h-[16rem]">
                        {filterTutor.map((tutor) => (
                            <SingleTutor tutor={tutor} />
                        ))}
                    </div>
                </div>
            </>
        )
    }



    return (
        <>
            {body}
        </>
    )
}

export default Tutors
