const models = require('../models');
const bcrypt = require('bcrypt-nodejs');
const debug = require('debug')('server');
const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const Validator = require("fastest-validator");

function postExpense(req, res) {
    const expenseReq = {
        expense: req.body.expense,
        amount: req.body.amount,
        user_id: req.user.userId,
        category_id: req.body.category_id,
        month_id: req.body.month_id,
        paid: req.body.paid
    };

    const schema = {
        expense: { type: "string", optional: false, min: 3, max: 100 },
        amount: { type: "string", optional: false, min: 3, max: 100 },
        category_id: { type: "number", optional: false },
        month_id: { type: "number", optional: false }
    };

    const v = new Validator();

    const validatorResponse = v.validate(expenseReq, schema);

    if (validatorResponse !== true) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validatorResponse
        });
    }

    models.expenses.create(expenseReq).then(result => {
        res.status(201).json({
            message: 'Expenses created',
            expense: result
        })
    }).catch(error => {
        // console.log(error);
        res.status(500).json({
            message: 'Something Went Wrong',
            error: error
        });
    });
}

function getMyExpenseList(req, res) {
    return models.expenses.findAll({ where: { user_id: req.user.userId } }).then(expenses => {
        if (expenses) {
            res.status(200).json({
                message: 'Expenses fetched succeesfully',
                incomeList: expenses
            })
        } else {
            res.status(200).json({
                message: 'No expenses yet',
                incomeList: expenses
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something Went Wrong',
            error: err
        });
    });
}

function getIndividualExpense(req, res) {
    return models.expenses.findOne({ where: { id: req.params.id, user_id: req.user.userId } }).then(expenseRes => {
        if (expenseRes) {
            res.status(200).json({
                message: 'Expenses fetched succeesfully',
                expense: expenseRes
            })
        } else {
            res.status(200).json({
                message: 'No data for the user',
                expense: expenseRes
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something Went Wrong',
            error: err
        });
    });
}

function updateExpense(req, res) {
    return models.expenses.findOne({ where: { id: req.params.id, user_id: req.user.userId }, limit: 1 }).then(expenseRes => {
        if (expenseRes) {
            let expenseData = {
                expense: req.body.expense,
                amount: req.body.amount,
                category_id: req.body.category_id,
                paid: req.body.paid
            };

            const schema = {
                expense: { type: "string", optional: false, min: 3, max: 100 },
                amount: { type: "string", optional: false, min: 3, max: 100 },
                category_id: { type: "number", optional: false }
            };

            const v = new Validator();

            const validatorResponse = v.validate(expenseData, schema);

            if (validatorResponse !== true) {
                return res.status(400).json({
                    message: "Validation failed",
                    errors: validatorResponse
                });
            }
            return expenseRes.update(expenseData).then(response => {
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
                message: 'No expense',
                response: expenseRes
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something went wrong',
            err: err
        });
    });
}

function deleteExpense(req, res) {
    return models.expenses.destroy({ where: { id: req.params.id, user_id: req.user.userId }, limit: 1 }).then(expenseRes => {
        if (expenseRes) {
            res.status(200).json({
                message: 'Deleted successfully',
                response: expenseRes
            });
        } else {
            res.status(200).json({
                message: 'No expense',
                response: expenseRes
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something went wrong',
            err: err
        });
    });
}

module.exports = {
    postExpense,
    getMyExpenseList,
    getIndividualExpense,
    updateExpense,
    deleteExpense
}