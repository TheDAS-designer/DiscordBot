const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js")
const Config = require("../../schemas/config")
module.exports = {
    data: {
        name: `NOTIFY_OFF`
    },
    async execute(interaction, client) {
        let config = await Config.findOne()
        
        if(!config) {
            interaction.reply({content: `[Config] is not exist.`, ephemeral: true})
            return 
        }
        if( !config.isNewPlayerNotification) {

            interaction.reply({content: `Succeeded.`, ephemeral: true})
            return 
        }

        config.isNewPlayerNotification = false
        await config.save().catch(console.error)
        interaction.reply({content: `Succeeded.`, ephemeral: true})
    }
}