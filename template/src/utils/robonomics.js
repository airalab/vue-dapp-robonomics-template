import Robonomics from 'robonomics-js'
import Provider from './provider'
import { IPFS_PUBSUB, ENS } from '../config'

let robonomics = null
const getRobonomics = (lighthouse) => {
  if (robonomics === null) {
    const socket = io(IPFS_PUBSUB)
    robonomics = new Robonomics({
      web3,
      provider: new Provider(socket),
      lighthouse,
      ens: ENS
    })
  }
  return robonomics
}

export default getRobonomics
