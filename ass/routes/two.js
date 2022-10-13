const express = require('express');
const router = express.Router();
const path =require('path')
router.get('/two',(req,res)=>{
    res.sendFile(path.join(__dirname,"../","views","two.html"))

})

module.exports = router