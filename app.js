const express=require("express");
const app=express();
const path=require("path");
const fs=require("fs");
const { redirect } = require("express/lib/response");
// const hisaabDir = './hisaab';

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));


app.get("/", (req, res) => {
    fs.readdir(`./hisaab`, function (err, files) {
        if (err) return res.status(500).send(err);
        console.log("Files found:", files); // Add this to see the list of files
        res.render("index", { files: files });
    });
});

app.get("/create",(req,res)=>{
    res.render("create")
})


// Check if the process has write permission to the 'hisaab' folder
// fs.access(hisaabDir, fs.constants.W_OK, (err) => {
//     if (err) {
//         console.error(`${hisaabDir} is not writable`);
//     } else {
//         console.log(`${hisaabDir} is writable`);
//     }
// });
//
//creating  file at hisaab folder with a name 
app.post("/createhisaab", (req, res) => {
    
  var currentdate=new Date();
  var date=`${currentdate.getDate()}-${currentdate.getMonth()+1}-${currentdate.getFullYear()}`;

    fs.writeFile(`./hisaab/${date}`, req.body.content, function(err) {
        if (err) return res.status(500).send(err);
        console.log(`File ${req.body.title} created`); // Add this to confirm file creation
        res.redirect("/");
    });

});

app.get("/edit/:filename", (req, res) => {
    const filePath = `./hisaab/${req.params.filename}`;

    // Read the file content dynamically
    fs.readFile(filePath, "utf-8", function (err, filedata) {
        if (err) return res.status(500).send(err);

        // Render the 'edit.ejs' page with file content and filename
        res.render("edit", { filedata, filename: req.params.filename });
    });
});

app.get("/hisaab/:filename", (req, res) => {
        fs.readFile(`./hisaab/${req.params.filename}`,"utf-8",function(err,filedata){
            if(err) return res.status(500).send(err)
                res.render("hisaab",{filedata, filename: req.params.filename})
        })
});

app.get("/delete/:filename", (req, res) => {
    fs.unlink(`./hisaab/${req.params.filename}`,function(err){
        if(err) return res.status(500).send(err)
            res.redirect("/")
    })
});


app.post("/update/:filename", (req, res) => {
    fs.writeFile(`./hisaab/${req.params.filename}`, req.body.content, function(err){
        if(err) {
            return res.status(500).send(err);
        }
        res.redirect("/");
    });
});

 

app.listen(3000);