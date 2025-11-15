import { map, reduce } from 'lodash'
import React, { useEffect, useState } from 'react'
import { IoCheckmark } from 'react-icons/io5'
import TableBtn from '../../Buttons/TableBtn'

const SupplierIncomingsTableRow = ({
    data,
    currentPage,
    countPage,
    currency,
    Pay,
    linkToProducts,
    Print
}) => {

    const [totalDebtPayment, setTotalDebtPayment] = useState(0)

    const reducer = (arr, key) =>
        arr.reduce((prev, item) => prev + item[key], 0)
    const changeCurrency = (item, key) =>
        currency === 'USD' ? item[key] : item[key + 'uzs']

    const parseToIntOrFloat = (value) => {
        if (!value || value === 0) return 0
        else if (value % 1 === 0) {
            return parseInt(value)
        } else {
            return Number(parseFloat(value).toFixed(2));
        }
    }


    useEffect(() => {
        setTotalDebtPayment(
            data.map((el) => {
                return el.payments?.filter((item) => item.totalpriceuzs === undefined).reduce((sum, payment) => {
                    return (
                        sum +
                        Number(
                            payment['paymentuzs']
                        )
                    )
                }, 0)
            }).reduce((prev, item) => prev + item, 0)
        )
    }, [data])
    console.log(totalDebtPayment);
    return (
        <>
            {map(data, (connector, index) => {
                let totalSum = 0;
                return (
                    <tr key={connector._id} className='tr'>
                        <td className='td'>
                            {currentPage * countPage + 1 + index}
                        </td>
                        <td className='td text-right'>
                            {new Date(connector.createdAt).toLocaleDateString()}
                        </td>
                        <td className='td text-right'>
                            {new Date(connector.createdAt).toLocaleTimeString()}
                        </td>
                        <td className='td text-right'>{connector.id}</td>
                        <td className='td text-right'>
                            {connector.incoming.length}
                        </td>
                        <td className='td text-right'>
                            {reducer(connector.incoming, 'pieces')}
                        </td>
                        <td className='td text-right font-medium text-primary-700'>
                            {changeCurrency(connector, 'total').toLocaleString(
                                'ru-RU'
                            )}{' '}
                            {currency}
                        </td>
                        <td className='td text-right font-medium text-success-500'>
                            {changeCurrency(
                                connector,
                                'totalpayment'
                            ).toLocaleString('ru-RU')}{' '}
                            {currency}
                        </td>
                        <td
                            className={`td text-right font-medium text-error-500`}
                        >
                            {changeCurrency(connector, 'debt').toLocaleString(
                                'ru-RU'
                            )}{' '}
                            {currency}
                        </td>
                        <td
                            className={`td text-right font-medium text-black`}
                        >
                            <ul>
                                {connector?.payments?.filter((item) => item.totalpriceuzs === undefined)?.flatMap(
                                    (payment) => {
                                        totalSum +=
                                            payment['paymentuzs']
                                    }
                                )}
                                <li className='flex justify-between'>
                                    <span>
                                        {totalSum > 0 ? '+ ' + parseToIntOrFloat(totalSum).toLocaleString("ru-Ru") : null}{' '}
                                        {currency}
                                    </span>
                                    {totalSum > 0 ? (
                                        <TableBtn
                                            type={'print'}
                                            bgcolor={'bg-blue-600'}
                                            onClick={() =>
                                                Print(
                                                    connector,
                                                    'oneAllPay'
                                                )
                                            }
                                        />
                                    ) : null}
                                </li>
                            </ul>
                        </td>
                        <td className='py-[0.375rem] td border-r-0 text-center'>
                            <div className='flex items-center justify-center gap-[0.625rem]'>
                                <TableBtn
                                    type={'info'}
                                    bgcolor={'bg-blue-600'}
                                    onClick={() =>
                                        linkToProducts(connector._id)
                                    }
                                />
                                {connector.debt !== 0 ? (
                                    <TableBtn
                                        type={'pay'}
                                        bgcolor={'bg-error-500'}
                                        onClick={() => Pay(connector)}
                                    />
                                ) : (
                                    <div
                                        className={`w-[24px] h-[24px] flex justify-center items-center rounded-full bg-success-500`}
                                    >
                                        <IoCheckmark color='white' />
                                    </div>
                                )}
                            </div>
                        </td>
                    </tr>
                )
            })}
            <tr className='tr'>
                <td className='py-[0.375rem] td text-center'></td>
                <td className='py-[0.375rem] td text-center'></td>
                <td className='py-[0.375rem] td text-center'></td>
                <td className='py-[0.375rem] td text-center'></td>
                <td className='py-[0.375rem] td text-center'></td>
                <td className='py-[0.375rem] td text-center'></td>
                <td className='py-[0.375rem] td text-right font-medium text-primary-700'>
                    {reducer(data, 'totaluzs').toLocaleString('ru-RU')}{' '}UZS
                </td>
                <td className='td text-right font-medium text-success-500'>
                    {reducer(data, 'totalpaymentuzs').toLocaleString('ru-RU')}{' '}UZS
                </td>
                <td className='td text-right font-medium text-error-500'>
                    {reducer(data, 'debtuzs').toLocaleString('ru-RU')}{' '}UZS
                </td>
                <td className='py-[0.375rem] td text-right font-medium text-black'>
                    {totalDebtPayment > 0 ? '+ ' + parseToIntOrFloat(totalDebtPayment).toLocaleString("ru-Ru") : null}{' '}
                    UZS
                    {totalDebtPayment > 0 && <TableBtn
                        type={'print'}
                        bgcolor={'bg-blue-600'}
                        onClick={() => Print(data, 'allSaleDebtPayments')}
                    />}
                </td>
                <td className='py-[0.375rem] td text-center border-r-0'></td>
            </tr>
        </>
    )
}

export default SupplierIncomingsTableRow
