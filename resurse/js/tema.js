
if (localStorage.getItem("tema") === "dark") {
    document.documentElement.setAttribute("data-bs-theme", "dark");
    document.documentElement.classList.add("dark", "dark-preload");
} else {
    document.documentElement.removeAttribute("data-bs-theme");
    document.documentElement.classList.remove("dark");
}

document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("tema") === "dark") {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }
    document.documentElement.classList.remove("dark-preload");
});