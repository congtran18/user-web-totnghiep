import { createContext } from 'react';

import { useWebRTC } from '../hooks/useWebRTC';


export const WebRtcContext = createContext();

export const WebRtProvider = ({ children }) => {

    const { me,
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
        endCall } = useWebRTC();

    return (
        <WebRtcContext.Provider value={{         
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
            endCall }}>
            {children}
        </WebRtcContext.Provider>
    );
}