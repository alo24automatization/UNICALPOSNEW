module.exports.checkPayments = (totalprice, payment, discount, debt, additionalPayment = 0) => {
  let prices =
    debt.debt +
    discount.discount +
    payment.cash +
    payment.card +
    payment.transfer +
    (additionalPayment || 0);
  if (Math.round(totalprice * 100) / 100 !== Math.round(prices * 100) / 100) {
    return true;
  }
  return false;
};
