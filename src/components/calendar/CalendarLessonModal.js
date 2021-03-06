import React, { useEffect, useState, useContext } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { uiCloseLessonModal, eventClearActiveEvent, createLesson } from 'features/tutorCalendarSlice';
import { useSession } from 'next-auth/react';
import Cookies from 'js-cookie'
import { toast } from "react-toastify";
import axios from "axios";
import { SocketContext } from 'context/SocketContext';

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

const nowStart = moment().minutes(0).seconds(0).add(1, "day");
const nowEnd = nowStart.clone().add(0.5, "hours");

const initEvent = {
    notes: "",
    start: nowStart.toDate(),
    end: nowEnd.toDate(),
};

const CalendarLessonModal = ({ uidTutor }) => {
    const { openLessonModal } = useSelector((state) => state.tutorCalendar);

    const { user } = useSelector(
        (state) => state.user
    );

    const { socket } = useContext(SocketContext);

    const { data: session } = useSession();

    const dispatch = useDispatch();

    const [dateStart, setDateStart] = useState(nowStart.toDate());
    const [dateEnd, setDateEnd] = useState(nowEnd.toDate());

    const [formValues, setFormValues] = useState(initEvent);

    const { notes, start, end } = formValues;

    useEffect(() => {
        setFormValues(initEvent);
    }, [setFormValues]);

    const handleInputChange = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value,
        });
    };

    const filterPassedTime = (time) => {
        const currentDate = new Date(dateStart);
        const selectedDate = new Date(time);

        return currentDate.getTime() < selectedDate.getTime();
    };

    const closeModal = () => {
        dispatch(uiCloseLessonModal());
        dispatch(eventClearActiveEvent());
        setFormValues(initEvent);
    };

    const handleStartDateChange = (e) => {
        setDateStart(e);
        const fixEnd = dateEnd;
        // if (moment(e).isSameOrAfter(dateEnd)) {
        fixEnd = new Date(e.getTime() + 30 * 60 * 1000)
        setDateEnd(new Date(e.getTime() + 30 * 60 * 1000))
        // }
        if (!moment(e).isSame(dateEnd, 'day')) {
            fixEnd = new Date(e.getTime() + 30 * 60 * 1000)
            setDateEnd(new Date(e.getTime() + 30 * 60 * 1000))
        }
        setFormValues({
            ...formValues,
            end: fixEnd,
            start: e,
        });
    };
    const handleEndDateChange = (e) => {
        setDateEnd(e);
        setFormValues({
            ...formValues,
            end: e,
        });
    };
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const response = await axios.get(`${process.env.NEXT_PUBLIC_DB_URL}/users/check-minutes/${user ? user.user.uid : session && session.user.uid}`)
        if (parseInt(response.data.data.daysleft) > 1) {
            const token = session ? session.accessToken : Cookies.get("userInfo") && JSON.parse(Cookies.get("userInfo")).accessToken
            await dispatch(createLesson({ ...formValues, ...{ token: token }, ...{ user: user ? user.user.uid : session && session.user.uid }, ...{ username: user ? user.user.fullName : session && session.user.name }, ...{ tutoruid: uidTutor } }));
            const messageToSend = {
                uid : [uidTutor, user ? user.user.uid : session && session.user.uid]
            };
            // Emit a websocket
            socket?.emit('private-lesson-message', messageToSend);
        } else {
            toast.error("B???n ko c?? th???i gian h???c!")
        }

        closeModal();
    };
    return (
        <Modal
            isOpen={openLessonModal}
            // onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            closeTimeoutMS={200}
        // className="modal"
        // overlayClassName="modal-fondo"
        >
            <h1 className="mb-3 text-lg"> {"?????t tr?????c l???ch h???c"} </h1>
            <hr />
            <form className="container my-4 " onSubmit={handleSubmitForm}>
                <div className="flex flex-col justify-center items-center">
                    <div className="form-group">
                        <div>Ng??y v?? gi??? b???t ?????u</div>
                        <DatePicker
                            selected={dateStart}
                            // maxDate={moment().minutes(0).seconds(0).add(2, "day").toDate()}
                            minDate={moment().minutes(0).seconds(0).add(1, "day").toDate()}
                            onChange={handleStartDateChange}
                            showTimeSelect
                            className="form-control"
                            dateFormat="Pp"
                            onKeyDown={(e) => {
                                e.preventDefault();
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <div>Ng??y v?? gi??? k???t th??c</div>
                        <DatePicker
                            selected={dateEnd}
                            maxDate={dateStart}
                            onChange={handleEndDateChange}
                            showTimeSelect
                            dateFormat="Pp"
                            minDate={dateStart}
                            disabled={true}
                            filterTime={filterPassedTime}
                            onKeyDown={(e) => {
                                e.preventDefault();
                            }}
                        />
                    </div>
                    {/* 
                    <div className="form-group mt-4 mb-6">
                        <div>Th??m m?? t??? (c?? ho???c kh??ng)</div>
                        <input
                            type="text"
                            className="form-control flex-1 min-w-[40%] my-2 border border-black sm:p-2 p-2 mx-2 outline-none text-sm sm:text-base rounded-md"
                            placeholder="m?? t???..."
                            name="notes"
                            autoComplete="off"
                            value={notes}
                            onChange={handleInputChange}
                        />
                    </div> */}

                    <div className="flex gap-3 mt-20">
                        <button type="submit" class="cursor-pointer bg-white text-gray-800 font-bold rounded border border-b-4 border-green-500 hover:border-red-500 hover:bg-red-500 hover:text-white shadow-md py-1 px-3 inline-flex items-center">
                            <span class="mr-2">?????t l???ch</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                            </svg>
                        </button>
                        <button onClick={closeModal} type="button" class="cursor-pointer bg-white text-gray-800 font-bold rounded border border-b-4 border-green-500 hover:border-red-500 hover:bg-red-500 hover:text-white shadow-md py-1 px-3 inline-flex items-center">
                            <span class="mr-2">????ng</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z" />
                                <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default CalendarLessonModal;
