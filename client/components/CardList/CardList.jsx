/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import MovieCard from "../MovieCard/MovieCard";

export default function CardList() {
  const [cards, setCards] = useState();

  const getMovies = async() => {
    const lstorageuser = localStorage.getItem("user");
      const movies = await fetch(process.env.BASE_URL + '/discover/movie?sort_by=popularity.desc' + `&${process.env.API_KEY}`);

      const moviesArray = await movies.json();
      if(moviesArray){
        // console.log('moviesArray is ' + JSON.stringify(moviesArray));
        let resultedObject = JSON.stringify(moviesArray);
        let JsonObject = JSON.parse(resultedObject);
        setCards(JsonObject.results);
      }
  };

  useEffect(() => {
    getMovies();
   }, []);

  return (
    <div className="list">
      {cards
        ? cards?.map((card, i) => (
            <MovieCard
                key={`c_${i}`}
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
