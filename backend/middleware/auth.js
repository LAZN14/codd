const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null
        
        if (!token) {
            return res.status(401).json({ error: 'Токен доступа отсутствует' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Недействительный токен' });
    }
};

module.exports = auth;