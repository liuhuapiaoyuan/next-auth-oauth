import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
const users = [
  {
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    avatar: {
      src: 'https://material-kit-pro-react.devias.io/assets/avatar-5.png',
      fallback: 'OM',
    },
    amount: '+$1,999.00',
  },
  {
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    avatar: {
      src: 'https://material-kit-pro-react.devias.io/assets/avatar-3.png',
      fallback: 'JL',
    },
    amount: '+$39.00',
  },
  {
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    avatar: {
      src: 'https://material-kit-pro-react.devias.io/assets/avatar-4.png',
      fallback: 'IN',
    },
    amount: '+$299.00',
  },
  {
    name: 'William Kim',
    email: 'will@email.com',
    avatar: {
      src: 'https://material-kit-pro-react.devias.io/assets/avatars/avatar-anika-visser.png',
      fallback: 'WK',
    },
    amount: '+$99.00',
  },
  {
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    avatar: {
      src: 'https://material-kit-pro-react.devias.io/assets/avatars/avatar-miron-vitold.png',
      fallback: 'SD',
    },
    amount: '+$39.00',
  },
]

export default function CustomerPage() {
  return (
    <div className='space-y-8 w-full gap-2'>
      {users.map((user, index) => (
        <Card key={index}>
          <CardContent className='flex items-center pt-6 hover:shadow '>
            <Avatar className='h-9 w-9'>
              <AvatarImage src={user.avatar.src} alt='Avatar' />
              <AvatarFallback>{user.avatar.fallback}</AvatarFallback>
            </Avatar>
            <div className='ml-4 space-y-1'>
              <p className='text-sm font-medium leading-none'>{user.name}</p>
              <p className='text-sm text-muted-foreground'>{user.email}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
