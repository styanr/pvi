const width = document.body.innerWidth;
const height = document.body.innerHeight;


const bubbles = document.getElementById("bubbles");
function spawnBubbles() {
    setInterval(function () {
        const pos = Math.floor(Math.random() * window.innerWidth);
        const newBubble = document.createElement("img");
        newBubble.src = "images/bubble.png";
        newBubble.style.left = pos + "px";
        bubbles.appendChild(newBubble);
        setTimeout(function () {
            newBubble.remove();
        }, 2000)
    }, 100)
}

window.onload = spawnBubbles;