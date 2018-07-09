const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
