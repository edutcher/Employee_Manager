const express = require('express');
const path = require('path');
const api = require('./routes/api/apiRoutes');
const html = require('./routes/html/htmlRoutes');

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api);
app.use('/', html);

app.listen(process.env.PORT || 3000, () => { console.log('Listening'); });