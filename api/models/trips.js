const mongoose = require('mongoose');

const tripSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    // sourceLat:{ type:Number, required:true},
    // sourceLog:{ type:Number,required:true},
    // destinationLat:{type:Number,required:true},
    // destinationLog:{type:Number,required:true},
    sourceLocation:{
        type:{
            type:String,
            enum:['Point'],
            default:"Point"
        },
        coordinates:{
            type:[Number],
            required: true
        }
    },
    destinationLocation:{
        type:{
            type:String,
            enum:['Point'],
            default:"Point"
        },
        coordinates:{
            type:[Number],
            required: true
        }
    },
    price: { type: Number, required: true },
});

tripSchema.index({sourceLocation:"2dsphere",destinationLocation:"2dsphere"});

module.exports = mongoose.model('Trip', tripSchema);