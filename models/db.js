const mysql = require('mysql2');
const {Client} = require('pg');

/* local xampp server */
module.exports = mysql.createConnection({
    uri: process.env.MYSQL_LOCAL
})

// /* railcay app server */
// module.exports = mysql.createConnection({
//    uri: process.env.MYSQL_RAILWAY
// })

// /* Render External db */
// module.exports = new Client({
//     connectionString: process.env.POSTGRESQL_RENDER,
//     ssl: true
// })
