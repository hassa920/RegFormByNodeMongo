require('dotenv').config()
const express= require("express");
const app=express();
const bcrypt=require("bcryptjs")
const path=require("path")
const hbs=require("hbs");
require("./db/conn")
const Register=require("./models/register");
const port =process.env.Port || 4000;
// This is for static website 
// const staticPath=path.join(__dirname,"./public")
// app.use(express.static(staticPath))
// app.get("/",(req,res)=>{

//     res.send("Hy From Hassam ")
// });

// This is for view engine file file ko "/" url pr render krwana ka liya 

const templatePath=path.join(__dirname,"./templates/views")
const partialsPath=path.join(__dirname,"./templates/partials")
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.set("view engine", "hbs");
app.set("views",templatePath)
hbs.registerPartials(partialsPath)
app.get("/",(req,res)=>{
    res.render("index")
});
app.get("/login",(req,res)=>{
    res.render("login")
});
app.get("/register",(req,res)=>{
    res.render("register")
});
// create new user
app.post("/register", async(req,res)=>{
    try{
       console.log(req.body);
       const pass=req.body.password;
       const cpass=req.body.confirmpassword;
       if(pass===cpass)
       {
         const registeredEmoloyee=new Register({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,
            gender:req.body.gender,
            phone:req.body.phone,
            age:req.body.age,
            password:req.body.password,
            confirmpassword:req.body.confirmpassword
         })
         // ma instance  ka saat wokr krha hoon this is instance registeredEmoloyee
        //  ab schema ma haam methods iss liya use karain gain kyoo ka haam yaahn instance use krha hain
         const token= await registeredEmoloyee.generateToken();
         console.log("token in app.js file is: ",token)
         const registered=await registeredEmoloyee.save();
         res.status(201).redirect("/");
       }
       else
       {
         res.send("Password are not matched")
       }
      
    }
    catch(e){
        res.status(400).send(e)
    }
});

app.post("/login", async(req,res)=>{
    try{

        const email=req.body.email;
        const pass=req.body.password;
        const userEmail= await Register.findOne({email:email});

        // this is for when password store in data base is in plain text
        // if(userEmail.password===pass)
        // {
        //     res.status(201).redirect("/");
        // }
        // This is for when password store in database in hash
        const isMatch= await bcrypt.compare(pass,userEmail.password)
        console.log(isMatch)
        // Agr loign ka liya bi token generate krwan aho
        const token= await userEmail.generateToken();
        console.log("Login Part Token:",token)
        if(isMatch)
        {
            res.status(201).redirect("/");
        }
        else
        {
            res.send("Invalid login details");
        }
    }
    catch(e)
    {
        res.status(400).send(e)
    }
});
app.listen(port,()=>{
    console.log("Server Started at port number: ",port)
})