import Head from 'next/head';
import Banner from 'components/Banner';
import Newsletter from 'components/Newsletter';
import StaticUtility from 'components/StaticUtility'
import NewProduct from 'components/NewProduct';
import Link from "next/link";
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTotals } from 'features/cartSlice';
// import VideoChat from "components/video-chat/VideoChat";
import AcceptCallDialog from "components/AcceptCallDialog";
import { Box } from "@mui/material";
import { WebRtcContext } from 'context/WebRtcContext';
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie'

import { resetAllStorage } from 'features/storageSlice';
import { saveCourseHistory } from 'features/courseHistorySlice';

const VideoChat = dynamic(
  () => import('components/video-chat/VideoChat'),
  {
    ssr: false,
  }
);

export default function Home() {

  const { tutorUid,
    setTutorUid,
    userVideo,
    myVideo,
    callAccepted,
    callPeer,
    stream,
    acceptCall,
    me,
    receivingCall,
    caller,
    sendMessage,
    messages,
    rejectCall,
    calling,
    cancelCall,
    endCall } = useContext(WebRtcContext);

  const [openAcceptDialog, setOpenAccepDialog] = useState(false);
  // const [openCallingDialog, setOpenCallingDialog] = useState(false);

  const cart = useSelector((state) => state.cart);

  const { dataStore } = useSelector((state) => state.storage);

  const dispatch = useDispatch();

  const handleSaveHistoryCourse = async (dataStore) =>{
    const token = Cookies.get("sessionToken") ? Cookies.get("sessionToken") : Cookies.get("userInfo") && JSON.parse(Cookies.get("userInfo")).accessToken
    await dispatch(saveCourseHistory({...dataStore, token}))
  }

  useEffect(async () => {
    console.log("dataStore", dataStore)
    // dispatch(storeUserCourse({ tutor: me }))
    if (dataStore && dataStore.videoUrl) {
      handleSaveHistoryCourse(dataStore)
      dispatch(resetAllStorage())
    }
  }, []);

  useEffect(() => {
    dispatch(getTotals())
  }, [cart, dispatch]);

  useEffect(() => {
    if (receivingCall) {
      setOpenAccepDialog(true);
    } else {
      setOpenAccepDialog(false);
    }
  }, [receivingCall]);

  // useEffect(() => {
  //   if (calling) {
  //     console.log("calling", calling)
  //     setOpenCallingDialog(true);
  //   } else {
  //     setOpenCallingDialog(false);
  //   }
  // }, [calling]);

  // const doIntevelCall = () => {
  //   const interval = setInterval(() => {
  //     toast.info("Học viên hết thời gian")
  //     endCall(tutorUid);
  //   }, 15000);
  // }

  return (
    <>
      <Head>
        <title>Trang chủ</title>
        <link rel="icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={true} />
        <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>
      <main>
        <Banner />
        {/* <Categories /> */}
        <h1 className="text-center tracking-wider font-medium mt-10 mb-10 bg-themePink p-2.5 text-base sm:text-xl ">Sản phẩm mới</h1>
        <NewProduct />
        <Link href="/productlist" >
          <a className="flex items-center justify-center underline tracking-wide py-3 px-5 mx-auto bg-themePink hover:font-medium transition w-max my-6">Xem tất cả sản phẩm</a>
        </Link>
        <h1 className="text-center tracking-wider font-medium mt-7 bg-themePink p-2.5 text-base sm:text-xl ">Dịch vụ</h1>
        <StaticUtility />
        <Newsletter />
        <div>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // minHeight: "100vh",
            }}
          >
            <AcceptCallDialog
              open={openAcceptDialog}
              caller={caller}
              handleClose={() => setOpenAccepDialog(false)}
              onAccept={() => {
                setOpenAccepDialog(false);
                acceptCall();
                // doIntevelCall();
              }}
              onReject={async () => {
                setOpenAccepDialog(false);
                await rejectCall();
              }}
            />
            {/* <CallingDialog
              open={openCallingDialog}
              handleClose={() => setOpenCallingDialog(false)}
              onCancel={() => cancelCall(name)}
            /> */}
          </Box>

          <VideoChat

            onReady={true}
            isTutor={true}
          // myVideoRef={myVideo}
          // userVideoRef={userVideo}
          // stream={stream}
          // callAccepted={callAccepted}
          // messages={messages}
          // sendMessage={sendMessage}
          // onEndCall={() => endCall(tutorUid)}
          />
        </div>
      </main>
    </>


  )
}
