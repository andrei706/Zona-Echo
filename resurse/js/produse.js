window.onload = function () {

    function stergeErori() {
        document.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"))
        let cont = document.getElementById("container-erori")
        if (cont) { cont.innerHTML = ""; cont.style.display = "none" }
    }

    function validare() {
        stergeErori()
        let erori = []

        let elNume = document.getElementById("inp-nume")
        let valNume = elNume.value.trim()
        if (valNume !== "" && /^\d+$/.test(valNume)) {
            elNume.classList.add("is-invalid")
            erori.push("Câmpul <b>Caută</b> nu poate consta doar din cifre.")
        }

        let elCaract = document.getElementById("inp-caract-datalist")
        if (elCaract) {
            let valCaract = elCaract.value.trim()
            if (valCaract !== "" && /^\d+$/.test(valCaract)) {
                elCaract.classList.add("is-invalid")
                erori.push("Câmpul <b>Caracteristică specifică</b> nu poate conține doar cifre.")
            }
        }

        let cbBifate = document.querySelectorAll(".checkbox-destinatie:checked")
        if (cbBifate.length === 0) {
            erori.push("Selectați cel puțin o <b>Destinație de utilizare</b>.")
        }

        if (erori.length > 0) {
            let cont = document.getElementById("container-erori")
            if (cont) {
                cont.innerHTML = "<ul class='mb-0'>" + erori.map(e => `<li>${e}</li>`).join("") + "</ul>"
                cont.className = "mt-2 alert alert-danger p-2"
                cont.style.display = "block"
            }
            return false
        }

        return true
    }

    document.getElementById("inp-pret").onchange = function () {
        let val = this.value.trim()
        document.getElementById("infoRange").innerHTML = `(${val})`
    }


    document.getElementById("inp-nume").oninput = function () {
        let val = this.value.trim()
        if (val === "" || !/^\d+$/.test(val)) {
            this.classList.remove("is-invalid")
        }
        else {
            if (/^\d+$/.test(val)) {
                this.classList.add("is-invalid")
            }
        }
    }

    document.getElementById("inp-caract-datalist").oninput = function () {
        let val = this.value.trim()
        if (val === "" || !/^\d+$/.test(val)) {
            this.classList.remove("is-invalid")
            document.getElementById("inp-caract-datalist-error").style.display = "none"
            document.getElementById("lbl-caract-datalist").style.display = "block"
        }
        else {
            if (/^\d+$/.test(val)) {
                this.classList.add("is-invalid")
                document.getElementById("inp-caract-datalist-error").style.display = "block"
                document.getElementById("lbl-caract-datalist").style.display = "none"
            }
        }
    }

    // Blocare Enter
    document.getElementById("inp-nume").addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });


    document.getElementById("filtrare").onclick = function () {
        if (!validare()) return

        let inpNume = document.getElementById("inp-nume").value.trim().toLowerCase()

        let grupRadio = document.getElementsByName("gr_rad")
        let greutateMin, greutateMax, isToate = false;
        for (let rad of grupRadio) {
            if (rad.checked) {
                if (rad.value != "toate") {
                    [greutateMin, greutateMax] = rad.value.split(":")
                    greutateMin = parseInt(greutateMin)
                    greutateMax = parseInt(greutateMax)
                }
                else {
                    isToate = true
                }
                break
            }
        }

        let inpPretMin = parseFloat(document.getElementById("inp-pret").value.trim())

        let inpCategorie = document.getElementById("inp-categorie").value.trim().toLowerCase()

        let cbBifate = document.querySelectorAll(".checkbox-destinatie:checked")
        let destinatiiSelectate = Array.from(cbBifate).map(cb => cb.value.toLowerCase())

        let inpCaractDatalist = document.getElementById("inp-caract-datalist").value.trim().toLowerCase()

        let selectExclCaract = document.getElementById("inp-excl-caracteristici")
        let caractExcluse = Array.from(selectExclCaract.selectedOptions).map(o => o.value.toLowerCase())

        let produse = document.getElementsByClassName("produs")
        for (let prod of produse) {
            prod.style.display = "none"

            let nume = prod.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase()
            let cond1 = nume.includes(inpNume)

            let greutate = parseInt(prod.getElementsByClassName("val-greutate")[0].innerHTML.trim())
            let cond2 = (greutate >= greutateMin && greutate < greutateMax) || isToate;

            let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim())
            let cond3 = pret >= inpPretMin

            let cond4 = prod.getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase() == inpCategorie || inpCategorie == "toate";

            let dest = prod.getElementsByClassName("val-destinatie")[0].innerHTML.trim().toLowerCase()
            let cond5 = destinatiiSelectate.length === 0 || destinatiiSelectate.includes(dest)



            let valCaract = prod.getElementsByClassName("val-caracteristici")[0].innerHTML.trim().toLowerCase()
            let cond7 = inpCaractDatalist === "" || valCaract.split(",").some(c => c.trim() === inpCaractDatalist)

            let arrCaract = valCaract.split(",").map(c => c.trim())
            let cond8 = caractExcluse.length === 0 || !caractExcluse.some(excl => arrCaract.includes(excl))

            if (cond1 && cond2 && cond3 && cond4 && cond5 && cond7 && cond8) {
                prod.style.display = "block"
            }
        }

        let niciun = Array.from(produse).every(p => p.style.display === "none")
        if (niciun) {
            let cont = document.getElementById("container-erori")
            if (cont) {
                cont.innerHTML = "<ul class='mb-0'><li>Nu există rezultate pentru filtrele selectate.</li></ul>"
                cont.className = "mt-2 alert alert-warning p-2"
                cont.style.display = "block"
            }
        }
    }

    document.getElementById("resetare").onclick = function () {
        if (!window.confirm("Ești sigur că vrei să resetezi toate filtrele și sortarea?")) return

        document.getElementById("inp-nume").value = ""
        document.getElementById("inp-pret").value = document.getElementById("inp-pret").dataset.pretMin
        document.getElementById("infoRange").innerHTML = "(" + document.getElementById("inp-pret").dataset.pretMin + ")"
        document.getElementById("inp-categorie").value = "toate"
        document.getElementById("i_rad4").checked = true

        document.getElementById("inp-caract-datalist").value = ""
        Array.from(document.getElementById("inp-excl-caracteristici").options).forEach(o => o.selected = false)
        document.querySelectorAll(".checkbox-destinatie").forEach(cb => cb.checked = true)

        let produse = document.getElementsByClassName("produs")
        for (let prod of produse) {
            prod.style.display = "block"
        }
        stergeErori()
    }

    function sorteaza(semn) {
        let produse = document.getElementsByClassName("produs")
        let vProduse = Array.from(produse)
        vProduse.sort(function (a, b) {
            let pretA = parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML.trim())
            let pretB = parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML.trim())

            if (pretA === pretB) {
                let numeA = a.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase()
                let numeB = b.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase()
                return semn * numeA.localeCompare(numeB, "ro")
            }

            return semn * (pretA - pretB)
        })
        for (let prod of vProduse) {
            prod.parentElement.appendChild(prod)
        }
    }

    document.getElementById("sortCrescNume").onclick = function () {
        if (!validare()) return
        sorteaza(1)
    }
    document.getElementById("sortDescrescNume").onclick = function () {
        if (!validare()) return
        sorteaza(-1)
    }

    let selectEl = document.getElementById("inp-categorie")
    let tipSelectat = selectEl.dataset.tipSelectat
    if (tipSelectat && tipSelectat !== "") {
        document.getElementById("filtrare").click()
    }

    document.getElementById("calculare").onclick = function () {
        if (!validare()) return

        let produse = document.getElementsByClassName("produs")
        let suma = 0
        let nrVizibile = 0
        for (let prod of produse) {
            if (prod.style.display !== "none") {
                suma += parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim())
                nrVizibile++
            }
        }

        let divExistent = document.getElementById("div-suma-calculata")
        if (divExistent) divExistent.remove()

        let divSuma = document.createElement("div")
        divSuma.id = "div-suma-calculata"
        divSuma.innerHTML =
            `<i class="fa-solid fa-calculator" style="margin-right:0.5rem"></i>` +
            `<strong>Total (${nrVizibile} produse):</strong> ${suma.toFixed(2)} RON`
        divSuma.style.cssText = [
            "position: fixed",
            "bottom: 2rem",
            "right: 2rem",
            "z-index: 9999",
            "background: #198754",
            "color: #fff",
            "padding: 1rem 1.5rem",
            "border-radius: 0.75rem",
            "box-shadow: 0 4px 24px rgba(0,0,0,0.35)",
            "font-size: 1rem",
            "animation: fadeInUp 0.3s ease"
        ].join("; ")
        document.body.appendChild(divSuma)

        setTimeout(function () {
            let d = document.getElementById("div-suma-calculata")
            if (d) d.remove()
        }, 2000)
    }

}
