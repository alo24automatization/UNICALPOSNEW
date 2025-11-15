import React, { useEffect, useState } from 'react'
import Api, { baseURL } from '../../Config/Api.js'

const MessageLogs = () => {
    const localStorage_isSending = Boolean(localStorage.getItem('isSending'))
    const [isSending, setIsSending] = useState(localStorage_isSending || false)

    useEffect(() => {
        localStorage.setItem('isSending', isSending)
    }, [isSending])

    const startSendingMessages = async () => {
        if (isSending) return

        setIsSending(true)
        try {
            await Api.post('/send_message_dev')
        } catch (error) {
            console.error('Error:', error)
            setIsSending(false)
        }
        // Use fetch to stream the logs
    }

    const stopSendingMessages = () => {
        if (!isSending) return

        Api.post('/stop_message_sending')
            .then(({ data }) => {
                alert(data.message)
                setIsSending(false)
            })
            .catch((error) => {
                console.error('Error stopping messages:', error)
            })
    }

    return (
        <div className='py-2 pt-16 md:pt-2 bg-black-800 px-1 h-full overflow-y-auto'>
            <div className='flex items-center gap-x-3'>
                <button
                    className={`${isSending ? 'bg-green-500 hover:bg-green-700' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded`}
                    onClick={startSendingMessages}
                    disabled={isSending}
                >
                    Start Sending Messages
                </button>
                <button
                    className='bg-blue-500 hover:bg-blue-700 disabled:text-blue-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded'
                    onClick={stopSendingMessages}
                    disabled={!isSending}
                >
                    Stop Sending Messages
                </button>
            </div>
        </div>
    )
}

export default MessageLogs
