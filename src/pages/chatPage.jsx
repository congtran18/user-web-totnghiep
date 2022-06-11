import { useSelector } from "react-redux";
import Head from 'next/head';
import { useRouter } from "next/router";
import { useSession } from 'next-auth/react';
import { Messages } from 'components/chat-message/Messages'
import { ChatSelect } from 'components/chat-message/ChatSelect'
import { InboxPeople } from 'components/chat-message/InboxPeople'

const chatPage = () => {

    const { user } = useSelector(
        (state) => state.user
    );


    const { activeChat } = useSelector(
        (state) => state.chatTutor
    );

    const { data: session, status } = useSession();

    const router = useRouter();

    const loading = status === "loading" ? true : false


    if (!user && !session && !loading) {
        router.push("/signin")
    }

    return (
        <>
            <Head>
                <title>Chat Page</title>
                <link rel="icon" href="/favicon.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={true} />
                <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>
            <main>
                <section className="sm:w-[90%] w-[95%] h-full flex flex-wrap items-center mx-auto my-5 ">
                    <div className="flex flex-col w-full -space-y-1 border-b border-gray-300 py-4">
                        <h1 className="font-semibold text-gray-800 text-lg sm:text-2xl">Tin nhắn</h1>
                        {/* <p className="text-gray-700 text-xs ">{user?.username}</p> */}
                    </div>
                </section>
                {loading ?
                    <div className="w-full">
                        <img src="/Images/loading2.gif" alt="loading" className="text-center flex items-center justify-center mx-auto mt-3 " />
                    </div>
                    : (user || session) &&
                    <>
                        <div className="messaging p-10">
                            <div className="inbox_msg">

                                <InboxPeople />
                                {

                                    (activeChat) ?
                                        <Messages />
                                        :
                                        <ChatSelect />
                                }

                            </div>

                        </div>
                    </>}
            </main>
        </>
    )
}

export default chatPage
