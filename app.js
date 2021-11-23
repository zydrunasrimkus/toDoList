const express = require('express');
const app = express();
const date = require(__dirname + "/date.js")

let item = "";
let items = ['Buy food', 'Cook food', 'Eat food'];
let workItems = [];

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));

app.get('/', (req, res) => {

    let day = date.getDay();

    res.render("list", {listTitle: day, items: items});
});

app.post("/", (req,res) => {
    item = req.body.newItem;

    if (req.body.list == "Work") {
        workItems.push(item);
        res.redirect('/work');
    } else {
        items.push(item);
        res.redirect('/');
    }
});


app.get("/work", (req,res) => {
    res.render("list", {
        listTitle: "Work",
        items: workItems
    });
});

app.get("/about", (req,res) => {
    res.render("about");
})

app.post("/work", (req, res) => {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Server up on port 3000!');
});