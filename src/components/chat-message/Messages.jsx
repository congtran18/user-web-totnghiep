import React, { useCallback, useContext, useEffect } from 'react'

import { SendMessage } from './SendMessage'
import { OutgoingMessage } from './OutgoingMessage'
import { IncomingMessage } from './IncomingMessage'
import { scrollToBottom } from 'helpers/scrollToBottom'
import { useDispatch, useSelector } from "react-redux";
import { getMessages, loadMessages, getUnreadMessages } from 'features/chatTutorSlice';
import { GoPrimitiveDot } from "react-icons/go";
import { VscError } from "react-icons/vsc";
import Cookies from 'js-cookie'
import { useSession } from 'next-auth/react';


export const Messages = () => {

    const dispatch = useDispatch();

    const { user } = useSelector(
        (state) => state.user
    );

    const { data: session, status } = useSession();

    const loading = status === "loading" ? true : false

    const { activeChat, messages, isLoading } = useSelector(
        (state) => state.chatTutor
    );

    const fetchMessages = useCallback(
        async () => {
            const token = Cookies.get("userInfo") ? JSON.parse(Cookies.get("userInfo")).accessToken : Cookies.get("sessionToken") && Cookies.get("sessionToken")
            const response = await dispatch(getMessages({ token: token, uid: activeChat.uid }))
            await dispatch(loadMessages(response.payload))
            await dispatch(getUnreadMessages({ token: token }))
            scrollToBottom('messages');
        },
        [activeChat, dispatch],
    );


    useEffect(() => {
        // Load chat messages
        fetchMessages();
    }, [fetchMessages]);


    return (
        <>
            <div className="flex gap-2 border-2 p-[22px] bg-slate-200 text-md font-bold items-center text-neutral-700">&nbsp;&nbsp;{activeChat.fullName}{activeChat.online ? <GoPrimitiveDot className='text-green-500' /> : <VscError className='text-red-500' />}</div>
            {/* <!-- Chat inicio --> */}
            <div
                className="mesgs"
            >

                {/* <!-- Historia inicio --> */}
                <div
                    id="messages"
                    className="msg_history"
                >

                    {
                        (isLoading || loading) ?
                            <div className="w-full">
                                <img src="/Images/loading8.gif" alt="loading" className="w-[8rem] h-[8rem] text-center flex items-center justify-center mx-auto mt-[20%] text-xs" />
                            </div>
                            :
                            messages.filter(({ from }) => from !== activeChat.uid).length === 0 ?
                                <div className="flex items-center justify-center mt-[30%] right-0 width-[60%] text-center">
                                    <div className="alert alert-info">
                                        {/* <hr /> */}
                                        {/* <h3>Chọn gia sư</h3> */}
                                        <h2 className="font-bold text-lg">
                                            Bắt đầu chat!
                                        </h2>
                                    </div>
                                </div>
                                :
                                messages.map(
                                    (msg) =>
                                    (session ? (msg.to !== session.uid) : (msg.to !== user.user.uid))
                                        ? <OutgoingMessage key={msg.id} message={msg} />//minh gui di
                                        : (msg.from === activeChat.uid) && <IncomingMessage key={msg.id} message={msg} imageUrl={activeChat.imageUrl} />//tin nhan nhan lai
                                    // {
                                    //     console.log(msg)
                                    // }
                                )

                    }


                </div>
                {/* <!-- Historia Fin --> */}

                <SendMessage />

            </div>
            {/* <!-- Chat Fin --> */}
        </>
    )
}
