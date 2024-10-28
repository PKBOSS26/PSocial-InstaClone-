
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const SuggestedUsers = () => {
  const { SuggestedUsers } = useSelector(store => store.auth)

  if (!SuggestedUsers?.length) {
    return <p className="text-center text-gray-500 my-5">No suggested users available.</p>
  }

  return (
    <div className='my-10'>
      <div className='flex items-center justify-between text-sm mb-4'>
        <h1 className='font-semibold text-gray-600'>Suggested Users</h1>
        <span className='font-medium cursor-pointer hover:underline'>See all</span>
      </div>

      {SuggestedUsers.map((user) => (
        <div key={user._id} className="flex items-center justify-between gap-2 mb-4">
          <Link to={`/profile/${user._id}`} className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.profilePicture || ''} alt={`${user.username}'s avatar`} />
              <AvatarFallback>{user.username?.slice(0, 2).toUpperCase() || 'UN'}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <h1 className="font-semibold text-sm">
                <Link to={`/profile/${user._id}`}>{user.username}</Link>
              </h1>
              <span className='text-sm text-gray-600'>{user.bio || 'No bio available'}</span>
            </div>
          </Link>

          <button className='text-blue-500 text-xs font-bold hover:text-blue-600'>
            Follow
          </button>
        </div>
      ))}
    </div>
  )
}

export default SuggestedUsers
