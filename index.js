const express= require("express");
const path= require("path");

app= express();
app.set("view engine", "ejs")

console.log("Folder index.js", __dirname);
console.log("Folder curent (de lucru)", process.cwd());
console.log("Cale fisier", __filename);

app.get("/", function(req, res){
    //res.sendFile(path.join(__dirname, "index.html"));
    res.render("pagini/index");
    console.log("Am primit o cerere GET pe /");
})

app.get("/despre", function(req, res){
    //res.sendFile(path.join(__dirname, "index.html"));
    res.render("pagini/despre");
    console.log("Am primit o cerere GET pe /despre");
})

app.get("/:a/:b", function(req, res){
   res.sendFile(path.join(__dirname, "index.html"));
});

app.use("/resurse", express.static(path.join(__dirname, "resurse")));

app.get("/cale/:a/:b", function(req, res){
    res.send(parseInt(req.params.a) + parseInt(req.params.b));
    console.log("Am primit o cerere GET pe /cale"); 
})

app.get("/cale2", function(req, res){
    res.write("ceva\n\nn]n]n]n]n]n]n]n]n]n]n]n]n]n]n]n]n]n]n]n]n]n]n]n]n]n]");
    res.write("altceva");

    res.end();
    console.log("Am primit o cerere GET pe /cale"); 
})

app.listen(8080);
console.log("Serverul a pornit!");