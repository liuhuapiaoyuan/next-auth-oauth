export function Header() {
  return (
    <header className='bg-[#FCF8F1] bg-opacity-30'>
      <div className='px-4 mx-auto sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16 lg:h-20'>
          <div className='flex-shrink-0'>
            <a href='#' title='' className='flex'>
              <img
                className='w-auto h-8'
                src='https://cdn.rareblocks.xyz/collection/celebration/images/logo.svg'
                alt=''
              />
            </a>
          </div>

          <button
            type='button'
            className='inline-flex p-2 text-black transition-all duration-200 rounded-md lg:hidden focus:bg-gray-100 hover:bg-gray-100'
          >
            <svg
              className='block w-6 h-6'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 8h16M4 16h16'
              />
            </svg>

            <svg
              className='hidden w-6 h-6'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>

          <div className='hidden lg:flex lg:items-center lg:justify-center lg:space-x-10'>
            <a
              href='#feature'
              title=''
              className='text-base text-black transition-all duration-200 hover:text-opacity-80'
            >
              {' '}
              特性{' '}
            </a>

            <a
              href='#'
              title=''
              className='text-base text-black transition-all duration-200 hover:text-opacity-80'
            >
              {' '}
              技术栈{' '}
            </a>

            <a
              href='#'
              title=''
              className='text-base text-black transition-all duration-200 hover:text-opacity-80'
            >
              {' '}
              预览{' '}
            </a>

            <a
              href='#'
              title=''
              className='text-base text-black transition-all duration-200 hover:text-opacity-80'
            >
              {' '}
              报价{' '}
            </a>
          </div>

          <div className='relative inline-flex items-center justify-center gap-4 group'>
            <div className='absolute inset-0 duration-1000 opacity-60 transitiona-all bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200' />
            <a
              href='/dashboard'
              title='payment'
              className='group relative inline-flex items-center justify-center text-base rounded-xl bg-gray-900 px-8 py-3 font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30'
              role='button'
            >
              DEMO
              <svg
                className='mt-0.5 ml-2 -mr-1 stroke-white stroke-2'
                fill='none'
                width='10'
                height='10'
                viewBox='0 0 10 10'
                aria-hidden='true'
              >
                <path
                  className='transition opacity-0 group-hover:opacity-100'
                  d='M0 5h7'
                />
                <path
                  className='transition group-hover:translate-x-[3px]'
                  d='M1 1l4 4-4 4'
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
