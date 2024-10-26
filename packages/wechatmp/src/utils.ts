/**
 * 仅处理微信公众号消息的xml
 * @param xml
 * @returns
 */
export function parseWehcatMessageXML<T>(xml: string) {
  const result: Record<string, string> = {}
  // 匹配 XML 标签及其内容
  const regex = /<(\w+)>([\s\S]*?)<\/\1>/g
  let match

  while ((match = regex.exec(xml)) !== null) {
    const [, tag, content] = match
    const cleanContent = content.replace(/^<!\[CDATA\[|\]\]>$/g, '')
    // 尝试嵌套
    if (tag === 'xml') {
      return parseWehcatMessageXML(cleanContent)
    } else {
      result[tag] = cleanContent
    }
  }

  return result as T
}

/**
 * 提供 XML 输出
 * @param data
 * @returns
 */
export function renderXML(data: Record<string, string | number>) {
  const xmls = ['<xml>']
  for (const key in data) {
    const value = data[key]
    if (typeof value === 'number') {
      xmls.push(`<${key}>${value}</${key}>`)
    } else {
      xmls.push(`<${key}><![CDATA[${value}]]></${key}>`)
    }
  }
  xmls.push('</xml>')
  return xmls.join('')
}
