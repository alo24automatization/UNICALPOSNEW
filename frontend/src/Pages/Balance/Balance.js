import { useEffect, useState } from 'react'
import Table from '../../Components/Table/Table'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '../../Components/Spinner/SmallLoader.js'
import NotFind from '../../Components/NotFind/NotFind.js'
import { motion } from 'framer-motion'
import { getUsersBalance } from './balanceSlice.js'

import SearchForm from '../../Components/SearchForm/SearchForm.js'
import { useTranslation } from 'react-i18next'
import FieldContainer from '../../Components/FieldContainer/FieldContainer.js'
import { map } from 'lodash'
import { getClients } from '../Sale/Slices/registerSellingSlice.js'
import Pagination from '../../Components/Pagination/Pagination.js'

const Balance = () => {
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
    const { t } = useTranslation(['common'])
    const dispatch = useDispatch()
    const { usersBalance, loading, totalPage, totalCount } = useSelector((state) => state.balance)
    const { clients } = useSelector((state) => state.registerSelling);
    const { market } = useSelector((state) => state.login);

    const headers = [
        { title: t('№') },
        { title: t('Mijoz') },
        { title: t('Naqd') },
        { title: t('Plastik') },
        { title: t('O`tkazma') },
        { title: t('Balansga') },
        { title: t('Balansdan') },
        { title: t('Sana') }
    ]

    // states
    const [data, setData] = useState(usersBalance)
    const [startDate, setStartDate] = useState(new Date().toISOString())
    const [endDate, setEndDate] = useState(new Date().toISOString())
    const [clientValue, setClientValue] = useState('');
    const [optionClient, setOptionClient] = useState([]);
    const [currentPage, setCurrentPage] = useState(0)

    useEffect(() => {
        const body = {
            from: startDate,
            to: endDate,
            client: clientValue.value,
            limit: 300,
            page: currentPage + 1
        }
        dispatch(getUsersBalance(body))
    }, [dispatch, startDate, endDate, clientValue, currentPage])

    useEffect(() => {
        setData(usersBalance)
    }, [usersBalance])

    useEffect(() => {
        setOptionClient([
          {
            label: t('Barchasi'),
            value: '',
          },
          ...map(clients || [], (client) => ({
            value: client._id,
            label: client.name,
            saleconnectorid: client?.saleconnectorid || null,
            balans: client?.balance,
          })),
        ]);
    }, [clients, t]);

    useEffect(() => {
        dispatch(getClients());
    }, [dispatch, market]);

    const handleStartDate = (e) => {
        setStartDate(e.toISOString());
    }
    const handleEndDate = (e) => {
        setEndDate(e.toISOString());
    }

    const handleChangeClientValue = (option) => {
        if (!option || option.value === '') {
            setClientValue({ label: '', value: '' });
        } else {
            setClientValue(option);
        }
    };

    const handleChangeCurrentPage = (page) => {
        setCurrentPage(page)
    }

    return (
        <motion.section
            key='content'
            initial='collapsed'
            animate='open'
            exit='collapsed'
            variants={{
                open: { opacity: 1, height: 'auto' },
                collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
        >
            <div className='flex p-[30px_10px] items-center flex-col'>
                <SearchForm
                    filterBy={['startDate', 'endDate']}
                    startDate={new Date(startDate)}
                    endDate={new Date(endDate)}
                    setStartDate={handleStartDate}
                    setEndDate={handleEndDate}
                />
                <FieldContainer
                  placeholder={t('Xaridor')}
                  maxWidth={'w-[14.676875rem]'}
                  border={true}
                  select={true}
                  value={clientValue}
                  options={optionClient}
                  onChange={handleChangeClientValue}
                />
            </div>

            <div className='lg:tableContainerPadding'>
                {loading ? (
                    <Spinner />
                ) : data?.length === 0 ? (
                    <NotFind text={t('Yetkazib beruvchilar mavjud emas')} />
                ) : (
                    !isMobile ?
                        <Table
                            page={'usersBalance'}
                            data={data}
                            headers={headers}
                        /> :
                        ''
                )}
            </div>
            <Pagination
                countPage={300}
                totalDatas={totalCount}
                currentPage={currentPage}
                setCurrentPage={handleChangeCurrentPage}
            />
        </motion.section>
    )
}

export default Balance;
