const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js")

module.exports = {
    data: {
        name: `JSON_RPC`
    },
    async execute(interaction, client) {
        const modal = new ModalBuilder().setCustomId('setRpc').setTitle("System setting")

        const textInput = new TextInputBuilder()
        .setCustomId("newRpc")
        .setLabel(`type a new rpc`)
        .setRequired(true)
        .setStyle(TextInputStyle.Short)

        modal.addComponents(new ActionRowBuilder().addComponents(textInput))

        await interaction.showModal(modal)
    }
}