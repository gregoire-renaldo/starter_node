// crypto is a built in node module
const crypto = require('crypto')
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
  photo:{
    type: String
  },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  roles: {
    type: String,
    enum: ['user', 'boat-owner', 'admin' ],
    default: 'user',
  },
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
              },
    message: 'passwords are not the same'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

// isModified, isNew, from mogoose doc : https://mongoosejs.com/docs/api/document.html

userSchema.pre('save',async function(next) {
  // run function only if password modified
  if(!this.isModified('password')) return next();
  // bcrypt.hash = asynchronous version
  this.password = await bcrypt.hash(this.password, 12);
  // delete password field
  this.passwordConfirm = undefined;
  next();
})

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  // timestamp 1 second in the past, to avoid differences (takes time to update, can vary)
  this.passwordChangedAt = Date.now() - 1000;
  next();
})

userSchema.pre(/^find/, function(next) {
  // not arrow function to access this keyword
  // this points to current query
  // regex for query starting with find
  // for getAllUsers, we want to access only the one with property active: true
  this.find({ active: { $ne: false}});
  next();

});

userSchema.methods.correctPassword = async function(
  // return true or false
  candidatePassword, userPassword
  ) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  // this = current document
  if(this.passwordChangedAt) {
    // console.log(this.passwordChangedAt, JWTTimestamp)
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    return JWTTimestamp < changedTimestamp
  }
  //  return false means no change
  return false
}

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  // console.log({resetToken}, this.createPasswordResetToken)
  this.passwordResetExpires = Date.now() + 10*60*1000;
  // to send by email
  return resetToken;
}




module.exports = mongoose.model('User', userSchema);
