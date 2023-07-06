import React, { useState, useEffect } from "react";
import Caver from "caver-js";
import CaverExtKAS from "caver-js-ext-kas";

function App() {
  const [kaikas, setKaikas] = useState(null); // kaikas 객체
  const [address, setAddress] = useState(""); // kaikas 계정 주소
  const [balance, setBalance] = useState(""); // kaikas 계정 잔액

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
      const accessKeyId = "KASKDL78X89NP2WTBUAB5FVL" // KAS 콘솔에서 발급받은 access key id
      const secretAccessKey = "zZ-K4jWQtS9bfUhMJa92bQyxb7SM3m4pE9GZu9kD" // KAS 콘솔에서 발급받은 secret access key
      const chainId = 8217 // 메인넷의 chain id

      // caver 인스턴스 생성
      const caver = new CaverExtKAS();
      caver.initKASAPI(chainId, accessKeyId, secretAccessKey);

      // Token History API 인스턴스 생성  
      const tokenHistory = caver.kas.tokenHistory

      // 토큰 내역 조회
      tokenHistory.getContractListByOwner("0x9f8a222fd0b75239b32aa8a97c30669e5981db05").then((res)=>{
        console.log(res.items);
        const testItem = res.items[0];
        const testAddress = testItem.contractAddress;
        caver.kas.kip7.balance(testAddress, "0x9f8a222fd0b75239b32aa8a97c30669e5981db05").then((res)=>{
          console.log(res.balance);
        })
      });

      console.log(tokenHistory.getTransferHistory);
    }   
  }, [kaikas, address]);

  return (
    <div className="App">
      <h1>Kaikas Example</h1>
      <p>Account: {address}</p>
      <p>Balance: {balance} KLAY</p>
    </div>
  );
}

export default App;