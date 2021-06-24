const models = require('../models');
const bcrypt = require('bcrypt-nodejs');
const debug = require('debug')('server');
const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const Validator = require("fastest-validator");

function postUsers(req, res) {

    models.users.findOne({ where: { email: typeof req.body.email !== 'undefined' ? req.body.email : '' }, limit: 1 }).then(user => {
        if (user) {
            return res.status(409).json({
                message: "The email already exists"
            });
        } else {
            bcrypt.hash(req.body.password, bcrypt.genSaltSync(10), null, (err, hash) => {
                console.log(err)
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = {
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                        status: 1
                    };

                    const schema = {
                        name: { type: "string", optional: false, min: 3, max: 100 },
                        email: { type: "email", optional: false, min: 3, max: 100 },
                        password: { type: "string", optional: false, min: 6 }
                    };

                    const v = new Validator();

                    const validatorResponse = v.validate(user, schema);

                    if (validatorResponse !== true) {
                        return res.status(400).json({
                            message: "Validation failed",
                            errors: validatorResponse
                        });
                    }

                    models.users.create(user).then(result => {
                        res.status(201).json({
                            message: 'User created',
                            user: {
                                id: result.id,
                                name: result.name,
                                email: result.email,
                                status: result.status,
                                createdAt: result.createdAt,
                                updatedAt: result.updatedAt
                            }
                        })
                    }).catch(error => {
                        res.status(500).json({
                            message: 'Something Went Wrong',
                            error: error
                        });
                    });
                }
            });
        }
    });
}

function siginIn(req, res) {
    models.users.findOne({ where: { email: req.body.email }, limit: 1 }).then(user => {
        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                console.log(err, result);
                if (result) {
                    const userObj = {
                        email: user.email,
                        userId: user.id,
                        name: user.name
                    };
                    debug(chalk.green(userObj));

                    const accessToken = generateAccessToken(userObj);
                    let expireTime = new Date(new Date().setHours(new Date().getHours() + 1));
                    const refreshToken = jwt.sign(
                        userObj,
                        process.env.REFRESH_KEY
                    );
                    saveRefreshToken(req.body.email, refreshToken).then(response => {
                        return res.status(200).json({
                            message: 'Authentication successful',
                            accessToken: accessToken,
                            expireTime: expireTime,
                            response: response
                        });
                    }).catch(err => {
                        return res.status(500).json({
                            message: 'Something went wrong',
                        });
                    });

                } else {
                    return res.status(401).json({
                        message: 'Authentication failed',
                    });
                }
            });
        } else {
            res.status(401).json({
                message: 'Authentication failed',
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something Went Wrong',
            error: err
        });
    });
}

function generateAccessToken(userObj) {
    return jwt.sign(
        userObj,
        process.env.JWT_KEY,
        {
            expiresIn: "1h"
        }
    );
}

function saveRefreshToken(email, refreshToken) {
    // console.log("refreshToken: "+refreshToken);
    return models.users.findOne({ where: { email: email }, limit: 1 }).then(user => {
        if (user) {
            return user.update({
                refreshToken: refreshToken
            })
        } else {
            return 'Invalid email';
        }
    }).catch(err => {
        return err;
    });
}

function getToken(req, res) {
    const refreshToken = req.body.token;
    if (refreshToken === null) {
        res.status(401).json({
            message: 'Forbidden'
        });
    } else {
        models.users.findOne({ where: { refreshToken: refreshToken }, limit: 1 }).then(user => {
            if (user) {
                jwt.verify(refreshToken, process.env.REFRESH_KEY, (err, user) => {
                    if (err) {
                        return res.status(403).json({
                            message: 'Forbidden',
                            error: err
                        });
                    }

                    const userObj = {
                        email: user.email,
                        userId: user.id,
                        name: user.name
                    };
                    let expireTime = new Date(new Date().setHours(new Date().getHours() + 1));
                    const accessToken = generateAccessToken(userObj);

                    return res.json({
                        accessToken: accessToken,
                        expireTime: expireTime
                    });
                });
            } else {
                return res.status(403).json({
                    message: 'Forbidden',
                });
            }
        }).catch(err => {
            return res.status(500).json({
                message: 'Something Went Wrong',
                error: err
            });
        });
    }
}

function signOut(req, res) {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];
    var decoded = jwt.decode(accessToken);
    // console.log(decoded.email);
    saveRefreshToken(decoded.email, null).then(response => {
        return res.status(200).json({
            message: 'Successfully signed out',
            response: response
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Something went wrong',
        });
    })
}

async function checkUniqueEmail(req, res) {
    return models.users.count({ where: { email: req.params.email } }).then(count => {
        let isValueUnique = (count > 0) ? false : true;
        res.status(200).json({
            isValueUnique: isValueUnique
        });
    }).catch(err => {
        return err;
    });
}

async function getUserProfile(req, res) {
    return models.users.findOne({
        where: {
            id: req.user.userId
        },
        attributes: ['name', 'email']
    }).then(user => {
        if (user) {
            res.status(200).json(user);
        } else {
            return res.status(401).json({
                message: 'Authentication failed',
            });
        }
    }).catch(err => {
        return err;
    });
}

module.exports = {
    postUsers,
    siginIn,
    getToken,
    signOut,
    checkUniqueEmail,
    getUserProfile
}