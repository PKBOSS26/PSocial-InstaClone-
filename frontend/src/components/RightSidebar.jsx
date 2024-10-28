
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import SuggestedUsers from './SuggestedUsers'

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth)
  return (
    <div className='w-fit my-10 pr-32'>
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}> 
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt={`${user.username}'s avatar`} />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
        </Link>

        <div className='flex flex-col items-center'>
          <h1 className="font-semibold text-sm"><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
          <span className='text-sm text-gray-600'>{user?.bio || 'No bio'}</span>
        </div>
      </div>

      <SuggestedUsers/>
    </div>
  )
}

export default RightSidebar