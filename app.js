var express= require("express"),
    bodyparser=require("body-parser"),
    mongoose= require("mongoose"),
    expressSanitizer= require("express-sanitizer"),
    methodOverride= require("method-override");
var app=express();

mongoose.connect("mongodb://localhost/restful");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


var blogSchema= new mongoose.Schema({
    title:String,
    image:String,
    body: String,
    created: {type:Date,default:Date.now}
});

var Blog=mongoose.model("Blog",blogSchema); 

// Blog.create({
//     title:"Corona",
//     image:"https://images.financialexpress.com/2020/03/coronav660.jpg",
//     body:"Bsdke ne Zindagi Tabah kar di!"
// });

app.get("/blogs",function(req,res){
    Blog.find({},function(error,Blogs){
        if(!error){
            console.log("/blogs was opened.")
            res.render("index",{Blogs:Blogs});
        }
        else{
            console.log("/blogs has an error.");
        }
    });

});
app.get("/blogs/new",function(req,res){
    res.render("new");
});

app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(!err){
            res.render("show",{Blogs:blog});
        }
        else{
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err){
            console.log("Error Found in /blogs/:id/edit")
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{Blogs:blog});
        }
    });

});

app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err, updateBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

app.get("/",function(req,res){
    res.redirect("/blogs");
});

app.post("/blogs",function(req,res){
    console.log(req.body);
    if(req.body.blog.body!=''){
        req.body.blog.body=req.sanitize(req.body.blog.body);
        console.log("=========");
        console.log(req.body);
        
        Blog.create(req.body.blog,function(err,blog){
                if(!err){
                    console.log("New Post Added");
                    res.redirect("/blogs");
                }
            });
        }
        else{
            res.redirect("/blogs");
        }
});

app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(!err){
            console.log("Delete Successgful");
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
    
});


app.listen(8000,"localhost",function(){
    console.log("RestFul has Started.");
});