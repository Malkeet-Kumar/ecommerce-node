// const fs = require('fs');
// const path = require('path')
// const {v4:uuid} = require('uuid')
// const db = require("../E_commerce/models/db")
// let data;

// db.query(`LOAD DATA INFILE 'C:/Users/Aniket/Desktop/NodeJs_Projects/E_commerce/a.csv'
// INTO TABLE products
// FIELDS TERMINATED BY '|||'
// LINES TERMINATED BY '\n'`, (err, res) => {
//     if (err) {
//         console.error(`Error: ${err.code} - ${err.message}`);
//     } else {
//         console.log("Query executed successfully.");
//     }
// });

//     })
// })



// try {
//     for(let i=0;i<5000;i++){
//         data = `${uuid()},product name ${i},random description here,1000,100,https://loremflickr.com/320/240\n`
//         fs.appendFile(path.resolve("a.csv"),data,(err)=>{
//             if(err){
//                 console.log(err);
//             }
//             console.log("row created");
//         })
//     } 
// } catch (error) {
//     console.log(error);
// }


// const url = 'https://axesso-walmart-data-service.p.rapidapi.com/wlm/walmart-search-by-keyword?keyword=Lego%20Star%20Wars&page=1&sortBy=best_match';
// const options = {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Key': 'bd4331292bmsh431098282458a06p11b367jsn8ed7421342f3',
// 		'X-RapidAPI-Host': 'axesso-walmart-data-service.p.rapidapi.com'
// 	}
// };

// async function getData(){
//     try {
//         const response = await fetch(url, options);
//         const result = await response.json();
//         console.log(result);
//     } catch (error) {
//         console.error(error);
//     }
// }
// getData();


// const fs = require('fs')
// // const {convertFile} = require('xlsx-to-csv')
// // // Convert your file
// // const { filePath } = convertFile('./aa.xls')
// // console.log(filePath)

// // Read the converted file
// const csvData = fs.readFileSync('./aa.csv')

// // Display the data
// console.log(csvData);

const { config } = require('dotenv');
const {Client} = require('pg');
const client = new Client({
    connectionString:"postgres://ecom_6njq_user:Ks6yHIiV8kQFVMg1CrZGLl3Uqdf0Sx1P@dpg-ckqlgrhrfc9c739l3dcg-a.oregon-postgres.render.com/ecom_6njq",
    ssl:true
})

client.connect()
.then((result) => {
   console.log("make",result);
}).catch((err) => {
    console.log("Open",err);
});

const ecom_users = `
CREATE TABLE ecom_users (
    id VARCHAR(250) PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50),
    gender CHAR(1),
    mobile BIGINT,  
    isVerified BOOLEAN,
    role VARCHAR(50),
    password VARCHAR(255)
);`

const insertEcomUsers = `
INSERT INTO ecom_users (id, name, email, gender, mobile, isVerified, role, password) VALUES
('99b638bb-ee94-4de3-affb-6ba223e39443', 'Malkeet', 'aniketkashyap321@gmail.com', 'M', 1234567890, true, 'user', '1234567890'),
('99b638bb-ee94-4de4-affb-6ba223e39443', 'Aniket', 'aniketkashyap321+admin@gmail.com', 'M', 1234567890, true, 'admin', 'admin@123'),
('b0196464-e91e-4ea5-b1f1-da564e5c4fed', 'mukesh', 'mukeshdhiman0309@gmail.com', 'M', 2147483647, true, 'user', 'Login@1234'),
('bf9d47f7-0d5f-4f32-bc91-f2d0d4f8897f', 'Qwerty ', 'sahilranag123@gmail.com', 'M', 1234567891, true, 'user', 'Ab@12345');`

const orders = `
CREATE TABLE orders (
    order_id VARCHAR(255) PRIMARY KEY NOT NULL,
    p_id VARCHAR(255),
    u_id VARCHAR(255),
    bill INT,
    shipping_address VARCHAR(255),
    placed_on DATE,
    delivery_date DATE,
    payment_status VARCHAR(255),
    status VARCHAR(255),
    seller_id VARCHAR(255),
    order_quantity INT,
    payment_mode VARCHAR(255),
    reason VARCHAR(255),
    cancellation_date DATE,
    city VARCHAR(255),
    pincode VARCHAR(255)
  );`

const q2 = `
ALTER TABLE trackorders
ADD CONSTRAINT fk_shipper1_id
FOREIGN KEY (shipper1_id)
REFERENCES shippers (shipper_id);

ALTER TABLE trackorders
ADD CONSTRAINT fk_shipper2_id
FOREIGN KEY (shipper2_id)
REFERENCES shippers (shipper_id);

ALTER TABLE trackorders
ADD CONSTRAINT fk_oid
FOREIGN KEY (oid)
REFERENCES orders (order_id);

ALTER TABLE trackorders
ADD CONSTRAINT fk_deliveryPerson_id
FOREIGN KEY (deliveryPerson_id)
REFERENCES deliverypersons (delp_id);
`

const qry = `select * from trackorders`

client.query(q2,(err, data)=>{
    if(err)
        console.log(err);
    else
        console.log(data);
})

// client.end()
// .then((result) => {
//     console.log("Connection end",result);
// }).catch((err) => {
//     console.log("Close",err);
// });

