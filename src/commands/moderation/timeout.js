const { SlashCommandBuilder } = require('discord.js')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('timeout the member provided.')
    .addUserOption((option) => {
      return option
        .setName("target")
        .setDescription("The member you'd like to timeout")
        .setRequired(true)
    })
    .addStringOption((option) => {
        return option
        .setName('time')
        .setDescription('The amount of minutes to timeout a member for.')
        .setRequired(true)
    }).addStringOption((option) => {
        return option
          .setName('reason')
          .setDescription('The reason for timeout the member provided.')
      }),
  async execute(interaction, client) {
    const user = interaction.options.getUser('target')
    let reason = interaction.options.getString('reason')
    const member = interaction.guild.members.fetch(user.id).catch(console.error)
    const time = interaction.options.getInteger("time")
    if(! reason) reason = "No reason provided."

    await member.timeout(time * 60 * 1000, reason).then(console.log).catch(console.error)
    await interaction.reply({
        content: `Timed out: ${user.tag} successfully!`
    })
  },
}
