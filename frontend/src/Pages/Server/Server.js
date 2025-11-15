import React, { useState } from 'react'

const Server = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [payTextError, setPayTextError] = useState(false);

    const closeWindow = () => {
        setIsOpen(false)
        setPayTextError(false)
    }


    return (
        <div style={{ backgroundColor: "white" }} className='py-6 bg-white px-6 w-full h-full'>
            {/* <header class="bg-white mb-6">
                <div class="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
                    <img className='h-10' alt='zomro' src='https://zomro.com/static/site/images/logo/logo-white.svg' />
                </div>
            </header> */}
            {/* <div className='p-2 '>
                <div className='mb-2'>Full name: <span style={{ color: "rgb(147 51 234 / var(--tw-text-opacity, 1))" }}>Aziz Axrorov</span></div>
                <div>Email: <span style={{ color: "rgb(147 51 234 / var(--tw-text-opacity, 1))" }}>azizaxrorov90@gmail.com</span></div>
                <div>VPS: <span style={{ color: "rgb(147 51 234 / var(--tw-text-opacity, 1))" }}>azizaxrorov90@gmail.com</span></div>
            </div>
            <div className='p-4 w-full rounded-sm border-[1px] border-indigo-500'>
                <div>Server</div>
            </div> */}
            <div class="overflow-hidden rounded-lg border shadow-sm transition hover:shadow-lg w-[400px]">

                <div class="mx-auto text-center flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
                    <img className='h-10' alt='zomro' src='https://zomro.com/static/site/images/logo/logo-white.svg' />
                </div>
                <div class="bg-white p-4 sm:p-6">
                    <div className='mb-2'>Full name: <span style={{ color: "rgb(147 51 234 / var(--tw-text-opacity, 1))" }}>Aziz Axrorov</span></div>
                    <div className='mb-2'>Email: <span style={{ color: "rgb(147 51 234 / var(--tw-text-opacity, 1))" }}>azizaxrorov90@gmail.com</span></div>
                    <div className='mb-2'>VPS: <span style={{ color: "rgb(147 51 234 / var(--tw-text-opacity, 1))" }}>217.15.162.132</span></div>
                    <div className='mb-2'>Username: <span style={{ color: "rgb(147 51 234 / var(--tw-text-opacity, 1))" }}>root</span></div>
                    <div className='mb-2'>Password: <span style={{ color: "rgb(147 51 234 / var(--tw-text-opacity, 1))" }}>Alotrade0101</span></div>
                    <div className='mb-2'>Activate date: <span style={{ color: "rgb(147 51 234 / var(--tw-text-opacity, 1))" }}>10.03.2025</span></div>
                    <div className='mb-2'>Expire date: <span style={{ color: "rgb(147 51 234 / var(--tw-text-opacity, 1))" }}>10.03.2026</span></div>
                    <div className='mb-2'>Payment per year: <span style={{ color: "rgb(147 51 234 / var(--tw-text-opacity, 1))" }}>192.0 €</span></div>
                    <button onClick={() => setIsOpen(true)} className='w-full text-center py-2 rounded-lg text-white' style={{ color: "white", backgroundColor: "rgb(99 102 241 / var(--tw-text-opacity, 1))" }}>Pay</button>
                </div>
            </div>
            {isOpen && (
                <div onClick={() => closeWindow(false)} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
                    <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "white" }} className="bg-white border p-6 rounded-lg shadow-lg w-96">
                        <div className='flex justify-between'><h2 className="text-xl font-semibold">Оплата</h2> <h2 style={{ color: "rgb(147 51 234 / var(--tw-text-opacity, 1))" }} className="mt-2 text-gray-600">192.0 €</h2></div>
                        <p className="mt-2 text-gray-600">Введите данные для оплаты.</p>

                        <form className="mt-4 space-y-4">
                            <div>
                                <label className="block text-gray-700">Номер карты</label>
                                <input
                                    type="text"
                                    placeholder="0000 0000 0000 0000"
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex space-x-4">
                                <div className="w-1/2">
                                    <label className="block text-gray-700">Срок</label>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-gray-700">CVV</label>
                                    <input
                                        type="text"
                                        placeholder="123"
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            {payTextError && <div style={{ color: 'red' }} className='py-2' >
                                Данные карты введины неправильно!
                            </div>}
                            <button type='button' onClick={() => setPayTextError(true)} className='w-full text-center py-2 rounded-lg text-white' style={{ color: "white", backgroundColor: "rgb(99 102 241 / var(--tw-text-opacity, 1))" }}>Оплатить</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Server
