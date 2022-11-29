const {SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription("Return settings button!")
,
    async execute(interaction, client){
        
        // check user roleCode if >= 100 return Error

       const button1 = new ButtonBuilder()
       .setCustomId('tokenLimit')
       .setLabel("set token limit")
       .setStyle(ButtonStyle.Primary)

       const button2 = new ButtonBuilder()
       .setCustomId('setAdmin')
       .setLabel("set token limit")
       .setStyle(ButtonStyle.Primary)


       const ab = new ActionRowBuilder()
       ab.addComponents(button1)

       await interaction.reply({
        components: [ab]
       })
    }
}