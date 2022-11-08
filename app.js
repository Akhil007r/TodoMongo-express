// jshint esversion:6
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const date = require(__dirname + "/date.js")
const _ = require('lodash')
const app = express();
// let items = [];
let workItems = [];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

//Connecting to mongodb 

// mongoose.connect("mongodb://localhost:27017/todoDB")

// connecting to cloud
mongoose.connect("mongodb+srv://admin-Akhil:test123@cluster0.ct6hpem.mongodb.net/todoDB")

// Creating mongose Schema 
const itemsSchema = mongoose.Schema({
    name: String,
});

const listSchema = mongoose.Schema({
    name: String,
    list: [itemsSchema],
})

// Creating mongoose Model

const Item = mongoose.model("Item", itemsSchema)

const customList = mongoose.model("List", listSchema)

const item1 = new Item({
    name: "To-Do List",
})

const item2 = new Item({
    name: "Click on + to Add new items",
})

const item3 = new Item({
    name: "press on check box to delete",
})

const defaultItems = [item1, item2, item3]

// console.log(defaultItems)



app.get("/", function (req, res) {
    //    let day = date.getDate();

    // find items inside db

    Item.find({}, function (err, itemResult) {
        // console.log(err);
        // checking for empty array and performing default items insertion to database

        if (itemResult.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err)
                } else {
                    // console.log("Data inserted to database")
                }
            })
            res.redirect("/");
        } else {
            // console.log(itemResult);
            res.render('index', { listTitle: "Today", newListItem: itemResult });

        }
    })

})



app.post("/", function (req, res) {
    let itemName = req.body.newItem;
    let listName = req.body.lists;
    console.log(listName);
    const item = new Item({
        name: itemName,
    })
    if (listName === "Today") {
        item.save();
        res.redirect("/")

    }else{
        customList.findOne({name : listName},function(err,foundList)
        {

            if(err){
                console.log(err);
            }else{
            foundList.list.push(item);
            foundList.save();
            res.redirect("/"+listName)
            }
        })
    }


    // console.log(req.body)
    // console.log(req.body.list)

    // if (req.body.list === "WORK") {
    //     workItems.push(item);
    //     res.redirect("/work")
    // }
    // else {
    //     items.push(item)
    //     res.redirect("/")
    // }

})

// delete

app.post("/delete", function (req, res) {
    console.log(req.body.checkbox)
    const check = req.body.checkbox;
    const listName = req.body.listName;
    console.log(listName);
    if(listName === "Today"){
        Item.findByIdAndRemove(check, function (err) {
            console.log(err)
        })
        res.redirect("/")
    }else{
    customList.findOneAndUpdate({name : listName},{$pull:{list:{_id:check}}},function(err,foundList){
    if(!err){
        res.redirect("/"+listName)
    }
})
    }
 
})

// routing 
app.get("/:customListName", function (req, res) {
    const customListName = _.capitalize(req.params.customListName);
    customList.findOne({ name: customListName }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                console.log(customListName);
                const list = new customList({
                    name: customListName,
                    list: defaultItems
                })
                list.save();
                res.redirect("/" + customListName)
            } else {
                res.render('index', { listTitle: foundList.name, newListItem: foundList.list })
                console.log("item exists");
                // res.redirect("/" + customListName)

            }
        }
    })

})




// work
app.get("/work", function (req, res) {
    res.render("index", { listTitle: "WORK ITEMS", newListItem: workItems });
})
app.get("/about", function (req, res) {
    res.render("about")
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
    console.log("Server started at location 3000")
})
