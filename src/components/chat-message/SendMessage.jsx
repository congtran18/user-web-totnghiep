import React, { ChangeEvent, FormEvent, useContext, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from 'context/SocketContext';
import { useSession } from 'next-auth/react';

export const SendMessage = () => {


    const [message, setMessage] = useState('');

    const { user } = useSelector(
        (state) => state.user
    );

    const { activeChat } = useSelector(
        (state) => state.chatTutor
    );

    const { data: session } = useSession();

    const { socket } = useContext(SocketContext);

    const onChange = ({ target }) => {
        setMessage(target.value);
    }

    const onSubmit = (ev) => {
        ev.preventDefault();
        if (message.trim().length === 0) { return; }

        const messageToSend = {
            from: session ? session.uid : user.user.uid,
            to: activeChat.uid,
            text: message,
        };
        // Emit a websocket
        socket?.emit('private-message', messageToSend);

        setMessage('');
    }


    return (
        <form
            onSubmit={onSubmit}
        >
            { /*      <!-- Enviar mensaje Inicio --> */}
            <div className="type_msg flex justify-between items-center">
                <div className="input_msg_write">
                    <input
                        type="text"
                        className="write_msg"
                        placeholder="Nhập tin nhắn..."
                        value={message}
                        onChange={onChange}
                    />
                </div>
                <div className="text-center">
                    <button
                        className="msg_send_btn mt-3"
                        type="submit"
                    >
                        Gửi
                    </button>
                </div>
            </div>
            {/* <!-- Enviar mensaje Fin --> */}
        </form>
    )
}
