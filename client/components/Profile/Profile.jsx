import React, {useState, useEffect} from 'react';
import TaskBar from '../TaskBar/TaskBar';
import ProfileCard from '../ProfileCard/ProfileCard';
import CardList from '../CardList/CardList';
import ProfileUserReviews from '../ProfileUserReviews/ProfileUserReviews';
import {Link} from 'react-router-dom';
import './Profile.css';
import ProfileUserComments from '../ProfileUserComments/ProfileUserComments';

 function Profile(props){

    const [name, setName] = useState('');
    const [nrPosts, setNrPosts] = useState(0);
    const [nrComments, setNrComments] = useState(0);
    const [item, setItem] = useState('user-posts');
    

    useEffect(() => {
        // setItem('user-posts');
        //window.setItem = setItem;
    },[]);

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
        <div >
            <TaskBar/>
            <div className="profile-page">
            <ProfileCard/>
            {/* <ul className="buttons">
                <li className="button" >
                    <span id ='user-posts' onClick={()=>{
                        console.log('clicked on posts')
                        setItem('user-posts');
                    }}>Crowdfunding Projects</span>
                </li>
                <li className="button" >
                    <span id ='user-reviews' onClick={()=>{
                        console.log('clicked on reviews')
                        setItem('user-reviews');
                    }}>Reviews</span>
                </li>
                <li className="button" >
                    <span id ='user-comments' onClick={()=>{
                        console.log('clicked on comments')
                        setItem('user-comments');
                    }}>Comments</span>
                </li>
            </ul> */}
            {/* <CardList page='profile' type={item}/> */}
           {item === 'user-comments' ? <ProfileUserComments routerUser={props.routerUser} parent='profile'/> : null}
           {item === 'user-reviews' ? <ProfileUserReviews routerUser={props.routerUser} parent='profile'/> : null}
        </div>
        </div>
    );
}
export default Profile;