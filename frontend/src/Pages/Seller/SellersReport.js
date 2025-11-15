import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import LinkToBack from '../../Components/LinkToBack/LinkToBack'
import Pagination from '../../Components/Pagination/Pagination'
import SearchForm from '../../Components/SearchForm/SearchForm'
import Table from '../../Components/Table/Table'
import TableMobile from '../../Components/Table/TableMobile'
import { getSellerReports } from './sellerSlice'
import { filter, reduce } from 'lodash'
import UniversalModal from '../../Components/Modal/UniversalModal.js'
import { t } from 'i18next'
import SelectForm from '../../Components/Select/SelectForm'

const SellersReport = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const location = useLocation()
    console.log(location);

    const { id } = useParams()

    const dispatch = useDispatch()

    const headers = [
        {
            title: '№',
        },
        {
            title: t('Sana'),
            filter: 'createdAt',
        },
        {
            title: t('ID'),
            filter: 'saleconnector.id',
        },
        {
            title: t('Mijoz'),
        },
        {
            title: t('Naqt'),
        },
        {
            title: t('Plastik'),
        },
        {
            title: t("O'tkazma"),
        },
        {
            title: t("Qarz"),
        },
        {
            title: t("Qarzdan to'lov"),
        },
        {
            title: t('Qaytarilgan'),
        },
        {
            title: '',
        }
    ]

    const headersInfo = [
        {
            title: t('Sotuvlar soni'),
        },
        {
            title: t('Sotilgan mahsulotlar'),
        },
        {
            title: t('Jami tushum'),
        },
    ]

    const { currencyType } = useSelector((state) => state.currency)
    const { sellersreport, count } = useSelector((state) => state.sellers)

    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [countPage, setCountPage] = useState(100)
    const [search, setSearch] = useState({
        id: '',
        client: '',
    })
    const [sendingSearch, setSendingSearch] = useState({
        id: '',
        client: '',
    })
    const [printedSelling, setPrintedSelling] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [generalReport, setGeneralreport] = useState({})
    const [startDate, setStartDate] = useState(
        new Date(new Date().setHours(0, 0, 0, 0))
    )
    const [endDate, setEndDate] = useState(
        new Date(new Date().setHours(23, 59, 59, 59))
    )

    const toggleModal = () => {
        setModalVisible(!modalVisible)
        setPrintedSelling(null)
    }

    const handleClickPrint = (selling) => {
        setPrintedSelling(selling)
        setModalVisible(true)
    }

    const filterByTotal = ({ value }) => {
        setCountPage(Number(value))
        setCurrentPage(0)
    }

    // handle change client and id
    const handleChangeId = (e) => {
        const val = e.target.value
        const valForSearch = val.replace(/\s+/g, ' ').trim()
        const filteredProducts = filter(sellersreport, (selling) => {
            return selling.id.includes(valForSearch)
        })
        setData(filteredProducts)
        setSearch({
            ...search,
            id: valForSearch,
        })
    }
    const handleChangeClient = (e) => {
        const val = e.target.value.toLowerCase()
        const filteredProducts = filter(sellersreport, (selling) => {
            return selling?.client?.name
                ? selling?.client?.name.toLowerCase().includes(val)
                : selling
        })
        setData(filteredProducts)
        setSearch({
            ...search,
            client: val,
        })
    }
    const handleChangeIdAndClientWhenPressEnter = (e) => {
        if (e.key === 'Enter') {
            setCurrentPage(0)
            setSendingSearch(search)
        }
    }

    useEffect(() => {
        let body = {
            startDate,
            endDate,
            currentPage,
            countPage,
            search: sendingSearch,
            seller: id,
        }
        dispatch(getSellerReports(body))
    }, [
        dispatch,
        startDate,
        endDate,
        currentPage,
        countPage,
        id,
        sendingSearch,
    ])

    useEffect(() => {
        console.log(sellersreport);
        setData(sellersreport)
        // if (sellersreport.length > 0) {
        //     const totalprice = reduce(
        //         sellersreport,
        //         (summ, sale) =>
        //             summ +
        //             reduce(
        //                 sale.payments,
        //                 (summ, payment) => summ + payment.payment,
        //                 0
        //             ),
        //         0
        //     )
        //     const totalpriceuzs = reduce(
        //         sellersreport,
        //         (summ, sale) =>
        //             summ +
        //             reduce(
        //                 sale.payments,
        //                 (summ, payment) => summ + payment.paymentuzs,
        //                 0
        //             ),
        //         0
        //     )

        //     const saleProducts = reduce(
        //         sellersreport,
        //         (summ, sale) => summ + sale.products.length,
        //         0
        //     )

        //     setGeneralreport({
        //         salesCount: sellersreport.length,
        //         totalprice,
        //         totalpriceuzs,
        //         saleProducts,
        //     })
        // }
    }, [sellersreport])
    return (
        <div className='w-full'>
            <UniversalModal
                printedSelling={printedSelling}
                currency={currencyType}
                body={'allChecks'}
                isOpen={modalVisible}
                toggleModal={toggleModal}
            />
            <div className='flex items-center justify-between '>
                <LinkToBack link={'/hamkorlar/sotuvchilar'} />
            </div>

            <div className='flex justify-between items-center gap-4 w-full '>
                <div className={'mt-6'}>
                    <SelectForm
                        key={'total_1'}
                        onSelect={filterByTotal}
                    />
                </div>
                <SearchForm
                    filterBy={[
                        'total',
                        'startDate',
                        'endDate',
                        'id',
                        'clientName',
                    ]}
                    filterByTotal={(e) => setCountPage(e.value)}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    searchById={search.id}
                    searchByClientName={search.client}
                    filterByClientName={handleChangeClient}
                    filterById={handleChangeId}
                    filterByClientNameWhenPressEnter={
                        handleChangeIdAndClientWhenPressEnter
                    }
                    filterByIdWhenPressEnter={
                        handleChangeIdAndClientWhenPressEnter
                    }
                />
            </div>
            {data.length > 0 && (
                <>
                    {/* <div className='lg:tableContainerPadding'>
                        {
                            isMobile ?
                                <TableMobile
                                    data={generalReport}
                                    currency={currencyType}
                                    page={'generalreport'}
                                    headers={headersInfo}
                                />
                                : <Table
                                    data={generalReport}
                                    currency={currencyType}
                                    page={'generalreport'}
                                    headers={headersInfo}
                                />
                        }
                    </div> */}
                    <div className='lg:tableContainerPadding mt-4'>
                        {
                            isMobile ?
                                <TableMobile
                                    data={data}
                                    currentPage={currentPage}
                                    currency={currencyType}
                                    countPage={countPage}
                                    page={'saleslist'}
                                    headers={headers}
                                    sellers={true}
                                    Print={handleClickPrint}
                                /> :
                                <Table
                                    data={data}
                                    currentPage={currentPage}
                                    currency={currencyType}
                                    countPage={countPage}
                                    page={'seller_payments'}
                                    headers={headers}
                                    sellers={true}
                                    Print={handleClickPrint}
                                />
                        }
                    </div>
                    <div className='flex justify-center mt-[30px] mb-[30px]'>
                        <Pagination
                            countPage={countPage}
                            totalDatas={count || 1}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                </>

            )}
        </div>
    )
}

export default SellersReport
