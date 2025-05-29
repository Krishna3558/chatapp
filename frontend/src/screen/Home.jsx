import React , {useState , useEffect, useRef} from 'react'
import Navbar from '../components/Navbar'
import { useFetch } from '../context/Fetching'
import { FaSearch , FaUser , FaPaperPlane , FaCamera , FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Userprofile from '../components/Userprofile';

function Home() {
  const {user , message , fetchMessage , sendMessage , selectedUser , updateSelectedUser , typingHandler , typing , online , lastSeen} = useFetch();
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [sent , setSent] = useState(false);
  const [chat , setChat] = useState(false);
  const [showProfile , setShowProfile] = useState(false);

  const navigate = useNavigate();

  const handleProfileClick = () => {
        setShowProfile(true);
  }

  useEffect(() => {
    if (selectedUser) {
        fetchMessage(selectedUser._id);
        setChat(true);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message[selectedUser?._id]]);

  const handleRemoveImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset file input
        }
    };

    useEffect(() => {
        console.log("Messages updated:", message);
    }, [message]);

  const handleSendMessage = async() => {
    if( !text.trim() && !selectedImage) return ;
    const responseMessage = await sendMessage(selectedUser._id , text , selectedImage);
    setText("");
    setSelectedImage(null);
    setSent(!sent);
    console.log(responseMessage);
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 to 12
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const getLastSeen = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >=12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const today = new Date();
    const yesterday = new Date();
    let dateLabel;
    yesterday.setDate(today.getDate() - 1);
    if(
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    ){
        dateLabel = "today"
    }
    else if(
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()
    ){
        dateLabel = "yesterday"
    }
    else{
        dateLabel = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }
    return `last seen ${dateLabel} at ${formattedHours}:${formattedMinutes} ${ampm}`
  }

  const day = new Date().getDate();

  const [grouped, setGrouped] = useState({});

  useEffect(() => {
    let tempGrouped = {};
    const messageArray = Object.values(message[selectedUser?._id] || {})
    messageArray.forEach((msg) => {
        const date = new Date(msg.createdAt);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        let dateLabel;

        if(
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        ){
            dateLabel = "today"
        }

        else if(
            date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear()
        ){
            dateLabel = "yesterday"
        }

        else{
            dateLabel = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        }

        if(!tempGrouped[dateLabel]){
            tempGrouped[dateLabel] = [];
        }

        tempGrouped[dateLabel].push(msg);
    })
    setGrouped(tempGrouped);
    } , [message , selectedUser]);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            setTimeout(() => {
                navigate("/login"); // Redirect to login after 3 seconds
            }, 3000);
        }
    }, [token, navigate]);

  return (
    <div className="">
      {token ? <div className="flex bg-gray-100">
            {/* Sidebar */}
            <div className={`w-full md:w-1/4 min-h-screen fixed top-18 p-4 bg-white shadow-lg md:block ${chat ? "hidden" : "block"}`}>
                <h2 className="text-xl font-bold mb-4">Chats</h2>
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full p-2 pl-8 border rounded-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <FaSearch className="absolute left-2 top-3 text-gray-500" />
                </div>

                <div className="overflow-y-auto h-[calc(100vh-150px)]">
                    {user
                        .filter((item) => item.userName.toLowerCase().includes(search.toLowerCase()))
                        .map((item) => (
                            <div
                                key={item._id}
                                className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${
                                    selectedUser?._id === item._id ? "bg-green-600 text-white" : "hover:bg-gray-200"
                                }`}
                                onClick={() => updateSelectedUser(item)}
                            >
                                {item.img ? <img
                                  src={item?.img}
                                  alt='User image'
                                  className='w-10 h-10 rounded-full'
                                /> : <button className=' rounded-full w-10 h-10 flex justify-center items-center bg-gray-500 text-white'>
                                        <FaUser className="text-xl" />
                                    </button>}
                                <span className="font-medium">{item.userName}</span>
                            </div>
                        ))}
                </div>
            </div>

            {/* Chat Interface */}
            {showProfile && selectedUser && (
                <Userprofile user={selectedUser} onClose={() => setShowProfile(false)} />
            )}
            <div className={`w-full md:w-3/4 min-h-screen absolute left-0 md:left-1/4 flex flex-col bg-white shadow-lg md:block ${chat ? "block" : "hidden"}`}>
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 fixed top-18 w-full bg-green-600 text-white font-bold flex items-center gap-2">
                            <button className="md:hidden text-xl" onClick={() => {setChat(false); updateSelectedUser(null);}}>
                                <FaArrowLeft />
                            </button>
                              {selectedUser.img ? <img
                                  src={selectedUser?.img}
                                  alt='User image'
                                  className='w-10 h-10 rounded-full'
                                /> : <button onClick={handleProfileClick} className=' rounded-full w-10 h-10 flex justify-center items-center bg-gray-500 text-white'>
                                        <FaUser className="text-xl" />
                                    </button>}
                            <div>
                                <p>{selectedUser.userName}</p>
                                <p className=' text-sm font-normal'>{typing ? `Typing...` : (Object.keys(online).includes(selectedUser?._id) ? "Online" : `${getLastSeen(lastSeen[selectedUser?._id])}`)}</p>
                            </div>
                        </div>

                        {/* Chat Messages */}

                        <div className="flex flex-col min-h-screen gap-3 p-4 pt-40 pb-20 overflow-y-scroll">
                        {Object.keys(grouped)?.map((date, index) => (
                            <div key={index} className="flex flex-col gap-2">
                                <div className=' text-center'>
                                    <span className=" capitalize py-1 px-2 rounded-sm bg-amber-200 text-sm text-black my-2">
                                    {date}
                                    </span>
                                </div>
                                {grouped[date].map((msg) => (
                                <div key={msg._id} className={`flex ${msg.senderId === selectedUser._id ? "justify-start" : "justify-end"}`}>
                                    <div className={`p-3 min-w-28 max-w-xs rounded-2xl shadow ${msg.senderId === selectedUser._id ? "bg-gray-300 text-black" : "bg-green-500 text-white"}`}>
                                    {msg.img && <img src={msg.img} alt="Message" className="w-40 rounded-lg mb-2" />}
                                    <p className="break-words">{msg.text}</p>
                                    <p className=' text-right text-xs mt-1'>{formatTime(msg.createdAt)}</p>
                                    </div>
                                </div>
                                ))}
                            </div>
                            ))}

                            {selectedImage && (
                                    <div className="p-2 border max-w-full flex justify-between items-start bg-gray-100">
                                        <img src={URL.createObjectURL(selectedImage)} alt="Preview" className="w-20 h-20 rounded-md" />
                                        <button onClick={handleRemoveImage} className="text-red-500 cursor-pointer">✖</button>
                                    </div>
                            )}
                            <div ref={messageEndRef}></div>
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 fixed w-full md:w-3/4 z-20 bg-white bottom-0 flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="flex-1 py-1 md:p-2 border rounded-lg"
                                value={text}
                                onChange={(e) => {setText(e.target.value);
                                    typingHandler();
                                }}
                            />
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="file-upload"
                                onChange={(e) => setSelectedImage(e.target.files[0])}
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <FaCamera className="text-green-500 hover:text-green-600 text-xl md:text-3xl" />
                            </label>
                            <button
                                className="rounded-full w-6 h-6 md:w-10 md:h-10 flex justify-center items-center bg-green-500 text-white"
                                onClick={handleSendMessage}
                            >
                                <FaPaperPlane className="text-sm md:text-lg" />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center flex-1 text-gray-500">
                        Select a user to start chatting
                    </div>
                )}
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

export default Home
