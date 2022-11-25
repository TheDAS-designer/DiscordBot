const {Schema, model} = require('mongoose')

const guildSchema = new Schema({
    _id: Schema.Types.ObjectId,
    discordId: {type: String, required: true},
    discordName: {type: String, required: false},
    address: {type: String, required: true},
    roleCode: {type: Number, required: false, default: 100}
})

module.exports = model("User", guildSchema, "users");