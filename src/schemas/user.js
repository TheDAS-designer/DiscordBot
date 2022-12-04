const {Schema, model} = require('mongoose')

const guildSchema = new Schema({
    _id: Schema.Types.ObjectId,
    discordId: {type: String, required: false},
    discordName: {type: String, required: false},
    address: {type: String, required: false},
    roleCode: {type: Number, required: false, default: 100},
    isOG: {type: Boolean, require: false, default: false},
    isGrantOgRole: {type: Boolean, require: false, default: false},
})

module.exports = model("User", guildSchema, "users");