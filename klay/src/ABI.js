const fetch = require('node-fetch');
const Headers = require('node-fetch').Headers;

// Covalent API 키 설정하기
const covalentApiKey = 'cqt_rQwg9GhWVK3hB99RRByDM9rddYDw';

// 사용자 지갑 주소 설정하기
const walletAddress = "0xae91e781cc56694dc3aa66717784739b7f48d77d";

// chainName 설정하기
const chainName = "klaytn-mainnet";

let headers = new Headers();
    headers.set('Authorization', `Bearer ${covalentApiKey}`)

fetch(`https://api.covalenthq.com/v1/${chainName}/address/${walletAddress}/balances_v2/`, {method: 'GET', headers: headers})
  .then((resp) => resp.json())
  .then((data) => console.log(data));