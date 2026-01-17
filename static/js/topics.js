document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".topic-card");

    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add("show");
        }, index * 120); // stagger effect
    });
});
