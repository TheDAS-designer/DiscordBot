const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription("Return my embed!")
,
    async execute(interaction, client){
       const embed = new EmbedBuilder()
       .setTitle(`$$$$$$$$$$$$$$$`)
       .setAuthor(
        {
            url:"https://cn.pornhub.com/view_video.php?viewkey=ph5ff70c4f4a3e3",
            iconURL: interaction.user.displayAvatarURL(),
            name: interaction.user.tag
        }
       )
       .setDescription(`xxxxxxxxxxxxxxxxxxxxxxxxx`)
       .addFields([
        {
            name: `HAHA`,
            value: `hahahaha`,
            inline: true
        },
        {
            name: `HEHE`,
            value: `hehehehehe`,
            inline: true
        }
       ])
       .setFooter({
        iconURL: client.user.displayAvatarURL(),
        text: client.user.tag
       })
       .setURL(`https://www.youtube.com/watch?v=7UY5fpwh9MY`)
       .setImage(client.user.displayAvatarURL())
       .setThumbnail(client.user.displayAvatarURL())
       .setTimestamp(Date.now())
       .setColor(0x0080000)

       interaction.reply({
        embeds:[embed]
       })
    }
}