const mysql = require('mysql');
const express = require('express');
const app = express();
const dotenv = require("dotenv")
dotenv.config()

const connections = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

connections.connect((err)=>{
    if(err){
        console.log(`an error occured while connecting to the database: ${err.message}`);
    }else{
        console.log("connected to the database successfully");
    }
})
module.exports = connections