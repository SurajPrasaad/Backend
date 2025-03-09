import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { db } from "./utils/db.js";
import userRoutes from "./routes/user.route.js"

dotenv.config()

const app = express()
const port = process.env.PORT||4000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:process.env.BASE_URI,
    methods:['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders:['Content-Type','Authorization'],
    credentials:true,
}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})
db();
app.use("/api/v1/users",userRoutes)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})