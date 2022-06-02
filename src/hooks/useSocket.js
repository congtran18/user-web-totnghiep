import { useCallback, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import Cookies from 'js-cookie'
import Peer from "simple-peer";
import { useRouter } from "next/dist/client/router";

export const useSocket = (serverPath) => {


    // const socket = useMemo(
    //     () => io(
    //         serverPath,
    //         {
    //             transports: ['websocket'],
    //         },
    //     ),
    //     [serverPath],
    // );
    const router = useRouter();

    const { data: session } = useSession();

    const [socket, setSocket] = useState(null);

    const connectSocket = useCallback(
        () => {
            const token = Cookies.get("sessionToken") ? Cookies.get("sessionToken") : Cookies.get("userInfo") && JSON.parse(Cookies.get("userInfo")).accessToken
            const socketTemp = io(
                serverPath,
                {
                    transports: ['websocket'],
                    autoConnect: true,
                    forceNew: true,
                    query: {
                        authorization: `Bearer ${token}`,
                    },
                    extraHeaders: {
                        authorization: `Bearer ${token}`,
                    }
                },
            );
            console.log("socketTemp", socketTemp)
            setSocket(socketTemp);
        },
        [serverPath],
    );

    const disconnectSocket = useCallback(
        () => {

            socket?.disconnect();
            setSocket(null);
        },
        [socket],
    );


    const [online, setOnline] = useState(false);

    useEffect(() => {

        setOnline(socket?.connected ? true : false);

    }, [socket]);


    useEffect(() => {

        socket?.on(
            'connect', () => {
                setOnline(true);
            }
        );

    }, [socket]);


    useEffect(() => {

        socket?.on(
            'disconnect', () => {
                setOnline(false);
            }
        );

    }, [socket]);


    return {
        socket,
        online,
        disconnectSocket,
        connectSocket,
    };
}
