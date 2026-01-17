const params = new URLSearchParams(window.location.search);
const level = params.get("level");

const title = document.getElementById("quiz-title");
const box = document.getElementById("quiz-box");
const nextBtn = document.getElementById("nextBtn");

let current = 0;
let score = 0;
let questions = [];

fetch("/static/quizzes.json")
    .then(res => res.json())
    .then(data => {
        questions = data[TOPIC][level];
        title.innerText = `${TOPIC.toUpperCase()} — ${level.toUpperCase()}`;
        showQuestion();
    });

function showQuestion() {
    const q = questions[current];
    box.innerHTML = `<p>${q.question}</p>`;

    q.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.innerText = opt;
        btn.onclick = () => check(i);
        box.appendChild(btn);
    });
}

function check(i) {
    if (i === questions[current].answer) score++;
    current++;
    if (current < questions.length) showQuestion();
    else {
        box.innerHTML = `<h3>Score: ${score}/${questions.length}</h3>
        <button onclick="location.reload()">Retry</button>`;
        nextBtn.style.display = "none";
    }
}
