const mongoose = require('mongoose');

const tripSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },

    sourceLocation:{
        type:{
            //type:String,
            //enum:['Point'],
            // default:"Point",
            coordinates:{
                type:{
                slatitude:{ type:Number, required : true},
                slongitude:{ type:Number, required : true}
                }
                // type:[Number],
                // required: true
            }
        },
       
    },
    destinationLocation:{
        type:{
            //type:String,
            //enum:['Point'],
            //default:"Point",
            coordinates:{
                type:{
                dlatitude:{ type:Number, required : true},
                dlongitude:{ type:Number, required : true}
                }
                // type:[Number],
                // required: true
            }
        },
       
    },
    // destinationLocation:{
    //     type:{
    //         type:String,
    //         enum:['Point'],
    //         default:"Point"
    //     },
    //     coordinates:{
    //         type:[Number],
    //         required: true
    //     }
    // },
    price: { type: Number, required: true },
});

//tripSchema.index({sourceLocation:"2dsphere",destinationLocation:"2dsphere"});

module.exports = mongoose.model('Trip', tripSchema);