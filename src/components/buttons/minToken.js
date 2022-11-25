const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js")
module.exports = {
    data: {
        name: `tokenLimit`
    },
    async execute(interaction, client) {
        const modal = new ModalBuilder().setCustomId('tokenLimit').setTitle("Admin Setting")

        const textInput = new TextInputBuilder()
        .setCustomId("tokenAmount")
        .setLabel(`type token amount`)
        .setRequired(true)
        .setStyle(TextInputStyle.Short)

        modal.addComponents(new ActionRowBuilder().addComponents(textInput))

        await interaction.showModal(modal)
    }
}