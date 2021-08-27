const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valide email']
  },
  photo: String,
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: {
    type: String,
    required: [true, 'please provide a valid password'] ,
    minlength: 6,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      // only work on creat & save - important for update
      validator: function(el) {
        return el === this.password;
      }
    }
  },
});

userSchema.pre('save',async function(next) {
  // run function only if password modified
  if(!this.isModified('password')) return next();
  // bcrypt.hash = asynchronous version
  this.password = await bcrypt.hash(this.password, 12);
  // delete password field
  this.passwordConfirm = undefined;
  next();
})

userSchema.methods.correctPassword = async function(
  // return true or false
  candidatePassword, userPassword
  ) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);
