/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import MovieCard from "../MovieCard/MovieCard";
import './Cardlist.css';

export default function CardList(props) {


  return (
    <div className="card-list">
      {props.cards
        ? props.cards?.map((card, i) => (
            <MovieCard
                key={card.title}
                title={card.title}
                rating={card.vote_average}
                overview={card.overview}
                releaseDate={card.release_date}
                posterPath={card.poster_path}
            />
          ))
        : null}
    </div>
  );
}
