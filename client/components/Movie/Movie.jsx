import React from "react";
import "./Movie.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Movie() {

  const [nrComments, setNrComments] = useState(0);
  const [nrReviews, setNrReviews] = useState(0);
  const [userName, setUserName] = useState('');
  const location = useLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  var number = 0;
  var i = location.pathname.length - 1;
  var powerOfTen = 0;
  while (location.pathname[i] !== "/") {
    number = number + location.pathname[i] * Math.pow(10, powerOfTen);
    console.log(number);
    powerOfTen++;
    i--;
  }

  const getCounts = async() => {
    console.log("Useid is " + location.pathname[location.pathname.length - 1]);
    console.log("Number is " + number);
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("User IS " + user.userId)
      setNrComments(username.comments.comment_count);
      setNrReviews(username.reviews.reviews_count);
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getCounts()
  }
  , []);
      

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
        <input type="text" name="review" id="review-input" />
        <div className="review-input-buttons">
          <div>
            <input type="checkbox" name="review-special" id="review-special" />
            <label htmlFor="review-special" id="review-special-text">Check this for special list</label>
          </div>
          <button className="editor_card_button">Submit</button>
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
