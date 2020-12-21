const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const MongoClient = require('mongodb').MongoClient;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/static', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


mongoose.connect("mongodb+srv://admin_stacy:test123@cluster0.iqsln.mongodb.net/todoDB?retryWrites=true&w=majority", 
{ useNewUrlParser: true,useUnifiedTopology:true });


const itemsSchema = {
    name: String
};
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Write down your todolist"
});
const item2 = new Item({
    name: "<---Tick to delete"
})
const defaultItems = [item1, item2];


let day = new Date().toISOString().slice(0, 10);
app.get("/", function (req, res) {
    Item.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("successfully saved.");
                }
            });
            res.redirect("/");
        }else{
            res.render("index", { items: foundItems, day: day });
        }

    })


})

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId,function(err){
        if(!err){
            console.log("successfully deleted");
            res.redirect("/");
        }
        
    });
    

})
app.post("/", function (req, res) {
    const itemName = req.body.newItem;
    const item = new Item({
        name:itemName
    })
    item.save();
   res.redirect("/")
})
app.get("/edit/:id",function(req,res){
   const id = req.params.id;
   Item.find({},function(err,foundItems){
       res.render("edit",{items:foundItems,day:day,id:id})
   })

})
app.post("/edit/:id",function(req,res){
    const id = req.params.id;
    Item.findByIdAndUpdate(id,{name:req.body.editedContent},
        function(err){
        if(!err){
            console.log("successfully upadted");
            res.redirect("/");
        }
    })
    
})

app.listen(3000, function () {
    console.log("server is running on port 3000");
})