const JWT = require('jsonwebtoken');

//jwt secret
const createToken = (id, role) => {
    return JWT.sign(
        {
            id: id, 
            role: role
        }, 
        process.env.SECRET_KEY, 
        {
            expiresIn: '1d'
        }
    );
}

module.exports = {
    createToken
};