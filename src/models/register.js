const mongoose=require("mongoose");
const jwt=require('jsonwebtoken')
const bcrypt=require("bcryptjs")

const employeeSchema= new mongoose.Schema({

    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true,
        
    },
    phone:{
        type:Number,
        required:true,
        unique:true
        
    },
    age:{
        type:Number,
        required:true,
        
    },
    password:{
        type:String,
        required:true,
        unique:true
        
    },
    confirmpassword:{
        type:String,
        required:true,
        unique:true
        
    },
    tokens:[
        {
            token:{
                type:String,
                required:true,
            }
        }
    ]
    
});

employeeSchema.methods.generateToken = async function() {
    try {
    // iss ma apni unique id pass karoon ga payload ma jo ma databse ma bi store krwa raha hoon
        // or ya object ma ha iss ko haam string ma convert karain gain
      const token = jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY);
      this.tokens=this.tokens.concat({token:token});
      // aik naye filed bana di or issi middleware ma hi usa save krwa diya 
      await this.save();
      return token;
    } catch(e) {
      console.log("Error in token generating: ", e);
    }
  };
// Middle ware for converting plain text password into hash

employeeSchema.pre("save",async function(next){
    if(this.isModified("password")){
       console.log("original Password",this.password);
       this.password=await bcrypt.hash(this.password,10);
       console.log("Password after decrypt ",this.password)
       this.confirmpassword=await bcrypt.hash(this.confirmpassword,10);
       next(); 
    }
})


const Register=new mongoose.model("Employee",employeeSchema);
module.exports=Register;