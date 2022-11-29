require('dotenv').config()
const { ethers } = require('ethers')
const mongoose = require('mongoose')
const User = require('./schemas/user')
const Config = require('./schemas/config')

const { token, mongodbToken } = process.env
const { connect } = require('mongoose')
const { Client, Collection, GatewayIntentBits } = require('discord.js')
const fs = require('fs')

// const opts = {agent: new require('socks-proxy-agent')('socks://127.0.0.1:7890')};
// const ws = this.ws = new WebSocket(null, undefined, opts);
// const ws = (this.connection = new WebSocket(null, null, {agent: new proxy('http://127.0.0.1:7890')}));

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMembers,
], })

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
  const discordUserName = request.body.discordUserName
  const address = request.body.address
  const sign = request.body.sign

  const message = `
purpose:\tVerify address

discordId:\t${discordId}

discordName:\t${discordUserName}

owner:\t${address}`

  if (
    ethers.utils.verifyMessage(message, sign).toUpperCase() ===
    address.toUpperCase()
  ) {
    // record in db
    let userProfile = User.findOne({ address })
    console.log("userProfile", userProfile)
    if (!userProfile) {
      userProfile = await new User({
        _id: mongoose.Types.ObjectId(),
        discordId,
        discordUserName,
        address
      })

      userProfile.save().catch(console.error)
      response.send({ data: 0 })
    } else {
      
      response.send({ data: 1 })
    }
    return
  }
  response.send({ data: 2 })
})

app.listen(3001)
client.handleEvents()
client.handleCommands()
client.handleComponents()
client.login(token)
;(async () => {
  await connect(mongodbToken).catch(console.error)
  let config = await Config.findOne()
  if(!config) {
    config = await new Config({
      _id: mongoose.Types.ObjectId(),
      isOgPeriod: true
    })

    config.save().catch(console.error)
  }

  await require("./web3/contract.js")["test3"](client)
})()
