import React, { useContext, useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Fab, useMediaQuery } from "@mui/material";

import ChatMessages from "./ChatMessages";
import TranslateAudio from "./TranslateAudio";
import MyVideo from "./MyVideo";
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import MicIcon from '@mui/icons-material/Mic';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import DesktopAccessDisabledIcon from '@mui/icons-material/DesktopAccessDisabled';
import MicOffIcon from '@mui/icons-material/MicOff';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import CommentIcon from '@mui/icons-material/Comment';
import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';
import MicExternalOffIcon from '@mui/icons-material/MicExternalOff';
import MicExternalOnIcon from '@mui/icons-material/MicExternalOn';
import { WebRtcContext } from 'context/WebRtcContext';
import { useRouter } from "next/dist/client/router";

import 'video.js/dist/video-js.css';
import videojs from 'video.js';
import 'webrtc-adapter';
import RecordRTC from 'recordrtc';
import 'videojs-record/dist/css/videojs.record.css';
import 'videojs-record/dist/videojs.record.js';

import { saveFile, storeUserCourse } from 'features/storageSlice';
import { useDispatch, useSelector } from 'react-redux';

const VideoChat = ({ onReady, isTutor }) => {

    const theme = useTheme();
    const router = useRouter();
    const mobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [userCall, setUserCall] = useState()

    const { dataStore } = useSelector((state) => state.storage);

    const dispatch = useDispatch();

    const {
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
        textTutorTranslate,
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
    } = useContext(WebRtcContext);


    const saveCourseUser = async () => {
        console.log("caller.socket_id", userCall)
    }

    const handleVideoRecorderReady = async (videoRecorder) => {
        videoRecorderRef.current = videoRecorder;

        // Device is ready
        videoRecorder.on('deviceReady', () => {
            console.log('Device is ready!');
        });

        // User clicked the record button and started recording
        videoRecorder.on('startRecord', () => {
            console.log('Started recording!');
            // setIsRecording(true);
        });

        videoRecorder.on('stopRecord', () => {
            console.log('Stopped recording!');
            // setIsRecording(false);
        });

        // User completed recording and stream is available
        videoRecorder.on('finishRecord', async () => {
            // recordedData is a blob object containing the recorded data that
            // can be downloaded by the user, stored on server etc.
            console.log('Finished recording: ', videoRecorder.recordedData);

            // Lưu lại file record
            var file = new File([videoRecorder.recordedData], "my-call.mp4", { type: "video/mp4", lastModified: new Date().getTime() })
            var videoData = new FormData();
            videoData.append("file", file);
            const dataVideo = await dispatch(saveFile(videoData))
            await dispatch(storeUserCourse({ videoUrl: dataVideo.payload }))

            await new Promise((res) => {
                setTimeout(() => {
                    res();
                }, 2000);
            });
            console.log("vo videoRecorder 1")
            router.reload()
            // console.log('Finished recording: ', response.data);
        });

        // Error handling
        videoRecorder.on('error', (element, error) => {
            console.error('Error on video recorder', error);
        });

        videoRecorder.on('deviceError', () => {
            console.error('device error:', videoRecorder.deviceErrorCode);
        });
    };

    const videoJsOptions = {
        controls: false,
        bigPlayButton: false,
        width: mobile ? 100 : 200,
        height: mobile ? 70 : 150,
        fluid: false,
        plugins: {
            record: {
                audio: true,
                video: true,
                maxLength: 500,
                debug: true,
            },
        },
    };

    useEffect(() => {
        if (caller && isTutor) {
            dispatch(storeUserCourse({ user: caller.socket_id, tutor: me }))
        }
    }, [caller]);

    useEffect(() => {
        if (onReady) {
            if (!videoRecorderRef.current) {
                const videoElement = myVideo.current;
                if (!videoElement) return;
                const videoRecorderInstance = videojs(videoElement, videoJsOptions, () => {

                    const version_info = `Using video.js: ${videojs.VERSION
                        } with videojs-record: ${videojs.getPluginVersion(
                            'record'
                        )} and recordrtc: ${RecordRTC.version}`;
                    videojs.log(version_info);

                    if (videoRecorderInstance) {
                        handleVideoRecorderReady(videoRecorderInstance);
                    }
                });
                videoRecorderRef.current = videoRecorderInstance;
            }
            if (videoRecorderRef.current) {
                videoRecorderRef.current.record().getDevice();
            }
            return () => {
                if (videoRecorderRef.current) {
                    videoRecorderRef.current.record().destroy();
                    videoRecorderRef.current = null;
                }
            };
        }
    }, [onReady]);


    const endButtonRightPosition = () => {
        if (!mobile) return 50

        if (typeof window === 'undefined') {
            return 50
        } else {
            return window.innerWidth / 2 - 30
        }
    }


    return (
        <Box
            sx={{
                position: "absolute",
                width: "100vw",
                height: "100vh",
                top: 0,
                left: 0,
                opacity: callAccepted ? 1 : 0,
                backgroundColor: "#fff",
                zIndex: callAccepted ? 1 : -1,
                // backgroundImage:
                //     "repeating-radial-gradient( circle at 0 0, transparent 0, #ffffff 7px ), repeating-linear-gradient( #00b8fa55, #00b8fa )",
            }}
        >
            <Box sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
                {callAccepted && stream && (
                    <video
                        ref={userVideo}
                        playsInline
                        autoPlay

                        //style={{ width: "100%", height: "100%" }}
                        width={window.innerWidth}
                    //height={window.innerHeight}
                    />
                )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: "absolute", bottom: 60, right: endButtonRightPosition() }}>
                {timeOut && <Box
                    sx={{
                        color: "#ff3d00",
                        fontSize: '15px',
                        marginRight: '4px',
                    }}
                >
                    {isTutor ? "Học viên chỉ còn 30 giây học!" : "Bạn chỉ còn 30 giây học!"}
                </Box>}
                {!isTutor && <Fab
                    sx={{
                        bgcolor: "red",
                        ":hover": { bgcolor: "red", opacity: 0.7 },
                    }}
                    aria-label="add"
                    onClick={() => setTranslateStatus(!translateStatus)}
                >
                    {translateStatus ? <MicExternalOnIcon sx={{ color: "#fff" }} /> : <MicExternalOffIcon sx={{ color: "#fff" }} />}
                </Fab>}
                <Fab
                    sx={{
                        bgcolor: "red",
                        ":hover": { bgcolor: "red", opacity: 0.7 },
                    }}
                    aria-label="add"
                    onClick={() => setChatStatus(!chatStatus)}
                >
                    {chatStatus ? <CommentIcon sx={{ color: "#fff" }} /> : <CommentsDisabledIcon sx={{ color: "#fff" }} />}
                </Fab>
                {!isTutor && <Fab
                    sx={{
                        bgcolor: "red",
                        ":hover": { bgcolor: "red", opacity: 0.7 },
                    }}
                    aria-label="add"
                    onClick={() => updateVideo()}
                >
                    {myVdoStatus ? <DesktopWindowsIcon sx={{ color: "#fff" }} /> : <DesktopAccessDisabledIcon sx={{ color: "#fff" }} />}
                </Fab>}
                <Fab
                    sx={{
                        bgcolor: "red",
                        ":hover": { bgcolor: "red", opacity: 0.7 },
                    }}
                    aria-label="add"
                    onClick={() => handleScreenSharing()}
                >
                    <ScreenShareIcon sx={{ color: "#fff" }} />
                </Fab>
                <Fab
                    sx={{
                        bgcolor: "red",
                        ":hover": { bgcolor: "red", opacity: 0.7 },
                    }}
                    aria-label="add"
                    onClick={() => updateMic()}
                >
                    {myMicStatus ? <MicIcon sx={{ color: "#fff" }} /> : <MicOffIcon sx={{ color: "#fff" }} />}
                </Fab>
                <Fab
                    sx={{
                        bgcolor: "red",
                        ":hover": { bgcolor: "red", opacity: 0.7 },
                    }}
                    aria-label="add"
                    onClick={() => endCall(tutorUid)}
                >
                    <PhoneDisabledIcon sx={{ color: "#fff" }} />
                </Fab>
            </Box>

            {!mobile && <ChatMessages messages={messages} sendMessage={sendMessage} chatStatus={chatStatus} />}
            {!mobile && <TranslateAudio textTutorAudio={textTutorAudio} textTutorTranslate={textTutorTranslate} translateStatus={translateStatus} />}

            <MyVideo stream={stream} myVideoRef={myVideo} />
        </Box>
    );
};

export default VideoChat;
