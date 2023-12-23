import { FaHome, FaSearch } from 'react-icons/fa'
import { HiLibrary } from 'react-icons/hi'

function Nav() {
  return (
    <div className='mt-2 min-h-min shrink grow basis-60 '>
      <ul className='w-full p-3 font-semibold'>
        <li className=' flex w-full cursor-pointer py-2 align-middle text-2xl hover:text-green-100'>
          <span className=' my-auto flex min-h-full justify-center px-2 pt-0.5 align-middle'>
            <FaHome />
          </span>{' '}
          <span className=''>Home</span>
        </li>
        <li className='flex w-full cursor-pointer py-2 align-middle text-2xl font-semibold hover:text-green-100'>
          <span className=' my-auto flex min-h-full justify-center px-2 pt-0.5 align-middle'>
            <FaSearch />
          </span>{' '}
          <span>Search</span>
        </li>
        <li className='flex w-full cursor-pointer py-2 align-middle text-2xl font-semibold hover:text-green-100'>
          <span className=' my-auto flex min-h-full justify-center px-2 pr-1 pt-0.5 align-middle'>
            <HiLibrary />
          </span>{' '}
          <span className=''>Your Library</span>
        </li>
      </ul>
    </div>
  )
}

export default Nav
