const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const { readDatabase, writeDatabase } = require('../config/db.js');

const getAllClients = asyncErrorHandler(async (req, res, next) => {
    const dbData = readDatabase();
    const users = dbData.users || [];

    const clients = users.filter(u => u.role === 'client');

    if (clients.length <= 0) {
        return next(new CustomError('No clients found', 404));
    }
    res.status(200).json(clients);
});

const getClient = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const dbData = readDatabase();
    const users = dbData.users || [];

    const client = users.find(u => u.id == id && u.role === 'client');

    if (!client) {
        return next(new CustomError('Client not found', 404));
    }
    res.status(200).json(client);
});

const getAllAdmins = asyncErrorHandler(async (req, res, next) => {
    const dbData = readDatabase();
    const users = dbData.users || [];

    const admins = users.filter(u => u.role === 'admin');

    if (admins.length <= 0) {
        return next(new CustomError('No admins found', 404));
    }
    res.status(200).json(admins);
});

const getAdmin = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const dbData = readDatabase();
    const users = dbData.users || [];

    const admin = users.find(u => u.id == id && u.role === 'admin');

    if (!admin) {
        return next(new CustomError('Admin not found', 404));
    }
    res.status(200).json(admin);
});


module.exports = {
    getAllClients,
    getClient,
    getAllAdmins,
    getAdmin
};