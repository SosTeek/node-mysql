/*eslint-disable*/
const User = require('../models').User;
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const validator = require('validator');

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8],
          msg: "At least 8 characters required for password"
        },
    },
  },
    role: {
      type: DataTypes.STRING,
      enum: ['admin', 'user'],
      defaultValue: 'user',
    },
    passwordChangedAt: DataTypes.DATE,
    passwordResetToken: DataTypes.STRING,
    passwordResetExpires: DataTypes.DATE,
    // confirmPassword: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // }
  }, 
  /************* Hooks Didn't Worked */
  // {
  //   hooks: {
  //     beforeCreate: function (user, options) {
  //       const hashed_password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
  //       user.password = hashed_password;//bcrypt.hashSync(user.pwd, bcrypt.genSaltSync(10), null);
  //       user.confirmPassword = undefined;
  //     },
  //   }
  // },
  {
    sequelize,
    modelName: 'User',
  });
  return User;
};

// const hashPassword = (password)=> {
//   return bcrypt.hash(password, 12)
// }

// User.beforeCreate(async (user, options) => {
//   const hashedPassword = await hashPassword(user.password);
//   user.password = hashedPassword;
// });

// User.addHook('beforeCreate',async function(next) {
//   //Hash the passoword with cost of 12
//   this.passoword = await bcrypt.hash(this.passoword, 12);

//   // Delete the confirmPassword field
//   this.confirmPassword = undefined;

//   next();
// } )

//Instance Method createPasswordResetToken()
Model.prototype.createPasswordResetToken = function() {
        const resetToken = crypto.randomBytes(32).toString('hex');
        this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
        this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
        // console.log({resetToken}, this.passwordResetToken);

        return resetToken;  
};
