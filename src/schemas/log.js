const {Schema, model} = require('mongoose')

const logSchema = new Schema({
    _id: Schema.Types.ObjectId,
   hash: {type: String, require: true},
   blockNumber: {type: Number, require: true},
   from: {type: String, require: true},
   to: {type: String, require: true},
   amount : {type: String, require: true},
})

module.exports = model("Log", logSchema, "logs");