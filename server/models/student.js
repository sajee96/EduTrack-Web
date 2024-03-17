const mongoose = require('mongoose');


const studentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  student_id: Number,
  name:String,
  email:String,
  dob:Date,
  subject:String,
  location:String,
  is_agree: Boolean,
  is_correspondence: Boolean,
  status:Boolean

});

module.exports = mongoose.model('Student', studentSchema);