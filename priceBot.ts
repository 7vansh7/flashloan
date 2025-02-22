import axios from "axios"


const tokenList = ['JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN','So11111111111111111111111111111111111111112','6AJcP7wuLwmRYLBNbi825wgguaPsWzPBEHcHndpRpump','34HPe7wfG5gTEgV2jNjCfiZyZoFCn3Ti3RFx7nkAqaMp','6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN']
const token = tokenList[2]
const moralisLink = `https://solana-gateway.moralis.io/token/mainnet/${token}/price`
const jupiterLink = `https://api.jup.ag/price/v2?ids=${token}&showExtraInfo=false`
const raydiumLink = `https://api-v3.raydium.io/mint/price?mints=${token}`
const headers = {'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjQ0ZjU4MjE5LWJiN2MtNDNjNS1hMjhlLWUyYzRhODJkYTg0MSIsIm9yZ0lkIjoiNDMwNzQ4IiwidXNlcklkIjoiNDQzMDg3IiwidHlwZUlkIjoiNGZkYmQzYWQtYWJkMy00Zjc5LWFmMDYtMGRkZTgwMTRkY2JmIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MzkyODUwODIsImV4cCI6NDg5NTA0NTA4Mn0.9xHrLY4jfJ21-ziU4q33LE9R89hrA3aVphCsIoG-i6A'}

const getPriceJupiter = async(link:string, tokenadd:string)=>{
    const response = await axios.get(link)
    console.log("Jupiter->" + response.data.data[tokenadd].price)
    return Number(response.data.data[tokenadd].price)
}

const getPriceRaydium = async(link:string,tokenadd:string)=>{
    const response = await axios.get(link)
    console.log("Raydium->" +response.data.data[tokenadd])
    return response.data.data[tokenadd]
}


const getPriceOrca = async()=>{
    const response = await axios.get(moralisLink,{headers})
    console.log("Moralis->" +response.data.usdPrice)
    return response.data.usdPrice
}

const chPercentage = async()=>{
    const price1 = await getPriceJupiter(jupiterLink,token)
    const price2 = await getPriceRaydium(raydiumLink,token)
    // const price3 = await getPriceOrca()

    const minPrice = Math.min(price1,price2,)
    const maxPrice = Math.max(price1,price2)
    console.log(((maxPrice-minPrice)/minPrice)*100)
}


setInterval(chPercentage,10000)

