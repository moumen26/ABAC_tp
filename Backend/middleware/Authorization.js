const jwt = require('jsonwebtoken');
const CustomError = require('../util/CustomError');
const asyncErrorHandler = require('../util/asyncErrorHandler');

const checkAuthorization = (allowedRoles) => {
    return asyncErrorHandler(async (req, res, next) => {
        const {authorization} = req.headers;

        if (!authorization || !authorization.startsWith('Bearer ')) {
            return next(new CustomError('Authorization token is required', 400));
        }

        const token = authorization.split(' ')[1];
        
        try {
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const userRole = decodedToken.role;
            
            if (!Array.isArray(allowedRoles) ||!allowedRoles.includes(userRole)) {
                return next(new CustomError('Unauthorized access. You do not have permission to access this resource.', 403));
            }
            
            next();
        } catch (error) {
            return next(new CustomError('Invalid or expired token.', 401));
        }
    });
};

module.exports = checkAuthorization;
