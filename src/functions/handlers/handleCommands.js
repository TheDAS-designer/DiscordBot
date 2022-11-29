const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v10')

const fs = require('fs')
module.exports = (client) => {
  client.handleCommands = async () => {
    const commandFolders = fs.readdirSync('./src/commands')
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((f) => f.endsWith('.js'))

      const { commands, commandArray } = client

      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`)
        commands.set(command.data.name, command)
        commandArray.push(command.data.toJSON())
        console.log(
          `Command: ${command.data.name} has been passed through the handler`,
        )
      }
    }

    const clientId = "1041353063937622076"
    const guildId = process.env.GUILD_ID
    console.log("process.env.GUILD_ID", process.env.GUILD_ID)
    const rest = new REST({version: '10'}).setToken(process.env.token)

    try {
        console.log('Started refreshing application (/) commands.')
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            {body: client.commandArray}
        )
    } catch (error) {
        console.error(error)
    }
  }
}
