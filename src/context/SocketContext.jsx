import { createContext, useContext, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useSocket } from '../hooks/useSocket';

import { useSession } from 'next-auth/react';

import Cookies from 'js-cookie'

import { listTutors, activeChat, newMessage, loadMessages } from 'features/chatTutorSlice';

const initialContext = {
    online: false,
};


export const SocketContext = createContext(initialContext);



export const SocketProvider = ({ children }) => {

    const { socket, online, disconnectSocket, connectSocket } = useSocket('https://server-web-totnghiep.herokuapp.com/chat');

    const dispatch = useDispatch();

    const { user } = useSelector(
        (state) => state.user
    );

    useEffect(() => {
        if (user || Cookies.get("sessionToken")) {
            console.log("user ,connectSocket")
            connectSocket();
        }
    }, [user, Cookies.get("sessionToken"), connectSocket]);

    useEffect(() => {
        if (!user && !Cookies.get("sessionToken")) {
            console.log("3")
            disconnectSocket();
        }
    }, [user, Cookies.get("sessionToken"), disconnectSocket]);

    // listen  connected tutors
    useEffect(() => {
        socket?.on('online-tutors', (tutors) => {
            console.log("listTutors", tutors[0].user_tutor)
            dispatch(listTutors(tutors[0].user_tutor));
        });
    }, [socket, dispatch]);

    useEffect(() => {
        socket?.on('private-message', (message) => {

            dispatch(newMessage(message));
            // Move scroll to final
        });
    }, [socket, dispatch]);


    return (
        <SocketContext.Provider value={{ socket, online }}>
            {children}
        </SocketContext.Provider>
    );
}