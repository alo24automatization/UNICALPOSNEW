import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { exportExcel } from '../../App/globalFunctions'
import LinkToBack from '../../Components/LinkToBack/LinkToBack'
import Pagination from '../../Components/Pagination/Pagination'
import SearchForm from '../../Components/SearchForm/SearchForm'
import Table from '../../Components/Table/Table'
import { getIncomingConnectorsBySupplier, getSuppliersProduct } from './suppliersSlice'
import { t } from 'i18next'
import ExportBtn from '../../Components/Buttons/ExportBtn'
import { map } from 'lodash'
import { universalToast } from '../../Components/ToastMessages/ToastMessages'

const SuppliersProduct = () => {
    const { id } = useParams()
    const dispatch = useDispatch()

    const { user } = useSelector((state) => state.login)
    const { currencyType, currency } = useSelector((state) => state.currency)
    const { products } = useSelector(
        (state) => state.suppliers
    )

    const [currentData, setCurrentData] = useState([])

    const [currentPage, setCurrentPage] = useState(0)
    const [countPage, setCountPage] = useState(10)
    const [startDate, setStartDate] = useState(
        new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
        ).toISOString()
    )
    const [endDate, setEndDate] = useState(
        new Date(new Date().setHours(23, 59, 59, 0)).toISOString()
    )


    const exportData = () => {
        let fileName = 'Yetkazuvchilar'
        const exportHeader = [
            t('тДЦ'),
            t('Sana'),
            t('Vaqt'),
            t('Nomi'),
            t('Soni'),
            t('Kelish narxi'),
            t('Sotish narxi')
        ]
        const body = {
            incoming: id,
            startDate,
            endDate,
            currentPage,
            countPage
        }
        const reducer = (arr, key) =>
            arr.reduce((prev, item) => prev + item[key], 0)
        const changeCurrency = (item, key) =>
            currencyType === 'USD' ? item[key] : item[key + 'uzs']
        dispatch(getSuppliersProduct(body)).then(({ error, payload }) => {
            if (!error) {
                if (payload?.data.length > 0) {
                    console.log(payload);
                    const newData = map(payload?.data, (item, index) => ({
                        nth: index + 1,
                        createdAt: new Date(item.createdAt).toLocaleDateString() || '',
                        time: new Date(item.createdAt).toLocaleTimeString() || '',
                        name: item?.product?.productdata?.name || '',
                        pieces: item?.pieces || '',
                        incomingpriceuzs: item?.product?.price?.incomingpriceuzs.toLocaleString(
                            'ru-RU'
                        ) || '',
                        sellingpriceuzs: item?.product?.price?.sellingpriceuzs.toLocaleString(
                            'ru-RU'
                        ) || '',
                    }))
                    exportExcel(newData, fileName, exportHeader)
                } else {
                    universalToast("Jadvalda ma'lumot mavjud emas !", 'warning')
                }
            }
        })
    }

    useEffect(() => {
        let body = {
            incoming: id,
            startDate,
            endDate,
            currentPage,
            countPage
        }
        dispatch(getSuppliersProduct(body))
    }, [dispatch, startDate, endDate, currentPage, countPage, id])

    useEffect(() => {
        setCurrentData(products)
    }, [products])

    const headers = [
        {
            title: '№'
        },
        {
            title: t('Sana')
        },
        {
            title: t('Vaqti')
        },
        {
            title: t('Nomi')
        },
        {
            title: t('Soni')
        },
        {
            title: t('Kelish narxi')
        },
        {
            title: t('Kelish umumiy')
        },
        {
            title: t('Sotish narxi')
        }
    ]

    return (
        <div className='relative grow overflow-hidden h-full'>
            <div className='mainPadding'>
                <LinkToBack link={'/hamkorlar/yetkazuvchilar'} />
            </div>
            <div className='flex items-center'>
                <SearchForm
                    filterBy={['total']}
                    filterByTotal={(e) => setCountPage(e.value)}
                    startDate={new Date(startDate)}
                    endDate={new Date(endDate)}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />
                {/* <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    countPage={countPage}
                    totalDatas={connectorscount || 1}
                /> */}
                <div className={'flex px-4 py-2 gap-2'}>
                    <ExportBtn onClick={exportData} />
                </div>
            </div>
            <div className='tableContainerPadding'>
                {currentData.length > 0 && (
                    <Table
                        page={'suppliersproduct'}
                        currentPage={currentPage}
                        countPage={countPage}
                        currency={currencyType}
                        headers={headers}
                        data={currentData}
                    />
                )}
            </div>
            {/* <UniversalModal
                body={modalBody}
                isOpen={modalVisible}
                headerText={'To\'lovni amalga oshirishni tasdiqlaysizmi ?'}
                title={
                    'To\'lovni amalga oshirgach bu ma`lumotlarni o`zgaritirb bo`lmaydi !'
                }
                approveFunction={handleApprovePay}
                toggleModal={toggleModal}
            /> */}
        </div>
    )
}

export default SuppliersProduct
