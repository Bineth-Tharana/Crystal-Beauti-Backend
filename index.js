import express from 'express';
import bodyparser from 'body-parser';
import mongoose from 'mongoose';
import productRouter from './routes/productRoute.js';
import userRouter from './routes/userRoute.js';
import jwt from 'jsonwebtoken';
import orderRouter from './routes/orderRoute.js';

const app = express();

app.use(bodyparser.json());

app.use((req,res,next) => {
    const tokenString = req.header("Authorization");
    if(tokenString != null){
        const token = tokenString.replace("Bearer ", "");
        
        jwt.verify(token, "cbc-batch-five@2026", 
            (err, decoded) => {
                if(decoded != null){
                    req.user = decoded;
                    next();
                }
                else{
                    console.log("Invalid token");
                    res.status(403).json({
                        message : "Invalid token"
                    })
                }
            }
        );
    }
    else{
        next();
    }
})

mongoose.connect('mongodb://admin:123@ac-vwmkd56-shard-00-00.06eci1d.mongodb.net:27017,ac-vwmkd56-shard-00-01.06eci1d.mongodb.net:27017,ac-vwmkd56-shard-00-02.06eci1d.mongodb.net:27017/?ssl=true&replicaSet=atlas-fvpd3u-shard-0&authSource=admin&appName=Cluster0')
.then(() => {
    console.log('Connected to the database');
}).catch(() => {
    console.log("Database connection failed");
})

app.use('/products', productRouter);
app.use('/users', userRouter);
app.use('/orders',orderRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});