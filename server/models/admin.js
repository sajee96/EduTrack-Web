const mongoose = require('mongoose');
const bcrypt =require('bcrypt')

const adminSchema = mongoose.Schema({
//   _id: mongoose.Schema.Types.ObjectId,
  email:{
    type: String,
    required: true,
    lowercase:true,
    unique: true
  },
  password:{
    type: String,
    required: true
  }
});

adminSchema.pre('save', async function(next) {
try{
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword
  next();
}catch(error){
  next(error)
}
})

adminSchema.methods.isValidPassword = async function(password){
  try{
    return await bcrypt.compare(password, this.password)
  }catch(error){
    throw error
  }
}


module.exports = mongoose.model('Admin', adminSchema);