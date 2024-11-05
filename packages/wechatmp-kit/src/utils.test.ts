import { test, expect } from 'bun:test'
import { parseWehcatMessageXML, renderXML } from './utils'

test('parseWehcatMessageXML should correctly parse XML', () => {
  const xml = `
    <xml>
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
  `

  const expected = {
    ToUserName: 'toUser',
    FromUserName: 'fromUser',
    CreateTime: {
      A: '1348831860',
      B: '1348831860',
    },
    MsgType: 'text',
    Content: 'this is a test',
    MsgId: '1234567890123456',
    MsgDataId: 'xxxx',
    Idx: 'xxxx',
  }

  const result = parseWehcatMessageXML(xml)
  expect(result).toEqual(expected)
})

test('renderXML should correctly render object to XML', () => {
  const data = {
    ToUserName: 'toUser',
    FromUserName: 'fromUser',
    CreateTime: {
      A: 1348831860,
      B: 1348831860,
    },
    MsgType: 'text',
    Content: 'this is a test',
    MsgId: 1234567890123456,
    MsgDataId: 'xxxx',
    Idx: 'xxxx',
  }

  const expected = `
    <xml>
      <ToUserName><![CDATA[toUser]]></ToUserName>
      <FromUserName><![CDATA[fromUser]]></FromUserName>
      <CreateTime>
        <A>1348831860</A>
        <B>1348831860</B>
      </CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[this is a test]]></Content>
      <MsgId>1234567890123456</MsgId>
      <MsgDataId><![CDATA[xxxx]]></MsgDataId>
      <Idx><![CDATA[xxxx]]></Idx>
    </xml>
  `

  const result = renderXML(data)
  expect(result.replace(/\s/g, '')).toEqual(expected.replace(/\s/g, ''))
})

test('parseWehcatMessageXML and renderXML should be inverses', () => {
  const xml = `
    <xml>
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
  `

  const parsed =
    parseWehcatMessageXML<Record<string, string | number | object>>(xml)
  const rendered = renderXML(parsed)
  const reparsed = parseWehcatMessageXML(rendered)

  expect(reparsed).toEqual(parsed)
})
