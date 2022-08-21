const mysql = require('mysql');
const { db_name, db_password } = require('./config');

const dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: db_password,
    database: db_name
});

dbConn.connect(function (error) {
    if (error) throw error;
    console.log('Database Connected Successfully!!!');
});

module.exports = dbConn;