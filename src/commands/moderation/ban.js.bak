const { SlashCommandBuilder } = require('discord.js')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban the member provided.')
    .addUserOption((option) => {
        return option
        .setName("target")
        .setDescription("The member you'd like to ban")
        .setRequired(true)
    })
    .addStringOption((option) => {
        return option
        .setName('reason')
        .setDescription('The reason for banning the member provided.')
    }),
  async execute(interaction, client) {
    const user = interaction.options.getUser('target')
    let reason = interaction.options.getString('reason')
    const member = interaction.guild.members.fetch(user.id).catch(console.error)

    if(! reason) reason = "No reason provided."

    await member.ban({reason, deleteMessageDays: 1}).then(console.log).catch(console.error)
    await interaction.reply({
        content: `Banned: ${user.tag} successfully! 1 day`
    })
  },
}
