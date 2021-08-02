const mongoose = require("mongoose");

let commentSchema = new mongoose.Schema(
{ 
    text: String, 
    author: //##
    {
        id:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        } ,
        username: String
    }
});
let Comment = mongoose.model("Comment" , commentSchema);
module.exports = Comment;


// we could have stored the entire author in commentScheme 
// which looks like {
//                     username: "**",
//                     _id: "**",
//                     hash: "**",
//                     salt: "**"
//                  }
// but we don't want to store all this data inside each comment,
// we just the the important pieces which are id and username of the user who created the comment



// commentSchema:- {text: "**" , author: {id: "id of the associated user" , username: "name of the associated uswer"}}