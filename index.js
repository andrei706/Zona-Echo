const express= require("express");
const path= require("path");
const fs=require("fs");
const sass=require("sass");

app= express();
app.set("view engine", "ejs")

obGlobal={
    obErori:null,
    obImagini:null,
    folderScss: path.join(__dirname,"resurse/scss"),
    folderCss: path.join(__dirname,"resurse/css"),
    folderBackup: path.join(__dirname,"backup"),
}

console.log("Folder index.js", __dirname);
console.log("Folder curent (de lucru)", process.cwd());
console.log("Cale fisier", __filename);


function initErori(){
    let continut = fs.readFileSync(path.join(__dirname,"resurse/json/erori.json")).toString("utf-8");
    let erori=obGlobal.obErori=JSON.parse(continut)
    let err_default=erori.eroare_default
    err_default.imagine=path.join(erori.cale_baza, err_default.imagine)
    for (let eroare of erori.info_erori){
        eroare.imagine=path.join(erori.cale_baza, eroare.imagine)
    }
}
initErori()

function afisareEroare(res, identificator, titlu, text, imagine){
    let eroare = obGlobal.obErori.info_erori.find((elem) => elem.identificator==identificator)
    //TO DO cautam eroarea dupa identificator
    //daca sunt setate titlu, text, imagine, le folosim, 
    //altfel folosim cele din fisierul json pentru eroarea gasita
    //daca nu o gasim, afisam eroarea default
    let errDefault = obGlobal.obErori.eroare_default
    res.render("pagini/eroare", {
        imagine: imagine || eroare?.imagine || errDefault.imagine,
        titlu: titlu || eroare?.titlu || errDefault.titlu,
        text: text || eroare?.text || errDefault.text,
    });

}

let vect_foldere=["temp", "logs", "backup", "fisiere_uploadate"]
for(let folder of vect_foldere){
    if(!fs.existsSync(path.join(__dirname, folder))){
        fs.mkdirSync(path.join(__dirname, folder), {recursive:true});
    }
}

app.get("/eroare", function(req, res){
    afisareEroare(res, 404, "Eroare 404!!!");
})

app.get("/favicon.ico", function(req, res){
    res.sendFile(path.join(__dirname, "/resurse/imagini/favicon/favicon.ico"));
});

app.get(["/", "/index", "/home"], function(req, res){
    //res.sendFile(path.join(__dirname, "index.html"));
    res.render("pagini/index", {
        ip: req.ip,
    });
    console.log("Am primit o cerere GET pe /");
})

// app.get("/despre", function(req, res){
//     //res.sendFile(path.join(__dirname, "index.html"));
//     res.render("pagini/despre");
//     console.log("Am primit o cerere GET pe /despre");
// })

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

app.get("/*pagina", function(req, res){
    console.log("Cale pagina", req.url);
    if(req.url.startsWith("/resurse") && path.extname(req.url) == ""){
        afisareEroare(res, 403);
        return;
    }
    if(path.extname(req.url) == ".ejs"){
        afisareEroare(res, 400);
        return;
    }
    try{
        res.render("pagini"+req.url, function(err, rezRandare){
            if(err){
                if(err.message.includes("Failed to lookup view")){
                    afisareEroare(res, 404, "Pagina nu a fost gasita!!!");
                }
                else{
                    afisareEroare(res);
                }
            }
            else{
                res.send(rezRandare);
                console.log("Rezultat randare", rezRandare);
            }
        });
    }
    catch(err){
        if(err.message.includes("Cannot find module")){
            afisareEroare(res, 404, "Pagina nu a fost gasita!!!");
        }
        else{
            afisareEroare(res);
        }
    }
})

app.listen(8080);
console.log("Serverul a pornit!");