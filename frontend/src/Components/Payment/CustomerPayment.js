import { IoPerson } from 'react-icons/io5'
import { DiscountBtn, Payment, SaleBtn } from '../Buttons/SaleBtns.js'
import { DiscountInput } from '../Inputs/DiscountInputs.js'
import { useSelector } from 'react-redux'
import PaymentInput from './PaymentInput/PaymentInput.js'
import { t } from 'i18next'
import { useLocation } from 'react-router-dom'
import Dates from '../Dates/Dates.js'
import Checkbox from '../Checkbox/Checkbox.js'
import { useEffect, useState } from 'react'

function CustomerPayment({
    returned,
    active,
    togglePaymentModal,
    hasCalendar,
    hiddenDebt,
    type = 'cash',
    showPayEndDate,
    cash = '',
    card = '',
    transfer = '',
    hiddenMixed,
    discount,
    hasDiscount,
    hasDiscountBtn,
    debt,
    allPayment,
    paid = 0,
    client = '',
    balans,
    onChange,
    onClose,
    changePaymentType,
    discountSelectOption,
    handleClickDiscountBtn,
    handleChangeDiscountSelectOption,
    handleChangeDiscount,
    handleClickPay,
    clickdelay,
    disableInputsCashCard,
    payEndDate,
    handlePayEndDateChange,
    disablePayButton,
}) {
    const location = useLocation()
    const [checkedBalans, setCheckedBalans] = useState(false)

    useEffect(() => {
        if (active) {
            setCheckedBalans(false)
        }
    }, [active])
    const defineLabel = () => {
        switch (type) {
            case 'card':
                return (
                    <PaymentInput
                        value={card}
                        key={'sale-card1'}
                        keyInput={type}
                        onChange={(value, keyInput) => onChange(value, keyInput, checkedBalans)}
                        onClose={onClose}
                        disabled={disableInputsCashCard}
                        label={t('Plastik')}
                    />
                )
            case 'transfer':
                return (
                    <PaymentInput
                        value={transfer}
                        key={'sale-transfer'}
                        keyInput={type}
                        onChange={(value, keyInput) => onChange(value, keyInput, checkedBalans)}
                        onClose={onClose}
                        disabled={disableInputsCashCard}
                        label={t('O`tkazma')}
                    />
                )
            case 'mixed':
                return [
                    { label: t('Naqd'), key: 'cash', value: cash },
                    { label: t('Plastik'), key: 'card', value: card },
                    {
                        label: t('O`tkazma'),
                        key: 'transfer',
                        value: transfer,
                    },
                ].map((obj) => (
                    <PaymentInput
                        value={obj.value}
                        key={`sale-${obj.key}`}
                        keyInput={obj.key}
                        onChange={(value, keyInput) => onChange(value, keyInput, checkedBalans)}
                        onClose={onClose}
                        label={t(obj.label)}
                    />
                ))
            default:
                return (
                    <PaymentInput
                        key={'sale-cash'}
                        disabled={disableInputsCashCard}
                        value={cash}
                        onChange={(value, keyInput) => onChange(value, keyInput, checkedBalans)}
                        keyInput={type}
                        onClose={onClose}
                        label={t('Naqd')}
                    />
                )
        }
    }

    useEffect(() => {
        if (checkedBalans && balans < allPayment) {
            onChange(balans, type)
        }
    }, [checkedBalans]);
    
    const { currencyType } = useSelector((state) => state.currency)
    return (
        <section
            className={`fixed transition-all left-0 top-0 right-0 bottom-0 overflow-hidden duration-200 ease-out bg-black-300 backdrop-blur-[3px] z-20 ${active
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                }`}
            onClick={togglePaymentModal}
        >
            <h3
                className={
                    'text-white-900 text-lg leading-[1.875rem absolute top-[50%] left-[35%] -translate-x-[50%]'
                }
            >
                {t('')}
            </h3>
            <div
                className={`customerPay-head-style transition-all duration-200 ease-linear h-full overflow-auto absolute top-0 bottom-0 right-0 ${active ? 'translate-x-0' : 'translate-x-full'
                    }`}
                onClick={(e) => e.stopPropagation()}
                autoFocus
            >
                <div className='top-payment w-full'>
                    {client && (
                        <div className='customer-head-icon'>
                            <div className='flex items-center custom-payment-text-style'>
                                <IoPerson className='mr-[0.75rem]' />
                                <span>{t('Mijoz')} : </span>
                            </div>
                            <h3 className='text-[0.875rem]'>{client}</h3>
                        </div>
                    )}
                    <div className='mb-[1.25rem] font-medium text-[1.25rem] text-center leading-[23.44px]'>
                        {allPayment?.toLocaleString('ru-Ru')} {currencyType}
                    </div>
                    <ul className='w-full pb-[1.25rem]'>
                        {!returned && defineLabel()}
                        {(location.pathname.includes('/kassa/debts') ||
                            location.pathname.includes('/qarzdorlar') ||
                            location.pathname.includes('/yetkazuvchilar') ||
                            location.pathname.includes(
                                '/maxsulotlar/qabul/qabulqilish'
                            ) ||
                            location.pathname.includes(
                                '/maxsulotlar/qabul/qabullar'
                            )) &&
                            defineLabel()}
                        {hasDiscount && (
                            <DiscountInput
                                value={discount}
                                onChange={handleChangeDiscount}
                                option={discountSelectOption}
                                onSelect={handleChangeDiscountSelectOption}
                            />
                        )}
                        {showPayEndDate && (
                            <li className='custom-payment-ul-li justify-between flex gap-x-5'>
                                <span className='custom-payment-text-style'>
                                    {t("To'lov sanasi")}:
                                </span>
                                <Dates
                                    onChange={handlePayEndDateChange}
                                    value={payEndDate}
                                    placeholder={"To'lov sanasi"}
                                    disableIcon={true}
                                />
                            </li>
                        )}
                        {hiddenDebt || (allPayment > paid) && (
                            <li className='custom-payment-ul-li'>
                                <span className='custom-payment-text-style'>
                                    {t('Qarzlar')} :{' '}
                                </span>
                                <h3 className='text-error-500 text-[1rem]'>
                                    {debt.toLocaleString('ru-Ru')}{' '}
                                    {currencyType}
                                </h3>
                            </li>
                        )}

                        <li className='custom-payment-ul-li'>
                            <span className='custom-payment-text-style'>
                                {allPayment < 0
                                    ? t('Qaytarilayotgan')
                                    : checkedBalans ? t('Balansdan') : t('To`lanayotgan')}{' '}
                                :{' '}
                            </span>
                            <h3 className='text-[1rem] text-loginButton'>
                                {paid?.toLocaleString('ru-Ru')} {currencyType}
                            </h3>
                        </li>
                        {allPayment < paid && (
                            <li className='custom-payment-ul-li'>
                                <span className='custom-payment-text-style'>
                                    {t("Balansni to'ldirish")} :{' '}
                                </span>
                                <h3 className='text-[1rem] text-loginButton'>
                                    {Math.abs(allPayment - paid).toLocaleString('ru-Ru')} {currencyType}
                                </h3>
                            </li>
                        )}
                    </ul>
                </div>
                <div className='bottom-payment w-full flex flex-col gap-[1.25rem] border-t-[1px] border-black-200 pt-[1.25rem]'>
                    {client && (
                        <div className="flex items-start gap-[10px]">
                            <div className="flex items-center justify-center">
                                <Checkbox 
                                    id="balans" 
                                    type="checkbox" 
                                    value={checkedBalans} onChange={() => 
                                        setCheckedBalans((prevState) => !prevState)
                                    }
                                />
                            </div>
                            <div>
                                <div className="text-[20px] font-bold mb-1">{t('Balans')}:</div>
                                <div>
                                    {(balans ?? 0).toLocaleString('ru-Ru')} {currencyType}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className='custom-paymet-btn'>
                        <SaleBtn
                            text={t(`Naqd`)}
                            type='cash'
                            active={type === 'cash'}
                            onClick={changePaymentType}
                        />
                        <SaleBtn
                            text={t(`Plastik`)}
                            type='card'
                            active={type === 'card'}
                            onClick={changePaymentType}
                        />
                        <SaleBtn
                            text={t(`O'tkazma`)}
                            type='transfer'
                            active={type === 'transfer'}
                            onClick={changePaymentType}
                        />
                        {!returned && (
                            <SaleBtn
                                text={t(`Aralash`)}
                                type='mixed'
                                active={type === 'mixed'}
                                onClick={changePaymentType}
                            />
                        )}
                        {location.pathname.includes('/kassa/debts') && (
                            <SaleBtn
                                text={t(`Aralash`)}
                                type='mixed'
                                active={type === 'mixed'}
                                onClick={changePaymentType}
                            />
                        )}
                    </div>
                    {!returned && hasDiscountBtn && (
                        <DiscountBtn
                            text={t(`Chegirma`)}
                            onClick={handleClickDiscountBtn}
                        />
                    )}
                    <Payment
                        text={t(`To'lash`)}
                        disablePayButton={clickdelay}
                        loading={clickdelay}
                        onClick={
                            !clickdelay
                                ? () => handleClickPay(checkedBalans)
                                : () => console.log('wait')
                        }
                    // onDoubleClick={onDoubleClick}
                    />
                </div>
            </div>
        </section>
    )
}

export default CustomerPayment
