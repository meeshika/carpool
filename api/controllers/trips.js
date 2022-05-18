const mongoose = require("mongoose");
const Trip2 = require("../models/trips3");
const user = require("../models/user");

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

exports.trip_get_trip = (req, res, next) => {
  Product.find("slat slong dlat dlong")
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
  console.log({"body":req.body});
  const nsth = parseInt(req.body.startTimeh);
  const nstm = parseInt(req.body.startTimem);
  const neth = parseInt(req.body.endTimeh);
  
  const netm = parseInt(req.body.endTimem);
  const nst = nsth* 100 + nstm;
  const net = neth*100 + netm;
  const td = parseInt(req.body.tripDate);
  const cs = parseInt(req.body.carSeats);
  let a = -1;
  user.find({email : req.body.email}).exec().then(users => {
    if(users.length == 0){
      a = 0;
      return res.status(503).json({
        message: "Not a valid user!"})
    }
  else{
  Trip2.find({ email: req.body.email , tripDate: td })
    .exec()
    .then(trip => {
      // console.log("this is already in data base");
      // console.log(trip[0]);
      // console.log("hey there");
      let c = 0;
      if (trip.length >= 1){
        for ( t in trip){
          if((nst < net)&&(!(t.startTime >= net || nst >= t.endTime))){
             c = 1;
             break;
          }
        }
      }
      var d = new Date(); // for now
      var h = d.getHours(); 
      var m = d.getMinutes();
      var x = h*100+m;
      var date = (d.getFullYear())*10000+(d.getMonth()+1)*100+d.getDate();
      console.log(date);
      if((c==0)&& nst >= net){
             c = 2;
            // break;
      }
      else if ((c == 0)&& td == date && x > nst){ c=3;}
       if( c == 3){
        {return res.status(501).json({
          message: "Can not book ride in past!"}
        );}
      }
      else if(c==1)
        {return res.status(409).json({
          message: "you have already published a ride in this duration!"}
        );}
      else if( c == 2){
          {return res.status(502).json({
            message: "Check your trip's end time and start time!"}
          );}
        }
      // else if( c == 3){
      //   {return res.status(501).json({
      //     message: "Can not book ride in past!"}
      //   );}
      // }
      else{
          const trip = new Trip2({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            carRegistrationNo: req.body.carRegistrationNo,
           // price: req.body.price,
           carSeats:cs,
            //sourceLocation:{
             // coordinates:{
                slatitude:parseFloat(req.body.slatitude),
                slongitude:parseFloat(req.body.slongitude),
            //  }
            //},
           // destinationLocation:{
            //  coordinates:{
                dlatitude:parseFloat(req.body.dlatitude),
                dlongitude:parseFloat(req.body.dlongitude),
            //  }
           // },
            startTime:nst,
            endTime:net,
            tripDate:td
          });
          trip
          .save()
          .then(result => {
            console.log(result);
            res.status(201).json({
              message: "published trip successfully",
              createdProduct: {
                name: result.name,
              //  price: result.price,
                _id: result._id,
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
        }
      });
    }
  })
    }

    //     }).catch(err => {
    //         console.log(err);
    //         res.status(500).json({
    //           error: err
    //         });
    //       });
    //     };
    //   });
    // };


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
