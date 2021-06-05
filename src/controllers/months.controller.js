const models = require('../models');
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
    return models.months.findAll({
        where: {
            user_id: req.user.userId
        },
        include: [{
            model: models.expenses, as: 'expenses',
            attributes: ['expense', 'amount']
        },{
            model: models.incomes, as: 'incomes',
            attributes: ['income', 'amount']
        }]
    }).then(months => {
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

module.exports = {
    postMonth,
    getMyMonthList,
    getIndividualMonth,
    updateMonth,
    deleteMonth,
    getMonthDetails
}