const models = require('../models');
const bcrypt = require('bcrypt-nodejs');
const debug = require('debug')('server');
const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const Validator = require("fastest-validator");

function postCategories(req, res) {
    const category = {
        name: req.body.name,
        description: req.body.description,
        user_id: req.user.userId
    };

    const schema = {
        name: { type: "string", optional: false, min: 3, max: 100 },
        description: { type: "string", optional: false, min: 3, max: 250 }
    };

    const v = new Validator();

    const validatorResponse = v.validate(category, schema);

    if (validatorResponse !== true) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validatorResponse
        });
    }

    models.categories.create(category).then(result => {
        res.status(201).json({
            message: 'Category created',
            category: result
        })
    }).catch(error => {
        res.status(500).json({
            message: 'Something Went Wrong',
            error: error
        });
    });
}

function getMyCategoryList(req, res) {
    return models.categories.findAll({ where: { user_id: req.user.userId } }).then(categories => {
        if (categories) {
            res.status(200).json({
                message: 'Categories fetched succeesfully',
                postList: categories
            })
        } else {
            res.status(200).json({
                message: 'No categories yet',
                postList: categories
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something Went Wrong',
            error: err
        });
    });
}

function getIndividualCategory(req, res) {
    return models.categories.findOne({ where: { id: req.params.id, user_id: req.user.userId } }).then(category => {
        if (category) {
            res.status(200).json({
                message: 'Category fetched succeesfully',
                category: category
            })
        } else {
            res.status(200).json({
                message: 'No data for the user',
                category: category
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something Went Wrong',
            error: err
        });
    });
}

function updateCategory(req, res) {
    return models.categories.findOne({ where: { id: req.params.id, user_id: req.user.userId }, limit: 1 }).then(category => {
        if (category) {
            let categoryData = {
                name: req.body.name,
                description: req.body.description
            };

            const schema = {
                name: { type: "string", optional: false, min: 3, max: 100 },
                description: { type: "string", optional: false, min: 3, max: 250 }
            };

            const v = new Validator();

            const validatorResponse = v.validate(categoryData, schema);

            if (validatorResponse !== true) {
                return res.status(400).json({
                    message: "Validation failed",
                    errors: validatorResponse
                });
            }
            return category.update(categoryData).then(response => {
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
                message: 'No category',
                response: category
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something went wrong',
            err: err
        });
    });
}

function deleteCategory(req, res) {
    return models.categories.destroy({ where: { id: req.params.id, user_id: req.user.userId }, limit: 1 }).then(category => {
        if (category) {
            res.status(200).json({
                message: 'Deleted successfully',
                response: category
            });
        } else {
            res.status(200).json({
                message: 'No category',
                response: category
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
    postCategories,
    getMyCategoryList,
    getIndividualCategory,
    updateCategory,
    deleteCategory
}