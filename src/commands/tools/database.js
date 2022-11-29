const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js')
const mongoose = require('mongoose')
const Guild = require('../../schemas/guild')
let count = 0
module.exports = {
    data: new SlashCommandBuilder()
    .setName('database')
    // .setDescription("Return information from a database")
    .setDescription("管理可以用这个命令启动对链上数据的监听")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
,
    async execute(interaction, client){
        let guildProfile = await Guild.findOne({guildId: interaction.guild.id})
        if(!guildProfile){
            guildProfile = await new Guild({
                _id: mongoose.Types.ObjectId(),
                guildId: interaction.guild.id,
                guildName: interaction.guild.name,
                guildIcon: interaction.guild.iconURL() ?interaction.guild.iconURL() : "None"
            })

            await guildProfile.save().catch(console.error)

            await interaction.reply({
                content: `Hello everyone, 我是一个正在施工中的Bot, 主要功能是给大家发福利...哦不...发牛逼闪闪的 Loopss OG身分组
                版本号: undefined
                名称: Null
                描述: 还没想好
                作者: 发这条命令的人
                Server Name: ${guildProfile.guildName}`
            })
            console.log(guildProfile);
        }
        else{
            if(count > 1){
                await interaction.reply({
                    content: `${interaction.user.tag}：“大家都围过来一下嗷， 我给大家宣布个事， 我是个傻逼！！！”`
                })
                count+=1
                return 
            }

            if(count > 0){
                await interaction.reply({
                    content: `你干嘛, 哎呦~~`
                })
                count+=1
                return
            }


            await interaction.reply({
                content: `有没有一种可能，这个命令只能被执行一次？`
            })
            console.log(guildProfile);
            count+=1
        }

       
    }
}