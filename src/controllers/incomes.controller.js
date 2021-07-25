const models = require('../models');
const bcrypt = require('bcrypt-nodejs');
const debug = require('debug')('server');
const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const Validator = require("fastest-validator");

function postIncome(req, res) {
    const incomeReq = {
        income: req.body.income,
        amount: req.body.amount,
        user_id: req.user.userId,
        month_id: req.body.month_id
    };

    const schema = {
        income: { type: "string", optional: false, min: 3, max: 100 },
        amount: { type: "string", optional: false, min: 3, max: 100 },
        month_id: { type: "number", optional: false }
    };

    const v = new Validator();

    const validatorResponse = v.validate(incomeReq, schema);

    if (validatorResponse !== true) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validatorResponse
        });
    }

    models.incomes.create(incomeReq).then(result => {
        res.status(201).json({
            message: 'Incomes created',
            income: result
        })
    }).catch(error => {
        res.status(500).json({
            message: 'Something Went Wrong',
            error: error
        });
    });
}

function getMyIncomeList(req, res) {
    return models.incomes.findAll({ where: { user_id: req.user.userId } }).then(incomes => {
        if (incomes) {
            res.status(200).json({
                message: 'Incomes fetched succeesfully',
                incomeList: incomes
            })
        } else {
            res.status(200).json({
                message: 'No incomes yet',
                incomeList: incomes
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something Went Wrong',
            error: err
        });
    });
}

function getIndividualIncome(req, res) {
    return models.incomes.findOne({ where: { id: req.params.id, user_id: req.user.userId } }).then(incomeRes => {
        if (incomeRes) {
            res.status(200).json({
                message: 'Income fetched succeesfully',
                income: incomeRes
            })
        } else {
            res.status(200).json({
                message: 'No data for the user',
                income: incomeRes
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something Went Wrong',
            error: err
        });
    });
}

function updateIncome(req, res) {
    return models.incomes.findOne({ where: { id: req.params.id, user_id: req.user.userId }, limit: 1 }).then(incomeRes => {
        if (incomeRes) {
            let incomeData = {
                income: req.body.income,
                amount: req.body.amount
            };

            const schema = {
                income: { type: "string", optional: false, min: 3, max: 100 },
                amount: { type: "string", optional: false, min: 3, max: 100 }
            };

            const v = new Validator();

            const validatorResponse = v.validate(incomeData, schema);

            if (validatorResponse !== true) {
                return res.status(400).json({
                    message: "Validation failed",
                    errors: validatorResponse
                });
            }
            return incomeRes.update(incomeData).then(response => {
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
                message: 'No income',
                response: incomeRes
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something went wrong',
            err: err
        });
    });
}

function deleteIncome(req, res) {
    return models.incomes.destroy({ where: { id: req.params.id, user_id: req.user.userId }, limit: 1 }).then(incomeRes => {
        if (incomeRes) {
            res.status(200).json({
                message: 'Deleted successfully',
                response: incomeRes
            });
        } else {
            res.status(200).json({
                message: 'No income',
                response: incomeRes
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
    postIncome,
    getMyIncomeList,
    getIndividualIncome,
    updateIncome,
    deleteIncome
}