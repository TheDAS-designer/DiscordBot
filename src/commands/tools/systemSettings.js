const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits
} = require('discord.js')
const Config = require('../../schemas/config')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('aaa')
    .setDescription('Return system settings button!')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,
  async execute(interaction, client) {
    // check user roleCode if >= 100 return Error
    let config = await Config.findOne()
    if (!config) return

    const button1 = new ButtonBuilder()
      .setCustomId('OG_ON')
      .setLabel(`Change the [Config.isOgPeriod](${config.isOgPeriod}) to true.`)
      .setStyle(ButtonStyle.Primary)

    const button2 = new ButtonBuilder()
      .setCustomId('OG_OFF')
      .setLabel(
        `Change the [Config.isOgPeriod](${config.isOgPeriod}) to false.`,
      )
      .setStyle(ButtonStyle.Primary)

    const button3 = new ButtonBuilder()
      .setCustomId('NOTIFY_ON')
      .setLabel(
        `Change the [Config.isNewPlayerNotification](${config.isNewPlayerNotification}) to true.`,
      )
      .setStyle(ButtonStyle.Primary)
    const button4 = new ButtonBuilder()
      .setCustomId('NOTIFY_OFF')
      .setLabel(
        `Change the [Config.isNewPlayerNotification](${config.isNewPlayerNotification}) to false.`,
      )
      .setStyle(ButtonStyle.Primary)

    const button5 = new ButtonBuilder()
      .setCustomId('JSON_RPC')
      .setLabel(`Type a new RPC URL for the [Config.rpc](${config.rpc})`)
      .setStyle(ButtonStyle.Primary)

    const ab = new ActionRowBuilder()
    ab.addComponents(button1)
      .addComponents(button2)
      .addComponents(button3)
      .addComponents(button4)
      .addComponents(button5)

    await interaction.reply({
      components: [ab],
      ephemeral: true
    })
  },
}
