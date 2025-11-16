import Modal from 'react-modal'
import FieldContainer from '../FieldContainer/FieldContainer';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SaleBtn } from '../Buttons/SaleBtns';
import { addBalance } from '../../Pages/Clients/clientsSlice';
import { useDispatch } from 'react-redux';

const BalanceModal = ({
    isOpen,
    clientId,
    onCloseModal
}) => {
    const [amount, setAmount] = useState(0)
    const { t } = useTranslation(['common'])
    const [type, setType] = useState('cash')
    const dispatch = useDispatch()

    const amountBalanceHandler = (e) => {
        setAmount(e.target.value)
    }

    const changePaymentType = (type) => {
        setType(type)
    }

    const sendBalanceHandler = () => {
        const data = {
            clientId,
            paymentType: type,
            amount
        }

        dispatch(addBalance(data))
        onCloseModal()
    }

    return ( 
        <Modal 
            isOpen={isOpen}
            onRequestClose={onCloseModal}
        >
            <FieldContainer
                value={amount}
                label={t('Balans')}
                type={'number'}
                onChange={amountBalanceHandler}
            />
            <div className='flex justify-between gap-[10px] mt-[20px]'>
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
            </div>
            <button 
                type="button" 
                className="w-full h-[2.5rem] bg-[#0090A3] text-white-900 rounded-lg mt-[20px]"
                onClick={sendBalanceHandler}
            >
                {t("Jo'natish")}
            </button>
        </Modal>
    );
};

export default BalanceModal;