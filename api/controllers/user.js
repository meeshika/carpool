const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//require("dotenv").config();

const User = require("../models/user");

exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        console.log(user[0].email);
        return res.status(409).json({
          message: "Mail exists",
         // useremail: req.body.email
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
              mess : "hashing "
            });
          }
           else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              name:req.body.name,
              email: req.body.email,
              password: hash,
              phoneNo:req.body.phoneNo,
              address:req.body.address,
              vehicleRegistrationNo: req.body.vehicleRegistrationNo,
              carMakeModel:req.body.carMakeModel,
              emergencyEmail1: req.body. emergencyEmail1,
              emergencyEmail2:req.body. emergencyEmail2
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err,
                  mess : " user creation"
                });
              });
          }
        });
      }
    });
};

exports.user_login = (req, res, next) => {
  console.log("here are we in login");
  console.log(req.body.email);
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "user doesnot exists!!"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          console.log(req.body.email);

          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            "jwtkey",
            {
              expiresIn: "24h"
            }
          );
          console.log(req.body.email);
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        console.log(req.body.email);

        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};


exports.user_delete = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

