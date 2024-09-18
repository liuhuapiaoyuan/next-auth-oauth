import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Activity,
  BadgePercent,
  Gauge,
  Podcast,
  ShoppingCart,
  UserPlus,
  Users,
} from 'lucide-react'
import React from 'react'

export type CounterItemProps = {
  title: string
  content: React.ReactNode
  description?: string
  icon?: React.ReactNode
}

// CounterItem 组件
function CounterItem({ title, content, description, icon }: CounterItemProps) {
  return (
    <Card className='group/counterItem  cursor-pointer'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <span className='text-muted-foreground'>{icon}</span>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold group-hover/counterItem:scale-110 transition-all'>
          {content}
        </div>
        <p className='text-xs text-muted-foreground'>{description}</p>
      </CardContent>
    </Card>
  )
}
// Counters 组件
export function Counters() {
  const dataList: CounterItemProps[] = [
    {
      title: '总收入',
      content: '¥67,890.50',
      description: '较上月增长15.3%',
      icon: <Activity />,
    },
    {
      title: '订单数量',
      content: '1,234',
      description: '较上月增长10.2%',
      icon: <ShoppingCart />,
    },
    {
      title: '新增用户',
      content: '890',
      description: '较上月增长22.5%',
      icon: <UserPlus />,
    },
    {
      title: '活跃用户',
      content: '3,456',
      description: '较上周增长5.7%',
      icon: <Users />,
    },
  ]

  return (
    <>
      {dataList.map((item, index) => (
        <CounterItem
          key={index}
          title={item.title}
          icon={item.icon}
          content={item.content}
          description={item.description}
        />
      ))}
    </>
  )
}
