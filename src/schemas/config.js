const {Schema, model} = require('mongoose')

const configSchema = new Schema({
    _id: Schema.Types.ObjectId,
    isOgPeriod: {type: Boolean, default: true},
    lastBlockNumber: {type: Number, required: false, default: 
        22930484},
    isNewPlayerNotification: {type: Boolean, default: true},
    notificationChannelId: {type: String, require: false},
    ogRoleId: {type: String, require: false},
    rpc: {type: String,  require: false, default: "https://bscrpc.com"},
    launchCount: {type: Number,  require: false, default: 0}
})

module.exports = model("Config", configSchema, "config");