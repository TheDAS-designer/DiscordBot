const { ethers } = require('ethers')
const mongoose = require('mongoose')
const Config = require("../../schemas/config")
module.exports = {
  data: {
    name: `setRpc`,
  },
  async execute(interaction, client) {
    const newRpc = interaction.fields.getTextInputValue(`newRpc`)
    let config = await Config.findOne()
    if (!config) {
      interaction.reply({ content: `[Config] is not exist.` })
      return
    }
    config.rpc = newRpc
    config.save().catch(console.error)
    await interaction.reply({
        content: `Set the [Config.rpc] to: ${newRpc}`
        ,ephemeral: true
    })
  },
}
