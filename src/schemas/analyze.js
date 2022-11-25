const {Schema, model} = require('mongoose')

const analyzeSchema = new Schema({
    _id: Schema.Types.ObjectId,
    lastBlockNumber: {type: Number, required: true},
})

module.exports = model("Analyze", analyzeSchema, "analyze");