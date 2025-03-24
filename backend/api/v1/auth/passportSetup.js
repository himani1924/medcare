import passport from 'passport'
import {Strategy as LocalStrategy} from 'passport-local'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import bcrypt from 'bcryptjs'
import pool from '../../db/index.js'
import { configDotenv } from 'dotenv'

configDotenv()



// local strategy 
passport.use(new LocalStrategy(
    {
    usernameField: 'email'
    },
    async (email, password, done) =>{
        try {
            console.log(email, password);
            const user = await pool.query('select * from users where email = $1', [email])
            if(user.rows.length === 0){
                console.log('no user returned');
                return done(null, false, {message: 'User not found'})
            }
            const isMatch = await bcrypt.compare(password, user.rows[0].password)
            console.log('isMatch', isMatch);
            if(!isMatch){
                return done(null, false, {message: 'Incorrect password'})
            }
            return done(null, user.rows[0])
        } catch (error) {
            return done(error, false)
        }
    }

))

// google strategy 
passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/api/v1/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) =>{
        try {
            const email = profile.emails[0].value;
            console.log("Checking if user exists in database for email:", email);

            let user = await pool.query('select * from users where email = $1', [email])
            if(user.rows.length === 0){
                // create new user 
                user = await pool.query('insert into users (name, email, password, role) values ($1, $2, $3, $4) returning *', [profile.displayName, profile.emails[0].value, "", 'patient'])
            }
            return done(null, user.rows[0])
        } catch (error) {
            return done(error, null)
        }
    }
))

passport.serializeUser((user, done) =>{
    console.log('serializing user', user);
    done(null, user.id)
})

passport.deserializeUser(async (id, done) =>{
    try {
        console.log("Deserializing User ID:", id);
        const user = await pool.query('select * from users where id = $1', [id])
        if (user.rows.length === 0) {
            return done(new Error("User not found"), null);
          }
        done(null, user.rows[0])
    } catch (error) {
        done(error, null)
    }
})

export default passport