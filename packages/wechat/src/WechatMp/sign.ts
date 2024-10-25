import crypto, { randomBytes } from 'crypto'

export function randomStr(size: number) {
  const randomBuffer = randomBytes(size)
  return randomBuffer.toString('hex')
}

export function checkSignature(
  signature: string,
  timestamp: string,
  nonce: string,
  token: string,
) {
  const tmpArr = [token, timestamp, nonce]
  tmpArr.sort()
  const tmpStr = tmpArr.join('')
  const hash = crypto.createHash('sha1').update(tmpStr).digest('hex')
  return hash === signature
}

function base64Encode(input: Buffer): string {
  return input.toString('base64')
}

function base64Decode(input: string): Buffer {
  return Buffer.from(input, 'base64')
}

function padToPKCS7(text: Buffer, keySize: number): Buffer {
  const paddingSize = keySize - (text.length % keySize)
  const padding = Buffer.alloc(paddingSize, paddingSize)
  return Buffer.concat([text, padding])
}
function unpadPKCS7(input: Buffer, keySize: number): Buffer {
  let padding = input[input.length - 1]
  if (padding < 1 || padding > keySize) {
    padding = 0
  }

  return input.subarray(0, input.length - padding)
}
function intToNetworkByteOrder(value: number) {
  const buffer = Buffer.from([
    (value >>> 24) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 8) & 0xff,
    value & 0xff,
  ])
  return buffer
}

/**
 * 加密
 * @param encodingAESKey
 * @param randomStr
 * @param msg
 * @param msgLen
 * @param appId
 * @returns
 */
export function encryptMessage(
  encodingAESKey: string,
  randomStr: string,
  msg: string,
  appId: string,
): string {
  const aesKey = base64Decode(encodingAESKey + '=')
  const fullStr = Buffer.concat([
    Buffer.from(randomStr),
    intToNetworkByteOrder(msg.length),
    Buffer.from(msg),
    Buffer.from(appId),
  ])
  const paddedFullStr = padToPKCS7(fullStr, aesKey.length)
  const iv = aesKey.subarray(0, 16)
  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv)
  const encrypted = cipher.update(paddedFullStr)
  return base64Encode(encrypted)
}
/**
 * 解密消息
 */
export function decryptMessage(encodingAESKey: string, encryptMessage: string) {
  // 1. 生成 AESKey
  const aesKey = Buffer.from(encodingAESKey + '=', 'base64')
  // 2. 将 Encrypt 密文进行 Base64 解码
  const tmpMsg = Buffer.from(encryptMessage, 'base64')
  // 3. 使用 AESKey 进行 AES 解密
  const iv = aesKey.subarray(0, 16)
  const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv)
  decipher.setAutoPadding(false)
  let full = decipher.update(tmpMsg)
  full = Buffer.concat([full, decipher.final()])
  full = unpadPKCS7(full, aesKey.length)
  const randomStr = full.subarray(0, 16)
  const msgLenBuffer = full.subarray(16, 20)
  const msgLen = msgLenBuffer.readUInt32BE(0)
  const msg = full.subarray(20, 20 + msgLen).toString('utf8')
  const appId = full.subarray(20 + msgLen).toString('utf8')
  return {
    randomStr: randomStr.toString('utf8'),
    msgLen: msgLen,
    msg: msg,
    appId: appId,
  }
}
