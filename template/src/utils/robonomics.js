import Robonomics from 'robonomics-js'
import Provider from './provider'

let robonomics = null
const getRobonomics = (lighthouse) => {
  if (robonomics === null) {
    // const socket = io('http://localhost:9999')
    const socket = io('https://wss.pool.aira.life')
    robonomics = new Robonomics({
      web3,
      provider: new Provider(socket),
      lighthouse
      // ens: '0xc5b93d119726fe76141d5db975d1e9a655a735b7' // kovan
      // ens: '0xd4F9C19B32e57cC2485877Ef9EBA8CeAA91687b2', // ropsten
    })
  }
  return robonomics
}

export default getRobonomics
