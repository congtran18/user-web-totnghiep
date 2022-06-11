import React from 'react'
import moment from 'moment'

export const OutgoingMessage = ({ message }) => {
    return (
        <>
            {/* <!-- Mensaje enviado inicio --> */}
            <div className="outgoing_msg">
                <div className="sent_msg">
                    <p className="break-words">{message.text}</p>
                    <span className="time_date">
                        {moment(new Date(message.createdAt)).format('DD/MM/YYYY, h:mm:ss a')}
                    </span>
                </div>
            </div>
            {/* <!-- Mensaje enviado inicio --> */}
        </>
    )
}
