import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TaskBar from "../TaskBar/TaskBar";
import MainPosts from '../MainPosts/MainPosts';
import {Link} from 'react-router-dom';
// import "./MainPage.css";
import { useStateContext } from '../../context/index.jsx';
import CardList from "../CardList/CardList";
import CreateCampaignButton from "../CreateCampaignButton/CreateCampaignButton";
import CampaignList from "../CampaignList/CampaignList";


export default function Main(props) {
    const [messages, setMessage] = useState([]);
    const [cards, setCards] = useState([]);
    const [image, setImage] = useState();
    const [userName, setUserName] = useState('');
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [campaigns, setCampaigns] = useState([]);
    const { connect, address, contract, getCampaigns } = useStateContext();
    const navigate = useNavigate();
    const searchURL = process.env.BASE_URL + '/search/movie?' + process.env.API_KEY;
  
    useEffect(()=> {      
        getUser();
        getMovies();
        //  .then(username => setUserName(username))
    },[])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    
    const getMovies = async() => {
          const movies = await fetch(process.env.BASE_URL + '/discover/movie?sort_by=popularity.desc' + `&${process.env.API_KEY}`);
    
          const moviesArray = await movies.json();
          if(moviesArray){
            // console.log('moviesArray is ' + JSON.stringify(moviesArray));
            let resultedObject = JSON.stringify(moviesArray);
            let JsonObject = JSON.parse(resultedObject);
            setCards(JsonObject.results);
          }
      };

      const handleSearch = async(e) =>{
        let val = e.target.value;
            let newResults, result;
            if(val.length > 0) {
                result = await fetch(searchURL + '&query=' + val) 
                newResults = await result.json()
                let resultedObject = JSON.stringify(newResults);
                let JsonObject = JSON.parse(resultedObject);
                setCards(JsonObject.results)
            }else{
                getMovies()
            }  
    }

    const fetchCampaigns = async () => {
        setIsLoading(true);
        const data = await getCampaigns();
        setCampaigns(data);
        setIsLoading(false);
    }

    useEffect(() => {
        if(contract) fetchCampaigns();
    }, [address, contract]);

    const getUser = async() => {
        let user = await JSON.parse(localStorage.getItem('user'));
        await fetch(`http://localhost:8888/main/user/${user.payload.userId}`, {
            'method': 'POST'
            //'Authorization': `Bearer ${user.payload.userId}-${user.sessionId}-${user.sessionToken} `
        }).then(response => {response = response.json(); return response;})
        .then(responseJson => {setUserName(responseJson.username); setImage(`http://localhost:8888/photos/${responseJson.profile_image}`)})
        .catch(error => console.log(error));
    }


    return (
        <div>
            <TaskBar user={userName} setCards={setCards} handleSearch={handleSearch}/>
            <CardList cards={cards} setCards={setCards}/>
            <CreateCampaignButton
                btnType="button"
                title={address ? 'Create a campaign' : 'Connect to create'}
                styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
                isDisabled={false}
                handleClick={() => {
                    if(address) navigate('/campaigns/create')
                    else connect()
                }}
            />
            <CampaignList 
                title="All Campaigns"
                isLoading={isLoading}
                campaigns={campaigns}
            />
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