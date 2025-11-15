import { map } from 'lodash'
import React from 'react'
import { IoCheckmark } from 'react-icons/io5'
import TableBtn from '../../Buttons/TableBtn'

const SuppliersProductTable = ({
    data,
    currentPage,
    countPage,
    currency,
    Pay,
    linkToProducts
}) => {
    const reducer = (arr, key) =>
        arr.reduce((prev, item) => prev + item[key], 0)
    const changeCurrency = (item, key) =>
        currency === 'USD' ? item[key] : item[key + 'uzs']

    return (
        <>
            {map(data, (connector, index) => (
                <tr key={connector._id} className='tr'>
                    <td className='td'>
                        {currentPage * countPage + 1 + index}
                    </td>
                    <td className='td text-right py-[0.375rem]'>
                        {new Date(connector.createdAt).toLocaleDateString()}
                    </td>
                    <td className='td text-right'>
                        {new Date(connector.createdAt).toLocaleTimeString()}
                    </td>
                    <td className='td text-right'>{connector.product?.productdata?.name}</td>
                    <td className='td text-right'>
                        {connector.pieces}
                    </td>
                    <td className='td text-right'>
                        {connector.product?.price?.incomingpriceuzs.toLocaleString(
                            'ru-RU'
                        )}
                    </td>
                    <td className='td text-right'>
                        {connector.totalpriceuzs.toLocaleString(
                            'ru-RU'
                        )}
                    </td>
                    <td className='td text-right'>
                        {connector.product?.price?.sellingpriceuzs.toLocaleString(
                            'ru-RU'
                        )}
                    </td>
                </tr>
            ))}
            <tr className='tr'>
                <td className='td'>
                </td>
                <td className='td text-right py-[0.375rem]'>
                </td>
                <td className='td text-right'>
                </td>
                <td className='td text-right'></td>
                <td className='td text-right'>
                </td>
                <td className='td text-right py-[0.375rem]'>
                    {data.reduce((prev, item) => prev + item.product?.price?.incomingpriceuzs, 0).toLocaleString(
                        'ru-RU'
                    )}
                </td>
                <td className='td text-right'>
                    {data.reduce((prev, item) => prev + item.totalpriceuzs, 0).toLocaleString(
                        'ru-RU'
                    )}
                </td>
                <td className='td text-right'>
                    {data.reduce((prev, item) => prev + item.product?.price?.sellingpriceuzs, 0).toLocaleString(
                        'ru-RU'
                    )}
                </td>
            </tr>
        </>
    )
}

export default SuppliersProductTable
