import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetAllMessage from '@/hooks/useGetAllMessage';
import useGetRTM from '@/hooks/useGetRTM';

const Messages = ({ selectedUser }) => {
    useGetRTM();
    useGetAllMessage();

    const { messages = [], loading, error } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);

    
    return (    
        <div className='overflow-y-auto flex-1 p-4'>
            <div className='flex justify-center'>
                <div className='flex flex-col items-center justify-center'>
                    <Avatar className="h-20 w-20">
                        {selectedUser?.profilePicture ? (
                            <AvatarImage src={selectedUser.profilePicture} alt='profile' />
                        ) : (
                            <AvatarFallback>CN</AvatarFallback>
                        )}
                    </Avatar>
                    <span>{selectedUser?.username}</span>
                    <Link to={`/profile/${selectedUser?._id}`}>
                        <Button className="h-8 my-2" variant="secondary">View profile</Button>
                    </Link>
                </div>
            </div>
            
            <div className='flex flex-col gap-3'>
                {loading && <p>Loading messages...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {messages.length > 0 ? (
                    messages.map((msg) => {
                        // Check if msg and msg.senderId are defined
                        if (!msg || !msg.senderId) {
                            return null; // Skip this message if it's invalid
                        }
                        return (
                            <div key={msg._id} className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-2 rounded-lg max-w-xs break-words ${msg.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                                    {msg.message}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>No messages yet.</p>
                )}
            </div>
        </div>  
    );
}

export default Messages;
