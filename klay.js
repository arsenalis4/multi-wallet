// caver-js 라이브러리를 불러옵니다.
const Caver = require('caver-js')

// 클레이튼의 공개 노드 중 하나인 Baobab 테스트넷에 연결합니다.
const caver = new Caver('https://api.baobab.klaytn.net:8651/')

// 지갑 주소를 변수로 선언합니다.
const address = '0x97d4be5CAF9e26797b2453238a41F6Ac258565c1'


// 2번 (미완...)
// caver.rpc.klay.getBalance 메서드를 사용하여 지갑 주소의 klay 잔액을 조회합니다.
caver.rpc.klay.getBalance(address).then((balance) => {
  // 잔액을 peb 단위에서 klay 단위로 변환합니다.
  const klay = caver.utils.convertFromPeb(balance, 'KLAY')
  // 결과를 출력합니다.
  console.log(`The balance of ${address} is ${klay} KLAY`)
})
