const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const tripsController = require('../controllers/trips');

router.get("/", tripsController.trips_get_all);

router.get("/:slat/:slong/:dlang/:dlong", tripsController.trip_get_trip);


router.post("/",checkAuth, tripsController.trips_create_trip);

router.get("/:tripId", function(){
  tripsController.trips_get_trip});

router.patch("/:tripId", checkAuth,function(){ tripsController.trips_update_trip});

router.delete("/:tripId", checkAuth,function(){ tripsController.trips_delete});

module.exports = router;
