const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mediareviews',
    password: 'postgres',
    port: 5432
});


/*
const client = new Client()
client.connect()
*/

module.exports = {
    pool
    // query: (text, params, callback) => {
    //     const start = Date.now()
    //     return pool.query(text, params, (err, res) => {
    //         const duration = Date.now() - start
    //         console.log('executed query', { text, duration, /*rows: res.rowCount*/ })
    //         callback(err, res)
    //     })
    // },
}