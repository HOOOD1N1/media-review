const express = require('express');
const app = express();
const cors = require("cors");
const http = require('http');
const User = require("./controllers/User");
const Movie = require("./controllers/Movie");
const multiparty = require("connect-multiparty");
const { json } = require("body-parser");
const { pool } = require("./config/db/db");
var multer = require('multer');
const userRouter = require('./routes/user-routes');
const crypto = require('crypto');

var upload = multer({
    storage: multer.diskStorage({
        destination: './photos/',
        filename: async function(req, file, cb) {
            //req.body is empty...
            //How could I get the new_file_name property sent from client here?
            let newToken = crypto.randomBytes(48).toString('hex');
            console.log(file)
            cb(null, newToken + "." + file.mimetype.split('/')[1]);
        }
    })
});

const PORT = "8888";

const MultiPartyMiddleWare = multiparty({ uploadDir: './photos' });

app.use(cors());
app.use(json());
app.use(userRouter);
app.use('/photos', express.static(`${__dirname}/photos/`));

app.post('/ckuploads', MultiPartyMiddleWare, (req, res) => {
    console.log("Files to upload are ", req.files.upload);
    let x = req.files.upload.path;
    let y = x.split('\\');
    let path = y[1];
    res.send({ "uploaded": "true", "url": `http://localhost:8888/photos/${path}` })
});

app.post('/photo/:id', upload.single('uploaded_file'), async(req, res) => {
    // console.log(JSON.stringify(req.file))
    console.log(req.file.filename)
    try {
        const result = await pool.query(`UPDATE users set profile_image=$1 where id=${req.params.id}
         returning profile_image;`, [req.file.filename])
        if (result) {
            console.log(result.rows[0])
            res.send(JSON.stringify({ photo: `http://localhost:8888/photos/${result.rows[0].profile_image}` }));
        }
    } catch (error) {
        console.log(error);
    }

});

app.get('/query/search', async(req, res) => {
    let value = req.query.value;
    let result = await pool.query(`select id, username as name, profile_image as image from users where username like '${value}%';`)
    console.log(result.rows)
    if (result.rows) res.send(JSON.stringify({ results: result.rows }))
});

app.post('/main/user/:id', async(req, res) => {
    var userId = req.params.id;
    console.log(userId);
    try {
        const result = await pool.query('SELECT username,profile_image FROM users WHERE id=$1;', [userId]);
        if (result) {
            console.log(result.rows[0])
            res.status(200);
            res.send(JSON.stringify(result.rows[0]))
        }
    } catch (error) {
        res.send({
            status: 'ERROR',
            message: 'MAIN_USERNAME_RETRIEVAL_ERROR'
        })
        res.send(error)
    }
});

app.delete('/clear/:userId', async(req, res) => {
    const userId = req.params.userId;
    console.log(`userid when deleting is ${userId}`);
    try{
        await pool.query(`DELETE FROM sessions WHERE author_id=${userId};`)
    }catch(err){
        console.log('error while deleting ', err);
        res.status(500);
        res.send();
    }
    res.status(200);
    res.send();
});
//check if sessions already exists
app.post('/session/validate/:userId', async(req, res) => {
const { sessionToken } = req.body;
const { userId } = req.params

console.log(`userid is ${userId} and sessionToken is ${sessionToken}`);

const result = await pool.query(`SELECT id FROM sessions WHERE author_id=$1 AND session_token=$2;`, [userId, sessionToken])
if (result.rowCount === 1) {
    res.send(JSON.stringify({ 'status': 'success', message: 'VALID_SESSION' }));
} else {
    res.send(JSON.stringify({ 'status': 'error', message: 'INVALID_SESSION' }));
}
//res.send()
});

app.post('/user/:user/comments', async(req, res) => {
    var id = req.params.user;
    try {
        var results = await pool.query(`SELECT content, profile_image, comments.creation_date,
         comments.id as postId, users.username, users.id from comments join users 
         on comments.author_id = users.id where users.id=$1 ORDER BY creation_date DESC;`, [id]);
        if (results) {
            res.send({
                status: 'success',
                message: 'USER_COMMENTS_RETRIEVED',
                posts: JSON.stringify(results.rows)
            })
        }
    } catch (error) {
        res.send({
            status: 'failed',
            message: 'users_COMMENTS_ERROR'
        })
        res.send(error);
    }
});

app.post('/user/:user/reviews', async(req, res) => {
    var id = req.params.user;
    try {
        var results = await pool.query(`SELECT content,profile_image,review, reviews.creation_date,
         reviews.id as postId, users.username, users.id from reviews join users 
         on reviews.author_id = users.id where users.id=$1 ORDER BY creation_date DESC;`, [id]);
        if (results) {
            res.send({
                status: 'success',
                message: 'USER_REVIEWS_RETRIEVED',
                posts: JSON.stringify(results.rows)
            })
        }
    } catch (error) {
        res.send({
            status: 'failed',
            message: 'users_REVIEWS_ERROR'
        })
        res.send(error);
    }
});

app.post('/posts', async(req, res) => {
    try {
        var results = await pool.query(`SELECT content, title, profile_image, posts.creation_date, posts.id as postId, users.username,
         users.id from posts join users on posts.author_id = users.id ORDER BY creation_date DESC;`);
        if (results) {

            res.send({
                status: 'success',
                message: 'POSTS_RETRIEVED',
                posts: JSON.stringify(results.rows)
            })
        }

    } catch (error) {
        res.send({
            status: 'failed',
            message: 'POSTS_RETRIEVED_ERROR'
        })
        res.send(error);
    }
})

app.post('/post/:postId/comments', async(req, res) => {
    var postId = req.params.postId;
    try {

        var results = await pool.query(`SELECT content, profile_image, comments.creation_date,
        comments.id as postId, users.username, users.id from comments join users on comments.author_id = users.id
        WHERE comments.post_id = $1 ORDER BY creation_date;`, [postId]);
        if (results) {

            res.send({
                status: 'success',
                message: 'COMMENTS_RETRIEVED',
                posts: JSON.stringify(results.rows)
            })
        }

    } catch (error) {
        res.send({
            status: 'failed',
            message: 'COMMENTS_RETRIEVED_ERROR'
        })
        res.send(error);
    }
})

app.post('/post/:postId/reviews', async(req, res) => {
    var postId = req.params.postId;
    try {
        var results = await pool.query(`SELECT content,profile_image, reviews.creation_date,reviews.review, reviews.id as postId,
         users.username, users.id from reviews join users on reviews.author_id = users.id WHERE reviews.post_id = $1
          ORDER BY creation_date ;`, [postId]);
        if (results) {
            res.send({
                status: 'success',
                message: 'REVIEWS_RETRIEVED',
                posts: JSON.stringify(results.rows)
            })
        }
    } catch (error) {
        res.send({
            status: 'failed',
            message: 'REVIEWS_RETRIEVED_ERROR'
        })
        res.send(error);
    }
});

app.post('/userprofile/user/:id', async(req, res) => {
    var userId = req.params.id;

    try {
        const result1 = await pool.query(`SELECT username, profile_image FROM users WHERE id=${userId};`);
        const result2 = await pool.query(`SELECT count(*) as comment_count from comments where author_id=${userId};`);
        const result3 = await pool.query(`SELECT count(*) as reviews_count FROM reviews WHERE author_id=${userId};`);
        if (result1 && result2 && result3) {
            const username = result1.rows[0];
            const comments = result2.rows[0];
            const reviews = result3.rows[0];
            const payload = {
                profile_image: username.profile_image,
                username: username.username,
                comments,
                reviews
            };
            res.status(200).send(payload)
        }
    } catch (error) {
        console.log(error);
        res.send({
            status: 'failed',
            message: 'USER_INFO_RETRIEVAL_ERROR',
            error: error
        })
        res.send(error)
    }
});

app.post('/users', async(req, res) => {
    //const id = parseInt(request.params.id)
    const { id, name, email } = req.body
    const password = 123;
    const date = new Date();
    const result = await pool.query(
        'INSERT INTO users (id, username, email, password, creation_date) VALUES ($1, $2, $3, $4, $5)', [id, name, email, password, date])

    res.status(201).send(`User added with ID: ${result.insertId}`)

});
app.get('/users_all', async(req, res) => {
    const result = await pool.query('SELECT * FROM users;')
    res.status(201).json(result.rows)
});

app.get('/taskbar/photo/:userId', async(req, res) => {
    let userId = req.params.userId;
    try {
        let result = await pool.query('SELECT profile_image, username from users WHERE id=$1;', [userId]);
        if (result.rows) {
            console.log(result.rows)
            res.json(result.rows);
        }
    } catch (error) {
        console.log(error);
        res.send(error);
    }

});

app.post('/:type/like/:postId/:userId', async(req, res) => {
    var userId = req.params.userId;
    var postId = req.params.postId;
    var type = req.params.type;
    try {
        let exists = await pool.query(`select id from likes where post_id=${postId} and author_id=${userId}`);
        console.log(exists.rows[0])
        if (exists.rows[0]) {
            let x = exists.rows[0];
            await pool.query(`delete from likes where id=${x.id}`);
            let likeResult = await pool.query(`update ${type} set likes = likes - 1 where id=${postId} returning likes;`)
            if (likeResult) {

                res.status(200).send(likeResult.rows[0])
            }
        } else {
            await pool.query(`insert into likes (post_id, author_id) values (${postId}, ${userId})`);
            let likeResult = await pool.query(`update ${type} set likes = likes + 1 where id=${postId} returning likes;`)
            if (likeResult) {
                res.status(200).send(likeResult.rows[0])
            }
        }
    } catch (error) {
        console.log(error);
    }


});
app.post('/:type/likes/:postId', async(req, res) => {
    var postId = req.params.postId;
    var type = req.params.type;
    try {
        var likeResult = await pool.query(`select likes from ${type} where id=${postId};`)

        if (likeResult) {

            res.status(200).send(likeResult.rows[0])
        }
    } catch (error) {
        res.send(error);
    }


});

app.post('/login', async(req, res) => {


    const { email, password } = req.body;
    const result = await User.authenticate({ email: email, password: password })
    console.log('here is payload' + JSON.stringify(result.payload));
    if (result) {
        res.send(JSON.stringify(result.payload));
    }
});

app.post('/register', async(req, res) => {
    const result = await User.create(req.body)
    console.log("result is " + JSON.stringify(result))
    if (result) {
        console.log("there is a result")
        const { status, message } = result;
        if (status === 'error') {
            res.status(500).send(result)
        } else {
            res.send(result)
        }
    }
});

app.post('/movie', async(req, res) => {
    console.log(req.body)
    const result = await Movie.create(req.body);
    if(result) {
        console.log("movie result")
        const { status, message } = result;
        if (status === 'error') {
            console.log("Error when creating a movie");
            res.status(500).send(result)
        } else {
            res.send(result)
        }
    }
});

const server = http.createServer(app);

server.listen(PORT, (err) => {

    console.log(`Listening to http://localhost:${PORT}`)

});