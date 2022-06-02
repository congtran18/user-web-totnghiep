import { useEffect, useRef, useState } from "react";

import io from "socket.io-client";
import Peer from "simple-peer";
import { useTheme } from '@mui/material/styles';

import { useRouter } from "next/dist/client/router";
import useMediaQuery from '@mui/material/useMediaQuery';
import Cookies from 'js-cookie'

function ab2str(buf) {
    // return String.fromCharCode.apply(null, new Uint8Array(buf));
    return new TextDecoder().decode(buf);
}

export const useWebRTC = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [me, setMe] = useState("");
    const [stream, setStream] = useState(null);
    const [receivingCall, setReceivingCall] = useState(false);
    const [calling, setCalling] = useState(false);
    const [callReciever, setCallReciever] = useState(false);
    const [caller, setCaller] = useState(null);
    const [callerSignal, setCallerSignal] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);

    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('sm'))

    console.log("mobile", mobile)


    const [callCancelled, setCallCancelled] = useState(false);

    const [messages, setMessages] = useState([]);

    const socket = useRef();
    const myVideo = useRef();
    const userVideo = useRef();

    const callerPeer = useRef();
    const answerPeer = useRef();

    const messageSound = useRef(null);
    const callSound = useRef(null);
    const recieveCallSound = useRef(null);

    useEffect(() => {
        messageSound.current = new Audio("/message.wav");
        callSound.current = new Audio("/make-call.wav");
        recieveCallSound.current = new Audio("/recieving-call.wav");
    }, []);

    useEffect(() => {
        if (callAccepted && recieveCallSound.current) {
            recieveCallSound.current.pause();
        }
        if (callAccepted && callSound.current) {
            callSound.current.pause();
        }
    }, [callAccepted]);

    useEffect(() => {
        const token = Cookies.get("sessionToken") ? Cookies.get("sessionToken") : Cookies.get("userInfo") && JSON.parse(Cookies.get("userInfo")).accessToken

        if (token) {
            socket.current = io("http://localhost:5001/videoChat", {
                transports: ['websocket'],
                autoConnect: true,
                forceNew: true,
                query: {
                    authorization: `Bearer ${token}`,
                },
                extraHeaders: {
                    authorization: `Bearer ${token}`,
                }
            });
            navigator.mediaDevices
                .getUserMedia({
                    video: {
                        width: { min: 640, ideal: 1920, max: 1920 },
                        height: { min: 400, ideal: 1080 },
                        aspectRatio: 1.777777778,
                        //aspectRatio: 1.777777778,
                        frameRate: { max: 30 },
                        facingMode: "user",
                    },
                    //video: false,
                    audio: true,
                })
                .then((stream) => {
                    setStream(stream);
                    if (myVideo.current) {
                        myVideo.current.srcObject = stream;
                    }
                });

            socket.current.on("me", (id) => {
                setMe(id);
            });

            socket.current.on("user.calling", (data) => {
                if (callCancelled) {
                    setCallCancelled(false);
                    return;
                }
                setReceivingCall(true);
                setCallReciever(true);
                setCaller(data.from);
                setCallerSignal(data.signal);
                if (recieveCallSound.current) {
                    recieveCallSound.current.loop = true;
                    recieveCallSound.current.play();
                }
            });

            socket.current.on("call.cancelled", () => {
                setReceivingCall(false);
                setCallReciever(false);
                setCaller(null);
                setCallerSignal(null);
                setCallCancelled(true);
                if (recieveCallSound.current) {
                    recieveCallSound.current.pause();
                }
            });

            socket.current.on("call.ended", () => {
                router.reload();
            });
        }
    }, []);

    function callPeer(id) {
        setCalling(true);
        if (callSound.current) {
            callSound.current.loop = true;
            callSound.current.play();
        }
        callerPeer.current = new Peer({
            initiator: true,
            trickle: false,
            config: {
                iceServers: [
                    {
                        urls: "stun:numb.viagenie.ca",
                        username: "sultan1640@gmail.com",
                        credential: "98376683",
                    },
                    {
                        urls: "turn:numb.viagenie.ca",
                        username: "sultan1640@gmail.com",
                        credential: "98376683",
                    },
                ],
            },
            stream: stream,
        });

        callerPeer.current.on("signal", (data) => {
            socket.current.emit("call.user", {
                user_to_call: id,
                signal: data,
                from: { socket_id: me.toString(), name },
            });
        });

        callerPeer.current.on("stream", (stream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = stream;
            }
        });

        callerPeer.current.on("data", (m) => {
            console.log("caller get message >>", ab2str(m));
            setMessages((prev) => [
                ...prev,
                { position: "right", text: ab2str(m) },
            ]);
            if (messageSound.current) {
                messageSound.current.play();
            }
        });

        socket.current.on("call.accepted", ({ signal }) => {
            setCallAccepted(true);
            setCalling(false);
            callerPeer.current.signal(signal);
        });

        socket.current.on("call.rejected", ({ from }) => {
            setCalling(false);
            if (callSound.current) {
                callSound.current.pause();
            }
            if (callerPeer.current) {
                callerPeer.current.destroy();
            }
            router.reload();
        });
    }

    function acceptCall() {
        setCallAccepted(true);
        setReceivingCall(false);
        answerPeer.current = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
        });
        answerPeer.current.on("signal", (data) => {
            socket.current.emit("answer.call", {
                signal: data,
                to: caller.socket_id.toString(),
            });
        });

        answerPeer.current.on("stream", (stream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = stream;
            }
        });

        answerPeer.current.on("data", (m) => {
            console.log("answer got message >> ", ab2str(m));
            setMessages((prev) => [
                ...prev,
                { position: "right", text: ab2str(m) },
            ]);
            if (messageSound.current) {
                messageSound.current.play();
            }
        });

        answerPeer.current.signal(callerSignal);
    }

    async function rejectCall() {
        await socket.current.emit("reject.call", {
            from: me,
            to: caller.socket_id,
        });
        setReceivingCall(false);
        setCallReciever(false);
        setCaller(null);
        setCallerSignal(null);
        if (recieveCallSound.current) {
            recieveCallSound.current.pause();
        }
    }

    async function cancelCall(id) {
        setCalling(false);
        if (callSound.current) {
            callSound.current.pause();
        }
        await socket.current.emit("cancel.call", {
            from: me,
            to: id,
        });
        callerPeer.current.destroy();
        router.reload();
    }

    async function endCall(id) {
        await socket.current.emit("end.call", {
            from: me,
            to: callReciever ? caller.socket_id : id,
        });
        router.reload();
    }

    function sendMessage(message) {
        if (message === '') return
        if (callReciever) {
            answerPeer.current.send(message);
            setMessages((prev) => [
                ...prev,
                { position: "left", text: message },
            ]);
        } else {
            callerPeer.current.send(message);
            setMessages((prev) => [
                ...prev,
                { position: "left", text: message },
            ]);
        }
    }

    return {
        me,
        stream,
        callPeer,
        acceptCall,
        receivingCall,
        callAccepted,
        myVideo,
        userVideo,
        name,
        setName,
        caller,
        callerSignal,
        sendMessage,
        messages,
        rejectCall,
        calling,
        cancelCall,
        endCall,
    };
};
