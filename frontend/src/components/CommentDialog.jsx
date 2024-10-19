import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';

const CommentDialog = ({ open, setOpen }) => {
    const [text, setText] = useState('');

    const handleChange = (e) => {
        setText(e.target.value);
    };

    const handleSendMessage = async () => {
        if (text.trim()) {
            alert(text);
            setText('');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className='flex flex-1 max-w-3xl max-h-[80vh] w-full h-full p-8 rounded-lg shadow-lg'>
                <div className='w-1/2'>
                    <img
                        src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_640.jpg"
                        alt="Comment background" // Added alt for accessibility
                        className='w-full h-full object-cover rounded-l-lg'
                    />
                </div>
                <div className='flex flex-col w-1/2 justify-between'>
                    <div className='flex items-center justify-between '>
                        <Link to="#">
                            <Avatar>
                                <AvatarImage src='https://github.com/shadcn.png' alt="User Avatar" className='h-10 w-10 rounded-full'/>
                                <AvatarFallback>UN</AvatarFallback>
                            </Avatar>
                        </Link>
                            <Link to="#" className='font-semibold text-xs'>username</Link>
                        <div>
                            <span className='text-gray-500 text-sm'>Bio here...</span>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <MoreHorizontal className='cursor-pointer' aria-label="More options" />
                            </DialogTrigger>
                            <DialogContent className='flex flex-col text-center'>
                                <div className='cursor-pointer text-red-500' onClick={() => alert('Unfollowed!')}>
                                    Unfollow
                                </div>
                                <div className='cursor-pointer' onClick={() => alert('Added to favorites!')}>
                                    Add to favorites
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <hr />
                    <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                        {/* Placeholder for comments */}
                        <p>Comments will show here...</p>
                    </div>
                    <div className='p-4'>
                        <div className='flex items-center gap-2'>
                            <input
                                type="text"
                                value={text}
                                onChange={handleChange}
                                placeholder='Add a comment'
                                className='w-full outline-none border border-gray-300 rounded-lg p-2'
                            />
                            <Button
                                disabled={!text.trim()}
                                onClick={handleSendMessage}
                                variant='outline'
                            >
                                Send
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CommentDialog;
