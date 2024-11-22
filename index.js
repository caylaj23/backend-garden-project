import express from "express"
let app = express()
import pg from pg
const {Pool} = pg
import bodyParser from "body-parser"
import cors from cors

    const corsOptions = {
        origin: '*',
        credentials: 'true',
        optionsSuccessStatus : 200,

    }
    app.use(cors(corsOptions))


    app.use(bodyParser.json())


    const pool = new Pool({
        user: 'cjohnson345',
        host: '@ep-holy-rice-a52gt46b-pooler.us-east-2.aws.neon.tech',
        database: 'gardenlocator',
        password: 'IJbB4NcO7tGw',
        port: 5432,
        ssl: {
            require: true,
        }
    })

    app.get('/recipes', function(req,res){

        pool.query('SELECT * FROM recipes', function(error,results){
            if(error){
                throw error
            }
            res.send(results.rows)
        })
    })



    app.get('/map', function(req,res){
        pool.query('SELECT L.name, L.latitude, L.longitude, L.address, L.image, L.type, L.url, array_agg(I.ingredientname) FROM locations L JOIN ing_loctn_bridge B   ON L.locationid = B.locationid JOIN ingredients I ON I.ingredientid = B.ingredientid GROUP BY L.name, L.latitude, L.longitude, L.address, L.image, L.type, L.url', function(error,results){
            if(error){
                throw error
            }
            res.send(results.rows)
        })
    })

    app.get('/resources', function(req,res){
    pool.query('SELECT * FROM resources', function(error, results){
        if(error){
            throw error
        }
        res.send(results.rows)
    })
    })

    app.post('/farmers', function(req,res){
        let name = req.body.name
        let image = req.body.image
        let address = req.body.address
        let latitude = req.body.latitude
        let longitude = req.body.longitude
        let url = req.body.url
        let locationid = req.body.locationid
        let ingredientsarray = req.body.ingredientsarray
        console.log(req.body.ingredientsarray)

    
            pool.query(`INSERT INTO locations (name, image, address, url, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6) RETURNING locationid`, [name, image, address, url, latitude, longitude],  function(error,results){
            if(error){
                throw error
            } else {
                console.log(results)
                for (let i = 0; i < ingredientsarray.length; i++){
                    pool.query ('INSERT INTO ing_loctn_bridge (locationid, ingredientid) VALUES ($1, $2)',  [results.rows[0].locationid, ingredientsarray[i]], function(error, results){
                        if (error){
                            throw error
                        }
                        (results.rows)
                    })
                }
        
            }
            // res.send("Signup Complete")
        })

    })

    app.post ('/signup', function(req,res){
        const email = req.body.email
        const firstname = req.body.firstname

        pool.query('INSERT INTO userinfo (email, firstname) VALUES ($1, $2)', [email,firstname], function(error, results){
        if (error){
            throw error
            }
            res.send("You have successfully signed up")
        })
        })


    app.listen(3000)
    export default app



 