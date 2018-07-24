const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const logger = require('morgan');

const CONFIG = require('./config/config');
const app = express();
const cron = require('./cronjob/cronjob');
const authRouter = require('./routes/auth');
const cronJobRouter = require('./routes/cronjob');
const marketsRouter = require('./routes/markets');
const marketAdminsRouter = require('./routes/marketadmins');
const merchantsRouter = require('./routes/merchants');
const productTypesRouter = require('./routes/productTypes');
const indexRouter = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/cronjob', cronJobRouter);
app.use('/markets', marketsRouter);
app.use('/marketadmins', marketAdminsRouter);
app.use('/merchants', merchantsRouter);
app.use('/producttypes', productTypesRouter);
app.use('/', indexRouter);

//
cron.job.start();

app.listen(CONFIG.PORT, () =>
  console.log(`Server started on port: ${CONFIG.PORT}`)
);
