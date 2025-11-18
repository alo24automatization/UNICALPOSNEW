import {useEffect, useState} from 'react'
import TableBtn from '../../Buttons/TableBtn'
import {map} from 'lodash'
import { useSelector } from 'react-redux';

export const UsersBalanceTableRow = ({data}) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const {currencyType} = useSelector((state) => state.currency)
    console.log(data)
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <>
            {map(data,(balance, index) => (
                !isMobile? <tr key={balance._id} className='tr'>
                    <td className='td text-center py-[0.375rem]'>
                        {index + 1}
                    </td>
                    <td className='td text-center py-[0.375rem]'>
                        {balance?.client?.name}
                    </td>
                    <td className='td text-center py-[0.375rem]'>
                        {balance?.paymentType === 'cash' && balance?.type === 'credit' ? balance?.amount?.toLocaleString('ru-Ru') : 0} {currencyType}
                    </td>
                    <td className='td text-center py-[0.375rem]'>
                        {balance?.paymentType === 'card' && balance?.type === 'credit' ? balance?.amount?.toLocaleString('ru-Ru') : 0} {currencyType}
                    </td>
                    <td className='td text-center py-[0.375rem]'>
                        {balance?.paymentType === 'transfer' && balance?.type === 'credit' ? balance?.amount?.toLocaleString('ru-Ru') : 0} {currencyType}
                    </td>
                    <td className='td text-center py-[0.375rem] text-success-500'>
                        + {balance?.type === 'credit' ? balance?.amount?.toLocaleString('ru-Ru') : 0} {currencyType}
                    </td>
                    <td className='td text-center py-[0.375rem] text-error-500'>
                        - {balance?.type === 'debit' ? balance?.amount?.toLocaleString('ru-Ru') : 0} {currencyType}
                    </td>
                    <td className='td text-center py-[0.375rem]'>
                        {new Date(balance?.createdAt).toLocaleDateString()}
                    </td>
                </tr>:
                // <li className='text-1xl w-[90vw]  bg-[white] rounded-lg m-1 list-none'>
                //     <li className='flex justify-between p-[10px] items-center'><p>{unit.name}</p> <p className='text-[blue]'>
                //     <div className='flex items-center justify-end w-[100px]'>
                //             <TableBtn
                //                 type={'edit'}
                //                 bgcolor='bg-warning-500'
                //                 onClick={() => Edit(unit)}
                //             />
                //             <TableBtn
                //                 type={'delete'}
                //                 bgcolor='bg-error-500 ml-2.5'
                //                 onClick={() => Delete(unit)}
                //             />
                //         </div>
                //         </p></li>
                    
                // </li>
                ''
            ))}
            <tr className='tr'>
                <td className='text-center td py-[0.375rem]'></td>
                <td className='text-center td py-[0.375rem]'></td>
                <td className='text-center td py-[0.375rem] font-bold'>
                    {data.reduce((prev, el) => {
                        if (el?.paymentType === 'cash' && el?.type === 'credit') {
                            prev += Number(el?.amount || 0)
                        }
                        return prev
                    }, 0).toLocaleString('ru-Ru')} {currencyType}
                </td>
                <td className='text-center td py-[0.375rem] font-bold'>
                    {data.reduce((prev, el) => {
                        if (el?.paymentType === 'card' && el?.type === 'credit') {
                            prev += Number(el?.amount || 0)
                        }
                        return prev
                    }, 0).toLocaleString('ru-Ru')} {currencyType}
                </td>
                <td className='text-center td py-[0.375rem] font-bold'>
                    {data.reduce((prev, el) => {
                        if (el?.paymentType === 'transfer' && el?.type === 'credit') {
                            prev += Number(el?.amount || 0)
                        }
                        return prev
                    }, 0).toLocaleString('ru-Ru')} {currencyType}
                </td>
                <td className='text-center td py-[0.375rem] font-bold'>
                    {data.reduce((prev, el) => {
                        if (el?.type === 'credit') {
                            prev += Number(el?.amount || 0)
                        }
                        return prev
                    }, 0).toLocaleString('ru-Ru')} {currencyType}
                </td>
                <td className='text-center td py-[0.375rem] font-bold'>
                    {data.reduce((prev, el) => {
                        if (el?.type === 'debit') {
                            prev += Number(el?.amount || 0)
                        }
                        return prev
                    }, 0).toLocaleString('ru-Ru')} {currencyType}
                </td>
                <td className='text-center td py-[0.375rem]'></td>
            </tr>
        </>
    )
}
