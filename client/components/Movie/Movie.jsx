import React from "react";
import "./Movie.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useStateContext } from '../../context/index.jsx';
import CreateCampaignButton from "../CreateCampaignButton/CreateCampaignButton";
import ReviewCard from "../ReviewCard/ReviewCard";

export default function Movie() {

  const [nrReviews, setNrReviews] = useState(0);
  const [reviewsList, setReviewsList] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewGrade, setReviewGrade] = useState(0);
  const [reviewList, setReviewList] = useState([]);
  const [specialReviewsList, setSpecialReviewList] = useState([]);
  const [showErrorBanner, setShowErrorBanner] = useState("");
  const location = useLocation();
  const { address, reviewContract, connect, addReview, getAllReviewsOfGivenMovie, disconnect} = useStateContext();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  var number = 0;
  var i = location.pathname.length - 1;
  var powerOfTen = 0;
  while (location.pathname[i] !== "/") {
    number = number + location.pathname[i] * Math.pow(10, powerOfTen);
    powerOfTen++;
    i--;
  }

  const handleReview = async () => {
    const userId = JSON.parse(localStorage.getItem('user')).payload.userId;
    console.log('sending review');
    const review = await fetch(`http://localhost:8888/review/${number}`, {
        
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userId,
              reviewText: reviewText,
              reviewGrade: reviewGrade
            })
          
        }
        );
        const jsonLikes = await review.json();
        if(jsonLikes.message === "REVIEW_ALREADY_EXISTS") {
          setShowErrorBanner("You already wrote a review for this movie");
        }
        setReviewsList([jsonLikes, ...reviewsList]);
}

  const handleSpecialReview = async () => {
    const userId = JSON.parse(localStorage.getItem('user')).payload.userId;
    console.log('sending review');
    try {
      const initialUserData = await fetch(`http://localhost:8888/main/user/${userId}`);
      const parsedUserData = await initialUserData.json();
      await addReview(number, parsedUserData.username, userId, reviewText, reviewGrade, parsedUserData.profile_image );
    } catch(error){
      console.log(error);
      setShowErrorBanner(error)
    }
    
  }

  const handleFetchedReviewList = async() => {
    const fetchedReviewList = await fetch(`http://localhost:8888/reviews/${number}`);

      const reviewListJSON = await fetchedReviewList.json();
      // console.log("The reviewList is ", reviewListJSON);
          if(reviewListJSON){
            setReviewList(reviewListJSON);
            setNrReviews(reviewListJSON.length)
          }
  }
    useEffect(() => {
      console.log("address is ", address)
     handleFetchedReviewList();
    }, []);

    const fetchSpecialReviews = async () => {
      const data = await getAllReviewsOfGivenMovie(number);
      console.log("Show data ", data)
      setSpecialReviewList(data);
  }

    useEffect(() => {
      console.log("new address is ", address)
      if(reviewContract && (address !== undefined || address !== "")) fetchSpecialReviews();
  }, [address, reviewContract]);
    
    const handleReviewChange = (e) => {
      setReviewText(e.target.value);
      if(showErrorBanner !== ""){
        setShowErrorBanner("");
      }
    }

    const handleReviewGradeChange = (e) => {
      setReviewGrade(e.target.value);
      if(showErrorBanner !== ""){
        setShowErrorBanner("");
      }
    }

    const chooseReviewHandler = () => {
      if(address) {
        handleSpecialReview();
      } else {
        handleReview();
      }
    }

    const handleConnectionButton = (e) =>  {
      console.log("Try connecting...");
      if(!address) {
        console.log("Connecting...");
        connect();
        console.log("Connected");
        e.target.innerText = "Connected";
      } else {
        console.log("Disconnecting...");
        disconnect();
        console.log("Disconnected");
        e.target.innerText = "Connect for special vote"
      }
  }

  return (
    <>
    <div className="movie-card">
      <span className="leftside">
          <div id="picture-parent">
          <picture>
          <img
            className="movie-img"
            src={location.state.moviePhoto}
            alt="profile-poster"
          />
          
        </picture>
          </div>
       
      </span>
      <span className="rightside">
        <div className="profile-cards">
          <ul className="profile_list">
            <li className="profile_item">{location.state.title}</li>
            <li className="profile_item">{location.state.description}</li>
            <li className="profile_item">Release date: {location.state.releaseDate}</li>
          </ul>
        </div>
      </span>
    </div>

    <div className="reviews-section">
      <div className="review-input-box">
        <input type="text" name="review" id="review-input" onChange={e => handleReviewChange(e)}/>
        {showErrorBanner !== "" ? <div id="error_banner">{showErrorBanner}</div> : null}
        <div className="review-input-buttons">
        <CreateCampaignButton
            btnType="button"
            title={address ? 'Connected' : 'Connect for special vote'}
            styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
            handleClick={handleConnectionButton}
        />
        <input type="number" name="review_grade" id="review_grade" max={10} min={0} onChange={e => handleReviewGradeChange(e)}/>
          <button className="editor_card_button" onClick={() => chooseReviewHandler()}>Submit</button>
        </div>
      </div>
      <div className="review-columns">
      <span id="special-column">
      {specialReviewsList.length > 0
        ? specialReviewsList.map((review, i) => (
          <ReviewCard id={i} review={review}/>
          ))
        : (
          <span>There are no reviews</span>
        )}
      </span>
      <span id="normal-column">
      {reviewList.length > 0
        ? reviewList.map((review, i) => (
            <ReviewCard id={i} review={review}/>
          ))
        : (
          <span>There are no reviews</span>
        )}
      </span>
      </div>
    </div>
    </>
  );
}
