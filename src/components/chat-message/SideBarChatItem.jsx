import React, { useContext } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { ActiveChat } from 'features/chatTutorSlice';
import { GoPrimitiveDot } from "react-icons/go";
import { VscError } from "react-icons/vsc";

export const SideBarChatItem = ({ user }) => {

    const { fullName, online, uid, imageUrl } = user;

    const dispatch = useDispatch();

    const { activeChat, unread } = useSelector(
        (state) => state.chatTutor
    );

    const onClick = () => {
        dispatch(ActiveChat({ uid, imageUrl, fullName, online }));



        // This code was commented because I have to  do a click two times to load messages
        // This logic was move to Messages component
        // const response = await customFetch<IMessage[]>(
        //     {
        //         endpoint: `message/history/${activeChat}`,
        //         method: 'GET',
        //         token: localStorage.getItem('accessToken') ?? '',
        //     }
        // );

        // if (response.ok) {

        //     const loadAction = {
        //         type: ChatTypes.loadMessages,
        //         payload: response.data ?? [],
        //     } as LoadMessages;

        //     dispatch(loadAction);

        // }

    }


    return (
        <>
            {/* <!-- conversación activa inicio --> */}
            <div
                className={`chat_list ${uid === activeChat.uid && 'active_chat'}`}
                onClick={onClick}
            >
                <div className="chat_people">
                    <div className="chat_img rounded-md">
                        {imageUrl && <img className="rounded" src={imageUrl} />}
                    </div>
                    <div className="chat_ib">
                        <div className='flex justify-between'>
                            <h5>{fullName}</h5>
                            {unread && unread.unreads.filter(({ from }) => from === uid).length > 0 && <span className='h-6 w-6 rounded-full  bg-red-600 text-white font-semibold text-xs flex items-center justify-center'>{unread.unreads.filter(({ from }) => from === uid).length}</span>}
                        </div>
                        { 
                            (online)
                                ? <div className="flex items-center justify-start gap-2 text-green-500 font-medium"><GoPrimitiveDot />Online</div>
                                : <div className="flex items-center justify-start gap-2 text-red-800 font-medium" ><VscError />Offline</div>
                        }
                    </div>
                </div>
            </div>
            {/* <!-- conversación activa Fin --> */}

        </>
    )
}
