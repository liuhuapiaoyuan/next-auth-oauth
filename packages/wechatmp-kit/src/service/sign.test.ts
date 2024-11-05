import { encryptMessage, decryptMessage } from './sign'
import { describe, expect, test } from 'bun:test'

describe('wechatMpApi encryptMessage', () => {
  test('测试base64加密', () => {
    const input = 'hello world!'
    const base64 = 'aGVsbG8gd29ybGQh'
    expect(base64).toBe(Buffer.from(input).toString('base64'))
  })
  test('解密base64', () => {
    const input = 'hello world!'
    const base64 = 'aGVsbG8gd29ybGQh'
    expect(input).toBe(Buffer.from(base64, 'base64').toString())
  })
  test('测试加密算法', async () => {
    const expectEncryptedMessage = `ELGduP2YcVatjqIS+eZbp80MNLoAUWvzzyJxgGzxZO/5sAvd070Bs6qrLARC9nVHm48Y4hyRbtzve1L32tmxSQ==`
    const EncodingAESKey = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    const randomStr = '707722b803182950' // 需要补足到16字节
    const msg = '{"demo_resp":"good luck"}'
    const appId = 'wxba5fad812f8e6fb9'
    const encrypt = encryptMessage(EncodingAESKey, randomStr, msg, appId)
    expect(encrypt).toBe(expectEncryptedMessage)
  })
  test('测试解密算法', async () => {
    const expectEncryptedMessage = `+qdx1OKCy+5JPCBFWw70tm0fJGb2Jmeia4FCB7kao+/Q5c/ohsOzQHi8khUOb05JCpj0JB4RvQMkUyus8TPxLKJGQqcvZqzDpVzazhZv6JsXUnnR8XGT740XgXZUXQ7vJVnAG+tE8NUd4yFyjPy7GgiaviNrlCTj+l5kdfMuFUPpRSrfMZuMcp3Fn2Pede2IuQrKEYwKSqFIZoNqJ4M8EajAsjLY2km32IIjdf8YL/P50F7mStwntrA2cPDrM1kb6mOcfBgRtWygb3VIYnSeOBrebufAlr7F9mFUPAJGj04=`
    const EncodingAESKey = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    const randomStr = 'a8eedb185eb2fecf' // 需要补足到16字节
    const msg =
      '{"ToUserName":"gh_97417a04a28d","FromUserName":"o9AgO5Kd5ggOC-bXrbNODIiE3bGY","CreateTime":1714112445,"MsgType":"event","Event":"debug_demo","debug_str":"hello world"}'
    const msgLen = msg.length // 需要转换成网络字节序的Uint8Array
    const appId = 'wxba5fad812f8e6fb9'
    const decodePack = decryptMessage(EncodingAESKey, expectEncryptedMessage)
    console.log({ decodePack })
    expect(decodePack.appId).toBe(appId)
    expect(decodePack.msgLen).toBe(msgLen)
    expect(decodePack.randomStr).toBe(randomStr)
    expect(decodePack.msg).toBe(msg)
  })
})
