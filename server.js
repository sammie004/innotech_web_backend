const express = require('express');
const cors = require('cors');
const app = express();

const routes = require('./routes/routes');
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);
app.get('/',(req,res)=>{
    res.send("Welcome to the Innotech API");
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})