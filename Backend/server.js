require('dotenv').config();

const express = require('express');
const path = require('path');
//error handler
const ErrorHandler = require('./controllers/ErrorController');
//security
const cors = require('cors');
//routes]
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');


//http server
const http = require('http');
const port = process.env.PORT || 8080;

//express app
const app = express();
const server = http.createServer(app);

//midlewares
//cors
app.use(cors());
//static files
app.use('/files', express.static('./files'));
//body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: false }));

//routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


//error handling
app.use(ErrorHandler);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});