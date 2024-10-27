const jwt = require('jsonwebtoken');
const CustomError = require('../util/CustomError');
const asyncErrorHandler = require('../util/asyncErrorHandler');
const utilMoment = require('../util/Moment');
const moment = require('moment');
const { readDatabase } = require('../config/db.js');

const requireAuth = asyncErrorHandler(async (req, res, next) => {
    const {authorization} = req.headers;
    if(!authorization || !authorization.startsWith('Bearer ')){
        const err = new CustomError('authorization token is required', 401);
        return next(err);
    }
    const token = authorization.split(' ')[1];

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
        const error = new CustomError('Invalid or expired token. Please log in again.', 401);
        return next(error);
    }

    const { id, role, exp } = decodedToken;
    
    const currentTime = utilMoment.getCurrentDateTime();
    if (currentTime.isSameOrAfter(exp * 1000)) {
        const err = new CustomError('Token has expired. Please log in again.', 401);
        return next(err);
    }

    const dbData = readDatabase();
    const user = dbData.users.find(u => u.id === id);

    if (!user) {
        return next(new CustomError('Authentication rejected: user not found', 401));
    }

    //check if user is still active
    if(user.role == 'client'){
        const endTime = moment(user.endTime, "HH:mm:ss");
        const startTime = moment(user.startTime, "HH:mm:ss");

        if (currentTime.isBefore(startTime) || currentTime.isSameOrAfter(endTime)) {
            return next(new CustomError('Authentication rejected: user is not active', 401));
        }
    }

    req.user = user;

    next();
});
module.exports = requireAuth;