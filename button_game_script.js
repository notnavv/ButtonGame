let clickCount = 0;
let resultBoxVisible = false;
let retryButtonClicked = false;
let shouldResetCounter = false;
let buttonVisible = true;
let lastMousePosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

document.addEventListener('mousemove', function(e) {
    lastMousePosition = { x: e.clientX, y: e.clientY };
});

function updateClickCounter() {
    const counterElement = document.getElementById('counter');
    counterElement.textContent = clickCount;
}

function showResultBox() {
    const resultBox = document.getElementById('result-box');
    resultBox.innerHTML = '';
    // Main congrats message
    const congrats = document.createElement('div');
    congrats.textContent = 'Congrats, you caught the button!';
    congrats.style.fontSize = '48px';
    congrats.style.fontWeight = 'bold';
    congrats.style.marginBottom = '10px';
    congrats.style.textAlign = 'center';
    congrats.style.color = '#e0cfff';
    // Missed count message
    const missed = document.createElement('div');
    missed.textContent = `You missed the button ${clickCount} times.`;
    missed.style.fontSize = '28px';
    missed.style.opacity = '0.7';
    // Container for both
    const resultContainer = document.createElement('div');
    resultContainer.style.display = 'flex';
    resultContainer.style.flexDirection = 'column';
    resultContainer.style.alignItems = 'center';
    resultContainer.appendChild(congrats);
    resultContainer.appendChild(missed);
    // Retry button
    const retryButton = document.createElement('button');
    retryButton.id = 'retry-button';
    retryButton.textContent = 'Retry';
    retryButton.onclick = retryGame;
    retryButton.style.marginTop = '20px';
    resultContainer.appendChild(retryButton);
    resultBox.appendChild(resultContainer);
    resultBox.style.display = 'block';
    resultBox.style.bottom = '50%';
    resultBox.style.transform = 'translate(-50%, 50%)';
    resultBoxVisible = true;
    startConfetti();
}

function retryGame() {
    retryButtonClicked = true;
    clickCount = 0;
    updateClickCounter();
    const resultBox = document.getElementById('result-box');
    resultBox.style.bottom = '-100%';
    setTimeout(() => {
        resultBox.style.display = 'none';
        resultBox.innerHTML = '';
    }, 500);
    resetMovingButton();
    resultBoxVisible = false;
    retryButtonClicked = false;
    const button = document.getElementById('button');
    button.style.display = 'block';
    buttonVisible = true;
    shouldResetCounter = false;
}

function resetMovingButton() {
    const button = document.getElementById('button');
    const buttonWidth = button.clientWidth;
    const buttonHeight = button.clientHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    let randomX, randomY, distance;
    do {
        randomX = Math.floor(Math.random() * (windowWidth - buttonWidth));
        randomY = Math.floor(Math.random() * (windowHeight - buttonHeight));
        const buttonCenterX = randomX + buttonWidth / 2;
        const buttonCenterY = randomY + buttonHeight / 2;
        distance = Math.sqrt(Math.pow(lastMousePosition.x - buttonCenterX, 2) + Math.pow(lastMousePosition.y - buttonCenterY, 2));
    } while (distance < 150);
    button.style.left = randomX + 'px';
    button.style.top = randomY + 'px';
    button.style.display = 'block';
    buttonVisible = true;
    button.style.lineHeight = button.clientHeight + 'px';
    button.style.textAlign = 'center';
}

function hideButton() {
    const button = document.getElementById('button');
    button.style.display = 'none';
    buttonVisible = false;
}

function getRandomPosition() {
    const button = document.getElementById('button');
    const windowWidth = window.innerWidth - button.clientWidth;
    const windowHeight = window.innerHeight - button.clientHeight;
    const randomX = Math.floor(Math.random() * windowWidth);
    const randomY = Math.floor(Math.random() * windowHeight);
    return { x: randomX, y: randomY };
}

function updateButtonPosition(event) {
    const button = document.getElementById('button');
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const buttonRect = button.getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    const distance = Math.sqrt(Math.pow(mouseX - buttonCenterX, 2) + Math.pow(mouseY - buttonCenterY, 2));
    const maxDistance = 80;
    if (distance <= maxDistance && Math.random() > 0.05) {
        const newPosition = getRandomPosition();
        button.style.left = newPosition.x + 'px';
        button.style.top = newPosition.y + 'px';
    }
}

document.addEventListener('mousemove', updateButtonPosition);

document.addEventListener('click', function (event) {
    const button = document.getElementById('button');
    const retryButton = document.getElementById('retry-button');
    if (!resultBoxVisible && event.target !== button && event.target !== retryButton) {
        clickCount++;
        updateClickCounter();
    }
});

function popButton() {
    updateClickCounter();
    const button = document.getElementById('button');
    button.style.transform = 'scale(0)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 1000);
    showResultBox();
    button.style.display = 'none';
    buttonVisible = false;
}

// Confetti ribbons
function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    const confettiCount = 120;
    const confetti = [];
    const colors = [
        ['#b86bff', '#ac4688'],
        ['#ac4688', '#b86bff']
    ];
    for (let i = 0; i < confettiCount; i++) {
        const colorPair = colors[Math.floor(Math.random()*2)];
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            w: 14 + Math.random() * 14, // slightly bigger ribbons
            h: 3.5 + Math.random() * 4, // slightly bigger width
            d: 2 + Math.random() * 2,
            angle: Math.random() * 2 * Math.PI,
            angleSpeed: (Math.random() - 0.5) * 0.1,
            wiggle: Math.random() * 2 * Math.PI,
            wiggleSpeed: 0.07 + Math.random() * 0.06,
            wiggleCount: 2 + Math.random() * 3,
            amplitude: 0.5 + Math.random() * 1.2,
            color1: colorPair[0],
            color2: colorPair[1]
        });
    }
    function drawRibbon(ctx, x, y, w, h, angle, color1, color2, wiggle, wiggleCount, amplitude) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, color1);
        grad.addColorStop(1, color2);
        ctx.strokeStyle = grad;
        ctx.lineWidth = h;
        ctx.beginPath();
        for (let i = 0; i <= 10; i++) {
            const t = i / 10;
            const wx = t * w;
            const wy = Math.sin(wiggle + t * wiggleCount * Math.PI) * h * amplitude;
            if (i === 0) ctx.moveTo(wx, wy);
            else ctx.lineTo(wx, wy);
        }
        ctx.globalAlpha = 0.85;
        ctx.stroke();
        ctx.restore();
    }
    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let allAtBottom = true;
        for (let i = 0; i < confetti.length; i++) {
            let c = confetti[i];
            drawRibbon(ctx, c.x, c.y, c.w, c.h, c.angle, c.color1, c.color2, c.wiggle, c.wiggleCount, c.amplitude);
            if (c.y < canvas.height + 10) {
                allAtBottom = false;
                c.y += c.d;
                c.angle += c.angleSpeed;
                c.wiggle += c.wiggleSpeed;
            }
        }
        if (!allAtBottom) {
            requestAnimationFrame(drawConfetti);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = 'none';
        }
    }
    drawConfetti();
}

document.getElementById('button').addEventListener('click', popButton);
