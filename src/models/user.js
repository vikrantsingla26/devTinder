const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 50,
    },

    lastName: {
      type: String,
    },

    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email syntax is incorrect.");
        }
      },
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      validate(value){
        if(!validator.isStrongPassword(value)){
            throw new Error("enter the strong password!!!! ")
        }
      }
    },

    age: {
      type: Number,
      min: 18,
    },

    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error(
            "Gender is not valid. Please enter male, female, or other."
          );
        }
      },
    },

    photoUrl: {
      type: String,
      validate(value) {
        // Validate only if photoUrl is provided
        if (value && !validator.isURL(value)) {
          throw new Error("Photo URL is incorrect.");
        }
      },
    },

    about: {
      type: String,
      default: "this is the default about of user",
    },

    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;