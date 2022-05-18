const mongoose = require('mongoose');

const trip2Schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, required: true },
    carRegistrationNo:{type: String,required:true},
    carSeats:{type:Number,required:true},
    sourceLocation:{
        type:{
            coordinates:{
                type:{
                slatitude:{ type:Number, required : true},
                slongitude:{ type:Number, required : true}
                }
            }
        },
       
    },
    destinationLocation:{
        type:{
            coordinates:{
                type:{
                dlatitude:{ type:Number, required : true},
                dlongitude:{ type:Number, required : true}
                }
            }
        },
       
    },
    startTime:{
        type:Number,
        required:true,
    },
    endTime:{
        type:Number,
        required:true,
    },
    tripDate:{
        type:Number,
        required:true
    },
   // price: { type: Number, required: true },
});


module.exports = mongoose.model('Trip2', trip2Schema);