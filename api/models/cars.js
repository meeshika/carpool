const mongoose = require('mongoose');

const carSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User',// required: true
 },
    carSeats: { type: Number, default: 1 },
    numberPlate:{ type:String,required:true}
});

module.exports = mongoose.model('Car', carSchema);