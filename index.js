const express = require('express');
const path = require('path');
const moment = require('moment');
const bankMiddleware = require('./middleware/banks');
const fileReader = require('./middleware/filereader');
const reporter = require('./middleware/report');
const port = 3310;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/', express.static(path.join(__dirname, './public')));
app.get('/', (req, res) => {
     res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/current', (req, res) => {
    res.json({
        currentTime: moment().format('hh:mm:ss a').toString()
    })
});

app.get('/banks/request', bankMiddleware.usesRequest);
app.get('/banks/axios', bankMiddleware.usesAxios);
app.get('/readfile', fileReader);

app.listen(port, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.info(`We have an express powered server running on: ${port}`);
    }
});
