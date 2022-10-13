const express = require('express');
const path = require('path');
const app = express();
const oneRouter = require('./routes/one')
const twoRouter = require('./routes/two')

app.use(express.static(path.join(__dirname , "public")))
app.use(oneRouter)
app.use(twoRouter)


app.listen(7000);

