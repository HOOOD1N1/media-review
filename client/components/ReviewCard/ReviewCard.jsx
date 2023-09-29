import React from "react";
import "./ReviewCard.css";

export default function ReviewCard({key, review}) {
    return (
        <div key={key} id="review_card">
            <div id="review_top">
                <img src={`http://localhost:8888/photos/${review.profile_image}`} alt="reviewer profile image" id="profile_image"/>
                <span id="reviewer_username">{review.username}</span>
                <span id="shown_review_grade">{review.review_grade}</span>
            </div>
            <div>ReviewText is {review.review_text}</div>
        </div>
        );
}
