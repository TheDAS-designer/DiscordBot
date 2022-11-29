const ethers = require('ethers')
const mongoose = require('mongoose')
const Config = require('../schemas/config')
const User = require('../schemas/user')
const Log = require('../schemas/log')
const Guild = require('../schemas/guild')
const { PermissionsBitField } = require('discord.js')
// const rpcURL = "https://bsc-mainnet.public.blastapi.io"
// const rpcURL = 'https://rpc.ankr.com/bsc'
const rpcURL = 'https://bscrpc.com'
let provider = new ethers.providers.JsonRpcProvider(rpcURL)

//  async function getProvider(){
//     if(provider) return provider

//     provider = new ethers.getDefaultProvider("https://bsc-mainnet.public.blastapi.io")
//     console.log("provider", provider)

//     return provider
// }

function validateOG(address) {
  if (!ethers.utils.isAddress(address)) return false

  // get condition/limit
}
const loopssContractAddress = '0xB1aC1c0f2E7E467f10Df232E82CC65e2CA4Cb0d2'
const LOOPSS_ABI = require('../abi/Loopss.json')
async function getLoopssContract() {
  return new ethers.Contract(loopssContractAddress, LOOPSS_ABI, provider)
}
const BUSD_ABI = require('../abi/BUSD.json')
// const { User } = require('discord.js')

const usdtContract = new ethers.Contract(
  '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  BUSD_ABI,
  provider,
)

const loopssContract = new ethers.Contract(
  loopssContractAddress,
  LOOPSS_ABI,
  provider,
)

const contract = loopssContract
const interval = 60 * 1000

// let logs = []
// let timer
async function test3(client) {
  //   timer && clearInterval(timer)
  await test2(client, true)
  setInterval(() => test2(client, false), interval)
}

let decimals
//1041949667610603530
async function sendToChannel(config, client, addresses, guildId) {
  if (addresses.length === 0) return
  let channel = client.channels.cache.get(config.notificationChannelId)
  console.log('channel:', channel)
  if (!channel) {
    let guild = await client.guilds.fetch(guildId)
    //   await delay(100)
    console.log('guild', guild)
    channel = await guild.channels.create({
      name: 'Notification Channel',
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    })
    console.log("channel.id:", channel.id)
    config.notificationChannelId = channel.id
    await config.save().catch(console.error)
  }

  addresses.map(async (addr) => {
    

    console.log("addr:", addr)
    await channel.send(`🎉🎉🎉 Welcome address:${addr} joined us! 🤗🤗🤗`)
  })
}
const test2 = async (client, isInit) => {
  decimals = await contract.decimals()
  let config = await Config.findOne()

  if (!config) return
  const step = 5000

  let currentBlockNumber = await provider.getBlockNumber()
  let startNumber = config.lastBlockNumber
  let endNumber = currentBlockNumber
  let logs = []

  // endNumber - startNumber = diff
  // diff / step = [times].[lastStep]
  if (startNumber < endNumber) {
    let times = 1
    const diff = endNumber - startNumber
    try {
      if (diff > step) {
        times = (diff / step) | 0
        console.log('times', times)
        for (let i = 1; i < times + 1; i++) {
          console.log('times index', i)
          console.log('startNumber:', startNumber)
          console.log('endNumber:', startNumber + step)
          const _logs = await contract.queryFilter(
            'Transfer',
            startNumber,
            startNumber + step,
          )
          logs.push(..._logs)
          startNumber = startNumber + step
          console.log('step', step)
          console.log('after startNumber', startNumber)
          await delay(600)
        }
      }
  
      console.log('remain startNumber:', startNumber)
      console.log('remain endNumber:', endNumber)
      const _logs = await contract.queryFilter('Transfer', startNumber, endNumber)
  
      // console.log('_logs:', _logs)
      logs.push(..._logs)
  
    } catch (error) {
      console.error(error)
      return 
    }
   
    // console.log('logs:', logs)
    // save logs in db
    await saveTransfers(logs)
    // check logs if balance >= 0.003
    const addresses = await analyzeLogs(logs, isInit)
    let newArrList = [...new Set(addresses)]
   
    // Deduplication
    const _users = await User.find({address: {$in: newArrList}})
    const usersAddressList = _users.filter( u => !!u).map( u => u.address)
    newArrList = newArrList.concat(usersAddressList).filter(v => !newArrList.includes(v) || !usersAddressList.includes(v))
   
    console.log('newArrList', newArrList)

    let guildProfile = await Guild.findOne()
    // post to channel
    if (config.isNewPlayerNotification) {
      await sendToChannel(config, client, newArrList, guildProfile.guildId)
    }

    //update user OG role
    if (config.isOgPeriod) {
      await attachRole(client, newArrList, config, guildProfile.guildId)
    }

    logs = []

    config.lastBlockNumber = endNumber

    //save config changes
    config.save().catch(console.error)
  }
}

async function attachRole(client, addresses, config, guildId) {
  if (addresses.length === 0) return

  const guild = await client.guilds.fetch(guildId)
  const members = await guild.members.fetch()

  //   console.log("fetch members", members)
  // create og role
  let ogRole = await guild.roles.fetch(config.ogRoleId)

  //   console.log("fetch ogRole", ogRole)

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

  addresses.map(async (address) => {
    let userProfile = await User.findOne({ address })
    if (!userProfile) {
      userProfile = await new User({
        _id: mongoose.Types.ObjectId(),
        discordId: '',
        discordUserName: '',
        address,
      })
    }
    userProfile.isOG = true
    userProfile.save()

    if (userProfile.discordId) {
      const member = members.filter((m) => m.user.id === userProfile.discordId)
    //   console.log('member', member)
      if (member.length === 0) return

      const { roles } = member
      //   console.log("roles", roles)
      if (!roles.cache.has(ogRole.id)) {
        await roles.add(ogRole).catch(console.error)
      }
    //   console.log('add roles', roles)

      await member
        .send({ content: `Add OG role for ${member.user.tag}` })
        .catch(console.error)
    }
  })
}

async function saveTransfers(logs) {
  logs.map(async (event) => {
    let transferLog = new Log({
      _id: mongoose.Types.ObjectId(),
      hash: event.transactionHash,
      blockNumber: event.blockNumber,
      from: event.args.from,
      to: event.args.to,
      amount: event.args.value,

    })
    await transferLog.save().catch(console.error)
  })
}

async function analyzeLogs(logs, isInit) {
  let addresses  =  await Promise.all(logs.map(async (event) => {
    const address = event.args.to
    const balance = await contract.balanceOf(address)
    console.log('address', address)
    // // console.log('balance.toNumber()', ethers.utils.formatUnits(balance.toString(), decimals.toNumber()))
    // console.log('balance.toString()', balance.toString())
    // console.log('decimals', decimals.toNumber())
    console.log(
      'ethers.utils.formatUnits balance.toString()',
      ethers.utils.formatUnits(balance.toString(), decimals),
    )
    await delay(300)
    if (checkBalance(balance.toString(), isInit)) {
     return address
    }
    return ""
   

  }))  

  return addresses.filter( i => !!i)
}

function checkBalance(balance, isInit) {
  const _balance = balance.slice(-(decimals - 2)).substring(0, 1)
  if (isInit) {
    return Number(_balance) >= 3
  } else {
    return Number(_balance) === 3
  }
}

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}
async function test() {
  const usdtContract = new ethers.Contract(
    '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    BUSD_ABI,
    provider,
  )
  let config = await Config.findOne()
  if (!config) return
  let blocknumber = 0

  const step = 5
  const step2 = 50

  usdtContract.on('Transfer', async (from, to, value, event) => {
    console.log('===============Transfer on==============')
    console.log('from', from)
    console.log('to', to)
    console.log('value', value)
    console.log('event.blockNumber', event.blockNumber)

    console.log(
      'event.blockNumber - blocknumber > step',
      event.blockNumber - blocknumber > step,
    )
    // save the last block number
    if (event.blockNumber - blocknumber > step) {
      config.lastBlockNumber = event.blockNumber
      blocknumber = event.blockNumber
      console.log(
        'event.blockNumber - blocknumber',
        event.blockNumber - blocknumber,
      )
      console.log(
        'event.blockNumber - blocknumber > step',
        event.blockNumber - blocknumber > step,
      )
      config.save().catch(console.error)
    }

    console.log('event.transactionHash', event.transactionHash)
    console.log('===============Transfer on==============')

    if ((blocknumber = 0)) {
      console.log('======get past event======')
      blocknumber = event.blockNumber - 1
      const totalBlocks = blocknumber - config.lastBlockNumber
      const times = totalBlocks / step2
      console.log('times:', times)
      const logs = []
      for (const i = 0; i < times; i++) {
        console.log('=================')
        const _logs = await usdtContract.queryFilter(
          'Transfer',
          config.lastBlockNumber,
          config.lastBlockNumber + step2,
        )
        logs.concat(_logs)
        console.log('count:', i)
        console.log('past transfer logs:', logs[0])
        console.log('=================')
        await delay(500)
      }
      const remain = totalBlocks - times * step2
      if (remain > 0) {
        console.log('=================')
        const _logs = await usdtContract.queryFilter(
          'Transfer',
          config.lastBlockNumber + times * step2,
          blocknumber,
        )
        logs.concat(_logs)
        console.log('count:', i)
        console.log('past remain transfer logs:', logs[0])
        console.log('=================')
      }

      logs.map(async (event) => {
        const address = event.args[0].to
        const balance = await usdtContract.balanceOf(address)
        console.log(`address:[${address}]\tbalance:[${balance}]`)
        await delay(300)
      })
      console.log('======get past event======')
    }
  })
}

// get all recipient
async function getTransferLogs() {
  let config = await Config.findOne()
  const lastBlockNumber = config.lastBlockNumber
  const loopsContract = await getLoopssContract()

  const currentBlockNumber = await provider.getBlockNumber()

  const logs = await loopsContract.queryFilter(
    'Transfer',
    lastBlockNumber,
    currentBlockNumber,
  )
  console.log('past transfer logs:', logs)
  config.lastBlockNumber = currentBlockNumber
  config.save().catch(console.error)

  loopsContract.on('Transfer', (from, to, value, event) => {
    console.log('===============Transfer on==============')
    console.log('from', from)
    console.log('to', to)
    console.log('value', value)
    console.log('event', event)
  })
}

function getPastTransfer() {}
function fetchTransfer() {}

function analyze() {
  // fetch transfer events
  // record in db
}

module.exports = { test3 }
