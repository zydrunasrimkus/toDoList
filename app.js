const express = require('express');
const app = express();
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const _ = require('lodash');

/* let item = "";
let items = ['Buy food', 'Cook food', 'Eat food'];
let workItems = []; */

mongoose.connect("mongodb+srv://godlesas:test123@cluster0.ijgn0.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
    name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));

app.get('/', (req, res) => {
    Item.find({}, (err, foundItems) => {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err)
                }  else {
                    console.log('success')
                }
            });
            res.redirect('/');
        } else {
            res.render("list", {listTitle: day, items: foundItems});
        }
    });
    let day = date.getDay();
});


app.get('/:customListName', (req,res) => {
    const customListName  = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, (err, foundList) => {
        if(!err) {
            if (!foundList) {
                //create new list
               const list = new List({
                name: customListName,
                items: defaultItems
                });
                list.save();
                console.log('created');
                res.redirect('/' + customListName);
            } else {
                console.log('exists');
                res.render("list", {listTitle: foundList.name, items: foundList.items});
            }
        }
    });

});

app.post("/", (req,res) => {

    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
        name: itemName
    });

    if (listName === date.getDay()) {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, (err, foundList) =>  {
            foundList.items.push(item);
            foundList.save();
            res.redirect('/' + listName);
        })
    }

});

app.post('/delete', (req,res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === date.getDay()) {
        Item.findByIdAndRemove(checkedItemId, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('success');
                res.redirect('/');
            }
        });
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList) => {
            if (!err) {
                res.redirect('/' + listName);
            }
        })
    }


});


app.get("/about", (req,res) => {
    res.render("about");
})

app.post("/work", (req, res) => {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect('/');
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running!');
});