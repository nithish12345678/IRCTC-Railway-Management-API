const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',   // Set your MySQL user here
    password: '',   // Set your MySQL password here, if applicable
    database: 'irctc'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Database connected!');
});

module.exports = connection;
