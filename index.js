const express = require("express");
const path = require("path");
const fs = require("fs");
const sass = require("sass");
const sharp = require("sharp");

const ejs = require("ejs");
const pg = require("pg");

app = express();
app.set("view engine", "ejs")

obGlobal = {
    obErori: null,
    obImagini: null,
    folderScss: path.join(__dirname, "resurse/scss"),
    folderCss: path.join(__dirname, "resurse/css"),
    folderBackup: path.join(__dirname, "backup"),
}

console.log("Folder index.js", __dirname);
console.log("Folder curent (de lucru)", process.cwd());
console.log("Cale fisier", __filename);


// SQL

client = new pg.Client({
    database: "cti_2026",
    user: "andrei",
    password: "parola",
    host: "localhost",
    port: 5432
})

client.connect()

app.get("/produse", function (req, res) {

    clauzaWhere = ""
    if (req.query.tip)
        clauzaWhere = `where tip_produs ='${req.query.tip}'`
    client.query(`select * from prajituri ${clauzaWhere}`, function (err, rez) {
        if (err) {
            console.log("Eroare", err);
            afisareEroare(res, 2)
        }
        else {
            res.render("pagini/produse", {
                produse: rez.rows,
                optiuni: []
            })
            console.log(res);
        }
    })
})

app.get("/produs/:id", function (req, res) {

    client.query(`select * from prajituri where id=${req.params.id}`, function (err, rez) {
        if (err) {
            console.log("Eroare", err);
            afisareEroare(res, 2)
        }
        else {
            if (rez.rowCount == 0) {
                afisareEroare(res, 404, "Produs inexistent")
            }
            else {
                res.render("pagini/produs", {
                    prod: rez.rows[0],
                    optiuni: []
                })
            }
        }
    })
})

// End of SQL

function initErori() {
    let continut = fs.readFileSync(path.join(__dirname, "resurse/json/erori.json")).toString("utf-8");
    let erori = obGlobal.obErori = JSON.parse(continut)
    let err_default = erori.eroare_default
    err_default.imagine = path.join(erori.cale_baza, err_default.imagine)
    for (let eroare of erori.info_erori) {
        eroare.imagine = path.join(erori.cale_baza, eroare.imagine)
    }
}
initErori()

function afisareEroare(res, identificator, titlu, text, imagine) {
    let eroare = obGlobal.obErori.info_erori.find((elem) => elem.identificator == identificator)
    //cautam eroarea dupa identificator
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

let vect_foldere = ["temp", "logs", "backup", "fisiere_uploadate"]
for (let folder of vect_foldere) {
    if (!fs.existsSync(path.join(__dirname, folder))) {
        fs.mkdirSync(path.join(__dirname, folder), { recursive: true });
    }
}

// app.get("/eroare", function (req, res) {
//     afisareEroare(res, 404, "Eroare 404!!!");
// })

// app.get("/favicon.ico", function (req, res) {
//     res.sendFile(path.join(__dirname, "/resurse/imagini/favicon/favicon.ico"));
// });

app.get(["/", "/index", "/home"], function (req, res) {
    let vals = [4, 9, 16];
    let rIdx = Math.floor(Math.random() * vals.length);
    let nrImagRand = vals[rIdx];

    let imaginiFiltrate = obGlobal.obImagini.imagini.filter(im => {
        let numeFis = im.cale_imagine.split('.')[0];
        return numeFis.length < 12;
    });

    let alese = [...imaginiFiltrate];
    for (let i = alese.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [alese[i], alese[j]] = [alese[j], alese[i]];
    }

    let imaginiAlese = [];
    if (alese.length > 0) {
        for (let i = 0; i < nrImagRand; i++) {
            imaginiAlese.push(alese[i % alese.length]);
        }
    }

    res.render("pagini/index", {
        ip: req.ip,
        imagini: obGlobal.obImagini.imagini,
        imagini_animata: imaginiAlese,
        nrImagRand: nrImagRand
    });
    console.log("Am primit o cerere GET pe /");
})



// app.get("/galerie", function (req, res) {
//     res.render("pagini/galerie", {
//         imagini: obGlobal.obImagini.imagini
//     });
//     console.log("Am primit o cerere GET pe /galerie");
// })

// app.get("/despre", function(req, res){
//     //res.sendFile(path.join(__dirname, "index.html"));
//     res.render("pagini/despre");
//     console.log("Am primit o cerere GET pe /despre");
// })

// app.get("/:a/:b", function (req, res) {
//     res.sendFile(path.join(__dirname, "index.html"));
// });

app.use("/resurse", express.static(path.join(__dirname, "resurse")));
app.use("/dist", express.static(path.join(__dirname, "node_modules/bootstrap/dist")));

// app.get("/cale/:a/:b", function (req, res) {
//     res.send(parseInt(req.params.a) + parseInt(req.params.b));
//     console.log("Am primit o cerere GET pe /cale");
// })

// app.get("/cale2", function (req, res) {
//     res.write("ceva\n");
//     res.write("altceva");

//     res.end();
//     console.log("Am primit o cerere GET pe /cale");
// })

app.get("/*pagina", function (req, res) {
    console.log("Cale pagina", req.url);
    if (req.url.startsWith("/resurse") && path.extname(req.url) == "") {
        afisareEroare(res, 403);
        return;
    }
    if (path.extname(req.url) == ".ejs") {
        afisareEroare(res, 400);
        return;
    }
    try {
        res.render("pagini" + req.url, function (err, rezRandare) {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    afisareEroare(res, 404, "Pagina nu a fost gasita!!!");
                }
                else {
                    afisareEroare(res);
                }
            }
            else {
                res.send(rezRandare);
                console.log("Rezultat randare", rezRandare);
            }
        });
    }
    catch (err) {
        if (err.message.includes("Cannot find module")) {
            afisareEroare(res, 404, "Pagina nu a fost gasita!!!");
        }
        else {
            afisareEroare(res);
        }
    }
})

function initImagini() {
    var continut = fs.readFileSync(path.join(__dirname, "resurse/json/galerie.json")).toString("utf-8");

    obGlobal.obImagini = JSON.parse(continut);
    let vImagini = obGlobal.obImagini.imagini;
    let caleGalerie = obGlobal.obImagini.cale_galerie

    let caleAbs = path.join(__dirname, caleGalerie);
    let caleAbsMediu = path.join(caleAbs, "mediu");
    let caleAbsMic = path.join(caleAbs, "mic");
    if (!fs.existsSync(caleAbsMediu)) fs.mkdirSync(caleAbsMediu);
    if (!fs.existsSync(caleAbsMic)) fs.mkdirSync(caleAbsMic);

    let data = new Date();
    let oraMinuteSrv = data.getHours() * 60 + data.getMinutes();

    let imaginiFiltrate = vImagini.filter(imag => {
        if (!imag.timp) return false;
        let p = imag.timp.split("-");
        let start = p[0].split(":");
        let end = p[1].split(":");
        let tStart = parseInt(start[0]) * 60 + parseInt(start[1]);
        let tEnd = parseInt(end[0]) * 60 + parseInt(end[1]);
        return oraMinuteSrv >= tStart && oraMinuteSrv <= tEnd;
    });

    // Trunchere la maxim 10
    imaginiFiltrate = imaginiFiltrate.slice(0, 10);

    for (let imag of imaginiFiltrate) {
        let numeSiExt = imag.cale_imagine.split(".");
        let numeFis = numeSiExt[0];
        let caleFisAbs = path.join(caleAbs, imag.cale_imagine);

        // Setup Mediu
        let caleFisMediuAbs = path.join(caleAbsMediu, numeFis + ".webp");
        if (!fs.existsSync(caleFisMediuAbs)) {
            sharp(caleFisAbs).resize({ width: 400, height: 400, fit: "cover" }).toFile(caleFisMediuAbs);
        }
        imag.fisier_mediu = path.join("/", caleGalerie, "mediu", numeFis + ".webp");

        // Setup Mic
        let caleFisMicAbs = path.join(caleAbsMic, numeFis + ".webp");
        if (!fs.existsSync(caleFisMicAbs)) {
            sharp(caleFisAbs).resize({ width: 250, height: 250, fit: "cover" }).toFile(caleFisMicAbs);
        }
        imag.fisier_mic = path.join("/", caleGalerie, "mic", numeFis + ".webp");

        // Original
        imag.fisier = path.join("/", caleGalerie, imag.cale_imagine);
    }

    // Setam inapoi in obiectul original pentru rute doar cele corecte
    obGlobal.obImagini.imagini = imaginiFiltrate;
    console.log("Imagini filtrate prelucrate în initImagini (max 10).");
}
initImagini();


function compileazaScss(caleScss, caleCss) {
    if (!caleCss) {

        let numeFisExt = path.basename(caleScss); // "folder1/folder2/a.scss" -> "a.scss"
        let numeFis = numeFisExt.split(".")[0]   /// "a.scss"  -> ["a","scss"]
        caleCss = numeFis + ".css"; // output: a.css
    }

    if (!path.isAbsolute(caleScss))
        caleScss = path.join(obGlobal.folderScss, caleScss)
    if (!path.isAbsolute(caleCss))
        caleCss = path.join(obGlobal.folderCss, caleCss)

    let caleBackup = path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup, { recursive: true })
    }

    // la acest punct avem cai absolute in caleScss si  caleCss

    let numeFisCss = path.basename(caleCss);
    if (fs.existsSync(caleCss)) {
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resurse/css", numeFisCss))// +(new Date()).getTime()
    }
    rez = sass.compile(caleScss, { "sourceMap": true });
    fs.writeFileSync(caleCss, rez.css)

}


//la pornirea serverului
vFisiere = fs.readdirSync(obGlobal.folderScss);
for (let numeFis of vFisiere) {
    if (path.extname(numeFis) == ".scss") {
        compileazaScss(numeFis);
    }
}


fs.watch(obGlobal.folderScss, function (eveniment, numeFis) {
    if (eveniment == "change" || eveniment == "rename") {
        let caleCompleta = path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)) {
            compileazaScss(caleCompleta);
        }
    }
})


function verificaErori() {
    const caleJson = path.join(__dirname, "resurse/json/erori.json");

    //Verificare daca exista fisierul erori.json
    if (!fs.existsSync(caleJson)) {
        console.error("Eroare critica: Nu exista fisierul erori.json la calea " + caleJson + ". Aplicatia se va inchide.");
        process.exit();
    }

    let continut = fs.readFileSync(caleJson).toString("utf-8");

    //Verificare proprietati specificate de mai multe ori pe string
    let stack = [new Set()];
    let cheieCurenta = "";
    let inGhilimele = false;

    for (let i = 0; i < continut.length; i++) {
        //console.log(stack);
        let char = continut[i];

        if (char === '"' && (i === 0 || continut[i - 1] !== '\\')) {
            inGhilimele = !inGhilimele;

            if (!inGhilimele) {
                let j = i + 1;
                while (j < continut.length && [" ", "\n", "\r", "\t"].includes(continut[j])) {
                    j++;
                }

                if (continut[j] === ':') {
                    let obiectCurent = stack[stack.length - 1];
                    if (obiectCurent.has(cheieCurenta)) {
                        console.error(`Eroare in JSON: Numele de proprietate "${cheieCurenta}" este duplicat în același obiect.`);
                    }
                    obiectCurent.add(cheieCurenta);
                }
                cheieCurenta = "";
            }
            continue;
        }

        if (inGhilimele) {
            cheieCurenta += char;
        } else {
            if (char === '{') {
                stack.push(new Set());
            } else if (char === '}') {
                stack.pop();
            }
        }
    }


    let erori = JSON.parse(continut);

    //Verfificare daca nu exista una dintre proprietati
    if (!erori.info_erori || !erori.cale_baza || !erori.eroare_default) {
        console.error("Eroare in JSON: Lipseste cel putin una dintre proprietatile de baza: 'info_erori', 'cale_baza' sau 'eroare_default'.");
    }

    //Verificare daca nu exista propietatile erorii default
    if (erori.eroare_default) {
        if (!erori.eroare_default.titlu || !erori.eroare_default.text || !erori.eroare_default.imagine) {
            console.error("Eroare in JSON: Pentru 'eroare_default' lipseste una dintre proprietatile obligatorii: 'titlu', 'text' sau 'imagine'.");
        }
    }

    //Verificare daca folderul cale_baza nu exista
    let folderCaleBaza = null;
    if (erori.cale_baza) {
        folderCaleBaza = path.join(__dirname, erori.cale_baza);
        if (!fs.existsSync(folderCaleBaza)) {
            console.error(`Eroare: Folderul specificat in 'cale_baza' (${folderCaleBaza}) nu exista in sistemul de fisiere.`);
        }
    }

    //Nu exista vreunul dintre fisierele imagine
    if (folderCaleBaza && erori.eroare_default && erori.eroare_default.imagine) {
        let pathImgDef = path.join(folderCaleBaza, erori.eroare_default.imagine);
        if (!fs.existsSync(pathImgDef)) {
            console.error(`Eroare: Imaginea pentru eroarea default (${pathImgDef}) nu exista in sistemul de fisiere.`);
        }
    }

    if (folderCaleBaza && erori.info_erori) {
        erori.info_erori.forEach(err => {
            if (err.imagine) {
                let pathImg = path.join(folderCaleBaza, err.imagine);
                if (!fs.existsSync(pathImg)) {
                    console.error(`Eroare: Imaginea pentru eroarea cu identificatorul ${err.identificator} (${pathImg}) nu exista in sistemul de fisiere.`);
                }
            }
        });
    }

    //Mai multe erori cu acelasi identificator
    if (erori.info_erori) {
        let duplicateId = {};
        erori.info_erori.forEach(err => {
            if (!duplicateId[err.identificator]) duplicateId[err.identificator] = [];
            duplicateId[err.identificator].push(err);
        });

        for (let id in duplicateId) {
            if (duplicateId[id].length > 1) {
                console.error(`Eroare in JSON: Exista mai multe erori cu acelasi identificator (${id}). Mai jos sunt detaliile lor (fara identificator):`);
                duplicateId[id].forEach(errDuplicate => {
                    let clona = { ...errDuplicate };
                    delete clona.identificator;
                    console.error(` - ${JSON.stringify(clona)}`);
                });
            }
        }
    }
}

app.listen(8080);
verificaErori();
console.log("Serverul a pornit!");