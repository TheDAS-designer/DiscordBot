const {SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('buttons')
    .setDescription("Return a button!")
,
    async execute(interaction, client){
       const button = new ButtonBuilder()
       .setCustomId('sign')
       .setLabel("Click Me!")
       .setStyle(ButtonStyle.Primary)

       await interaction.reply({
        components: [new ActionRowBuilder().addComponents(button)]
       })
    }
}