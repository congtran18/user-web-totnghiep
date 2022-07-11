import moment from "moment";
import "moment/locale/vi";
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { messages } from "helpers/calendar-messages-es";
import CandelarEvent from "./CandelarEvent";
import CalendarModal from "./CalendarModal";
import ModalAllLesson from "./ModalAllLesson"
import CalendarLessonModal from "./CalendarLessonModal";
import { useDispatch, useSelector } from "react-redux";
import { uiOpenModal, eventClearActiveEvent, eventSetActive, getEvents, uiOpenAllLessonModal } from 'features/tutorCalendarSlice';
import AddNewFab from "../handleCalendar/AddNewFab";
import AddNewLesson from "../handleCalendar/AddNewLesson";
import DeleteEventFab from "../handleCalendar/DeleteEventFab";
import { useSession } from 'next-auth/react';
import Cookies from 'js-cookie'
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("vi");
const localizer = momentLocalizer(moment);

const CalendarScreen = ({ uidTutor, action }) => {
    console.log("uidTutor", uidTutor)
    const dispatch = useDispatch();
    const { listCalendar, activeEvent } = useSelector((state) => state.tutorCalendar);

    const { data: session } = useSession();

    useEffect(() => {
        // const uid = user ? user.user.uid : session && session.uid
        dispatch(getEvents(uidTutor));
    }, []);

    const [lastView, setLastView] = useState(
        localStorage.getItem("lastView") || "month"
    );

    const onSelectSlot = (e) => {
        dispatch(eventClearActiveEvent());
    };

    const eventStyleGetter = (event, start, end, isSelected) => {
        const style = {
            backgroundColor: true ? "#367CF7" : "#465660",
            borderRadius: "0px",
            opacity: "0.8",
            display: "block",
            color: "white",
        };
        return {
            style,
        };
    };
    const onDoubleClick = (e) => {
        dispatch(uiOpenAllLessonModal());
    };
    const onSelectEvent = (e) => {
        dispatch(eventSetActive(e));
    };
    const onViewChange = (e) => {
        setLastView(setLastView(e));
        localStorage.setItem("lastView", e);
    };
    return (
        <div className="flex flex-col h-[100vh]">
            <Calendar
                selectable={true}
                localizer={localizer}
                events={listCalendar}
                startAccessor="start"
                endAccessor="end"
                messages={messages}
                eventPropGetter={(listCalendar) => {
                    const backgroundColor = listCalendar.color ? listCalendar.color : 'blue';
                    const style = {
                        backgroundColor: backgroundColor,
                        borderRadius: "0px",
                        opacity: "0.8",
                        display: "block",
                        color: "white",
                    };
                    return { style, }
                }}
                // components={{
                //     event: CandelarEvent,
                // }}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelectEvent}
                onView={onViewChange}
                onSelectSlot={onSelectSlot}
                view={lastView}
            />
            {activeEvent && action && <DeleteEventFab token={session ? session.accessToken : Cookies.get("userInfo") && JSON.parse(Cookies.get("userInfo")).accessToken} />}
            <div className="flex justify-center items-center mt-5">
                {action ? <AddNewFab /> : <AddNewLesson />}
                {/* {action && <AddNewFab />} */}
            </div>
            <CalendarModal />
            <CalendarLessonModal uidTutor={uidTutor} />
            <ModalAllLesson />
        </div>
    );
};

export default CalendarScreen;
