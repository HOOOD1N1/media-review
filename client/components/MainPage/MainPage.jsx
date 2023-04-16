import React, { useState, useEffect } from "react";
import TaskBar from '../TaskBar/TaskBar';
import MainPosts from '../MainPosts/MainPosts';
import {Link} from 'react-router-dom';
import "./MainPage.css";


export default function Main(props) {
    const [messages, setMessage] = useState([]);
    const [image, setImage] = useState();
    const [userName, setUserName] = useState('');
    const [text, setText] = useState('');
  
    useEffect(()=> {      
        var user = JSON.parse(localStorage.getItem('user'));
         fetch(`http://localhost:8888/main/user/${user.userId}`, {
             'method': 'POST'
             //'Authorization': `Bearer ${user.userId}-${user.sessionId}-${user.sessionToken} `
         }).then(response => {response = response.json(); return response;})
         .then(responseJson => {setUserName(responseJson.username); setImage(`http://localhost:8888/photos/${responseJson.profile_image}`)})
         .catch(error => console.log(error));
         //.then(username => setUserName(username))
    },[])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    

    return (
        <div>
            <TaskBar user={userName} history={props.history}/>
            {/* <div className="main" id="main-div">

            <aside className="left aside" id="main-left-box">
                <span className="infos">
                <Link style={{textDecoration: 'none'}} to={`/profile/${JSON.parse(localStorage.getItem('user')).userId}`} image={image}>
                <picture>
                    <img src={image} style={{borderRadius: '50%', width: '50px', height: '50px'}} alt="photo_user"/>
                </picture>
                <span className="user_info">
                    
                    <p style={{display:'inline', verticalAlign:'super'}}>{userName}</p>
                    
                
                </span>
                </Link>
                </span>
                        
            </aside>
            <span className="feedbar">
                <div className="feed">
                    
                    <MainPosts currentUser={JSON.parse(localStorage.getItem('user')).userId}/>
                    

                </div> 
            </span>
            
            </div> */}
        </div>
    );

}