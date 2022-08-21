const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '\\.env' });

module.exports = {
    port: process.env.PORT,
    db_name: process.env.DB_NAME,
    db_password: process.env.DB_PASSWORD,
    api_key: process.env.API_KEY,
    domain: process.env.DOMAIN
};