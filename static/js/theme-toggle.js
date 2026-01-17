const toggle = document.getElementById("darkSwitch");
const page = document.querySelector(".theme-page");
const topic = page.dataset.topic;
const key = `darkMode_${topic}`;

if (localStorage.getItem(key) === "true") {
    page.classList.add("dark");
    toggle.checked = true;
}

toggle.addEventListener("change", () => {
    page.classList.toggle("dark");
    localStorage.setItem(key, page.classList.contains("dark"));
});
