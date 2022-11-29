const {SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('sign')
    .setDescription("Navigate to the Sign Page")
,
    async execute(interaction, client){
       const button = new ButtonBuilder()
       .setCustomId('sign')
       .setLabel("Bind my account to an address")
       .setStyle(ButtonStyle.Primary)

       await interaction.reply({
        components: [new ActionRowBuilder().addComponents(button)]
        ,ephemeral: true
       })
    }
}