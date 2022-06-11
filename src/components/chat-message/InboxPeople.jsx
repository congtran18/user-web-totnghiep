import React, { useEffect, useState } from 'react'
import { SearchBox } from './SearchBox'
import { SideBar } from './SideBar'
import { useDispatch, useSelector } from "react-redux";
import { useSession } from 'next-auth/react';


export const InboxPeople = () => {

    const { users } = useSelector(
        (state) => state.chatTutor
    );

    const { status } = useSession();

    const loading = status === "loading" ? true : false

    const [filterUsers, setFilterUsers] = useState(users)

    useEffect(() => {
        setFilterUsers(users)
    }, [users])

    return (
        <>

            {/* <!-- Inbox people inicio --> */}
            {loading
                ?
                <div className="w-full">
                    <img src="/Images/loading2.gif" alt="loading" className="text-center flex items-center justify-center mx-auto mt-3 " />
                </div>
                : <div className="inbox_people">

                    <SearchBox setFilterUsers={setFilterUsers} users={users} />

                    <SideBar users={filterUsers} />


                </div>}
            {/* <!-- Inbox people Fin --> */}
        </>
    )
}
