import React , {useState , useEffect} from 'react'
import Navbar from '../components/Navbar'
import { FaUserCircle , FaEnvelope, FaUserAlt , FaEdit, FaSave , FaPen, FaRegSave} from 'react-icons/fa';
import { useFetch } from '../context/Fetching';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const {img , userName , email , member , updateProfile , bio} = useFetch();
    const [selectedImage, setSelectedImage] = useState(null);
    const [message , setMessage] = useState(null);
    const navigate = useNavigate();
    const [editName , setEditName] = useState(false);
    const [editBio , setEditBio] = useState(false);
    const [saveBio , setSaveBio] = useState("");
    const [saveName , setSaveName] = useState("");

    useEffect(() => {
      setSaveBio(bio);
      setSaveName(userName);
    },[bio , userName]);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            setTimeout(() => {
                navigate("/login"); // Redirect to login after 3 seconds
            }, 3000);
        }
    }, [token, navigate]);

    const handleImage = async(e) => {
        const file = e.target.files[0];
        if(file){
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);

            const resposneMessage = await updateProfile(file , userName , bio);
            if( resposneMessage !== "success"){
                setMessage(resposneMessage)
            }
        }
    }

    const formattedDate = member
        ? new Date(member).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          })
        : "Loading...";
  return (
    <div>
    {token ? <div className=' min-h-screen bg-amber-50 pt-18'>
        <div className="flex flex-col items-center justify-center p-6">
            <h1 className=' text-3xl font-bold my-2 '>Profile</h1>
      <div className="relative w-32 h-32">
        <label htmlFor="upload-image" className="cursor-pointer">
          {img ? (
            <img
              src={img}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 shadow-lg"
            />
          ) : (
            <FaUserCircle className="w-32 h-32 text-gray-400 rounded-full border-2" />
          )}
        </label>
        <input
          type="file"
          id="upload-image"
          className="hidden"
          accept="image/*"
          onChange={handleImage}
        />
      </div>
      <h4 className=' text-lg font-medium my-2'>User can update their profile by clicking above</h4>
      {message && <p className="text-green-500">{message}</p>}
      <div className=" bg-gradient-to-r from-emerald-100 to-emerald-300 p-4 mt-4 rounded-lg shadow-md w-full md:w-1/2">
        <div className="flex flex-col gap-2">
            <div className=' flex gap-1 items-center font-medium'>
                    <FaUserAlt className=" text-green-500" />
                    <h4>Name</h4>
            </div>
            <div className=' w-full flex'>
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                readOnly={!editName}
                className={` w-full font-medium ${editName ? " bg-white " : "outline-none"} border-1 border-r-0 px-2 rounded-l-md py-1`}
              />
              <button onClick={async() => {
                if(editName){
                  const resposneMessage = await updateProfile(null , saveName , bio);
                  if( resposneMessage !== "success"){
                      setMessage(resposneMessage)
                  }
                  setEditName(false);
                }
                else{
                  setEditName(true);
                };
              }} className=' border-1 border-l-0 cursor-pointer bg-green-500 hover:bg-green-600 rounded-r-md py-1 px-6 '>
                {editName ? <FaRegSave className=' text-white text-lg'/> : <FaPen className=' text-white text-lg'/>}
              </button>
            </div>
        </div>
        <div className="flex flex-col gap-2 mt-4">
            <div className=' flex gap-1 items-center font-medium'>
                    <FaUserAlt className=" text-green-500" />
                    <h4>Bio</h4>
            </div>
            <div className=' w-full flex'>
              <input
                type="text"
                value={saveBio}
                onChange={(e) => setSaveBio(e.target.value)}
                readOnly={!editBio}
                className={` w-full font-medium ${editBio ? "bg-white" : "outline-none"} border-1 border-r-0 px-2 rounded-l-md py-1`}
              />
              <button onClick={async() => {
                if(editBio){
                  const resposneMessage = await updateProfile(null , userName , saveBio);
                  if( resposneMessage !== "success"){
                      setMessage(resposneMessage)
                  }
                  setEditBio(false);
                }
                else{
                  setEditBio(true);
                };
              }} className=' border-1 border-l-0 cursor-pointer bg-green-500 hover:bg-green-600 rounded-r-md py-1 px-6 '>
                {editBio ? <FaRegSave className=' text-white text-lg'/> : <FaPen className=' text-white text-lg'/>}
              </button>
            </div>
        </div>
        <div className=" flex flex-col gap-2 mt-4">
            <div className=' flex gap-1 items-center font-medium'>
                <FaEnvelope className="text-green-500" />
                <h4>Email</h4>
            </div>
            <span className=' font-medium border-1 px-2 rounded-md py-1'>{email}</span>
        </div>
        <div className=' mt-4 px-4'>
            <h1 className=' text-lg font-medium mb-4'>Account Information</h1>
            <div className=' flex justify-between font-medium mb-1'>
                <span>Member Since</span>
                <span>{formattedDate}</span>
            </div>
            <hr/>
            <div className=' flex justify-between font-medium mt-1'>
                <span>Account Status</span>
                <span className=' text-green-900'>Active</span>
            </div>
        </div>
      </div>
    </div>
    </div> : <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-3xl font-bold text-red-500">Unauthorized Access</h1>
                    <p className="text-lg text-gray-600 mt-2">
                        You need to log in to access this page. Redirecting to login...
                    </p>
    </div>}
    </div>
  )
}

export default Profile