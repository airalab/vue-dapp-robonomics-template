export const NETWORK = 1
export const VERSION = 3
export const ENS = ''
export const LIGHTHOUSE = '{{ lighthouse }}.lighthouse.3.robonomics.eth'
export const MODEL = '{{ model }}'
export const OBJECTIVE = '{{ objective }}'
export const IPFS_PUBSUB = 'https://wss.pool.aira.life' // https://github.com/vol4tim/ipfs-api-pubsub-ws
{{#isToken}}
export const TOKEN = '{{ token }}'
{{else}}
export const TOKEN = null
{{/isToken}}
export const PRICE = {{ price }}
