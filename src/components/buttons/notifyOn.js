const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js")
const Config = require("../../schemas/config")
module.exports = {
    data: {
        name: `NOTIFY_ON`
    },
    async execute(interaction, client) {
        let config = await Config.findOne()
        
        if(!config) {
            interaction.reply({content: `[Config] is not exist.`})
            return 
        }
        if( config.isNewPlayerNotification) {

            interaction.reply({content: `Succeeded.`})
            return 
        }

        config.isNewPlayerNotification = true
        await config.save().catch(console.error)
        interaction.reply({content: `Succeeded.`, ephemeral: true})
    }
}