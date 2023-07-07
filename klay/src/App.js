import React, { useState, useEffect } from "react";
import Caver from "caver-js";
import CaverExtKAS from "caver-js-ext-kas";

function App() {
  const [kaikas, setKaikas] = useState(null); // kaikas 객체
  const [address, setAddress] = useState(""); // kaikas 계정 주소
  const [balance, setBalance] = useState(""); // kaikas 계정 잔액
  const [tokens, setTokens] = useState([]); // kaikas 토큰 분포

  useEffect(() => {
    // kaikas-extension이 설치되어 있는지 확인
    if (window.klaytn) {
      // kaikas 객체 생성
      const klaytn = window.klaytn;
      const caver = new Caver(klaytn);
      setKaikas(caver);

      // kaikas와 연결 요청
      klaytn.enable().then((accounts) => {
        // 연결 성공 시 첫 번째 계정 주소를 가져옴
        setAddress(accounts[0]);
      });
    } else {
      // kaikas-extension이 설치되어 있지 않으면 경고 메시지 출력
      alert("Please install Kaikas extension.");
    }
  }, []);

  useEffect(() => {
    // kaikas 객체가 있고 계정 주소가 있으면 잔액을 가져옴
    if (kaikas && address) {
      const provider = new Caver.providers.HttpProvider(
        "https://api.baobab.klaytn.net:8651/"
      )
      // Klaytn 네트워크의 rpcURL을 설정
      kaikas.klay.setProvider(provider);

      // 계정 잔액을 KLAY 단위로 가져옴
      kaikas.klay.getBalance(address).then((balance) => {
        setBalance(kaikas.utils.fromPeb(balance, "KLAY"));
      });

      // KAS 접속 정보 설정
      const accessKeyId = "KASK2U8TSYABXYY6NZYAEN0F" // KAS 콘솔에서 발급받은 access key id
      const secretAccessKey = "JWvA6UoIsnQaj8C0dwo-oVmyF1rkD5ozLOYTuVq9" // KAS 콘솔에서 발급받은 secret access key
      const chainId = 8217 // 메인넷의 chain id

      // caver 인스턴스 생성
      const caver = new CaverExtKAS();
      caver.initKASAPI(chainId, accessKeyId, secretAccessKey);

      // Token History API 인스턴스 생성  
      const tokenHistory = caver.kas.tokenHistory;

      // 토큰 분포 조회
      tokenHistory.getContractListByOwner("0xfc596280cabe3d7adbdd3cc19aa6d7fe9120c462").then((res)=>{
        const items = res.items;
        console.log(items);
        items.forEach((item)=>{
          const tokenAddress = item.contractAddress;
          const symbol = item.extras.symbol;
          const tokens = [];
          const kip7Contract = new caver.contract(kaikas.klay.KIP7.abi, tokenAddress);
          kip7Contract.methods.balanceOf(address).call().then((balance) => {
            setTokens([...tokens, {symbol: symbol, balance: balance}]);
          });
        });
      });

      // 예치풀 조회
      const lpAddress = "0x97b4e13114ce2c9bf289be1ffd1268be5b2ed7c2";
      const testAddress = "0x16c2b38fb969589b208fbff106d1cfd3908f6e6b";
      const lpContract = new caver.contract(kaikas.klay.KIP7.abi, lpAddress);
      lpContract.methods.balanceOf(testAddress).call().then((balance) => {
        console.log(balance);
      });

      // 내 지갑의 거래 내역 조회
      tokenHistory.getTransferHistoryByAccount("0xfc596280cabe3d7adbdd3cc19aa6d7fe9120c462").then((res) => {
        const items = res.items;
        items.forEach((item) => {
          console.log(item);
        });
      });
    }
  }, [kaikas, address]);

  return (
    <div className="App">
      <h1>Kaikas Example</h1>
      <p>Account: {address}</p>
      <p>Balance: {balance} KLAY</p>
      <p>Token Symbol: {tokens[0] && tokens[0].symbol}</p>
      <p>Token Price: {tokens[0] && tokens[0].balance}</p>
    </div>
  );
}

export default App;