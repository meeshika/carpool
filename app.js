const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const tripRoutes = require("./api/routes/trips");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require('./api/routes/user');

mongoose.connect(
  "mongodb+srv://meeshika2:meeshika@cluster0.guftx.mongodb.net/db36?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },err => {
  if(err) throw err;
  console.log('Connected to MongoDB!!!')
  }
);
mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/trips", tripRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);
app.get("/",(req,res)=>{
  return res.status(200).json({message:"api connected succefully"})
})

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});


app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
