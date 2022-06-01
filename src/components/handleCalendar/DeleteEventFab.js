import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteEvent, eventClearActiveEvent } from 'features/tutorCalendarSlice';

const DeleteEventFab = ({ token }) => {
    const dispatch = useDispatch();

    const { activeEvent } = useSelector((state) => state.tutorCalendar);

    const handleDelete = () => {
        dispatch(deleteEvent({ token : token , id : activeEvent._id}));
        dispatch(eventClearActiveEvent());
    };

    return (
        // <button className="btn btn-danger fab-danger" onClick={handleDelete}>
        //     <i className="fas fa-trash mr-2"></i>
        //     <span>Borrar evento</span>
        // </button>
        <button class="flex gap-1 justify-center items-center rounded-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center" onClick={handleDelete}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-x" viewBox="0 0 16 16">
                <path d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708z" />
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
            </svg>
            <span>Xóa</span>
        </button>
    );
};

export default DeleteEventFab;
