const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];

    if (accessToken === null) return res.status(401);

    jwt.verify(accessToken, process.env.JWT_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: 'Forbidden',
                error: err
            });
        }
        req.user = user;
        next();
    });
}

module.exports = {
    authenticateToken
}