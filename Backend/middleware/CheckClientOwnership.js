const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');

const checkClientOwnership = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        const err = new CustomError('Invalid ID', 400);
        return next(err);
    }

    if (id.toString() !== req.user.id.toString()) {
        const err = new CustomError('Unauthorized access', 401);
        return next(err);
    }

    next(); 
});

module.exports = checkClientOwnership;
