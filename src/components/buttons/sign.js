module.exports = {
    data: {
        name: `sign`
    },
    async execute(interaction, client) {
        await interaction.reply({
            // content: `http://192.168.31.214:3000/?discordId=${interaction.user.id}&discordUserName=${interaction.user.tag}`
            content: `http://13.229.143.112:3000/?discordId=${interaction.user.id}&discordUserName=${interaction.user.tag}`
        })
    }
}