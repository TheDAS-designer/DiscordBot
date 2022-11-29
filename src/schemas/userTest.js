const {Schema, model} = require('mongoose')

const guildSchema = new Schema({
    _id: Schema.Types.ObjectId,
    discordId: {type: String, required: false},
    discordName: {type: String, required: false},
    address: {type: String, required: false},
    isOG: {type: Boolean, require: false}
})

module.exports = model("UserTest", guildSchema, "userTests");