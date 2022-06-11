import React, { useContext } from 'react'
import { SideBarChatItem } from './SideBarChatItem'
import { useDispatch, useSelector } from "react-redux";
import { useSession } from 'next-auth/react';


export const SideBar = ({ users }) => {

    const { user : dataUser } = useSelector(
        (state) => state.user
    );

    const { data: session, status } = useSession();

    const loading = status === "loading" ? true : false

    return (
        <>
            {/* <!-- Sidebar inicio --> */}
            <div className="inbox_chat">

                {
                    users
                        .filter(
                            user => user.uid !== (dataUser ? dataUser.user.uid : session && session.uid),
                        )
                        .map(
                            user =>
                            (
                                <SideBarChatItem
                                    key={user.uid}
                                    user={user}
                                />
                            ))
                }

                {/* <!-- Espacio extra para scroll --> */}
                <div className="extra_space"></div>


            </div>
            {/* <!-- Sidebar Fin --> */}
        </>
    )
}
