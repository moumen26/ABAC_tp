const CustomError = require('../util/CustomError.js');
const JWT = require('../util/JWT.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const bcrypt = require('bcrypt');
const { readDatabase, writeDatabase } = require('../config/db.js');
const moment = require('moment');
const utilMoment = require('../util/Moment');

const signin = asyncErrorHandler(async (req, res, next) => {
    const { username, password } = req.body;
    //check if all fields are provided
    if (!username || !password) {
        const err = new CustomError('All fields are required', 400);
        return next(err);
    }
    const dbData = readDatabase();
    const users = dbData.users || [];

    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (!user) {
        const err = new CustomError('Invalid username or password', 400);
        return next(err);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        const err = new CustomError('Invalid username or password', 400);
        return next(err);
    }

    if(user.role == 'client'){
        const currentTime = utilMoment.getCurrentDateTime();
        const endTime = moment(user.endTime, "HH:mm:ss");
        const startTime = moment(user.startTime, "HH:mm:ss");

        if (currentTime.isBefore(startTime) || currentTime.isSameOrAfter(endTime)) {
            return next(new CustomError('You are not allowed to login at this time', 400));
        }
    }
  
    const token = JWT.createToken(user.id, user.role);

    res.status(200).json({
        profile: user,
        token: token
    });
});

const signup = asyncErrorHandler(async (req, res, next) => {
    const { username, password, role, startTime, endTime } = req.body;
    //check if all fields are provided
    if (!username || !password || !role || !startTime || !endTime) {
        const err = new CustomError('All fields are required', 400);
        return next(err);
    }
    const dbData = readDatabase();
    const users = dbData.users || [];

    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        const err = new CustomError('Username already exists', 400);
        return next(err);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser = null;
    if (role.toLowerCase() == 'admin'){
        newUser = {
            id: users.length + 1,
            username: username.toString().toLowerCase(),
            password: hashedPassword.toString(),
            role: role.toString().toLowerCase(),
        };
    }else if (role.toLowerCase() == 'client'){
        const start = moment(startTime, "HH:mm:ss");
        const end = moment(endTime, "HH:mm:ss");
        if (start.isAfter(end)) {
            const err = new CustomError('Invalid start and end time', 400);
            return next(err);
        }
        newUser = {
            id: users.length + 1,
            username: username.toString().toLowerCase(),
            password: hashedPassword.toString(),
            role: role.toString().toLowerCase(),
            startTime: startTime,
            endTime: endTime
        };
    }
    
    if (!newUser) {
        const err = new CustomError('Invalid role', 400);
        return next(err);
    }

    users.push(newUser);

    dbData.users = users;
    writeDatabase(dbData);

    res.status(200).json({ message: 'User registered successfully' });
});

module.exports = {
    signin,
    signup
};