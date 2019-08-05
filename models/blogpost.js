var mongoose = require("mongoose");

var blogSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username : {
          type: String,
          ref : "User"
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("blogpost", blogSchema);
