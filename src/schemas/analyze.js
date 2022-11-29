const {Schema, model} = require('mongoose')

const analyzeSchema = new Schema({
    _id: Schema.Types.ObjectId,
    lastBlockNumber: {type: Number, required: false, default: 
        22930484},
})

module.exports = model("Analyze", analyzeSchema, "analyze");