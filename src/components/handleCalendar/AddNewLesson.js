import React from "react";
import { useDispatch } from "react-redux";
import { uiOpenLessonModal } from 'features/tutorCalendarSlice';
const AddNewLesson = () => {
    const dispatch = useDispatch();
    const handleClickNew = () => {
        dispatch(uiOpenLessonModal());
    };
    return (
        // <button className="btn btn-primary fab" onClick={handleClickNew}>
        //     <i className="fas fa-plus"></i>
        // </button>
        <button class="flex gap-3 justify-center items-center w-[18%] rounded-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 inline-flex items-center" onClick={handleClickNew}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
            </svg>
            <span>Đặt lịch học</span>
        </button>
    );
};

export default AddNewLesson;
