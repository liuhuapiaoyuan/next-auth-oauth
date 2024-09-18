import Image from 'next/image'
import { UserProfile } from './UserProfile'
import { UserAvatar } from './UserAvatar'

const SlideUserProfile = (props: { simple?: boolean }) => {
  return (
    <UserProfile>
      <UserAvatar className='w-full py-2  h-auto' />
    </UserProfile>
  )
}

export { SlideUserProfile }
