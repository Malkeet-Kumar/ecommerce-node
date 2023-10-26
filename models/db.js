const mysql = require('mysql2');
const {Client} = require('pg');

/* local xampp server */
module.exports = mysql.createConnection({
    uri: 'mysql://root:@localhost:3306/ECOM'
})

/* railcay app server */
// module.exports = mysql.createConnection({
//    uri:'mysql://root:mW8SX26YkGYsDw8q70B7@containers-us-west-54.railway.app:7764/railway'
// })

/* Render External db */
// module.exports = new Client({
//     connectionString:"postgres://ecom_6njq_user:Ks6yHIiV8kQFVMg1CrZGLl3Uqdf0Sx1P@dpg-ckqlgrhrfc9c739l3dcg-a.oregon-postgres.render.com/ecom_6njq",
//     ssl:true
// })
