const { reduce, isElement } = require("lodash");
const { SaleConnector } = require("../models/Sales/SaleConnector");
const moment = require("moment");
const { Debt } = require("../models/Sales/Debt");
const { Market } = require("../models/MarketAndBranch/Market");
const { Client } = require("../models/Sales/Client");
const { User } = require("../models/Users");
const axios = require("axios");
const { Discount } = require("../models/Sales/Discount");
const { Payment } = require("../models/Sales/Payment");
const { Product } = require("../models/Products/Product");
const { SaleProduct } = require("../models/Sales/SaleProduct");
const { Category, ProductData, Unit, ProductPrice } =
  require("./constants").models;

const createCategory = ({ market, name, code }) => {
  const newCategory = new Category({
    market,
    name,
    code,
  });
  return newCategory.save();
};

const createProductData = ({
  market,
  name,
  code,
  category,
  product,
  unit,
  barcode,
}) => {
  const newProductData = new ProductData({
    market,
    name,
    code,
    category,
    product,
    unit,
    barcode,
  });
  return newProductData.save();
};

const createUnit = ({ market, name }) => {
  const newUnit = new Unit({
    market,
    name,
  });
  return newUnit.save();
};

const createProduct = ({
  market,
  category,
  productdata,
  unit,
  price,
  minimumcount,
  total,
}) => {
  const newProduct = new Product({
    market,
    category,
    productdata,
    unit,
    price,
    minimumcount,
    total,
  });
  return newProduct.save();
};

const createProductPrice = ({
  market,
  product,
  sellingprice,
  sellingpriceuzs,
  incomingprice,
  incomingpriceuzs,
  tradeprice,
  tradepriceuzs,
}) => {
  const newProductPrice = new ProductPrice({
    market,
    product,
    sellingprice,
    sellingpriceuzs,
    incomingprice,
    incomingpriceuzs,
    tradeprice,
    tradepriceuzs,
  });
  return newProductPrice.save();
};

const sendMessage = async () => {
  console.log("Messaging has started!");
  const formatMessage = (
    name,
    debt,
    pay_end_date,
    market_number,
    market_name,
    isOverdue
  ) => {
    if (isOverdue) {
      return `Xurmatli ${name} sizni ${market_name} dan ${debt} uzs miqdorda qarzingiz mavjud. ${pay_end_date} gacha edi, ammo to'lovingiz kechikdi iltimos o'z vaqtida amalga oshiring. Murojat uchun ${market_number}`;
    } else {
      return `Xurmatli ${name} sizni ${market_name} dan ${debt} uzs miqdorda qarzingiz mavjud. ${pay_end_date} gacha to'lovni amalga oshiring. Murojat uchun ${market_number}`;
    }
  };
  try {
    const now = moment();
    const saleConnectors = await SaleConnector.find();

    const debtsreport = await Promise.all(
      saleConnectors.map(async (sale) => {
        const payments = await Payment.find({ _id: { $in: sale.payments } });
        const client = await Client.findById(sale.client);
        const debts = await Debt.find({ _id: { $in: sale.debts } });
        const discounts = await Discount.find({ _id: { $in: sale.discounts } });
        const products = await SaleProduct.find({
          _id: { $in: sale.products },
        });
        const reduce = (arr, el) =>
          arr.reduce((prev, item) => prev + (item[el] || 0), 0);
        const discount = reduce(discounts, "discount");
        const discountuzs = reduce(discounts, "discountuzs");
        const payment = reduce(payments, "payment");
        const paymentuzs = reduce(payments, "paymentuzs");
        const totalprice = reduce(products, "totalprice");
        const totalpriceuzs = reduce(products, "totalpriceuzs");

        const debtComment =
          debts.length > 0 ? debts[debts.length - 1].comment : "";
        const debtId = debts.length > 0 ? debts[debts.length - 1]._id : "";
        const payEndDate =
          debts.length > 0 ? debts[debts.length - 1].pay_end_date : "";

        return {
          client: client && client,
          totalprice,
          totalpriceuzs,
          debt: Math.round((totalprice - payment - discount) * 1000) / 1000,
          debtuzs:
            Math.round((totalpriceuzs - paymentuzs - discountuzs) * 1) / 1,
          pay_end_date: payEndDate,
        };
      })
    );
    const filteredDebtsReport = debtsreport.filter(
      (sales) => sales.debtuzs > 0
    );
    for (const debt of filteredDebtsReport) {
      const debtEndDate = moment(debt.pay_end_date);
      const daysUntilPayment = debtEndDate.diff(now, "days");
      const isOverdue = daysUntilPayment < 0;
      if (
        debt.debtuzs &&
        debt.debtuzs > 0 &&
        (isOverdue || (daysUntilPayment >= 0 && daysUntilPayment <= 3))
      ) {
        const client = await Client.findById(debt.client).populate({
          path: "market",
          populate: "director",
        });
        const { market } = client;
        const SMS_API_KEY = market.SMS_API_KEY;
        const validPhoneNumber =
          client.phoneNumber && client.phoneNumber.startsWith("+998")
            ? client.phoneNumber.slice(4)
            : client.phoneNumber;
        if (SMS_API_KEY) {
          const response = await axios.get(
            `https://smsapp.uz/new/services/send.php?key=${SMS_API_KEY}&number=${validPhoneNumber}&message=${formatMessage(
              client.name,
              debt.debtuzs,
              debtEndDate.format("MM/DD/YYYY"),
              market.director.phone,
              market.name,
              isOverdue
            )}`
          );
          console.log(`Messaging has ended! success: ${response.data.success}`);
        }
      }
    }
  } catch (error) {
    console.error("Failed to send message:", error.message);
  }
};
// const sendMessageFromMorning = async (_, res) => {
//   console.log("Morning message sending process has been started.");

//   const formatMessage = (name, debt, market_name) => {
//     return `Xurmatli ${name} sizning ${market_name} дан ${debt} uzs miqtorda qarzingiz mavjud. Iltimos to'lovni o'z vaqtida amalga oshiring!`;
//   };

//   let count = 1;
//   let currentClient = { phone: "", fullname: "" };

//   try {
//     const now = moment();
//     const reduce = (arr, el) =>
//       arr?.reduce((prev, item) => prev + (item[el] || 0), 0);

//     const saleconnectors = await SaleConnector.find()
//       .select("-isArchive -updatedAt -__v")
//       .populate("payments", "payment paymentuzs")
//       .populate({
//         path: "products",
//         select: "totalprice totalpriceuzs",
//         populate: { path: "product", select: "productdata" },
//       })
//       .populate("client", "name phoneNumber")
//       .populate("debts", "pay_end_date")
//       .populate("discounts", "discountuzs")
//       .lean();

//     const debtsreport = saleconnectors
//       .map((sale) => {
//         const paymentuzs = reduce(sale.payments, "paymentuzs");
//         const totalpriceuzs = reduce(sale.products, "totalpriceuzs");
//         const discountuzs = reduce(sale.discounts, "discountuzs");

//         return {
//           client: sale.client,
//           totalpriceuzs,
//           debtuzs: Math.round(totalpriceuzs - paymentuzs - discountuzs),
//           pay_end_date: sale.debts?.[0]?.pay_end_date || null,
//         };
//       })
//       .filter((sale) => sale.debtuzs > 0);

//     const uniqueClientDebts = new Set();

//     const filteredDebtsReport = debtsreport.filter((sale) => {
//       if (sale.client?._id) {
//         if (uniqueClientDebts.has(sale.client._id)) {
//           return false;
//         } else {
//           uniqueClientDebts.add(sale.client._id);
//           return true;
//         }
//       }
//       return false;
//     });

//     for (const debt of filteredDebtsReport) {
//       if (global.isStoppedSendMorningMessage) break;

//       const client = await Client.findById(debt.client).populate({
//         path: "market",
//         populate: "director",
//       });

//       if (!client || !client.market) continue;

//       const { market } = client;
//       const SMS_API_KEY = market.SMS_API_KEY;
//       const validPhoneNumber = client.phoneNumber.startsWith("+998")
//         ? client.phoneNumber.slice(4)
//         : client.phoneNumber;

//       currentClient.fullname = client.name;
//       currentClient.phone = client.phoneNumber;

//       if (SMS_API_KEY) {
//         try {
//           const message = formatMessage(client.name, debt.debtuzs, market.name);
//           const response = await axios.get(
//             `https://smsapp.uz/new/services/send.php?key=${SMS_API_KEY}&number=${validPhoneNumber}&message=${message}`
//           );

//           console.log(`[${count}] The SMS message has been sent. success:
//             ${response.data.success}
//             - client phoneNumber: ${
//               currentClient.phone + "  client name:" + currentClient.fullname
//             }
//             `);
//           count++;
//         } catch (error) {
//           console.error("Failed to send message:", error.message);
//         }
//       }
//     }
//     res?.status(200)?.json({ data: filteredDebtsReport.length });
//   } catch (error) {
//     console.error("SMS-APP Failed to send message:", error.message);
//     res?.status(500)?.json({ error: error.message });
//   }

//   console.log("------ The morning message sending process has ended. ------");
// };

const sendMessageFromMorning = async (_, res) => {
  console.log("Morning message sending process has been started.");

  const formatMessage = (name, debt, market_name) => {
    return `Xurmatli ${name}, sizning ${market_name} dan ${debt} uzs miqdorida umumiy qarzingiz mavjud. Iltimos, to'lovni o'z vaqtida amalga oshiring!`;
  };

  let count = 1;
  let currentClient = { phone: "", fullname: "" };

  try {
    // Fetch all clients
    const clients = await Client.find()
      .select("name phoneNumber market")
      .populate({
        path: "market",
        populate: "director",
      })
      .lean();

    for (const client of clients) {
      if (global.isStoppedSendMorningMessage) break;

      if (!client || !client.market) continue;

      const saleConnectors = await SaleConnector.find({ client: client._id })
        .select("-isArchive -updatedAt -__v")
        .populate("payments", "payment paymentuzs")
        .populate({
          path: "products",
          select: "totalprice totalpriceuzs",
          populate: { path: "product", select: "productdata" },
        })
        .populate("debts", "pay_end_date")
        .populate("discounts", "discountuzs")
        .lean();

      const reduce = (arr, el) =>
        arr?.reduce((prev, item) => prev + (item[el] || 0), 0);

      // Calculate total debt for the client
      const totalDebt = saleConnectors.reduce((acc, sale) => {
        const paymentuzs = reduce(sale.payments, "paymentuzs");
        const totalpriceuzs = reduce(sale.products, "totalpriceuzs");
        const discountuzs = reduce(sale.discounts, "discountuzs");
        const debt = Math.round(totalpriceuzs - paymentuzs - discountuzs);
        return acc + (debt > 0 ? debt : 0);
      }, 0);

      if (totalDebt > 0) {
        const SMS_API_KEY = client.market.SMS_API_KEY;
        // const validPhoneNumber = client.phoneNumber
        const validPhoneNumber = client.phoneNumber.startsWith("+998")
          ? client.phoneNumber.slice(4)
          : client.phoneNumber;

        currentClient.fullname = client.name;
        currentClient.phone = client.phoneNumber;

        if (SMS_API_KEY) {
          try {
            const message = formatMessage(
              client.name,
              totalDebt,
              client.market.name
            );
            const response = await axios.get(
              `https://smsapp.uz/new/services/send.php?key=${SMS_API_KEY}&number=${validPhoneNumber}&message=${message}`
            );

            console.log(`[${count}] -> ${message}`);
            count++;
          } catch (error) {
            console.error("Failed to send message:", error.message);
          }
        }
      }
    }

    res?.status(200)?.json({ data: count - 1 });
  } catch (error) {
    console.error("SMS-APP Failed to send message:", error.message);
    res?.status(500)?.json({ error: error.message });
  }

  console.log("------ The morning message sending process has ended. ------");
};
const displayCountdown = async (seconds) => {
  return new Promise((resolve) => {
    let currentSecond = 0;
    const interval = setInterval(() => {
      currentSecond++;
      process.stdout.write(`\rWaiting: ${currentSecond}/${seconds} seconds`); // Overwrite the same line
      if (currentSecond === seconds || global.isStoppedSendMorningMessage) {
        clearInterval(interval);
        process.stdout.write("\n");
        resolve();
      }
    }, 1000);
  });
};
// //   sendMessageFromMorning
// const sendMessageFromMorning = async (sendLog = function () {}) => {
//   sendLog("Morning message sending has started!");
//   console.log("Morning message sending has started!");
//   const formatMessage = (
//     name,
//     debt,
//     pay_end_date,
//     market_number,
//     market_name,
//     isOverdue
//   ) => {
//     if (isOverdue) {
//       return `Xurmatli ${name} sizni ${market_name} dan ${debt} uzs miqdorda qarzingiz mavjud. ${pay_end_date} gacha edi, ammo to'lovingiz kechikdi iltimos o'z vaqtida amalga oshiring. Murojat uchun ${market_number}`;
//     } else {
//       return `Xurmatli ${name} sizni ${market_name} dan ${debt} uzs miqdorda qarzingiz mavjud. ${pay_end_date} gacha to'lovni amalga oshiring. Murojat uchun ${market_number}`;
//     }
//   };
//   let currentClient = { phone: "", fullname: "" };
//   try {
//     const now = moment();
//     const saleConnectors = await SaleConnector.find();
//     const debtsreport = await Promise.all(
//       saleConnectors.map(async (sale) => {
//         const payments = await Payment.find({ _id: { $in: sale.payments } });
//         const client = await Client.findById(sale.client);
//         const debts = await Debt.find({ _id: { $in: sale.debts } });
//         const discounts = await Discount.find({ _id: { $in: sale.discounts } });
//         const products = await SaleProduct.find({
//           _id: { $in: sale.products },
//         });
//         const reduce = (arr, el) =>
//           arr.reduce((prev, item) => prev + (item[el] || 0), 0);
//         const discount = reduce(discounts, "discount");
//         const discountuzs = reduce(discounts, "discountuzs");
//         const payment = reduce(payments, "payment");
//         const paymentuzs = reduce(payments, "paymentuzs");
//         const totalprice = reduce(products, "totalprice");
//         const totalpriceuzs = reduce(products, "totalpriceuzs");

//         const debtComment =
//           debts.length > 0 ? debts[debts.length - 1].comment : "";
//         const debtId = debts.length > 0 ? debts[debts.length - 1]._id : "";
//         const payEndDate =
//           debts.length > 0 ? debts[debts.length - 1].pay_end_date : "";

//         return {
//           client: client && client,
//           totalprice,
//           totalpriceuzs,
//           debt: Math.round((totalprice - payment - discount) * 1000) / 1000,
//           debtuzs:
//             Math.round((totalpriceuzs - paymentuzs - discountuzs) * 1) / 1,
//           pay_end_date: payEndDate,
//         };
//       })
//     );
//     const filteredDebtsReport = debtsreport.filter(
//       (sales) => sales.debtuzs > 0
//     );
//     let count = 1;
//     for (const debt of filteredDebtsReport) {
//       if (isStoppedSendMorningMessage) {
//         sendLog("Sending end", false);
//         break;
//       }
//       const debtEndDate = moment(debt.pay_end_date);
//       const daysUntilPayment = debtEndDate.diff(now, "days");
//       const isOverdue = daysUntilPayment < 0;
//       if (
//         debt.debtuzs &&
//         debt.debtuzs > 0 &&
//         (isOverdue || (daysUntilPayment >= 0 && daysUntilPayment <= 3))
//       ) {
//         const client = await Client.findById(debt.client).populate({
//           path: "market",
//           populate: "director",
//         });
//         // if client or market is null continue;
//         if (!client || !client.market) {
//           continue;
//         }

//         const { market } = client;
//         const SMS_API_KEY = market.SMS_API_KEY;
//         const validPhoneNumber =
//           client.phoneNumber && client.phoneNumber.startsWith("+998")
//             ? client.phoneNumber.slice(4)
//             : client.phoneNumber;
//         (currentClient.fullname = client.name),
//           (currentClient.phone = client.phoneNumber);
//         if (SMS_API_KEY) {
//           try {
//             const response = await axios.get(
//               `https://smsapp.uz/new/services/send.php?key=${SMS_API_KEY}&number=${validPhoneNumber}&message=${formatMessage(
//                 client.name,
//                 debt.debtuzs,
//                 debtEndDate.format("MM/DD/YYYY"),
//                 market.director.phone,
//                 market.name,
//                 isOverdue
//               )}`
//             );
//             sendLog(
//               `[${count}] Morning message sending ended! success: ${
//                 response.data.success
//               } - client phoneNumber: ${
//                 currentClient.phone + "  client name:" + currentClient.fullname
//               }`,
//               response.data.success
//             );
//             console.log(
//               `[${count}] Morning message sending ended! success: ${
//                 response.data.success
//               } - client phoneNumber: ${
//                 currentClient.phone + "  client name:" + currentClient.fullname
//               }`
//             );
//             count++;
//           } catch (error) {
//             sendLog(
//               `Error while sending to client phoneNumber: ${
//                 currentClient.phone + "  client name:" + currentClient.fullname
//               }`,
//               true
//             );
//             console.error(
//               `Error while sending to client phoneNumber: ${
//                 currentClient.phone + "  client name:" + currentClient.fullname
//               }`,
//               true
//             );
//             console.error("Failed to send morning message:", error.message);
//           }
//         }
//       }
//     }
//   } catch (error) {
//     sendLog(
//       `General error: client phoneNumber: ${
//         currentClient.phone + "  client name:" + currentClient.fullname
//       }`,
//       true
//     );
//     console.error(
//       `General error: client phoneNumber: ${
//         currentClient.phone + "  client name:" + currentClient.fullname
//       }`,
//       true
//     );
//     console.error("Failed to send morning message:", error.message);
//   }
// };
module.exports = {
  createCategory,
  createProductData,
  createUnit,
  createProduct,
  createProductPrice,
  sendMessage,
  sendMessageFromMorning,
};

module.exports.reducer = (arr, el) =>
  reduce(arr, (prev, item) => prev + (item[el] || 0), 0);
module.exports.reducerDuobleProperty = (arr, el1, el2) =>
  reduce(arr, (prev, item) => prev + (item[el1][el2] || 0), 0);

module.exports.roundToUzs = (number) => Math.round(number * 1) / 1;
module.exports.roundToUsd = (number) => Math.round(number * 1000) / 1000;

module.exports.regExpression = (expression) =>
  new RegExp(".*" + expression + ".*", "i");
