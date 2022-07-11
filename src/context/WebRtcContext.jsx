import { createContext } from 'react';

import { useWebRTC } from '../hooks/useWebRTC';


export const WebRtcContext = createContext();

export const WebRtProvider = ({ children }) => {

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
        endCall
    } = useWebRTC();

    return (
        <WebRtcContext.Provider value={{
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
            endCall
        }}>
            {children}
        </WebRtcContext.Provider>
    );
}