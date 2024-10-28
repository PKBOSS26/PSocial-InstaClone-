import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';

const Profile = () => {
  const { id: userId } = useParams(); // Destructuring directly from useParams
  useGetUserProfile(userId); // Fetch user profile with custom hook

  const [activeTab, setActiveTab] = useState('posts');
  const { userProfile, user } = useSelector((store) => store.auth);

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = false; // Placeholder logic for following state

  const handleTabChange = (tab) => setActiveTab(tab);

  const displayedPosts = activeTab === 'posts' 
    ? userProfile?.posts 
    : userProfile?.bookmarks;

    console.log('User Profile:', userProfile);


  return (
    <div className='flex max-w-5xl justify-center mx-auto pl-10'>
      <div className='flex flex-col gap-20 p-8'>
        <div className='grid grid-cols-2'>
          {/* Avatar Section */}
          <section className='flex items-center justify-center'>
            <Avatar className='h-32 w-32'>
              <AvatarImage 
                src={userProfile?.profilepicture} 
                alt='profilephoto' 
                className='h-32 w-32 object-cover'
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>

          {/* Profile Details Section */}
          <section>
            <div className='flex flex-col gap-5'>
              <div className='flex items-center gap-2'>
                <span>{userProfile?.username}</span>

                {isLoggedInUserProfile ? (
                  <>
                    <Link to='/account/edit'>
                      <Button 
                        variant='secondary' 
                        className='hover:bg-gray-200 h-8'
                      >
                        Edit Profile
                      </Button>
                    </Link>
                    <Button variant='secondary' className='hover:bg-gray-200 h-8'>
                      View Archive
                    </Button>
                    <Button variant='secondary' className='hover:bg-gray-200 h-8'>
                      Ad Tools
                    </Button>
                  </>
                ) : (
                  isFollowing ? (
                    <>
                      <Button variant='secondary' className='h-8'>Unfollow</Button>
                      <Button variant='secondary' className='h-8'>Message</Button>
                    </>
                  ) : (
                    <Button className='bg-[#0095F6] hover:bg-[#3192d2] h-8'>
                      Follow
                    </Button>
                  )
                )}
              </div>

              {/* Posts, Followers, Following Count */}
              <div className='flex items-center gap-4'>
                <p>
                  <span className='font-semibold'>{userProfile?.posts.length} </span>
                  posts
                </p>
                <p>
                  <span className='font-semibold'>{userProfile?.followers.length} </span>
                  followers
                </p>
                <p>
                  <span className='font-semibold'>{userProfile?.following.length} </span>
                  following
                </p>
              </div>

              {/* Bio Section */}
              <div className='flex flex-col gap-1'>
                <span className='font-semibold'>{userProfile?.bio || 'bio here...'}</span>
                <Badge className='w-fit' variant='secondary'>
                  <AtSign /> 
                  <span className='pl-1'>{userProfile?.username}</span>
                </Badge>
                <span>Turning ideas into reality</span>
              </div>
            </div>
          </section>
        </div>

        {/* Tabs Section */}
        <div className='border-t border-t-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span 
              className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`} 
              onClick={() => handleTabChange('posts')}
            >
              POSTS
            </span>
            <span 
              className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''}`} 
              onClick={() => handleTabChange('saved')}
            >
              SAVED
            </span>
            <span className='py-3 cursor-pointer'>REELS</span>
            <span className='py-3 cursor-pointer'>TAGS</span>
          </div>

          {/* Posts Grid */}
          <div className='grid grid-cols-3 gap-1'>
            {displayedPosts?.map((post) => (
              <div 
                key={post?._id} 
                className='relative group cursor-pointer'
              >
                <img 
                  src={post.image} 
                  alt='postimage' 
                  className='rounded-sm my-2 w-full aspect-square object-cover' 
                />
                <div 
                  className='absolute inset-0 flex items-center justify-center 
                            bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 
                            transition-opacity duration-300'
                >
                  <div className='flex items-center text-white space-x-4'>
                    <button className='flex items-center gap-2 hover:text-gray-300'>
                      <Heart />
                      <span>{post?.likes.length}</span>
                    </button>
                    <button className='flex items-center gap-2 hover:text-gray-300'>
                      <MessageCircle />
                      <span>{post?.comments.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
