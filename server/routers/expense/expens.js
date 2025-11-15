const {validateExpense, Expense} = require('../../models/Expense/Expense');
const {Market} = require('../../models/MarketAndBranch/Market');
const {ExpenseCommentType} = require("../../models/Expense/ExpenseCommentTypes");

module.exports.getExpense = async (req, res) => {
    try {
        const { market, currentPage, countPage, startDate, endDate } = req.body;

        // Validate input (e.g., checking if currentPage or countPage are numbers)
        const page = currentPage ? parseInt(currentPage) : 1; // Default to page 1
        const limit = countPage ? parseInt(countPage) : 10; // Default to 10 items per page
        const skip = (page - 1) * limit; // Calculate the number of documents to skip

        const marke = await Market.findById(market);
        if (!marke) {
            return res.status(401).json({ message: "Diqqat! Do'kon ma'lumotlari topilmadi." });
        }

        // Fetch the expenses with the given filter, sorting, and pagination
        const expenses = await Expense.find({
            market,
            createdAt: {
                $gte: new Date(startDate),
                $lt: new Date(endDate),
            },
        })
        .sort({ _id: -1 }) // Sort by descending order of createdAt
        .select('sum sumuzs type user market createdAt') // Select necessary fields
        .populate('user', 'firstname lastname') // Populate user details
        .populate('comment', 'comment') // Populate comment details
        .skip(skip) // Skip documents for pagination
        .limit(limit); // Limit the number of documents per page

        // Count the total number of expenses for the pagination metadata
        const totalExpenses = await Expense.countDocuments({
            market,
            createdAt: {
                $gte: new Date(startDate),
                $lt: new Date(endDate),
            },
        });

        res.status(200).json({
            count: totalExpenses, // Total count for pagination
            totalPages: Math.ceil(totalExpenses / limit), // Total number of pages
            currentPage: page, // Current page number
            expenses, // The paginated expenses
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
    }
};

module.exports.getExpenseByType = async (req, res) => {
    try {
        const {market, currentPage, countPage, startDate, endDate, comment} = req.body;

        const marke = await Market.findById(market);
        if (!marke) {
            return res
                .status(401)
                .json({message: "Diqqat! Do'kon ma'lumotlari topilmadi."});
        }

        const expenses = await Expense.find({
            market,
            createdAt: {
                $gte: startDate,
                $lt: endDate,
            },
            comment
        })
            .sort({_id: -1})
            .select('sum sumuzs  type user market createdAt')
            .populate("user", "firstname lastname").populate("comment", "comment")

        res.status(201).json({
            count: expenses.length,
            expenses: expenses.splice(currentPage * countPage, countPage),
        });
    } catch (error) {
        res.status(501).json({error: 'Serverda xatolik yuz berdi...'});
    }
}
module.exports.registerExpense = async (req, res) => {
    try {
        const {currentPage, countPage, user} = req.body;
        const {sum, sumuzs, type, comment, market} = req.body.expense;

        const {error} = validateExpense(req.body.expense);

        if (error) {
            return res.status(400).json({
                error: error.message,
            });
        }

        const marke = await Market.findById(market);

        if (!marke) {
            return res
                .status(401)
                .json({message: "Diqqat! Do'kon ma'lumotlari topilmadi."});
        }

        const expense = new Expense({
            sum,
            sumuzs,
            type,
            comment,
            market,
            user
        });

        await expense.save();
        const findExpenseTypes = await ExpenseCommentType.findById(comment);
        if (findExpenseTypes) {
            findExpenseTypes.expenses.push(expense);
        }
        await findExpenseTypes.save()
        const responseExpense = await Expense.find({market}).select(
            'sum sumuzs type market user createdAt'
        )
            .populate("user", "firstname lastname")
            .populate("comment", "comment")

        res.status(201).json({
            count: responseExpense.length,
            expenses: responseExpense.splice(currentPage * countPage, countPage),
        });
    } catch (error) {
        res.status(501).json({error: 'Serverda xatolik yuz berdi...'});
    }
};

module.exports.deleteExpense = async (req, res) => {
    try {
        const {_id, market, currentPage, countPage} = req.body;

        const marke = await Market.findById(market);
        if (!marke) {
            return res
                .status(401)
                .json({message: "Diqqat! Do'kon ma'lumotlari topilmadi."});
        }

        await Expense.findByIdAndDelete(_id);

        const expenses = await Expense.find({
            market,
        })
            .sort({_id: -1})
            .select('sum sumuzs comment type market createdAt')
            .skip(currentPage * countPage)
            .limit(countPage);

        res.status(201).json({
            count: expenses.length,
            expenses: expenses.splice(currentPage * countPage, countPage),
        });
    } catch (error) {
        res.status(501).json({error: 'Serverda xatolik yuz berdi...'});
    }
};
