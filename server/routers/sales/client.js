const { Client, validateClient } = require('../../models/Sales/Client.js');
const { Market } = require('../../models/MarketAndBranch/Market');
const { Packman } = require('../../models/Sales/Packman.js');
const { SaleConnector } = require('../../models/Sales/SaleConnector');
require('../../models/Sales/SaleProduct');
require('../../models/Sales/Packman');
const { Payment } = require('../../models/Sales/Payment');
require('../../models/Sales/Discount');
require('../../models/Sales/Debt');
require('../../models/Sales/DailySaleConnector');
require('../../models/Products/Productdata');
require('../../models/Products/Product');
require('../../models/Users');
const { regExpression } = require('../globalFunctions.js');
const { DailySaleConnector } = require('../../models/Sales/DailySaleConnector');
const { Debt } = require('../../models/Sales/Debt');
const { ClientBalanceTransactions } = require('../../models/Sales/ClientBalanceTransactions.js');

const reduce = (arr, el) => arr.reduce((prev, item) => prev + (item[el] || 0), 0);

module.exports.register = async (req, res) => {
  try {
    const { name, phoneNumber, market, packman, search, currentPage, countPage } = req.body;
    const { error } = validateClient({ name, phoneNumber, market });
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(400).json({
        message: `Diqqat! Do'kon haqida malumotlar topilmadi.`,
      });
    }

    const client = await Client.findOne({
      name,
      market,
    });

    if (client) {
      return res.status(400).json({
        message: `Diqqat! ${name} mijoz avval yaratilgan!`,
      });
    }

    const newClient = new Client({
      name,
      market,
      phoneNumber,
    });
    await newClient.save();

    if (packman) {
      const checkpackman = await Packman.findById(packman);
      if (checkpackman) {
        newClient.packman = checkpackman._id;
        await Packman.findByIdAndUpdate(checkpackman._id, {
          $push: {
            clients: newClient,
          },
        });
        await newClient.save();
      }
    }
    const clientname = new RegExp('.*' + search ? search.client : '' + '.*', 'i');
    const clientpackman = new RegExp('.*' + search ? search.packman : '' + '.*', 'i');

    const clientsCount = await Client.find({ market, name: clientname })
      .sort({ _id: -1 })
      .select('name market packman phoneNumber')
      .populate({ path: 'packman', match: { name: clientpackman } });

    const filterCount = clientsCount.filter((item) => {
      return item.packman !== null;
    });

    const clients = await Client.find({ market, name: clientname })
      .sort({ _id: -1 })
      .select('name market packman phoneNumber')
      .populate({ path: 'packman', match: { name: clientpackman } })
      .populate('packman', 'name')
      .skip(currentPage * countPage)
      .limit(countPage);

    const filter = clients.filter((item) => {
      return item.packman !== null;
    });

    res.status(201).json({ clients: filter, count: filterCount.length });
  } catch (error) {
    res.status(400).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

module.exports.getAll = async (req, res) => {
  try {
    const { market } = req.body;

    const marketData = await Market.findById(market);

    if (!marketData) {
      return res.status(400).json({
        message: "Diqqat! Do'kon haqida malumotlari topilmadi!",
      });
    }

    const clients = await Client.find({ market })
      .select('name phoneNumber balance')
      .populate('packman', 'name')
      .lean();

    for (const client of clients) {
      const saleconnector = await SaleConnector.find({
        client: client._id,
      })
        .select('_id')
        .sort({ createdAt: -1 })
        .limit(1)
        .lean();

      if (saleconnector.length > 0) {
        client.saleconnectorid = saleconnector[0]._id;
      }
    }

    res.status(201).send(clients);
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

module.exports.updateClient = async (req, res) => {
  try {
    const { _id, market, name, phoneNumber, packman, search, currentPage, countPage } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(400).json({ message: "Diqqat! Do'kon haqida malumot topilmadi!" });
    }
    const client = await Client.findById(_id);
    if (!client) {
      return res.status(400).json({ message: `Diqqat! ${name} mijoz avval yaratilmagan` });
    }
    const updatedClient = {
      name,
      phoneNumber,
    };
    const packMan = await Packman.findById(packman);
    if (packMan) {
      await Packman.findByIdAndUpdate(client.packman, {
        $pull: {
          clients: _id,
        },
      });
      if (client.packman !== packMan._id) {
        await Packman.findByIdAndUpdate(packMan._id, {
          $push: {
            clients: _id,
          },
        });
      } else {
        await Packman.findByIdAndUpdate(client.packman, {
          $push: {
            clients: _id,
          },
        });
      }
      updatedClient.packman = { name: packMan.name, _id: packMan._id };
    }

    await Client.findByIdAndUpdate(_id, {
      ...updatedClient,
    });

    const clientname = new RegExp('.*' + search ? search.client : '' + '.*', 'i');
    const clientpackman = new RegExp('.*' + search ? search.packman : '' + '.*', 'i');

    const clientsCount = await Client.find({ market, name: clientname })
      .sort({ _id: -1 })
      .select('name market packman phoneNumber')
      .populate({ path: 'packman', match: { name: clientpackman } });

    const filterCount = clientsCount.filter((item) => {
      return item.packman !== null;
    });

    const clients = await Client.find({ market, name: clientname })
      .sort({ _id: -1 })
      .select('name market packman phoneNumber')
      .populate({ path: 'packman', match: { name: clientpackman } })
      .populate('packman', 'name')
      .skip(currentPage * countPage)
      .limit(countPage);

    const filter = clients.filter((item) => {
      return item.packman !== null;
    });

    res.status(201).json({ clients: filter, count: filterCount.length });
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

module.exports.deleteClient = async (req, res) => {
  try {
    const { _id, market, name, packman, search, currentPage, countPage } = req.body;

    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(400).json({ message: "Diqqat! Do'kon haqida malumot topilmadi!" });
    }
    const client = await Client.findById(_id);
    if (!client) {
      return res.status(400).json({ message: `Diqqat! ${name} mijoz avval yaratilmagan!` });
    }

    if (packman) {
      const packMan = await Packman.findById(packman);

      if (packMan) {
        await Packman.findByIdAndUpdate(packman, {
          $pull: {
            clients: client._id,
          },
        });
      }
    }
    await Client.findByIdAndDelete(_id);

    const clientname = new RegExp('.*' + search ? search.client : '' + '.*', 'i');
    const clientpackman = new RegExp('.*' + search ? search.packman : '' + '.*', 'i');

    const clientsCount = await Client.find({ market, name: clientname })
      .sort({ _id: -1 })
      .select('name market packman phoneNumber')
      .populate({ path: 'packman', match: { name: clientpackman } });

    const filterCount = clientsCount.filter((item) => {
      return item.packman !== null;
    });

    const clients = await Client.find({ market, name: clientname })
      .sort({ _id: -1 })
      .select('name market packman phoneNumber')
      .populate({ path: 'packman', match: { name: clientpackman } })
      .populate('packman', 'name')
      .skip(currentPage * countPage)
      .limit(countPage);

    const filter = clients.filter((item) => {
      return item.packman !== null;
    });

    res.status(201).json({ clients: filter, count: filterCount.length });
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

module.exports.paymentDebt = async (req, res) => {
  try {
    const { payment, user, saleconnectorid, products, debt_id, market } = req.body;

    const debt = await Debt.findById(debt_id);
    if (!debt) {
      return res.status(404).json({ message: 'Debt not found' });
    }
    debt.debt -= payment.card + payment.cash + payment.transfer;
    debt.debtuzs -= payment.carduzs + payment.cashuzs + payment.transferuzs;
    await debt.save();
    const saleConnector = await SaleConnector.findById(saleconnectorid);
    if (!saleConnector) {
      return res.status(404).json({ message: 'SaleConnector not found' });
    }
    const newPayment = new Payment({
      comment: payment.comment,
      payment: payment.card + payment.cash + payment.transfer,
      paymentuzs: payment.carduzs + payment.cashuzs + payment.transferuzs,
      card: payment.card,
      cash: payment.cash,
      transfer: payment.transfer,
      carduzs: payment.carduzs,
      cashuzs: payment.cashuzs,
      transferuzs: payment.transferuzs,
      type: payment.type,
      products,
      market,
      user,
      saleconnector: saleconnectorid,
    });
    await newPayment.save();
    saleConnector.payments.push(newPayment._id);
    await saleConnector.save();

    const returnpayment = await Payment.findById(newPayment._id).populate({
      path: 'saleconnector',
      select: 'client packman',
      populate: { path: 'client', select: 'name' },
    });
    res.status(200).json(returnpayment);
  } catch (error) {
    // Handle any errors that occur
    console.error('Error processing payment:', error);
    res.status(500).json({
      message: 'An error occurred while processing the payment',
      error,
    });
  }
};

module.exports.getClients = async (req, res) => {
  try {
    const { market, search, currentPage, countPage } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(401).json({ message: "Diqqat! Do'kon malumotlari topilmadi." });
    }

    const name = search?.client ? regExpression(search.client) : '';
    const phone = search?.phone ? regExpression(search.phone) : '';
    const packman = search.packman;

    let clientsCount = [];
    let clients = [];
    if (packman && !name && !phone) {
      clientsCount = await Client.find({
        market,
        packman,
      }).count();

      clients = await Client.find({
        market,
        packman,
      })
        .sort({ _id: -1 })
        .select('name market balance packman phoneNumber')
        .populate('packman', 'name')
        .skip(currentPage * countPage)
        .limit(countPage);
    } else if (!packman && !name && phone) {
      clientsCount = await Client.find({
        market,
        phoneNumber: phone,
      }).count();

      clients = await Client.find({
        market,
        phoneNumber: phone,
      })
        .sort({ _id: -1 })
        .select('name market balance phoneNumber packman')
        .populate('packman', 'name')
        .skip(currentPage * countPage)
        .limit(countPage);
    } else if (!packman && name && !phone) {
      clientsCount = await Client.find({
        market,
        name,
      }).count();

      clients = await Client.find({
        market,
        name,
      })
        .sort({ _id: -1 })
        .select('name market balance phoneNumber packman')
        .populate('packman', 'name')
        .skip(currentPage * countPage)
        .limit(countPage);
    } else if (packman && name && !phone) {
      clientsCount = await Client.find({
        market,
        name,
        packman,
      }).count();

      clients = await Client.find({
        market,
        name,
        packman,
      })
        .sort({ _id: -1 })
        .select('name market balance phoneNumber packman')
        .populate('packman', 'name')
        .skip(currentPage * countPage)
        .limit(countPage);
    } else if (packman && !name && phone) {
      clientsCount = await Client.find({
        market,
        phoneNumber: phone,
        packman,
      }).count();

      clients = await Client.find({
        market,
        phoneNumber: phone,
        packman,
      })
        .sort({ _id: -1 })
        .select('name market balance phoneNumber packman')
        .populate('packman', 'name')
        .skip(currentPage * countPage)
        .limit(countPage);
    } else if (!packman && name && phone) {
      clientsCount = await Client.find({
        market,
        name: name,
        phoneNumber: phone,
      }).count();

      clients = await Client.find({
        market,
        name: name,
        phoneNumber: phone,
      })
        .sort({ _id: -1 })
        .select('name market balance phoneNumber packman')
        .populate('packman', 'name')
        .skip(currentPage * countPage)
        .limit(countPage);
    } else {
      clientsCount = await Client.find({
        market,
      }).count();

      clients = await Client.find({
        market,
      })
        .sort({ _id: -1 })
        .select('name market balance phoneNumber packman')
        .populate('packman', 'name')
        .skip(currentPage * countPage)
        .limit(countPage);
    }

    const reduceForSales = (arr, key) => {
      return arr.reduce((prev, connector) => {
        prev.push(...connector[key]);
        return prev;
      }, []);
    };

    let newClients = [];

    for (let client of clients) {
      const saleconnectors = await SaleConnector.find({
        market,
        client: client._id,
        // createdAt: {
        //   $gte: startDate,
        //   $lt: endDate,
        // },
      })
        .select('-isArchive -market -__v')
        .sort({ createdAt: -1 })
        .populate({
          path: 'products',
          select: 'user',
          populate: {
            path: 'user',
            select: 'firstname lastname',
          },
        })
        .populate({
          path: 'products',
          select: 'price',
          populate: {
            path: 'price',
            select: 'incomingprice incomingpriceuzs',
          },
        })
        .populate({
          path: 'products',
          select:
            'totalprice unitprice totalpriceuzs unitpriceuzs pieces createdAt discount saleproducts product',
          options: { sort: { createdAt: -1 } },
          populate: {
            path: 'product',
            select: 'productdata',
            populate: { path: 'productdata', select: 'name code' },
          },
        })
        .populate('payments', 'payment paymentuzs comment totalprice totalpriceuzs createdAt')
        .populate('discounts', 'discount discountuzs procient products totalprice totalpriceuzs')
        .populate({ path: 'client', select: 'name phoneNumber' })
        .populate('packman', 'name')
        .populate('user', 'firstname lastname')
        .populate('dailyconnectors', 'comment');

      let s = null;
      let totaldebtuzs = 0;
      if (saleconnectors.length > 0) {
        const payments = reduceForSales(saleconnectors, 'payments');
        const products = reduceForSales(saleconnectors, 'products');
        const debts = reduceForSales(saleconnectors, 'debts');
        const discounts = reduceForSales(saleconnectors, 'discounts');
        const dailyconnectors = reduceForSales(saleconnectors, 'dailyconnectors');

        const totalsales = [...products].reduce((prev, el) => prev + el.totalprice || 0, 0);
        const totalsalesuzs = [...products].reduce((prev, el) => prev + el.totalpriceuzs || 0, 0);
        const incomings = [...products].reduce(
          (prev, el) => prev + el.pieces * ((el.price && el.price.incomingprice) || 0),
          0,
        );
        const incomingsuzs = [...products].reduce(
          (prev, el) => prev + el.pieces * ((el.price && el.price.incomingpriceuzs) || 0),
          0,
        );

        const productstotaluzs = [...products].reduce((prev, el) => prev + el.totalpriceuzs, 0);
        const paymentstotaluzs = [...payments].reduce((prev, el) => prev + el.paymentuzs, 0);
        const discountstotaluzs = [...discounts].reduce((prev, el) => prev + el.discountuzs, 0);
        totaldebtuzs = productstotaluzs - paymentstotaluzs - discountstotaluzs;
        s = {
          products: products,
          payments: payments,
          debts: debts,
          discounts: discounts,
          dailyconnectors: dailyconnectors,
          user: saleconnectors[0].user,
          createdAt: saleconnectors[0].createdAt,
          totalsales: totalsales,
          totalsalesuzs: totalsalesuzs,
          profit: totalsales - incomings,
          profituzs: totalsalesuzs - incomingsuzs,
          id: saleconnectors[0].id,
          totaldebtusd: -1,
          totaldebtuzs,
        };
      }
      const newClient = {
        _id: client._id,
        name: client.name,
        market: client.market,
        packman: client.packman,
        balance: client.balance,
        saleconnector: s,
        phoneNumber: client.phoneNumber,
      };
      newClients.push(newClient);
    }

    res.status(201).json({ clients: newClients, count: clientsCount });
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...', error });
  }
};

module.exports.getClientsSales = async (req, res) => {
  try {
    const { market, clientId } = req.body;

    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(401).json({ message: `Diqqat! Do'kon haqida malumotlar topilmadi!` });
    }

    const allpayments = await DailySaleConnector.find({
      market,
      client: clientId,
    })
      .select('-isArchive -updatedAt -market -__v')
      .populate({
        path: 'products',
        select: 'totalprice backed unitprice totalpriceuzs unitpriceuzs pieces fromFilial',
        populate: {
          path: 'product',
          select: 'productdata  total',
          populate: {
            path: 'productdata',
            select: 'code name',
            options: { sort: { code: 1 } },
          },
        },
      })
      .populate('payment', 'payment paymentuzs totalprice totalpriceuzs')
      .populate('discount', 'discount discountuzs')
      .populate('debt')
      .populate({
        path: 'client',
        select: 'name',
        // match: { _id: clientId },
      })
      .populate('packman', 'name')
      .populate('user', 'firstname lastname')
      .populate({
        path: 'saleconnector',
        populate: [
          { path: 'payments' }, // Populate payments in saleconnector
          {
            path: 'products',
            populate: {
              path: 'product',
              select: 'category productdata',
              populate: {
                path: 'productdata',
                select: 'name code',
              },
            },
          }, // Populate products in saleconnector
          { path: 'discounts' }, // Populate discounts in saleconnector
        ],
      })
      .lean()
      .then((connectors) => connectors.filter((connector) => connector.client));
    const updatedPayments = allpayments.map((payment) => {
      let sum = 0;
      if (payment.saleconnector.totalOfBackAndDebt) {
        sum = payment?.debt?.debtuzs - payment.saleconnector.totalOfBackAndDebt;
      } else {
        if (payment.debt) {
          sum = payment?.debt?.debtuzs || 0;
        }
      }
      return {
        ...payment,
        debt: { ...payment.debt, debtuzs: sum },
      };
    });
    const filteredPayments = updatedPayments.filter((payment) => payment.products.length > 0); // Assuming you want to keep all payments
    const count = filteredPayments.length;
    res.status(201).json({ data: filteredPayments, count });
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...', message: error.message });
  }
};

//* ------------------------------- CLIENT BALANCE -------------------------------
module.exports.getClientBalanceTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, from, to, search, market } = req.body;
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.max(parseInt(limit, 10) || 20, 1);
    const filter = { client: {} };
    const createdAt = {};

    if (market) {
      filter.client.market = market;
    }

    if (from) {
      const fromDate = new Date(from);
      if (!isNaN(fromDate)) {
        createdAt.$gte = fromDate;
      }
    }

    if (to) {
      const toDate = new Date(to);
      if (!isNaN(toDate)) {
        createdAt.$lte = toDate;
      }
    }

    if (Object.keys(createdAt).length) {
      filter.createdAt = createdAt;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      const matchedClients = await Client.find({
        $or: [{ name: searchRegex }, { phoneNumber: searchRegex }],
      })
        .select('_id')
        .lean();

      if (!matchedClients.length) {
        return res.status(201).json({
          records: [],
          pagination: { currentPage: pageNumber, totalPages: 0, totalCount: 0 },
        });
      }

      filter.client.$in = matchedClients.map((client) => client._id);
    }

    const [clientBalanceTransactions, count] = await Promise.all([
      ClientBalanceTransactions.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .populate('client', 'name phoneNumber balance'),
      ClientBalanceTransactions.countDocuments(filter),
    ]);

    res.status(201).json({
      records: clientBalanceTransactions,
      pagination: {
        currentPage: pageNumber,
        totalPages: count ? Math.ceil(count / limitNumber) : 0,
        totalCount: count,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...', message: error.message });
  }
};

module.exports.fillClientBalance = async (req, res) => {
  try {
    const { clientId, paymentType, amount } = req.body;

    if (!clientId) {
      return res.status(400).json({ message: 'Mijoz tanlanmagan.' });
    }

    if (!['cash', 'card', 'transfer'].includes(paymentType)) {
      return res.status(400).json({ message: 'To`lov turi tanlanmagan.' });
    }

    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({ message: 'Mijoz topilmadi.' });
    }

    const numericAmount = Number(amount) || 0;

    if (numericAmount < 0) {
      return res.status(400).json({ message: "Qiymatlar manfiy bo'lishi mumkin emas." });
    }

    client.balance += numericAmount;
    await Promise.all([
      client.save(),
      ClientBalanceTransactions.create({
        paymentType,
        client: client._id,
        type: 'credit',
        amount: numericAmount,
      }),
    ]);

    res.status(201).json({
      message: "Mijoz balansi muvaffaqiyatli to'ldirildi.",
      client: { _id: client._id, name: client.name, balance: client.balance },
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...', message: error.message });
  }
};
//! ------------------------------- CLIENT BALANCE -------------------------------
