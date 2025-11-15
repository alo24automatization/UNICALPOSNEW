import React, { forwardRef } from 'react'
import { map } from 'lodash'
import { useSelector } from 'react-redux'
import { t } from 'i18next'

export const SellerSmallCheck = forwardRef((props, ref) => {
    const {
        seller
    } = props;
    // console.log(selledPayments);
    const { market } = useSelector((state) => state.login)
    const { currencyType } = useSelector((state) => state.currency)
    console.log(seller);
    if (Object.keys(seller).length > 0) {
        return (
            <div ref={ref} className={'px-2'}>
                <div className='flex pb-2 flex-col text-center justify-center border-b-[0.8px] border-black-700'>
                    <div className='py-4 object-contain flex items-center justify-center'>
                        <img src={market?.image} alt='logo' className='w-[170px] mx-auto  object-contain h-full' />
                    </div>
                    <div className='flex justify-between items-center py-1 text-[12px] font-bold'>
                        {t('F.I.O')}:
                        <span className='text-[12px] text-black-900 font-bold'>
                            {seller.firstname}{' '}{seller.lastname}
                        </span>
                    </div>
                    <div className='flex justify-between items-center py-1 text-[12px] font-bold'>
                        {t('Telefon')}:
                        <span className='text-[12px] text-black-900 font-bold'>
                            {seller.phone}
                        </span>
                    </div>
                    <div className='flex justify-between items-center py-1 text-[12px] font-bold'>
                        {t('Sana')}:
                        <span className='text-[12px] text-black-900 font-bold'>
                            {new Date().toLocaleDateString()}
                        </span>
                    </div>
                </div>
                <div className=' w-full mt-4 mb-4 text-left'>
                    <h3
                        style={{ fontWeight: 'bolder' }}
                        className='text-black-900 text-[12px] font-bold pt-4'
                    >
                        {t('Sotuvlar')} :{' '}
                        <span style={{ fontWeight: "bolder" }} className='text-black-900 text-[12px] font-bold'>
                            {seller?.sales.toLocaleString('ru-Ru')}{' '}
                        </span>
                    </h3>
                    <h3
                        style={{ fontWeight: 'bolder' }}
                        className='text-black-900 text-[12px] font-bold pt-4'
                    >
                        {t('Summa')} :{' '}
                        <span style={{ fontWeight: "bolder" }} className='text-black-900 text-[12px] font-bold'>
                            {(currencyType === 'USD' ? seller?.totalsales : seller?.totalsalesuzs).toLocaleString('ru-Ru')}{' '}
                            {currencyType}
                        </span>
                    </h3>
                    {/* <h3
                        style={{ fontWeight: 'bolder' }}
                        className='text-black-900 text-[12px] font-bold pt-4'
                    >
                        {t("Qarzdan to'lov")} :{' '}
                        <span style={{ fontWeight: "bolder" }} className='text-black-900 text-[12px] font-bold'>
                            {(currencyType === 'USD' ? seller?.paydebt : seller?.paydebtuzs).toLocaleString('ru-Ru')}{' '}
                            {currencyType}
                        </span>
                    </h3> */}
                    {/* <h3
                        style={{ fontWeight: 'bolder' }}
                        className='text-black-900 text-[12px] font-bold pt-4'
                    >
                        {t('Sof foyda')} :{' '}
                        <span style={{ fontWeight: "bolder" }} className='text-black-900 text-[12px] font-bold'>
                            {(currencyType === 'USD' ? seller?.profit : seller?.profituzs).toLocaleString('ru-Ru')}{' '}
                            {currencyType}
                        </span>
                    </h3> */}
                    <h3
                        style={{ fontWeight: 'bolder' }}
                        className='text-black-900 text-[12px] font-bold pt-4'
                    >
                        {t('Naqt')} :{' '}
                        <span style={{ fontWeight: "bolder" }} className='text-black-900 text-[12px] font-bold'>
                            {(currencyType === 'USD' ? seller?.cash : seller?.cashuzs).toLocaleString('ru-Ru')}{' '}
                            {currencyType}
                        </span>
                    </h3>
                    <h3
                        style={{ fontWeight: 'bolder' }}
                        className='text-black-900 text-[12px] font-bold pt-4'
                    >
                        {t('Plastik')} :{' '}
                        <span style={{ fontWeight: "bolder" }} className='text-black-900 text-[12px] font-bold'>
                            {(currencyType === 'USD' ? seller?.card : seller?.carduzs).toLocaleString('ru-Ru')}{' '}
                            {currencyType}
                        </span>
                    </h3>
                    <h3
                        style={{ fontWeight: 'bolder' }}
                        className='text-black-900 text-[12px] font-bold pt-4'
                    >
                        {t("O'tkazma")} :{' '}
                        <span style={{ fontWeight: "bolder" }} className='text-black-900 text-[12px] font-bold'>
                            {(currencyType === 'USD' ? seller?.transfer : seller?.transferuzs).toLocaleString('ru-Ru')}{' '}
                            {currencyType}
                        </span>
                    </h3>
                    <h3
                        style={{ fontWeight: 'bolder' }}
                        className='text-black-900 text-[12px] font-bold pt-4'
                    >
                        {t("Qarz")} :{' '}
                        <span style={{ fontWeight: "bolder" }} className='text-black-900 text-[12px] font-bold'>
                            {(currencyType === 'USD' ? seller?.debt : seller?.debtuzs).toLocaleString('ru-Ru')}{' '}
                            {currencyType}
                        </span>
                    </h3>
                </div>

                {/* {market.qrcode && (
                    <div className='w-[120px] h-[120px] mx-auto'>
                        <img src={market.qrcode} alt='qrcode' />
                    </div>
                )} */}
            </div>
        )
    }
})
