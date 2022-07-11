import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { uiCloseAllLessonModal, eventClearActiveEvent, getLessons } from 'features/tutorCalendarSlice';
import moment from 'moment'

const customStyles = {
    overlay: {
        position: 'fixed',
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        background: 'white',
        borderRadius: '0.8rem',
        width: '40vw',
        height: '65vh',
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
    },
};

Modal.setAppElement("#__next");

const ModalAllLesson = () => {
    const { openModalAllLesson, activeEvent, listLesson, isLoading } = useSelector((state) => state.tutorCalendar);

    const dispatch = useDispatch();

    useEffect(() => {
        console.log("activeEvent", activeEvent)
        if (activeEvent) {
            dispatch(getLessons({ id: activeEvent._id, start: activeEvent.start, end: activeEvent.end }))
        }
    }, [activeEvent]);


    const closeModal = () => {
        dispatch(uiCloseAllLessonModal());
        dispatch(eventClearActiveEvent());
    };

    return (
        <Modal
            isOpen={openModalAllLesson}
            // onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            closeTimeoutMS={200}
        // className="modal"
        // overlayClassName="modal-fondo"
        >
            <div className="flex justify-between">
                <div className="mb-3 text-lg"> {"Danh sách đặt trước"} </div>
                <div>
                    <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" onClick={closeModal} data-modal-toggle="popup-modal">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </button>
                </div>
            </div>
            <hr />
            <div className="container flex flex-col justify-center items-center">
                {/* <div>Danh sách đặt trước</div> */}
                <div className="flex flex-col gap-[10rem] mt-10 justify-between">
                    {isLoading ?
                        <div className="w-full">
                            <img src="/Images/loading2.gif" alt="loading" className="text-center flex items-center justify-center mx-auto mt-3 " />
                        </div>
                        : listLesson.length === 0 ?
                            <div>Chưa có lịch đặt trước!</div>
                            : <div>
                                {listLesson.map(listLesson => {
                                    return (
                                        <div><span className="font-semibold">{listLesson.username}</span>{"  đặt lịch trước từ " + moment(new Date(listLesson.start)).format('h:mm a') + " đến " + moment(new Date(listLesson.end)).format('h:mm a')}</div>
                                    )
                                })}
                            </div>}
                </div>
            </div>
        </Modal>
    );
};

export default ModalAllLesson;
