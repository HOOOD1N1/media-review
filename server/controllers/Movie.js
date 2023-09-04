const { pool } = require('../config/db/db');
const bcrypt = require('bcrypt')
const Sessions = require('./Sessions')
module.exports = {
    create: async(params) => {
        const { movie_title, description, release_date } = params;
        console.log("movie_title " + movie_title + " description " + description + " release_date " + release_date);
        try {
            const movieExists = await pool.query('SELECT id FROM movies where movie_title=$1 and description=$2 and release_date=$3;', [movie_title,description,release_date])
            if(movieExists && movieExists.rows && movieExists.rows[0] && movieExists.rows[0].id) 
            {
                return {
                    status: 'success',
                    message: 'MOVIE_ALREADY_EXISTS',
                    payload: {
                        movieId: movieExists.rows[0].id,
                    }
                } 
            } else {
                const result = await pool.query('INSERT INTO movies (movie_title,description,release_date) VALUES ($1, $2, $3) RETURNING id;', [movie_title,description,release_date])
                return {
                    status: 'success',
                    message: 'MOVIE_SUCCESFULLY_CREATED',
                    payload: {
                        movieId: result.rows[0].id,
                    }
                }
            }
        }catch (err) {
                console.error("there is an error", err)
                return {
                    status: 'error',
                    message: 'ERROR_MOVIE_CREATION'
                }
            }
        // if (username && password && email) {
        //     try {
        //         const userExists = await pool.query('SELECT id FROM users where email=$1', [email])
        //         if (
        //             // userExists ? .rows[0] ? .id
        //             userExists && userExists.rows && userExists.rows[0] && userExists.rows[0].id
        //         ) {
        //             return {
        //                 status: 'error',
        //                 message: 'USER_ALREDY_REGISTERED'
        //             }
        //         }
        //         const date = new Date();
        //         const hash = await bcrypt.hash(password, 10);
        //         console.log("password is" + hash + "" + typeof(hash));
        //         const result = await pool.query('INSERT INTO users (email, username, password, creation_date) VALUES ($1, $2, $3, $4)', [email, username, hash, date])
        //         if (result.rowCount === 1) {
        //             return {
        //                 status: 'success',
        //                 message: 'USER_REGISTERED_SUCCESSFULLY'
        //             }
        //         }
        //     } catch (err) {
        //         console.error("there is an error", err)
        //         return {
        //             status: 'error',
        //             message: 'ERROR_REGISTERING_USER'
        //         }
        //     }
        // } else {
        //     return {
        //         status: 'error',
        //         message: 'MISSING_PARAMETERS'
        //     }
        // }
    },
}