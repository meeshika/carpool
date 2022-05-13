const mongoose = require("mongoose");
const Trip = require("../models/trips");

exports.trips_get_all = (req, res, next) => {
  Product.find()
    .select("name price _id source destination")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        trips: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            source:doc.source,
            destination:doc.destination,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id
            }
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.trips_create_trip = (req, res, next) => {
  const trip = new Trip({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    sourceLocation:{
      coordinates:[
        req.body.slatitude,
        req.body.slongitude
      ]
    },
    destinationLocation:{
      coordinates:[
        req.body.dlatitude,
        req.body.dlongitude
      ]
    }
    // sourceLat:req.body.sourceLat,
    // sourceLog:req.body.source.Log,
    // destinationLat:req.body.destinationLat,
    // destinationLog:req.body.destinationLog
  });
  trip
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          // sourceLat:req.body.sourceLat,
          // sourceLog:req.body.source.Log,
          // destinationLat:req.body.destinationLat,
          // destinationLog:req.body.destinationLog,
          //source:result.source,
          //destination:result.destination,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.trips_get_trips = (req, res, next) => {
  // const id = req.params.tripId;
  // const sourceLat = req.params.sourceLat;
  // const sourceLog = req.params.sourceLog;
  // const destinationLat = req.params.desinationLat;
  // const destinationLog = req.params.destinationLog;
  Trip.find({
    sourceLocation:{
      $near:{
        type:"Point",
        coordinates:[
          req.body.slat,
          req.body.slang
        ]
      },
      $maxdistance: 1000*1000
    },
    destinationLocation:{
      $near:{
        type:"Point",
        coordinates:[
          req.body.dlat,
          req.body.dlang
        ]
      },
      $maxdistance: 1000*1000
    },
    
  })
    .select("name price _id source destination")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          trip: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/products"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.trip_update_trip = (req, res, next) => {
  const id = req.params.tripId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Trip.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.trip_delete = (req, res, next) => {
  const id = req.params.tripId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/products",
          body: { name: "String", price: "Number" }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
