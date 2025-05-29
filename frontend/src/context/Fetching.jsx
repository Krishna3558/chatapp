import React, { createContext, useContext, useState , useEffect , useRef } from "react";
import io from 'socket.io-client';

const FetchContext = createContext();

const url = "http://localhost:3000";

const socket = io(url);

export const FetchProvider = ({children}) => {
    const [img , setImg] = useState('');
    const [userName , setUserName] = useState('');
    const [email , setEmail] = useState('');
    const [member , setMember] = useState('');
    const [user , setUser] = useState([]);
    const [message , setMessage] = useState({});
    const [isTyping , setIsTyping] = useState(false);
    const [typing , setTyping] = useState(false);
    const [socketConnected , setSocketConnected] = useState(false);
    const [selectedUser , setSelectedUser] = useState(null);
    const [token , setToken] = useState(localStorage.getItem('token'));
    const [userId , setUserId] = useState(localStorage.getItem('userId'));
    const [online , setOnline] = useState([]);
    const [lastSeen , setLastSeen] = useState({});
    const [bio , setBio] = useState('');

    useEffect(() => {

        if(userId && token){
            fetchData();
            fetchUser();
        }
        
    },[token , userId]);

    useEffect(() => {
        socket.emit("setup" , userId);
        socket.on("connected" , () => setSocketConnected(true));
        socket.on("typing" , () => setTyping(true));
        socket.on("stop typing" , () => setTyping(false));
        socket.on("online User" , (users) => {setOnline(users)});
        socket.on("last Seen" , (last) => setLastSeen(last))
    },[userId]);

    useEffect(() => {
        socket.on("messageRec" , (messageData) => {
            if(!selectedUser || selectedUser?._id !== messageData.senderId){
                console.log('hi');
                //notification
            }
            else{
                console.log("id:" , selectedUser._id);
                setMessage((prev) => ({
                    ...prev,
                    [selectedUser._id]: [...(prev[selectedUser._id] || []), messageData]
                }));
            }
        })

        return () => socket.off("messageRec");
    } , [selectedUser]);

    const typingTimeoutRef = useRef(null);

    const handleLogout = () => {
        socket.emit("logout" , userId);
        localStorage.removeItem('token');
        setToken(null);
        localStorage.removeItem('userId');
        setUserId(null);
    }

    const typingHandler = () => {
        if(!socketConnected) return ;

        if(!typing){
            setIsTyping(true);
            socket.emit("typing" , selectedUser?._id);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
    
        let lastTyping = new Date().getTime();
        const typingInterval = 3000;
    
        typingTimeoutRef.current = setTimeout(() => {
            let currentTime = new Date().getTime();
            let diff = currentTime - lastTyping;
    
            if (diff >= typingInterval && isTyping) {
                setIsTyping(false);
                socket.emit("stop typing", selectedUser?._id);
            }
        }, typingInterval);
    }

    const fetchData = async() => {
        try{
            const response = await fetch(`${url}/user/profile` , {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            setUserName(data.userName);
            setEmail(data.email);
            setImg(data.img);
            setMember(data.createdAt);
            setBio(data.bio);
        }
        catch(err){

        }
    }

    const handleSignup = async(field) => {
        try{
            const response = await fetch(`${url}/user/signup` , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(field)
            });
    
            const data = await response.json();
            if(data.message){
              return data.message;
            }
            else{
              if(data.token){
                localStorage.setItem('token' , data.token);
                localStorage.setItem('userId' , data.userId);
                setToken(data.token);
                setUserId(data.userId);
                setUserName(data.userName);
                setImg(data.img);
                setEmail(data.email);
                setMember(data.createdAt);
                setBio(data.bio);
              }
              return "success";
            }
          }
          catch(err){
            return err;
          }
    }

    const handleLogin = async(field) => {
        try{
            const response = await fetch(`${url}/user/login` , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(field)
            });

            const data = await response.json();
            if(data.message){
              return data.message;
            }
            else{
              if(data.token){
                localStorage.setItem('token' , data.token);
                localStorage.setItem('userId' , data.userId);
                setToken(data.token);
                setUserId(data.userId);
                setUserName(data.userName);
                setImg(data.img);
                setEmail(data.email);
                setMember(data.createdAt);
                setBio(data.bio);
                console.log(data);
              }
              return "success";
            }
        }
        catch(err){
            return err;
        }
    }

    const updateProfile = async(selectedImage , userName , bio) => {
        try{
            let base64Image = null;
            if(selectedImage){
                const reader = new FileReader();
                reader.readAsDataURL(selectedImage);
                reader.onloadend = async() => {
                    base64Image = reader.result;
                }
            }
            const response = await fetch(`${url}/user/updateProfile` , {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({img: base64Image , userName: userName.trim() , bio: bio.trim()})
            });

            const data = await response.json();

            if(response.ok){
                setImg(data.img);
                setBio(data.bio);
                setUserName(data.userName);
                return "success"
            }
            else{
                return data.message;
            }
        }
        catch(err){
            console.error("Error updating profile picture:", err);
            return "Error updating profile";
        }
    }

    const fetchUser = async() => {
        try{
            const response = await fetch(`${url}/message/userData` , {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();

            if(response.ok){
                setUser(data);
                data.map((users) => setLastSeen((prev) => ({...prev , [users._id]: users.lastSeen})))
                console.log(lastSeen);
                return "success";
            }
            else{
                return data.message;
            }
        }
        catch(err){
            console.error("Error updating profile picture:", err);
            return "Error updating profile";
        }
    }

    const fetchMessage = async(id) => {
        try{
            const response = await fetch(`${url}/message/${id}` , {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            if(response.ok){
                setMessage((prev) => ({
                    ...prev,
                    [id]: data
                }));
                return "success";
            }
            else{
                return response.message;
            }
        }
        catch(err){
            console.error("Error updating profile picture:", err);
            return "Error updating profile";
        }
    }

    const sendMessage = async(id , text , img) => {
        try{
            let base64Image
            if(img){
                const reader = new FileReader();
                reader.readAsDataURL(img);
                base64Image = await new Promise((resolve) => {
                    reader.onloadend = () => resolve(reader.result);
                });
            }

            const response = await fetch(`${url}/message/send/${id}` , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({text , img: base64Image})
            });

            const data = await response.json();

            if(response.ok){
                setMessage((prev) => ({
                    ...prev,
                    [id]: [...(prev[id] || []) , data]
                }));
                socket.emit("newMessage" , data);
                return "success";
            }
            else{
                return data.message;
            }
        }
        catch(err){
            console.error("Error updating profile picture:", err);
            return "Error updating profile";
        }
    }

    const updateSelectedUser = (data) => {
        setSelectedUser(data);
        socket.emit("joinChat" , data._id);
    }

    return(
        <FetchContext.Provider value={{handleLogin , handleSignup , updateProfile , fetchMessage , sendMessage , updateSelectedUser , typingHandler , handleLogout , bio , token , lastSeen , typing , online , selectedUser , img , email , userName , member , message , user}}>
            {children}
        </FetchContext.Provider>
    )
}

export const useFetch = () => useContext(FetchContext);