import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import './MovieCard.css';

export default function MovieCard(props) {
    const [moviePhoto, setMoviePhoto] = useState('');
    const [movieDetails, setMovieDetails] = useState(false);
    const [numberLikes, setNumberLikes] = useState();
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [releaseDate, setReleaseDate] = useState();
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setTitle(props.title);
        setRating(props.rating);
        setDescription(props.overview);
        setReleaseDate(props.releaseDate);
        setMoviePhoto(process.env.POSTER_IMG_URL + props.posterPath);
    }, []);

    useEffect(() => {
        if(movieDetails) {
            getMovieId();
        }
    }, [movieDetails]);

    const getColor = (rating) => {
        if(rating >= 8){
            return 'green';
        } else if(rating >= 5){
            return 'orange';
        }
        return 'red';
    }

    const getMovieId = () => {
        
            console.log('show movie details');

            const postObject = {
                movie_title: props.title,
                description: props.overview,
                release_date: props.releaseDate
            }


            fetch("http://localhost:8888/movie", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postObject)
            }).then(response => {response = response.json(); return response;})
            .then(responseJson => {navigate(`/movies/${responseJson.payload.movieId}`, {state:{title, rating, description, releaseDate, moviePhoto}})})
            .catch(error => console.log(error));
    }
    

    return (
        <div className="movie" onClick={() => setMovieDetails(true)}>
            <img src={moviePhoto} alt="movie-photo"/>
            <div className="movie-info">
                <h3>{title}</h3>
                <span className={getColor(rating)}>{rating}</span>
            </div>
            <div className="overview">{description}</div> 
        </div>
    );

}