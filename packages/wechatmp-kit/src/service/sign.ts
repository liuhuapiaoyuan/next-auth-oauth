import crypto from 'crypto'

export function randomStr(size: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let str = ''
  for (let i = 0; i < size; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return str
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

function base64Decode(input: string): Buffer {
  return Buffer.from(input, 'base64')
}

function padToPKCS7(buff: Buffer, keySize: number): Buffer {
  let needPadLen = 32 - (buff.length % 32)
  if (needPadLen == 0) {
    needPadLen = keySize
  }
  const pad = Buffer.alloc(needPadLen)
  pad.fill(needPadLen)
  return Buffer.concat([buff, pad])
}

function unpadPKCS7(input: Buffer, keySize: number): Buffer {
  let padding = input[input.length - 1]
  if (padding < 1 || padding > keySize) {
    padding = 0
  }

  return input.subarray(0, input.length - padding)
}

/**
 * 加解密
 * @param encodingAESKey  密钥
 * @param randomStr  随机字符串
 * @param msg   消息包
 * @param appId   appid
 * @returns
 */
export function encryptMessage(
  encodingAESKey: string,
  randomStr: string,
  msg: string,
  appId: string,
): string {
  const aesKey = base64Decode(encodingAESKey + '=')
  const msgBuffer = Buffer.from(msg, 'utf-8')
  const msgLength = Buffer.alloc(4)
  msgLength.writeUInt32BE(msgBuffer.length, 0)
  const fullStr = Buffer.concat([
    Buffer.from(randomStr, 'utf-8'),
    msgLength,
    msgBuffer,
    Buffer.from(appId, 'utf-8'),
  ])
  const paddedFullStr = padToPKCS7(fullStr, aesKey.length)
  const iv = aesKey.subarray(0, 16)
  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv)
  cipher.setAutoPadding(false)
  const cipheredMsg = Buffer.concat([
    cipher.update(/*encoded*/ paddedFullStr),
    cipher.final(),
  ])
  return cipheredMsg.toString('base64')
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
