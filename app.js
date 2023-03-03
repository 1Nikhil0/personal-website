//  Hosting the server using nodeJs

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const https = require("https");

// moduels of To-Do List

const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));


app.get("/", function (req, res) {
    res.render("work");
});

app.get("/contact", function (req, res) {
    res.render("contact");
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.post("/contact", function (req, res) {

    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const subject = req.body.subject;
    const number = req.body.phonenumber;
    const email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
                SUBJECT: subject,
                PHONE: number
            }
        }]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us20.api.mailchimp.com/3.0/lists/ed312ea9cd";

    const options = {
        method: "POST",
        auth: "nikhil:724e376ed59413de24bfeb7e5bc9a2f8-us20"
    }

    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.render("success");
        } else {
            res.render("failure");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure", function (req, res) {
    res.redirect("/");
});



// To Do List app.js

const day = date.getDate();

//mongoose.connect("mongodb+srv://nikhil:nikhil@cluster0.zoxtf.mongodb.net/todolistDB");

const itemsSchema = new mongoose.Schema({
    name: {
        type: String
    }
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the ➕ button to add a new item."
});

const item3 = new Item({
    name: "👈 Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);

app.get("/todolist", function (req, res) {

    const day = date.getDate();

    Item.find({}, function (err, foundItems) {

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Succesfully added the default Items");
                }
            });
            res.redirect("todolist");
        } else {
            res.render("todolist", { listTitle: day, newListItems: foundItems });
        }

    })

});

// app.get("/:customListName", function (req, res) {

//     const customListName = _.capitalize(req.params.customListName);

//     List.findOne({ name: customListName }, function (err, foundList) {
//       if (!err) {
//         if (!foundList) {
//           //Create a new List 
//           const list = new List({
//             name: customListName,
//             items: defaultItems
//           });

//           list.save();
//           res.redirect("todolist" + customListName);

//         } else {

//           //Show an exsistign List 
//           res.render("todolist", { listTitle: foundList.name, newListItems: foundList.items });

//         }
//       }
//     })

//   });

app.post("/todolist", function (req, res) {

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === day) {

        item.save();
        res.redirect("todolist");

    } else {

        List.findOne({ name: listName }, function (err, foundlist) {
            foundlist.items.push(item);
            foundlist.save();
            res.redirect("todolist" + listName);
        });

    }

});

app.post("/delete", function (req, res) {

    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === day) {

        Item.findByIdAndRemove(checkedItemId, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Succesfully Removed entry");
                res.redirect("todolist");
            }
        });

    } else {
        // List.findOneAndUpdate({name: listName},{$pull: {items: {_id:checkedItemId}}},function(err,foundList){
        //   if(!err){
        //     res.redirect("todolist"+listName);
        //   }
        // });

    }

});


//daily_journal app.js

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


const postSchema = {
    title: String,
    content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/daily_journal_home", function (req, res) {

    Post.find({}, function (err, posts) {
        res.render("daily_journal_home", {
            startingContent: homeStartingContent,
            posts: posts
        });
    });
});

app.get("/daily_journal_compose", function (req, res) {
    res.render("daily_journal_compose");
});

app.post("/daily_journal_compose", function (req, res) {
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postBody
    });


    post.save(function (err) {
        if (!err) {
            res.redirect("/daily_journal_home");
        }
    });
});

app.get("/post/:postId", function (req, res) {

    const requestedPostId = req.params.postId;
    console.log(requestedPostId);

    Post.find({ title: requestedPostId }, function (err, post) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(post.title);
            res.render("daily_journal_post", {
                title: post.title,
                content: post.content
            });
        }
    });

});

app.get("/daily_journal_about", function (req, res) {
    res.render("daily_journal_about", { aboutContent: aboutContent });
});

app.get("/daily_journal_contact", function (req, res) {
    res.render("daily_journal_contact", { contactContent: contactContent });
});


// Server Port 

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
});

// API Key :
// 724e376ed59413de24bfeb7e5bc9a2f8-us20

// List ID:
// ed312ea9cd.