/**
 * 仅处理微信公众号消息的xml
 * @param xml
 * @returns
 */
export function parseWehcatMessageXML<T>(xml: string) {
  const result: Record<string, unknown> = {}
  // 匹配 XML 标签及其内容
  const regex = /<(\w+)>([\s\S]*?)<\/\1>/g
  let match

  while ((match = regex.exec(xml)) !== null) {
    const [, tag, content] = match
    const cleanContent = content.replace(/^<!\[CDATA\[|\]\]>$/g, '')
    // 尝试嵌套
    if (tag === 'xml') {
      return parseWehcatMessageXML(cleanContent)
    } else if (cleanContent.includes('<')) {
      const nestedResult = parseWehcatMessageXML(cleanContent)
      result[tag] = nestedResult
    } else {
      result[tag] = cleanContent
    }
  }

  return result as T
}

function _renderXML(data: Record<string, string | number | object>): string {
  const xmls = []
  for (const key in data) {
    const value = data[key]
    if (typeof value === 'number') {
      xmls.push(`<${key}>${value}</${key}>`)
    } else if (typeof value == 'object') {
      xmls.push(`<${key}>
  ${_renderXML(value as Record<string, string | number | object>)}
</${key}>`)
    } else {
      xmls.push(`<${key}><![CDATA[${value}]]></${key}>`)
    }
  }
  return xmls.join('')
}
/**
 * 提供 XML 输出
 * @param data
 * @returns
 */
export function renderXML(data: Record<string, string | number | object>) {
  const xmls = ['<xml>']
  xmls.push(_renderXML(data))
  xmls.push('</xml>')
  return xmls.join('')
}
const t1 = parseWehcatMessageXML<
  Record<string, string | number | object>
>(`<xml>
  <ToUserName><![CDATA[toUser]]></ToUserName>
  <FromUserName><![CDATA[fromUser]]></FromUserName>
  <CreateTime>
    <A>1348831860</A>
    <B>1348831860</B>
  </CreateTime>
  <MsgType><![CDATA[text]]></MsgType>
  <Content><![CDATA[this is a test]]></Content>
  <MsgId>1234567890123456</MsgId>
  <MsgDataId>xxxx</MsgDataId>
  <Idx>xxxx</Idx>
  </xml>
  `)
console.log({ t1 })
const t2 = renderXML(t1)
console.log({ t2 })
const t3 = parseWehcatMessageXML(t2)
console.log({ t3 })
