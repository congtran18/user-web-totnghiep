import React from 'react'
import moment from 'moment'

export const IncomingMessage = ({ message, imageUrl }) => {

    return (
        <>
            <div className="incoming_msg">
                <div className="incoming_msg_img">
                    <img src={imageUrl} alt="sunil" />
                </div>
                <div className="received_msg">
                    <div className="received_withd_msg">
                        <p className="break-words">{message.text}</p>
                        <span className="time_date">{moment(new Date(message.createdAt)).format('DD/MM/YYYY, h:mm:ss a')}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

