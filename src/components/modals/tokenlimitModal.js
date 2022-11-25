const { ethers } = require('ethers')
const mongoose = require('mongoose')
const User = require('../../schemas/user')
const Guild = require('../../schemas/guild')
module.exports = {
  data: {
    name: `tokenLimit`,
  },
  async execute(interaction, client) {
    const tokenAmount = interaction.fields.getTextInputValue(`tokenAmount`)
    let userProfile = User.findOne(interaction.user.id)
    // check user roleCode
    if (userProfile.roleCode < 100) {
      let guildProfile = Guild.findOne({ guildId: interaction.guild.id })
      if (guildProfile.tokenLimit !== Number(tokenAmount)) {
        guildProfile.tokenLimit = Number(tokenAmount)
        // record db
        await guildProfile.save().catch(console.error)
        await interaction.reply({
          content: `tokenLimit has been set to ${tokenAmount}`,
        })
      } else {
        await interaction.reply({
          content: `tokenLimit has been set to ${tokenAmount}`,
        })
      }
    } else {
      await interaction.reply({
        content: `Error: roleCode must be less than 100!`,
      })
    }

    // await interaction.reply({
    //     content: `Set the minimum token amount: ${interaction.fields.getTextInputValue(`tokenAmount`)}`
    // })
  },
}
