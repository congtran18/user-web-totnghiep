import React, { useEffect, useRef, useState } from "react";

import io from "socket.io-client";
import Peer from "simple-peer";
import { useTheme } from '@mui/material/styles';

import { useRouter } from "next/dist/client/router";
import useMediaQuery from '@mui/material/useMediaQuery';
import Cookies from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { listTutors } from 'features/chatTutorSlice';
import { storeUserCourse } from 'features/storageSlice';

function ab2str(buf) {
    // return String.fromCharCode.apply(null, new Uint8Array(buf));
    return new TextDecoder().decode(buf);
}

export const useWebRTC = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [tutorUid, setTutorUid] = useState("");
    const [me, setMe] = useState("");
    const [stream, setStream] = useState(null);
    const [receivingCall, setReceivingCall] = useState(false);
    const [calling, setCalling] = useState(false);
    const [callReciever, setCallReciever] = useState(false);
    const [caller, setCaller] = useState(null);
    const [callerSignal, setCallerSignal] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);

    const [myVdoStatus, setMyVdoStatus] = useState(true);
    const [userVdoStatus, setUserVdoStatus] = useState();
    const [myMicStatus, setMyMicStatus] = useState(true);
    const [userMicStatus, setUserMicStatus] = useState();
    const [screenShare, setScreenShare] = useState(false);
    const [chatStatus, setChatStatus] = useState(true);

    const [timeOut, setTimeOut] = useState(false);

    const { user } = useSelector(
        (state) => state.user
    );

    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('sm'))

    const [callCancelled, setCallCancelled] = useState(false);

    const [messages, setMessages] = useState([]);

    const socket = useRef();
    const myVideo = useRef();
    const userVideo = useRef();
    const videoRecorderRef = useRef(null);

    const callerPeer = useRef();
    const answerPeer = useRef();
    const connectionRef = useRef();
    const screenTrackRef = useRef();

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
            socket.current = io("https://server-web-totnghiep.herokuapp.com/videoChat", {
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
                    // video: {
                    //     width: { min: 640, ideal: 1920, max: 1920 },
                    //     height: { min: 400, ideal: 1080 },
                    //     aspectRatio: 1.777777778,
                    //     //aspectRatio: 1.777777778,
                    //     frameRate: { max: 30 },
                    //     facingMode: "user",
                    // },
                    video: true,
                    audio: true,
                })
                .then((stream) => {
                    // stream.getAudioTracks()[0].enabled = false;
                    setStream(stream);
                    // myVideo.current.srcObject = stream;
                    if (myVideo.current) {
                        myVideo.current.srcObject = stream;
                    }
                });

            socket.current.on("me", (id) => {
                setMe(id);
            });

            socket.current.on("online-tutors", (tutors) => {
                dispatch(listTutors(tutors[0].user_tutor));
            });

            //gia su nhan cuoc goi tu nguoi dung
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

            //gia su nhan end call tu nguoi dung thi cx se ko reload
            socket.current.on("call.ended", async () => {
                videoRecorderRef.current?.record().stop()

                await new Promise((res) => {
                    setTimeout(() => {
                        res();
                    }, 500);
                });

                //khi gia su nhan thong bao end call
                // if (videoRecorderRef.current) {
                //     // console.log("{ tutor: me, user: caller.socket_id }", { tutor: me, user: caller })
                //     console.log("me nekeneken nek", me)
                //     dispatch(storeUserCourse({ tutor: me }))
                // }

                //nguoi dung se ko co record video
                if (!videoRecorderRef.current) {
                    router.reload()
                }
                // }
                // toast.info("Buổi học kết thúc")
            });

            socket.current.on("updateUserMedia", ({ type, currentMediaStatus }) => {
                if (currentMediaStatus !== null || currentMediaStatus !== []) {
                    switch (type) {
                        case "video":
                            setUserVdoStatus(currentMediaStatus);
                            break;
                        case "mic":
                            setUserMicStatus(currentMediaStatus);
                            break;
                        default:
                            setUserMicStatus(currentMediaStatus[0]);
                            setUserVdoStatus(currentMediaStatus[1]);
                            break;
                    }
                }
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
            //we are answering call that's why false
            initiator: true,
            trickle: false,
            config: {
                iceServers: [
                    {
                        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
                    },
                    // {
                    //     urls: 'stun:stun.l.google.com:19302'
                    // },
                ],
            },
            // we have asked permission from user
            stream: stream,
        });

        callerPeer.current.on("signal", (data) => {
            socket.current.emit("call.user", {
                user_to_call: id,
                signal: data,
                from: { socket_id: me.toString(), name: user.user.fullName },
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
                { position: "left", text: ab2str(m), bgcolor: "#e1bee7", color: "#212121" },
            ]);
            if (messageSound.current) {
                messageSound.current.play();
            }
        });

        socket.current.on("call.accepted", ({ signal }) => {
            setCallAccepted(true);
            setCalling(false);
            callerPeer.current.signal(signal);
            const interval1 = setInterval(() => {
                toast.info("Bạn hết thời gian!")
            }, 20000);
            const interval2 = setInterval(() => {
                setTimeOut(true)
                // toast.info("Bạn còn 5s!")
            }, 15000);
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

        connectionRef.current = callerPeer.current;
    }

    //gia su chap nhan call
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
                { position: "left", text: ab2str(m), bgcolor: "#e1bee7", color: "#212121" },
            ]);
            if (messageSound.current) {
                messageSound.current.play();
            }
        });

        videoRecorderRef.current?.record().start();

        const interval1 = setInterval(() => {
            setTimeOut(true)
            toast.info("Học viên sắp hết thời gian!")
            // endCall(caller.socket_id);
        }, 15000);

        const interval2 = setInterval(() => {
            toast.info("Học viên hết thời gian!")
            endCall(caller.socket_id);
        }, 20000);

        answerPeer.current.signal(callerSignal);

        connectionRef.current = answerPeer.current;
    }

    const updateVideo = () => {
        setMyVdoStatus((currentStatus) => {
            socket.current.emit("updateMyMedia", {
                type: "video",
                currentMediaStatus: !currentStatus,
            });
            stream.getVideoTracks()[0].enabled = !currentStatus;
            return !currentStatus;
        });
    };

    const updateMic = () => {
        setMyMicStatus((currentStatus) => {
            socket.current.emit("updateMyMedia", {
                type: "mic",
                currentMediaStatus: !currentStatus,
            });
            stream.getAudioTracks()[0].enabled = !currentStatus;
            return !currentStatus;
        });
    };

    //SCREEN SHARING 
    const handleScreenSharing = () => {

        if (!myVdoStatus) {
            console.log("!myVdoStatus")
            return;
        }

        if (!screenShare) {
            navigator.mediaDevices
                .getDisplayMedia({ cursor: true })
                .then((currentStream) => {
                    const screenTrack = currentStream.getTracks()[0];


                    // replaceTrack (oldTrack, newTrack, oldStream);
                    connectionRef.current.replaceTrack(
                        connectionRef.current.streams[0]
                            .getTracks()
                            .find((track) => track.kind === 'video'),
                        screenTrack,
                        stream
                    );

                    // Listen click end
                    screenTrack.onended = () => {
                        connectionRef.current.replaceTrack(
                            screenTrack,
                            connectionRef.current.streams[0]
                                .getTracks()
                                .find((track) => track.kind === 'video'),
                            stream
                        );

                        myVideo.current.srcObject = stream;
                        setScreenShare(false);
                    };

                    myVideo.current.srcObject = currentStream;
                    screenTrackRef.current = screenTrack;
                    setScreenShare(true);
                }).catch((error) => {
                    console.log("No stream for sharing")
                });
        } else {
            screenTrackRef.current.onended();
        }
    };

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

    //khi nguoi dung bam end call thi chi nguoi dung reload, khi gia su bam end call gia su khong reload
    async function endCall(id) {
        await socket.current.emit("end.call", {
            from: me,
            //callerReciever nguoi dung gui den gia su
            to: callReciever ? caller.socket_id : id,
        });
        videoRecorderRef.current?.record().stop()
        if (callReciever) {
            //gia su luu thong tin nguoi dung de tao file course
            dispatch(storeUserCourse({ tutor: me, user: caller.socket_id }))
            await new Promise((res) => {
                setTimeout(() => {
                    res();
                }, 2000);
            });
        }
        if (!callReciever) {
            //nguoi dung luu thong tin gia su de tao file course
            // dispatch(storeUserCourse({ tutor: id, user: me }))
            await new Promise((res) => {
                setTimeout(() => {
                    res();
                }, 1000);
            });
            //chi reload lai trang nguoi dung vi nguoi dung thi callReciever = false
            router.reload();
        }

    }

    function sendMessage(message) {
        if (message === '') return
        if (callReciever) {
            answerPeer.current.send(message);
            setMessages((prev) => [
                ...prev,
                { position: "right", text: message, bgcolor: "#2196f3", color: "#fff" },
            ]);
        } else {
            callerPeer.current.send(message);
            setMessages((prev) => [
                ...prev,
                { position: "right", text: message, bgcolor: "#2196f3", color: "#fff" },
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
        chatStatus,
        setChatStatus,
        userVideo,
        videoRecorderRef,
        tutorUid,
        setTutorUid,
        myVdoStatus,
        setMyVdoStatus,
        userVdoStatus,
        setUserVdoStatus,
        myMicStatus,
        userMicStatus,
        screenShare,
        handleScreenSharing,
        caller,
        updateVideo,
        updateMic,
        callerSignal,
        sendMessage,
        messages,
        rejectCall,
        calling,
        timeOut,
        cancelCall,
        endCall,
    };
};
