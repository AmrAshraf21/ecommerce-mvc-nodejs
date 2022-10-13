const express = require('express');
const app = express();


app.use('/users',(req,res,next)=>{
    console.log("hello from assignment2 users");
    res.send('<p>Hello from users</p>')
})

app.use('/',(req,res)=>{
    console.log("Hello from Home");
    res.send('<p>Hello from home</p>');
})
app.listen(5000)