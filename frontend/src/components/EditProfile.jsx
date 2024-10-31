import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';

const EditProfile = () => {
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(user?.profilePicture || '');
  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio || '',
    gender: user?.gender || 'male',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be under 5MB');
        return;
      }
      setInput((prev) => ({ ...prev, profilePhoto: file }));
      setPreview(URL.createObjectURL(file)); // Set preview image
    }
  };

  const selectChangeHandler = (value) => {
    setInput((prev) => ({ ...prev, gender: value }));
  };

  const editProfileHandler = async () => {
    if (!input.bio.trim()) {
      toast.error('Bio cannot be empty');
      return;
    }

    const formData = new FormData();
    formData.append('bio', input.bio);
    formData.append('gender', input.gender);
    if (input.profilePhoto instanceof File) {
      formData.append('profilePhoto', input.profilePhoto);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        'https://psocial.onrender.com/api/v1/user/profile/edit',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data.user?.gender,
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user?._id}`);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <section className="flex flex-col gap-8 w-full">
        <h1 className="font-extrabold text-3xl text-gray-800">Edit Profile</h1>

        {/* Profile Photo Section */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={preview} alt="profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-lg text-gray-700">{user?.username}</h2>
              <span className="text-gray-500 text-sm">{user?.bio || 'No bio yet...'}</span>
            </div>
          </div>
          <input
            ref={imageRef}
            onChange={fileChangeHandler}
            type="file"
            className="hidden"
            accept="image/*"
          />
          <Button
            onClick={() => imageRef.current?.click()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Change Photo
          </Button>
        </div>

        {/* Bio Section */}
        <div>
          <h2 className="font-semibold text-xl mb-2 text-gray-800">Bio</h2>
          <Textarea
            value={input.bio}
            onChange={(e) => setInput((prev) => ({ ...prev, bio: e.target.value }))}
            name="bio"
            placeholder="Tell us about yourself..."
            className="focus-visible:ring-blue-500 border border-gray-300 rounded-md p-4"
          />
        </div>

        {/* Gender Section */}
        <div>
          <h2 className="font-semibold text-xl mb-2 text-gray-800">Gender</h2>
          <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
            <SelectTrigger className="w-full border border-gray-300 rounded-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          {loading ? (
            <Button className="w-fit bg-blue-500 text-white hover:bg-blue-600 px-6 py-2 rounded-md">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </Button>
          ) : (
            <Button
              onClick={editProfileHandler}
              className="w-fit bg-blue-500 text-white hover:bg-blue-600 px-6 py-2 rounded-md"
              disabled={!input.bio.trim() && !(input.profilePhoto instanceof File)}
            >
              Save
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
