import React from "react";
import "./Movie.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useStateContext } from '../../context/index.jsx';
import CreateCampaignButton from "../CreateCampaignButton/CreateCampaignButton";

export default function Movie() {

  const [nrReviews, setNrReviews] = useState(0);
  const [reviewsList, setReviewsList] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewGrade, setReviewGrade] = useState(0);
  const { connect, address } = useStateContext();
  const location = useLocation();
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
        setReviewsList([jsonLikes, ...reviewsList]);
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
        <input type="text" name="review" id="review-input" onChange={e => setReviewText(e.target.value)}/>
        <div className="review-input-buttons">
          {/* <div>
            <input type="checkbox" name="review-special" id="review-special" />
            <label htmlFor="review-special" id="review-special-text">Check this for special list</label>
          </div> */}
        <CreateCampaignButton
            btnType="button"
            title={address ? 'Connected' : 'Connect for special vote'}
            styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
            isDisabled={address ? true : false}
            handleClick={() =>  connect()}
        />
        <input type="number" name="review_grade" id="review_grade" max={10} min={0} onChange={e => setReviewGrade(e.target.value)}/>
          <button className="editor_card_button" onClick={() => handleReview()}>Submit</button>
        </div>
      </div>
      <div className="review-columns">
      <span id="special-column">
        Special Column
      </span>
      <span id="normal-column">
        Normal column
      </span>
      </div>
    </div>
    </>
  );
}
