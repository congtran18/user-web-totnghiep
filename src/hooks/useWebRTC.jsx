import React, { useEffect, useRef, useState } from "react";

import io from "socket.io-client";
import Peer from "simple-peer";
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useRouter } from "next/dist/client/router";
import useMediaQuery from '@mui/material/useMediaQuery';
import Cookies from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { listTutors } from 'features/chatTutorSlice';
import { storeUserCourse } from 'features/storageSlice';
import { useSpeechRecognition } from 'react-speech-kit'

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
    const [translateStatus, setTranslateStatus] = useState(true);

    const deboundRef = useRef(null);
    const { listen, listening, stop } = useSpeechRecognition({
        onResult: result => {
            const currentTimestamp = deboundRef.current;

            if (currentTimestamp) {
                clearTimeout(currentTimestamp);
            }

            deboundRef.current = setTimeout(() => {
                sendTextTranslate(result)
            }, 300);
            // setText(result)
        }
    });

    const [timeOut, setTimeOut] = useState(false);

    const { user } = useSelector(
        (state) => state.user
    );

    const [minitesLeft, setMinutesLeft] = useState()

    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('sm'))

    const [callCancelled, setCallCancelled] = useState(false);

    const [messages, setMessages] = useState([]);
    const [textTutorAudio, setTextTutorAudio] = useState([]);// chuyen giong noi gia su thanh van ban
    const [textTutorTranslate, setTextTutorTranslate] = useState([]);// dich giong noi gia su sang tieng viet

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
        // const token = Cookies.get("sessionToken") ? Cookies.get("sessionToken") : Cookies.get("userInfo") && JSON.parse(Cookies.get("userInfo")).accessToken
        const token = Cookies.get("userInfo") ? JSON.parse(Cookies.get("userInfo")).accessToken : Cookies.get("sessionToken") && Cookies.get("sessionToken")

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

            socket.current.on("online-users", (users) => {
                dispatch(listTutors(users[0].users));
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
                } else {
                    stop()
                    await new Promise((res) => {
                        setTimeout(() => {
                            res();
                        }, 300);
                    });
                }
                // }
                // toast.info("Bu???i h???c k???t th??c")
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

        //nguoi dung se nhan translate text
        callerPeer.current.on("data", (m) => {
            console.log("caller get message >>", ab2str(m));
            if (ab2str(m).includes("handle translate to")) {
                setTextTutorAudio((prev) => [
                    ...prev,
                    ab2str(m).split("handle translate to")[1]
                ]);
                Translate(ab2str(m).split("handle translate to")[1])
            } else {
                setMessages((prev) => [
                    ...prev,
                    { position: "left", text: ab2str(m), bgcolor: "#e1bee7", color: "#212121" },
                ]);
                if (messageSound.current) {
                    messageSound.current.play();
                }
            }
        });

        socket.current.on("call.accepted", async ({ signal }) => {
            setCallAccepted(true);
            setCalling(false);
            callerPeer.current.signal(signal);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_DB_URL}/users/check-minutes/${me}`);
            const endTime = parseInt(response.data.data.minutes) - 15000

            // listen()

            const timeout1 = setTimeout(() => {
                toast.info("B???n h???t th???i gian!")
            }, parseInt(response.data.data.minutes));

            const timeout2 = setTimeout(() => {
                setTimeOut(true)
            }, endTime);
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
    async function acceptCall() {
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

        //gia su se ko nhan translate text
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

        answerPeer.current.signal(callerSignal);

        connectionRef.current = answerPeer.current;

        const response = await axios.get(`${process.env.NEXT_PUBLIC_DB_URL}/users/check-minutes/${caller.socket_id.toString()}`);

        const token = Cookies.get("userInfo") ? JSON.parse(Cookies.get("userInfo")).accessToken : Cookies.get("sessionToken") && Cookies.get("sessionToken")

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        
        const checkLesson = await axios.get(`${process.env.NEXT_PUBLIC_DB_URL}/lesson/tutorCheckLesson/${caller.socket_id}`, config);

        if(checkLesson.data.data === "call lesson"){
            await dispatch(storeUserCourse({ callLesson: true }))
        }

        const timeEnd = parseInt(response.data.data.minutes) - 15000

        // localStorage.setItem('timeStartCall', (new Date()).toString())

        await dispatch(storeUserCourse({ timeStartCall: (new Date()).toString() }))

        listen()

        const timeout1 = setTimeout(() => {
            setTimeOut(true)
            toast.info("H???c vi??n s???p h???t th???i gian!")
            // endCall(caller.socket_id);
        }, timeEnd);

        const timeout2 = setTimeout(() => {
            toast.info("H???c vi??n h???t th???i gian!")
            endCall(caller.socket_id);
        }, parseInt(response.data.data.minutes));
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
            stop()
            //xu ly khi gia su end call thi luu thoi gian call vao hoc vien va gia su
            // const timeCall = (new Date().getTime() - new Date(localStorage.getItem('timeStartCall')).getTime())
            // await axios.patch(`${process.env.NEXT_PUBLIC_DB_URL}/users/update-minutes/${caller.socket_id.toString()}`, { value: Math.round(timeCall) })
            await new Promise((res) => {
                setTimeout(() => {
                    res();
                }, 1000);
            });
        }
        if (!callReciever) {//la hoc vien end call 
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

    function sendTextTranslate(message) {
        if (message === '') return
        if (callReciever) {
            answerPeer.current.send("handle translate to" + message);
            // setTextTutorTranslate((prev) => [
            //     ...prev,
            //     message
            // ]);
        } else {
            callerPeer.current.send("handle translate to" + message);
            // setTextTutorTranslate((prev) => [
            //     ...prev,
            //     message
            // ]);
        }
    }

    function Translate(textToTranslate) {
        const data = {
            q: textToTranslate,
            source: "en",
            target: "vi",
        };

        axios
            .post("https://libretranslate.de/translate", data)
            .then((res) => setTextTutorTranslate((prev) => [
                ...prev,
                res.data.translatedText,
            ]));

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
        translateStatus,
        setTranslateStatus,
        textTutorAudio,
        setTextTutorAudio,
        textTutorTranslate,
        setTextTutorTranslate,
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
        setMinutesLeft,
        cancelCall,
        endCall,
    };
};
