require('dotenv').config()
const { ethers } = require('ethers')
const mongoose = require('mongoose')
const User = require('./schemas/user')
const Guild = require('./schemas/guild')
const Config = require('./schemas/config')

const { token, mongodbToken } = process.env
const { connect } = require('mongoose')
const { Client, Collection, GatewayIntentBits } = require('discord.js')
const fs = require('fs')
const OG_ROLE_ID = "1040581555329978428"

// const opts = {agent: new require('socks-proxy-agent')('socks://127.0.0.1:7890')};
// const ws = this.ws = new WebSocket(null, undefined, opts);
// const ws = (this.connection = new WebSocket(null, null, {agent: new proxy('http://127.0.0.1:7890')}));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
})

client.buttons = new Collection()
client.commands = new Collection()
client.commandArray = []
client.modals = new Collection()

const functionFolders = fs.readdirSync(`./src/functions`)

for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((f) => f.endsWith('.js'))

  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client)
}

const express = require('express')
var cors = require('cors')
// const bodyParser = require('body-parser');
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/ticket', async (request, response) => {
  console.log('request:', request) // the information in your POST request's body
  console.log('request.body:', request.body) // the information in your POST request's body
  //   const guild = await client.guilds.fetch('guild_id');
  //   guild.channels.create(request.body.ticketName);
  const discordId = request.body.discordId
  const discordName = request.body.discordUserName
  const address = request.body.address
  const sign = request.body.sign

  const message = `
purpose:\tVerify address

discordId:\t${discordId}

discordName:\t${discordName}

owner:\t${address}`

  if (
    ethers.utils.verifyMessage(message, sign).toUpperCase() ===
    address.toUpperCase()
  ) {
    // record in db
    let userProfile = await User.findOne({ address })
    console.log('userProfile', userProfile)
    if (!userProfile) {
      userProfile = await new User({
        _id: mongoose.Types.ObjectId(),
        discordId,
        discordName,
        address,
      })
    }

    userProfile.discordId = discordId
    userProfile.discordName = discordName

    const config = await Config.findOne()
    if (config.isOgPeriod && userProfile.isOG && !userProfile.isGrantOgRole) {
      const guildProfile = await Guild.findOne()
      if (!guildProfile) return

      const guild = await client.guilds.fetch(guildProfile.guildId)
      const members = await guild.members.fetch()

      // create og role and grant role
      let ogRole = await guild.roles.fetch(OG_ROLE_ID)

      if (!ogRole) {
        ogRole = guild.roles.create({
          name: 'OG',
          permissions: [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ViewChannel,
          ],
        })
        config.ogRoleId = ogRole.id
        config.save().catch(console.error)
        console.log('create ogRole', ogRole)
      }
      const member = members.filter((m) => m.user.id === userProfile.discordId)[0]
      if (member) {
        console.log('member:', member)
        console.log('member.guild:', member.guild)
        console.log('member._roles:', member._roles)
        const { roles } = member
        console.log('roles:', roles)
        //   console.log("roles", roles)
        // if (!roles.cache.has(ogRole.id)) {
        if (!roles.cache.has(ogRole.id)) {
          await roles.add(ogRole).catch(console.error)
        }
        //   console.log('add roles', roles)

        await member
          .send({ content: `Add OG role for ${member.user.tag}` })
          .catch(console.error)

        userProfile.isGrantOgRole = true
      }
    }
    userProfile.save().catch(console.error)
    response.send({ msg: 0 })
    return
  }
  response.send({ msg: 2 })
})

app.listen(3001)
client.handleEvents()
client.handleCommands()
client.handleComponents()
client.login(token)
;(async () => {
  await connect(mongodbToken).catch(console.error)
  let config = await Config.findOne()
  if (!config) {
    config = await new Config({
      _id: mongoose.Types.ObjectId(),
      isOgPeriod: true,
    })

    config.save().catch(console.error)
  }

  await require('./web3/contract.js')['test3'](client)
})()
