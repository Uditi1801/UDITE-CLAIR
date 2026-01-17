document.addEventListener("DOMContentLoaded", () => {

    const orb = document.getElementById("udiva-orb");
    const windowBox = document.getElementById("udiva-window");
    const typingIndicator = document.getElementById("udiva-typing");
    const messages = document.getElementById("udiva-messages");

    if (!orb || !windowBox) {
        console.error("Udiva elements not found");
        return;
    }

    /* ---------- OPEN / CLOSE ---------- */
    orb.addEventListener("click", () => {
        windowBox.style.display = "flex";
    });

    window.closeUdiva = function () {
        windowBox.style.display = "none";
    };

    /* ---------- FAQ ---------- */
    window.sendFAQ = function (text) {
        document.getElementById("udiva-input").value = text;
        sendUdivaMessage();
    };

    /* ---------- CHAT ---------- */
    window.sendUdivaMessage = function () {
        const input = document.getElementById("udiva-input");
        const message = input.value.trim();
        if (!message) return;

        messages.innerHTML += `<div class="user-msg">${message}</div>`;
        input.value = "";

        typingIndicator.style.display = "block";

        fetch("/udiva-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        })
        .then(res => res.json())
        .then(data => {
            typingIndicator.style.display = "none";
            showMessage(data.reply);
        })
        .catch(() => {
            typingIndicator.style.display = "none";
            messages.innerHTML += `<div class="udiva-msg">Something went wrong.</div>`;
        });
    };

    /* ---------- SHOW MESSAGE (NO TYPING ANIMATION) ---------- */
    function showMessage(text) {
        const bubble = document.createElement("div");
        bubble.className = "udiva-msg";

        const content = document.createElement("div");
        content.className = "udiva-text";
        content.textContent = text;
        bubble.appendChild(content);

        const looksLikeCode =
            text.includes("if ") ||
            text.includes("for ") ||
            text.includes("print(") ||
            text.includes("=");

        if (looksLikeCode) {
            const copyBtn = document.createElement("button");
            copyBtn.className = "copy-btn";
            copyBtn.textContent = "Copy";

            copyBtn.onclick = () => {
                navigator.clipboard.writeText(text).then(() => {
                    copyBtn.textContent = "Copied ✓";
                    copyBtn.classList.add("copied");

                    setTimeout(() => {
                        copyBtn.textContent = "Copy";
                        copyBtn.classList.remove("copied");
                    }, 1500);
                });
            };

            bubble.appendChild(copyBtn);
        }

        messages.appendChild(bubble);
        messages.scrollTop = messages.scrollHeight;
    }

    /* ---------- FULLSCREEN ---------- */
    window.toggleFullscreen = function () {
        windowBox.classList.toggle("fullscreen");
    };

    /* ---------- DRAG ---------- */
    let isDragging = false;
    let offsetX, offsetY;

    document.getElementById("udiva-top").addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - windowBox.offsetLeft;
        offsetY = e.clientY - windowBox.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        windowBox.style.left = `${e.clientX - offsetX}px`;
        windowBox.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

});
