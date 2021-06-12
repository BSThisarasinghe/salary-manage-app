const express = require('express');
const debug = require('debug')('server');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const routes = require('./routes');

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

app.use(cors(corsOptions));

const port = process.env.PORT || 5000;

//middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/', routes);

app.get('/', (req, res) => {
    debug(chalk.green(req));
    res.send('Salary manage Backend! - GET');
});

app.post('/', (req, res) => {
    debug(chalk.green(req));
    res.send('Salary manage Backend! - POST');
});

app.listen(port, function () {
    debug(`Listening on port ${chalk.green(port)}`);
}); 