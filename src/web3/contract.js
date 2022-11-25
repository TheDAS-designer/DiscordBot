const ethers = require("ethers")
const mongoose = require('mongoose')
const Analyze = require('../schemas/analyze')

const rpcURL = "https://bsc-mainnet.public.blastapi.io"
let provider = new ethers.providers.JsonRpcProvider(rpcURL)


//  async function getProvider(){
//     if(provider) return provider

//     provider = new ethers.getDefaultProvider("https://bsc-mainnet.public.blastapi.io")
//     console.log("provider", provider)

//     return provider
// }

 function validateOG(address){
    if(!ethers.utils.isAddress(address)) return false

    // get condition/limit

}
const loopssContractAddress=""
const abi = {}
async function getLoopssContract(){
    return new ethers.Contract( loopssContractAddress , abi , provider )
}

// get all recipient
async function getTransferLogs(){
    const {lastBlockNumber} = Analyze.findOne()
    const loopsContract = await getLoopssContract()

    const currentBlockNumber = await provider.getBlockNumber()

    const logs = await loopsContract.queryFilter("Transfer", lastBlockNumber, currentBlockNumber)
    console.log("past transfer logs:", logs)

    loopsContract.on("Transfer", (from, to, value, event) => {
        console.log("===============Transfer on==============")
        console.log("from", from)
        console.log("to", to)
        console.log("value", value)
        console.log("event", event)
    })
}

function getPastTransfer(){

}
function fetchTransfer(){

}


 function analyze(){
    // fetch transfer events
    // record in db
}

module.exports = {provider}