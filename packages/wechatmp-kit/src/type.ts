export type RequestXML = {
  FromUserName: string
  ToUserName: string
  MsgType: string
  Content: string
  MsgId: string
  EventKey?: string
}
export type ExcryptRequestXML = {
  Encrypt: string
  ToUserName: string
}

export type QueryParams = {
  signature: string
  timestamp: string
  nonce: string
  encrypt?: string
}

export type ResponseXML = {
  ToUserName: string
  FromUserName: string
  CreateTime: number
  MsgType: 'text'
  Content: string
}
export type AccessTokenApiResult = {
  access_token: string
  /**
       * 凭证有效时间，单位：秒
  
       */
  expires_in: number
}
export type QRCodeApiResult = {
  /**
   *  ticket	获取的二维码ticket，凭借此ticket可以在有效时间内换取二维码。
   */
  ticket: string
  /**
   * 该二维码有效时间，以秒为单位。 最大不超过2592000（即30天）。
   */
  expire_seconds: number
  /**
   * 二维码图片解析后的地址，开发者可根据该地址自行生成需要的二维码图片
   */
  url: string
}
