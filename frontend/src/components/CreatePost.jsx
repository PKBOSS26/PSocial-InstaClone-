import { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState('');
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useSelector((store) => store.auth.user);
  const dispatch = useDispatch();
  const {posts} = useSelector((store) => store.post);


  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const CreatePostHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('caption', caption);
    if (imagePreview) formData.append('image', file);

    try {
      setLoading(true);
      const res = await axios.post(
        'https://psocial.kalehub.com/api/v1/post/addpost',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
        setCaption('');
        setImagePreview('');
        setFile('');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md"
      >
        <DialogHeader className="text-center text-lg font-semibold text-gray-800">
          Create New Post
        </DialogHeader>

        {/* User Info Section */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={user?.profilePicture} alt="User Avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-sm text-gray-800">{user.username || 'Username'}</h1>
            <span className="text-xs text-gray-500">Bio here...</span>
          </div>
        </div>

        {/* Caption Textarea */}
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full p-3 border rounded-md focus:ring-blue-500 focus:outline-none text-sm resize-none"
          placeholder="What's on your mind?"
          rows={3}
        />

        {/* Image Preview */}
        {imagePreview && (
          <div className="w-full h-64 mt-4 rounded-md overflow-hidden">
            <img
              src={imagePreview}
              alt="image preview"
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* File Input (hidden) */}
        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />

        {/* Select File Button */}
        <Button
          onClick={() => imageRef.current.click()}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
        >
          Select File
        </Button>

        {/* Submit Button or Loader */}
        {imagePreview && (
          <div className="mt-4">
            {loading ? (
              <Button className="w-full bg-gray-500 text-white py-2 rounded-md flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                onClick={CreatePostHandler}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition"
              >
                Create Post
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
