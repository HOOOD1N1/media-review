const router = require('express').Router();
const User = require("../controllers/User.js");
const { pool } = require("../config/db/db.js");

router.post('/users', async(req, res) => {
    //const id = parseInt(request.params.id)
    const { id, name, email } = req.body
    const password = 123;
    const date = new Date();
    const result = await pool.query(
        'INSERT INTO users (id, username, email, password, creation_date) VALUES ($1, $2, $3, $4, $5)', [id, name, email, password, date])

    res.status(201).send(`User added with ID: ${result.insertId}`)

});
router.get('/users_all', async(req, res) => {
    const result = await pool.query('SELECT * FROM users;')
    res.status(201).json(result.rows)
});

router.post('/login', async(req, res) => {
    console.log("login")

    const { email, password } = req.body;
    const result = await User.authenticate({ email: email, password: password })
    console.log('here is payload' + JSON.stringify(result.payload));
    if (result) {
        res.send(JSON.stringify(result.payload));
    }
});

router.post('/register', async(req, res) => {
    console.log("register")
    const result = await User.create(req.body)
    console.log("result is " + JSON.stringify(result))
    if (result) {
        console.log("there is a result")
        const { status, message } = result;
        if (status === 'error') {
            res.status(500);
            res.send(result);
        } else {
            res.send(result)
        }
    }
})

router.post('/userprofile/user/:id', async(req, res) => {
    var userId = req.params.id;

    try {
        const result1 = await pool.query(`SELECT username, profile_image FROM users WHERE id=${userId};`);
        const result2 = await pool.query(`SELECT count(*) as comment_count from comments where author_id=${userId};`);
        const result3 = await pool.query(`SELECT count(*) as posts_count FROM posts WHERE author_id=${userId};`);
        const result4 = await pool.query(`SELECT count(*) as reviews_count FROM reviews WHERE author_id=${userId};`);
        if (result1 && result2 && result3 && result4) {
            const username = result1.rows[0];
            const comments = result2.rows[0];
            const posts = result3.rows[0];
            const reviews = result4.rows[0];
            const payload = {
                profile_image: username.profile_image,
                username: username.username,
                comments,
                posts,
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

router.get('/taskbar/photo/:userId', async(req, res) => {
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



module.exports = router;