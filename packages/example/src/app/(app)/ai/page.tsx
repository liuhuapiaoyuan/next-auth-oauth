import { ChatContainer } from './ChatContainer'
import { ChatPane } from './ChatPane'

export default function AIChage() {
  return (
    <div className='flex w-full h-full gap-4'>
      <div className=''>
        <ChatPane />
      </div>
      <div className='flex-1 w-1'>
        <ChatContainer />
      </div>
    </div>
  )
}
