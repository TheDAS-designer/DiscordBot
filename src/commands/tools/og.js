const { SlashCommandBuilder,PermissionsBitField } = require('discord.js')
const User = require('../../schemas/user')
const Config = require('../../schemas/config')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('og')
    .setDescription('Claim the OG role.'),
  async execute(interaction, client) {
    let user = await User.findOne({ discordId: interaction.user.id })
    if (!user) {
      interaction.reply({
        content: `Error: user${interaction.user.tag} not found.`,
        ephemeral: true,
      })
      return
    }

    let config = await Config.findOne()
    if (!config) {
      interaction.reply({ content: `Error.`, ephemeral: true })
      return
    }

    if (!config.isOgPeriod) {
      interaction.reply({
        content: `Error: not in OG period.`,
        ephemeral: true,
      })
      return
    }

    if (!user.isOG) {
      interaction.reply({
        content: `Error: Please try again after collecting 3 or more types of tokens.`,
        ephemeral: true,
      })
      return
    }

    let ogRole
    const guild = await interaction.guild
    if (!config.ogRoleId) {
      //create role
      ogRole = await guild.roles.create({
        name: 'OG',
        permissions: [
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ViewChannel,
        ],
      })
      config.ogRoleId = ogRole.id
      config.save().catch(console.error)
      console.log('create ogRole', ogRole)
    }

    const { roles } = interaction.member

    // if has the role
    if (!roles.cache.has(ogRole.id)) {
      // add role
      await roles.add(ogRole).catch(console.error)
      await interaction.reply({
        content: `Succeeded! User ${interaction.user.tag} got the ${ogRole.name} role. 🎉🎉🎉(Try '/og' to get this)`
      })
    } else {
      await interaction.reply({
        content: `You've got it, don't try again.`, ephemeral: true
      })
    }
  },
}
