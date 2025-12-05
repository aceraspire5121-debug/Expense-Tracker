import express from "express"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import {user} from "./models/users.js"
import {Expense} from "./models/expense.js"
dotenv.config(); // ye hamesha process.env. jaha bhi use ho raha hai uske upar likha hona chahiye na ki neeche
const port =process.env.PORT;
const MONGO_URL=process.env.MONGO_URL
const JWT_SECRET=process.env.JWT_SECRET 
const app = express()
app.use(express.json()); //convert incoming req string contents back to object
console.log("MONGO_URL:", process.env.MONGO_URL);

let conn=await mongoose.connect(MONGO_URL)
app.use(express.static("./frontend"))

function auth(req,res,next){ // route specific middleware hai jo ki chalega jab ham chahenge tab
const token = req.headers["authorization"];
if(!token)
  return res.status(401).json({ message: "No token" });
try{
  const decoded=jwt.verify(token,JWT_SECRET)
  req.userId=decoded.id;
  next()
}catch(err)
{
   res.status(401).json({ message: "Invalid token" });
}
}

app.get('/getexpense',auth,async (req, res) => {
  try{
  const data=await Expense.find({userId:req.userId})
  return res.json(data)
  }catch(err)
  {
console.log(err)
  }
}) 

app.delete("/delete",auth,async (req,res)=>{
  try{
  const data = await Expense.deleteOne({ ...req.body, userId: req.userId });
  const newdata=await Expense.find({userId:req.userId})
  res.json(newdata)
  }catch(err){
    console.log(err)
   res.status(500).json({ error: "Failed to fetch Expenses" })
  }
})

app.post('/login', async(req, res) => {
  try{
  const {username,password}=req.body
  const Existuser=await user.findOne({username})
  if(!Existuser)
    return res.json({success:false,message:"Account not found"}); //res.json se respond send ho jata hai par agar aage ka code run nhi karwana hai to return bhi lagaoge
  const pass=await bcrypt.compare(password,Existuser.password)
  if(!pass)
    return res.json({success:false,message:"Incorrect password"})
  const token = jwt.sign({ id: Existuser._id }, JWT_SECRET, { expiresIn: "7d" });
  return res.json({success:true,token})
}catch(err){
    console.log(err)
     res.status(500).json({ message: "Server error" });
  }
})
app.post('/register', async(req, res) => {
  try{
  const {username,password}=req.body
  const userExist=await user.findOne({username}) 
    if(userExist) // if object is there then true or for empty object , it is false
      return res.json({success:false,message:"User already exists"})
      const hashedPassword = await bcrypt.hash(password, 10);
      const newuser=await user.create({username,password:hashedPassword})
      return res.json({success:true,message:"Account created successfully"})
}catch(err){
    console.log(err)
     res.status(500).json({ message: "Server error" });
  }
})

app.post('/create', auth, async (req, res) => {
  try{
  const data=await Expense.create({...req.body,userId:req.userId})
 return res.json({ success: true, expense: data });
  }catch(err){
    return res.status(500).json({ success: false, message: "Unable to create expense" });
  }
}) 

app.put("/update",auth,async (req,res)=>{
  const data=await Expense.findOneAndUpdate({userId:req.userId,date:req.body.date},{$set:{title:req.body.naya}},{new:true})
  res.json(data)
})
app.put("/update2",auth,async (req,res)=>{
  const data=await Expense.findOneAndUpdate({userId:req.userId,date:req.body.date},{$set:{category:req.body.naya}},{new:true})
  res.json(data)
})
app.put("/update3",auth,async (req,res)=>{
  const data=await Expense.findOneAndUpdate({userId:req.userId,date:req.body.date},{$set:{amount:req.body.naya}},{new:true})
  res.json(data)
})
app.put("/update4",auth,async (req,res)=>{
  const data=await Expense.findOneAndUpdate({userId:req.userId,date:req.body.date},{$set:{time:req.body.naya}},{new:true})
  res.json(data)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
