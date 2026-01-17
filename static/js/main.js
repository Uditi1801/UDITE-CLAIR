/* ================= CONFIDENCE SYSTEM ================= */

const confidenceLabels = {
    0: "Low",
    1: "Developing",
    2: "Comfortable",
    3: "Strong"
};

function getConfidence(topic) {
    const value = localStorage.getItem(`confidence_${topic}`);
    return value !== null ? parseInt(value) : 0;
}

function updateConfidence(topic, score, total) {
    let level = 0;
    const accuracy = score / total;

    if (accuracy >= 0.9) level = 3;
    else if (accuracy >= 0.7) level = 2;
    else if (accuracy >= 0.4) level = 1;

    localStorage.setItem(`confidence_${topic}`, level);
}

function renderConfidence(topic) {
    const level = getConfidence(topic);
    const label = confidenceLabels[level];

    const el = document.getElementById("confidence-meter");
    if (el) {
        el.innerHTML = `<span class="confidence-label">${label}</span>`;
        el.setAttribute("data-level", level);
    }
}

/* ================= COFFEE MODE ================= */

function toggleCoffeeMode() {
    document.body.classList.toggle("coffee-mode");
    localStorage.setItem(
        "coffee_mode",
        document.body.classList.contains("coffee-mode")
    );
}

document.addEventListener("DOMContentLoaded", () => {
    const coffee = localStorage.getItem("coffee_mode");
    if (coffee === "true") {
        document.body.classList.add("coffee-mode");
    }
});
