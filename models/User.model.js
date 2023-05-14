const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    username: {
      type: String,
      require: true,
      min: 6,
    },
    email: {
      type: String,
      require: true,
      max: 50,
    },
    password: {
      type: String,
      require: true,
      min: 6,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      default: "Hi👋 Welcome To My Profile",
    },
    avatar: {
      type: String,
      default: "uploads\\defaul-avt-user.jpg",
    },
    avatarCover: {
      type: String,
      default: "",
    },
    website: String,
    location: String,
    phoneNumber: String,
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
