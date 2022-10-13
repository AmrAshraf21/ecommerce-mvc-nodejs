// const mysql = require("mysql2");
// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "node-complete",
//   password: "amr2242001",
// });

// module.exports = pool.promise();

// const { Sequelize } = require('sequelize');
// const sequelize = new Sequelize('node-complete' , 'root' , 'amr2242001',{
//     dialect:'mysql',
//     host:'localhost'
// })

// module.exports = sequelize;


const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db ;

const mongoConnect = (callback)=>{
    MongoClient.connect('mongodb+srv://amr:amr2242001@cluster0.wdl7qor.mongodb.net/shop?retryWrites=true&w=majority')
    .then(client =>{
        console.log('Connected');
        _db = client.db();
        callback()
    })
    .catch(err=>{
    console.log(err)
    throw err;
    })
}
const getDb = ()=>{
    if(_db){
        return _db
    }
    throw "No Database Found"
}

module.exports = {
    mongoConnect,
    getDb,
}