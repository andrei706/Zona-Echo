window.addEventListener("DOMContentLoaded", function () {

    let themeSwitch = document.getElementById("themeSwitch");
    let themeIcon = document.getElementById("themeIcon");

    if (localStorage.getItem("tema") === "dark") {
        if (themeSwitch) themeSwitch.checked = true;
        if (themeIcon) {
            themeIcon.classList.remove("fa-sun");
            themeIcon.classList.add("fa-moon");
        }
    } else {
        if (themeSwitch) themeSwitch.checked = false;
        if (themeIcon) {
            themeIcon.classList.remove("fa-moon");
            themeIcon.classList.add("fa-sun");
        }
    }

    if (!themeSwitch) return;

    themeSwitch.addEventListener("change", function () {
        if (this.checked) {
            document.body.classList.add("dark");
            document.documentElement.classList.add("dark");
            document.documentElement.setAttribute('data-bs-theme', 'dark');
            localStorage.setItem("tema", "dark");
            if (themeIcon) {
                themeIcon.classList.remove("fa-sun");
                themeIcon.classList.add("fa-moon");
            }
        } else {
            document.body.classList.remove("dark");
            document.documentElement.classList.remove("dark");
            document.documentElement.removeAttribute('data-bs-theme');
            localStorage.removeItem("tema");
            if (themeIcon) {
                themeIcon.classList.remove("fa-moon");
                themeIcon.classList.add("fa-sun");
            }
        }
    });
});
