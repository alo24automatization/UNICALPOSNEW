const { Market } = require('../../models/MarketAndBranch/Market');
const { DailySaleConnector } = require('../../models/Sales/DailySaleConnector');
const { Payment } = require('../../models/Sales/Payment');
const { SaleConnector } = require('../../models/Sales/SaleConnector');
const { User } = require('../../models/Users');
const { AgentPayment } = require("../../models/Sales/AgentPayment.js");
require('../../models/Sales/SaleProduct');
require('../../models/Sales/Discount');
require('../../models/Sales/Payment');
require('../../models/Sales/Packman');
require('../../models/Sales/Client');
// require('../../models/Users');
require('../../models/Sales/DailySaleConnector');
require('../../models/Products/Product');
require('../../models/Products/Productdata');

module.exports.getSellersReport = async (req, res) => {
  try {
    const { market, currentPage, countPage, startDate, endDate, search, seller, type } =
      req.body;

    const id = new RegExp(".*" + search ? search.id : "" + ".*", "i");
    const client = new RegExp(".*" + search ? search.client : "" + ".*", "i");

    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(401)
        .json({ message: `Diqqat! Do'kon haqida malumotlar topilmadi!` });
    }

    //========================================

    const allpayments = await Payment.find({
      // [type]: { $ne: 0 },
      market,
      user: seller,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .sort({ createdAt: -1 })
      .select(`-isArchive -user -updatedAt -__v -products`)
      .populate({
        path: "saleconnector",
        select: "id client products payments user dailyconnectors",
        match: { id: id },
        populate: {
          path: "client",
          select: "name phoneNumber",
          match: { name: client },
        },
      })
      .populate({
        path: "saleconnector",
        select: "id client createdAt products payments user dailyconnectors",
        populate: {
          path: "user",
          select: "firstname lastname",
        },
      })
      .populate({
        path: "saleconnector",
        select: "id client createdAt products payments user dailyconnectors",
        populate: {
          path: "payments",
          select:
            "cash cashuzs card carduzs transfer transferuzs payment paymentuzs totalprice totalpriceuzs",
        },
      })
      .populate({
        path: "saleconnector",
        select: "id client createdAt products payments user dailyconnectors",
        populate: {
          path: "products",
          select:
            "totalprice totalpriceuzs pieces price unitprice unitpriceuzs product createdAt user",
          populate: {
            path: "product",
            select: "productdata",
            populate: {
              path: "productdata",
              select: "name code",
            },
          },
        },
      })
      .populate({
        path: "saleconnector",
        select: "id client createdAt products payments user dailyconnectors",
        populate: {
          path: "products",
          select:
            "totalprice totalpriceuzs pieces price unitprice unitpriceuzs product createdAt user",
          populate: {
            path: "user",
            select: "firstname lastname",
          },
        },
      })
      .populate({
        path: "saleconnector",
        select: "id client createdAt products payments user dailyconnectors",
        populate: {
          path: "dailyconnectors",
          select: "payment",
        },
      })
      .populate({
        path: "saleconnector",
        populate: {
          path: "packman",
        },
      })
      .lean()
      .then((connectors) =>
        connectors.filter((connector) =>
          search.client && search.id
            ? connector.saleconnector.client &&
            connector.saleconnector.id === search.id
            : search.id && !search.client
              ? connector.saleconnector.id === search.id
              : search.client && !search.id
                ? connector.saleconnector.client
                : connector
        )
      );

    const respayments = [];

    const total = {
      payment: {
        cash: 0,
        cashuzs: 0,
        card: 0,
        carduzs: 0,
        transfer: 0,
        transferuzs: 0,
      },
      back: {
        cash: 0,
        cashuzs: 0,
        card: 0,
        carduzs: 0,
        transfer: 0,
        transferuzs: 0,
      },
      result: {
        cash: 0,
        cashuzs: 0,
        card: 0,
        carduzs: 0,
        transfer: 0,
        transferuzs: 0,
      },
      agentProfit: {
        cash: 0,
        cashuzs: 0,
        card: 0,
        carduzs: 0,
        transfer: 0,
        transferuzs: 0,
      },
    };
    for (const payment of allpayments) {
      respayments.push({
        id: payment.saleconnector && payment.saleconnector.id,
        saleconnector: payment.saleconnector,
        createdAt: payment.createdAt,
        client:
          payment.saleconnector &&
          payment.saleconnector.client &&
          payment.saleconnector.client,
        cash: payment.cash,
        cashuzs: payment.cashuzs,
        card: payment.card,
        carduzs: payment.carduzs,
        transfer: payment.transfer,
        transferuzs: payment.transferuzs,
        totalprice: (payment.totalprice && payment.totalprice) || 0,
        totalpriceuzs: (payment.totalpriceuzs && payment.totalpriceuzs) || 0,
      });

      if (payment.cash < 0 || payment.card < 0 || payment.transfer < 0) {
        total.back.cash += payment.cash;
        total.back.cashuzs += payment.cashuzs;
        total.back.card += payment.card;
        total.back.carduzs += payment.carduzs;
        total.back.transfer += payment.transfer;
        total.back.transferuzs += payment.transferuzs;
      } else {
        total.payment.cash += payment.cash;
        total.payment.cashuzs += payment.cashuzs;
        total.payment.card += payment.card;
        total.payment.carduzs += payment.carduzs;
        total.payment.transfer += payment.transfer;
        total.payment.transferuzs += payment.transferuzs;
      }
    }
    total.result.cash = total.payment.cash + total.back.cash;
    total.result.cashuzs = total.payment.cashuzs + total.back.cashuzs;
    total.result.card = total.payment.card + total.back.card;
    total.result.carduzs = total.payment.carduzs + total.back.carduzs;
    total.result.transfer = total.payment.transfer + total.back.transfer;
    total.result.transferuzs =
      total.payment.transferuzs + total.back.transferuzs;
    const allAgentPayments = await AgentPayment.find({
      market,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate({
      path: "packman",
      populate: "payments",
    });
    let totalSum = 0;
    for (const payment of allAgentPayments) {
      totalSum =
        payment?.packman?.payments.reduce(
          (prev, item) => prev + item.paymentuzs,
          0
        ) || 0;
      let agentProfit = totalSum;
      if (payment.type === "mixed") {
        total.agentProfit.cashuzs += payment.cashuzs;
        total.agentProfit.carduzs += payment.carduzs;
        total.agentProfit.transferuzs += payment.transferuzs;
      } else {
        total.agentProfit[payment.type + "uzs"] += agentProfit;
      }
    }
    const response = respayments.filter(
      (product) => product.saleconnector !== null
    );
    const count = response.length;
    let paymentsreport = response.splice(currentPage * countPage, countPage);
    res.status(201).json({ data: paymentsreport, count, total });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.getDayTotalReport = async (req, res) => {
  try {
    const { market, startDate, endDate, sellerId } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(400).json({
        message:
          "Diqqat! Foydalanuvchi ro'yxatga olinayotgan do'kon dasturda ro'yxatga olinmagan.",
      });
    }
    console.log(sellerId);
    const seller = await User.findById(sellerId)
      .select("firstname lastname market type login phone isIncomePage")
      .lean();

    if (seller) {
      const sales = await DailySaleConnector.find({
        user: seller._id,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
        .select("user payment")
        .populate(
          "payment",
          "cash cashuzs card carduzs transfer transferuzs payment paymentuzs totalprice totalpriceuzs"
        )
        .populate("saleconnector", "id totalOfBackAndDebt")
        .populate("client", "name")
        .populate({
          path: "products",
          select: "totalprice totalpriceuzs pieces price product",
          populate: {
            path: "price",
            select:
              "incomingprice incomingpriceuzs sellingprice sellingpriceuzs",
          },
        })
        .populate({
          path: "products",
          select: "totalprice totalpriceuzs pieces price product",
          populate: {
            path: "product",
            select: "price",
            populate: {
              path: "price",
              select: "incomingprice incomingpriceuzs",
            },
          },
        })
        .populate(
          "discount",
          "discount discountuzs totalprice totalpriceuzs procient"
        )
        .lean()

      const allpayments = await Payment.find({
        user: seller._id,
        // market,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
        .select(`-isArchive -updatedAt -__v -products`)
        .lean()


      for (const payment of allpayments) {
        console.log(payment);
      }

      seller.cash = allpayments.reduce((prev, el) => prev + (el.cash || 0), 0)
      seller.cashuzs = allpayments.reduce((prev, el) => prev + (el.cashuzs || 0), 0)
      seller.card = allpayments.reduce((prev, el) => prev + (el.card || 0), 0)
      seller.carduzs = allpayments.reduce((prev, el) => prev + (el.carduzs || 0), 0)
      seller.transfer = allpayments.reduce((prev, el) => prev + (el.transfer || 0), 0)
      seller.transferuzs = allpayments.reduce((prev, el) => prev + (el.transferuzs || 0), 0)
      seller.paydebt = allpayments.reduce((prev, el) => prev + !el.totalprice ? (el.cash + el.card + el.transfer) : 0, 0)
      seller.paydebtuzs = allpayments.reduce((prev, el) => prev + !el.totalpriceuzs ? (el.cashuzs + el.carduzs + el.transferuzs) : 0, 0)

      seller.sales = sales.length;
      seller.totalsales = seller.cash + seller.card + seller.transfer
      seller.totalsalesuzs = seller.cashuzs + seller.carduzs + seller.transferuzs

      // seller.totalsales = allpayments.reduce((prev, payment) => {
      //   return prev + (payment.totalprice || 0);
      // }, 0);
      // seller.totalsalesuzs = allpayments.reduce((prev, payment) => {
      //   return prev + (payment.totalpriceuzs || 0);
      // }, 0);


      // seller.cash = sales.reduce((prev, sale) => {
      //   return prev + ((sale.payment && sale.payment.cash) || 0);
      // }, 0);
      // seller.cashuzs = sales.reduce((prev, sale) => {
      //   return prev + ((sale.payment && sale.payment.cashuzs) || 0);
      // }, 0);

      // seller.card = sales.reduce((prev, sale) => {
      //   return prev + ((sale.payment && sale.payment.card) || 0);
      // }, 0);
      // seller.carduzs = sales.reduce((prev, sale) => {
      //   return prev + ((sale.payment && sale.payment.carduzs) || 0);
      // }, 0);

      // seller.transfer = sales.reduce((prev, sale) => {
      //   return prev + ((sale.payment && sale.payment.transfer) || 0);
      // }, 0);
      // seller.transferuzs = sales.reduce((prev, sale) => {
      //   return prev + ((sale.payment && sale.payment.transferuzs) || 0);
      // }, 0);


      // let profit = 0;
      // let profituzs = 0;
      let debt = 0
      let debtuzs = 0

      const profitData = sales.map((sale) => {
        // const totalincomingprice = sale.products.reduce(
        //   (prev, item) =>
        //     prev +
        //     item.pieces *
        //     ((item.price && item.price.incomingprice) ||
        //       (item.product && item.product.price.incomingprice) ||
        //       0),
        //   0
        // );
        // const totalincomingpriceuzs = sale.products.reduce(
        //   (prev, item) =>
        //     prev +
        //     item.pieces *
        //     ((item.price && item.price.incomingpriceuzs) ||
        //       (item.product && item.product.price.incomingpriceuzs) ||
        //       0),
        //   0
        // );
        const totalprice = sale.products.reduce(
          (summ, product) => summ + (product.totalprice || 0),
          0
        );
        const totalpriceuzs = sale.products.reduce(
          (summ, product) => summ + (product.totalpriceuzs || 0),
          0
        );

        const discount = (sale.discount && sale.discount.discount) || 0;
        const discountuzs = (sale.discount && sale.discount.discountuzs) || 0;

        debt += (Math.round((totalprice - (sale?.payment?.payment || 0) - discount) * 1000) / 1000)
        debtuzs += (Math.round((totalpriceuzs - (sale?.payment?.paymentuzs || 0) - discountuzs) * 1) / 1)

        // profit += totalprice - totalincomingprice - discount;
        // profituzs += totalpriceuzs - totalincomingpriceuzs - discountuzs;
      });
      // seller.profit = profit;
      // seller.profituzs = profituzs;
      seller.debt = debt;
      seller.debtuzs = debtuzs;

    }
    res.status(201).send(seller);
  } catch (error) {
    console.log(error);
    res
      .status(501)
      .json({
        error: "Serverda xatolik yuz berdi...",
        description: error.message,
      });
  }
};
