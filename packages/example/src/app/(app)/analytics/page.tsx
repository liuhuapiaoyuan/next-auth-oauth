'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { AreaChartDemo } from '../dashboard/AreaChartDemo'
import { Counters } from '../dashboard/Counters'
import { RecentSales } from '../dashboard/RecentSales'

export const description = 'A stacked area chart'

export default function Component() {
  return (
    <div className='grid gap-5'>
      <div />
      <div className='flex items-center justify-between space-y-2'>
        <h2 className='text-3xl font-normal'>Hi，欢迎回来，王先生 👋</h2>
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Counters />
      </div>
      <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7'>
        <Card className='col-span-4'>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className='pl-2'>
            <AreaChartDemo />
          </CardContent>
        </Card>
        <Card className='col-span-4 md:col-span-3'>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>You made 265 sales this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
