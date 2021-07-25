const models = require('../models');
var _ = require('lodash');
const bcrypt = require('bcrypt-nodejs');
const debug = require('debug')('server');
const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const Validator = require("fastest-validator");

function postMonth(req, res) {
    const monthReq = {
        month: req.body.month,
        year: req.body.year,
        user_id: req.user.userId
    };

    const schema = {
        month: { type: "string", optional: false, min: 3, max: 100 },
        year: { type: "string", optional: false, min: 3, max: 100 }
    };

    const v = new Validator();

    const validatorResponse = v.validate(monthReq, schema);

    if (validatorResponse !== true) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validatorResponse
        });
    }

    models.months.create(monthReq).then(result => {
        res.status(201).json({
            message: 'Month created',
            month: result
        })
    }).catch(error => {
        res.status(500).json({
            message: 'Something Went Wrong',
            error: error
        });
    });
}

function getMyMonthList(req, res) {
    return models.months.findAll({ where: { user_id: req.user.userId } }).then(months => {
        if (months) {
            res.status(200).json({
                message: 'Months fetched succeesfully',
                monthList: months
            })
        } else {
            res.status(200).json({
                message: 'No months yet',
                monthList: months
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something Went Wrong',
            error: err
        });
    });
}

function getIndividualMonth(req, res) {
    return models.months.findOne({ where: { id: req.params.id, user_id: req.user.userId } }).then(monthRes => {
        if (monthRes) {
            res.status(200).json({
                message: 'Month fetched succeesfully',
                month: monthRes
            })
        } else {
            res.status(200).json({
                message: 'No data for the user',
                month: monthRes
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something Went Wrong',
            error: err
        });
    });
}

function updateMonth(req, res) {
    return models.months.findOne({ where: { id: req.params.id, user_id: req.user.userId }, limit: 1 }).then(monthRes => {
        if (monthRes) {
            let monthData = {
                month: req.body.month,
                year: req.body.year
            };

            const schema = {
                month: { type: "string", optional: false, min: 3, max: 100 },
                year: { type: "string", optional: false, min: 3, max: 100 }
            };

            const v = new Validator();

            const validatorResponse = v.validate(monthData, schema);

            if (validatorResponse !== true) {
                return res.status(400).json({
                    message: "Validation failed",
                    errors: validatorResponse
                });
            }
            return monthRes.update(monthData).then(response => {
                console.log(response);
                res.status(200).json({
                    message: 'Update successful',
                    response: response
                });
            }).catch(err => {
                res.status(500).json({
                    message: 'Something went wrong',
                    err: err
                });
            });
        } else {
            res.status(200).json({
                message: 'No month',
                response: monthRes
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something went wrong',
            err: err
        });
    });
}

function deleteMonth(req, res) {
    return models.months.destroy({ where: { id: req.params.id, user_id: req.user.userId }, limit: 1 }).then(monthRes => {
        if (monthRes) {
            res.status(200).json({
                message: 'Deleted successfully',
                response: monthRes
            });
        } else {
            res.status(200).json({
                message: 'No month',
                response: monthRes
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something went wrong',
            err: err
        });
    });
}

function getMonthDetails(req, res) {
    let where;
    if (req.params.month_id !== 'LATEST') {
        where = {
            user_id: req.user.userId,
            id: req.params.month_id
        };
    } else {
        where = {
            user_id: req.user.userId
        };
    }
    return models.months.findOne({
        where: where,
        order: [['createdAt', 'DESC']],
        include: [{
            model: models.expenses, as: 'expenses',
            attributes: ['id', 'expense', 'amount', 'paid'],
            include: [{
                model: models.categories, as: 'categories',
                attributes: ['id', 'name']
            }]
        }, {
            model: models.incomes, as: 'incomes',
            attributes: ['id', 'income', 'amount']
        }]
    }).then(months => {
        if (months) {
            res.status(200).json({
                message: 'Months fetched succeesfully',
                data: expenseCategpryTransform(months)
            })
        } else {
            res.status(200).json({
                message: 'No months yet',
                data: months
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something Went Wrong',
            error: err
        });
    });
}

function expenseCategpryTransform(months) {
    console.log('IN transformation');
    var destination = [];

    // _.forEach(months, function (month) {

    // get the current month from destination
    let currentMonth = _.find(destination.months, _.matchesProperty('id', months.id));
    if (currentMonth === undefined) {
        // month not in the destination
        //console.log('tanant not in the list');
        currentMonth = {
            'id': months.id,
            'month': months.month,
            'year': months.year,
            "user_id": months.user_id,
            'createdAt': months.createdAt,
            "updatedAt": months.updatedAt,
            "incomes": months.incomes,
            'categories': []
        };
        destination.push(currentMonth);
    }

    _.forEach(months.expenses, function (expense) {
        //loop through widgets in the current month
        const catagoryId = expense.categories.id;

        //check catagory exist in the currentMonth
        let currentCategory = _.find(currentMonth.categories, _.matchesProperty('id', catagoryId));
        if (currentCategory === undefined) {
            //category not exist
            currentCategory = {
                'id': expense.categories.id,
                'name': expense.categories.name,
                'expenses': []
            }

            currentMonth.categories.push(currentCategory);
        }

        const expenseUUID = expense.id;
        let currentExpense = _.find(currentCategory.widgets, _.matchesProperty('uuid', expenseUUID));

        if (currentExpense === undefined) {
            currentExpense = {
                'id': expense.id,
                'expense': expense.expense,
                'amount': expense.amount,
                'paid': expense.paid
            }

        }

        currentCategory.expenses.push(currentExpense);
    });
    // });

    return destination;
}

module.exports = {
    postMonth,
    getMyMonthList,
    getIndividualMonth,
    updateMonth,
    deleteMonth,
    getMonthDetails
}