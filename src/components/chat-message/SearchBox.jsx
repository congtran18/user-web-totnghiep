import React, { useContext, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";

export const SearchBox = ({ setFilterUsers, users }) => {

    const [stateSearch, setStateSearch] = useState("")
    const [stateSelect, setStateSelect] = useState("")

    const handelSelect = (value) => {
        if (value === "true") {
            if (stateSearch) {
                setFilterUsers(users.filter(filterUsers => filterUsers.user_tutor.length > 0 && filterUsers.fullName.toLowerCase().includes(stateSearch)))
            } else {
                setFilterUsers(users.filter(filterUsers => filterUsers.user_tutor.length > 0))
            }
            setStateSelect("true")
        } else if (value === "false") {
            if (stateSearch) {
                setFilterUsers(users.filter(filterUsers => !filterUsers.user_tutor[0] && filterUsers.fullName.toLowerCase().includes(stateSearch)))
            } else {
                setFilterUsers(users.filter(filterUsers => !filterUsers.user_tutor[0]))
            }
            setStateSelect("false")
        }
        else {
            if (stateSearch) {
                setFilterUsers(users.filter(filterUsers => filterUsers.fullName.toLowerCase().includes(stateSearch)))
            } else {
                setFilterUsers(users)
            }
            setStateSelect("")
        }
    }

    const handelSearch = (value) => {
        if (value) {
            if (stateSelect === "true") {
                setFilterUsers(users.filter(filterUsers => filterUsers.fullName.toLowerCase().includes(value) && filterUsers.user_tutor.length > 0))
            } else if (stateSelect === "false") {
                setFilterUsers(users.filter(filterUsers => filterUsers.fullName.toLowerCase().includes(value) && !filterUsers.user_tutor[0]))
            } else {
                setFilterUsers(users.filter(filterUsers => filterUsers.fullName.toLowerCase().includes(value)))
            }
            setStateSearch(value)
        } else {
            if (stateSelect === "true") {
                setFilterUsers(users.filter(filterUsers => filterUsers.user_tutor.length > 0))
            } else if (stateSelect === "false") {
                setFilterUsers(users.filter(filterUsers => filterUsers.user_tutor[0]))
            } else {
                setFilterUsers(users)
            }
            setStateSearch("")
        }
    }

    return (
        <>
            {/* <!-- Searchbox inicio --> */}
            <div className="headind_srch">
                <div className="recent_heading mt-2">
                    <div class="input-group w-[110%] mb-4 rounded h-1">
                        <input onChange={e => handelSearch(e.target.value)} type="search" class="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Tìm theo tên..." aria-label="Search" aria-describedby="button-addon2" />
                    </div>
                </div>
                <div className="srch_bar mt-2 ml-[20%]">
                    <div class="mb-3 w-[80%]">
                        <select onChange={e => handelSelect(e.target.value)} class="form-select block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                            {/* <option selected>Trạng thái</option> */}
                            <option value="" selected>Lọc (all)</option>
                            <option value="true">Gia sư</option>
                            <option value="false">Người dùng</option>
                        </select>
                    </div>
                </div>
            </div>
            {/* <!-- Searchbox Fin --> */}
        </>
    )
}
