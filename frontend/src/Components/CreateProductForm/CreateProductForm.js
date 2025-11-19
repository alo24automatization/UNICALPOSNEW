import FieldContainer from '../FieldContainer/FieldContainer'
import Button from '../Buttons/BtnAddRemove'
import {useTranslation} from 'react-i18next'

function CreateProductForm({
                               searchBarcode,
                               stickyForm,
                               handleChangeCodeOfProduct,
                               codeOfProduct,
                               handleChangeNameOfProduct,
                               nameOfProduct,
                               metrOfProduct,
                               numberOfProduct,
                               totalMetrOfProduct,
                               handleChangeNumberOfProduct,
                            //    handleMetrOfProduct,
                               metrPriceOfProduct,
                               handleMetrPriceOfProduct,
                               unitOfProduct,
                               handleChangeUnitOfProduct,
                               handleChangePriceOfProduct,
                               priceOfProduct,
                               sellingPriceOfProduct,
                               handleChangeSellingPriceOfProduct,
                               handleEdit,
                               addNewProduct,
                               clearForm,
                               pageName,
                               unitOptions,
                               categoryOfProduct,
                               categoryOptions,
                               handleChangeCategoryOfProduct,
                               checkOfProduct,
                               handleChangeCheckOfProduct,
                               tradePrice,
                               handleChangeTradePrice,
                               minimumCount,
                               handleChangeMinimumCount,
                               sellingPriceOfProcient,
                               handleChangeSellingPriceOfProcient,
                               handleChangeTradePriceProcient,
                               tradePriceProcient,
                               productWidth,
                               handleChangeProductWidth,
                               metrIncPriceOfProduct
                           }) {
    const {t} = useTranslation(['common'])
    return (
        <form
            className={`bg-[white] flex pl-[20px] gap-[1.25rem] shadow-none  flex-col mainPadding   duration-200 ${stickyForm ? 'stickyForm' : ''
            }`}
        >
            <div className={'flex flex-wrap gap-[2.5rem]'}>
                {/* -- maxsulotlar checki -- */}
                <FieldContainer
                    label={t('Shtrix kodi')}
                    placeholder={`${t('misol')}: 123456789`}
                    onChange={handleChangeCheckOfProduct}
                    value={checkOfProduct}
                    maxWidth={'lg:w-[10rem] w-[90vw]'}
                    onKeyUp={searchBarcode}
                />

                {/* -- maxsulot kategoriyasi -- */}
                <FieldContainer
                    value={categoryOfProduct}
                    onChange={handleChangeCategoryOfProduct}
                    label={t('Kategoriya nomi')}
                    placeholder={t('tanlang...')}
                    select={true}
                    options={categoryOptions}
                    maxWidth={'lg:w-[15rem] w-[90vw]'}
                />

                {/* -- maxulot kodi -- */}
                <FieldContainer
                    label={t('Maxsulot kodi')}
                    placeholder={`${t('misol')}: 1234`}
                    onChange={handleChangeCodeOfProduct}
                    value={codeOfProduct}
                    type={'text'}
                    maxWidth={'lg:w-[8.5rem] w-[90vw]'}
                />

                {/* -- maxsulotlar nomi -- */}
                <FieldContainer
                    label={t('Maxsulot nomi')}
                    placeholder={`${t('misol')}: Acer`}
                    onChange={handleChangeNameOfProduct}
                    value={nameOfProduct}
                />
            </div>
            <div className={'flex flex-wrap gap-[2.5rem] items-end'}>
                {/* -- o`lchov birligi -- */}
                <FieldContainer
                    value={unitOfProduct}
                    onChange={handleChangeUnitOfProduct}
                    label={t("O'lchov birligi")}
                    placeholder={t('tanlang...')}
                    select={true}
                    options={unitOptions}
                />

                {pageName !== 'accept' && (
                    <>
                        {/* -- maxsulotlar soni -- */}
                        <FieldContainer
                            value={numberOfProduct}
                            onChange={handleChangeNumberOfProduct}
                            label={t('Maxsulot soni')}
                            placeholder={`${t('misol')}: 100`}
                            type={'text'}
                        />
                    </>
                )}
                {/* <> */}
                    {/* -- maxsulotlar soni -- */}
                    {/* <FieldContainer
                        value={metrOfProduct}
                        onChange={handleMetrOfProduct}
                        label={t('Metr')}
                        placeholder={`${t('misol')}: 100`}
                        type={'text'}
                    /> */}
                {/* </> */}
                {/* <> */}
                    {/* -- maxsulotlar soni -- */}
                    {/* <FieldContainer
                        value={totalMetrOfProduct}
                        onChange={handleChangeNumberOfProduct}
                        label={t('Jami metrda')}
                        placeholder={`${t('misol')}: 100`}
                        type={'text'}
                        disabled
                    /> */}
                {/* </> */}
                {/* <> */}
                    {/* -- maxsulotlar soni -- */}
                    {/* <FieldContainer
                        value={metrPriceOfProduct}
                        onChange={handleMetrPriceOfProduct}
                        label={t('Sotish metrda')}
                        placeholder={`${t('misol')}: 100`}
                        type={'text'}
                    /> */}
                    {/* <FieldContainer
                        value={metrIncPriceOfProduct}
                        // onChange={handleMetrPriceOfProduct}
                        label={t('Kelish metrda')}
                        placeholder={`${t('misol')}: 100`}
                        type={'text'}
                        disabled
                    /> */}
                {/* </> */}

                {pageName !== 'accept' && (
                    <>
                        {/* -- keltirilgan narxi -- */}
                        <FieldContainer
                            value={priceOfProduct}
                            onChange={handleChangePriceOfProduct}
                            label={t('Keltirilgan narxi')}
                            placeholder={`${t('misol')}: 100`}
                            type={'text'}
                        />

                        {/* -- sotish narxi -- */}
                        <FieldContainer
                            value={sellingPriceOfProduct}
                            onChange={handleChangeSellingPriceOfProduct}
                            label={t('Sotish narxi')}
                            placeholder={`${t('misol')}: 200`}
                            type={'text'}
                        />

                        {/* -- sotish foizi -- */}
                        <FieldContainer
                            value={sellingPriceOfProcient}
                            onChange={handleChangeSellingPriceOfProcient}
                            label={t('Sotish foizi')}
                            placeholder={`${t('misol')}: 30 %`}
                            type={'text'}
                        />
                    </>
                )}
                <FieldContainer
                    value={tradePriceProcient}
                    onChange={handleChangeTradePriceProcient}
                    label={t('Optom foizi')}
                    placeholder={`${t('misol')}: 30 %`}
                    type={'text'}
                />
                <FieldContainer
                    value={tradePrice}
                    onChange={handleChangeTradePrice}
                    label={t('Optom narxi')}
                    placeholder={`${t('misol')}: 300`}
                    type={'text'}
                />
                <FieldContainer
                    value={minimumCount}
                    onChange={handleChangeMinimumCount}
                    label={t('Minimum qiymat')}
                    placeholder={`${t('misol')}: 300`}
                    type={'text'}
                />
                {/* <div style={{maxWidth: "300px"}}>
                    <FieldContainer
                        value={productWidth}
                        onChange={handleChangeProductWidth}
                        label={t(`Eni`)}
                        placeholder={`${t('misol')}: 100 metr`}
                        type={'text'}
                    />
                </div> */}
                {/* <FieldContainer
                    value={productHeight}
                    onChange={handleChangeProductHeight}
                    label={t(`Uzunligi`)}
                    placeholder={`${t('misol')}: 100 metr`}
                    type={'text'}
                /> */}
            </div>
            <div className='flex flex-wrap gap-[2.5rem] items-end'>

                <div className={'flex gap-[1.25rem] min-w-[20rem]'}>
                    <Button
                        onClick={stickyForm ? handleEdit : addNewProduct}
                        add={!stickyForm}
                        edit={stickyForm}
                        text={
                            stickyForm
                                ? t('Saqlash')
                                : t("Yangi maxsulot qo'shish")
                        }
                    />
                    <Button onClick={clearForm} text={t('Tozalash')}/>
                </div>
            </div>
        </form>
    )
}

export default CreateProductForm