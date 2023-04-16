const { pool } = require('../config/db/db');



module.exports = {


    create: async(params) => {
        const { userId } = params

        // try {
        //     const insert = await pool.query(`insert into "sessions" (user_id, creation_date, session_token) values(6, '2021-03-21', '112112');`);
        // } catch (err) {

        //     console.error(err)
        // }

        var sessionId, sessionToken;
        console.log('create: done');
        try {
            const {cryptoRandomString} = await import("crypto-random-string");
            sessionToken = cryptoRandomString({ length: 10, type: 'base64' });
            //sessionToken = '123467';
            const takeId = await pool.query(`insert into "sessions"(user_id, session_token) values(${userId}, '${sessionToken}') RETURNING id;`);
            //console.log(JSON.stringify(takeId))
            //const takeId = await pool.query(`select id from sessions where session_token=${sessionToken};`)
            //const result = await pool.query(`INSERT INTO sessions (creation_date, user_id, session_token) values(${date}, ${userId}, ${sessionToken});`);

            sessionId = takeId.rows[0].id;

        } catch (err) {
            console.error(err);
            console.log('authenticate: undone');
        }
        return {
            status: 'success',
            message: 'SESSION_CREATED_SUCCESSFULLY',
            payload: {
                userId: userId,
                sessionId: sessionId,
                sessionToken: sessionToken
            }
            // Bearer: userId-sessionId-sessionToken
            // headers.authentication split('-')
        }
    },
    read: async(params) => {

    },
    update: async(params) => {

    },
    remove: async(params) => {},
    validate: async(params) => {

        const { userId, sessionId, sessionToken } = params;
        if (userId && sessionId && sessionToken) {
            const validSession = await pool.query('select id from sessions where id=$1 and user_id=$2 and session_token=$3', [Number(sessionId), Number(userId), sessionToken])
            if (validSession.rowCount > 0) {
                return true
            } else {
                return false
            }
        } else return false;
    }

}