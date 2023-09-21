import React from "react";
import "./ReviewCard.css";

export default function ReviewCard({key, review}) {
    return (
        <div key={key}>
            <div>ReviewText is {review.review}</div>
            <div>ReviewGrade is {review.review_grade}</div>
        </div>
        );
}
