const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const cors = require("cors");
const routes = require('./routes/route');
const app = express();

require('dotenv').config()
app.use(helmet());
app.use(compression());
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use("/uploads", express.static("./uploads"));

app.use(express.json());
app.use('/', routes);

app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/index.html');
});
app.listen(process.env.PORT)

mongoose.connect(
    process.env.MONGODB_URI,
    { 
        useFindAndModify: false, 
        useUnifiedTopology: true, 
        useNewUrlParser: true, 
        useCreateIndex: true,
        server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
        replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    },
    (err) => {
        if (err) return console.log("Error: ", err);
        console.log(
            "MongoDB Connection -- Ready state is:", 
            mongoose.connection.readyState
        );
    },
);
