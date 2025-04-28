window.onload = function () {
    let timerDiv = document.getElementById("timer");
    let refImage = document.getElementById("refImage");
    let canvasSection = document.getElementById("canvasSection");
    let resultDiv = document.getElementById("result");
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    let drawing = false;
    let lastX = 0, lastY = 0;
    let drawingTimer;
    let accuracy = 0;          
    let drawStartTime = null;   
    let auto = false;           

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Phase 1: Show image
    refImage.style.display = "block";
    let countdown = 5;
    timerDiv.innerText = `Memorize: ${countdown}`;

    let refTimer = setInterval(() => {
        countdown--;
        timerDiv.innerText = `Memorize: ${countdown}`;
        if (countdown <= 0) {
            clearInterval(refTimer);
            refImage.style.display = "none";
            startDrawingPhase();
        }
    }, 1000);

    function startDrawingPhase() {
        canvasSection.style.display = "block";
        resultDiv.innerHTML = "<em>Start drawing now!</em>";
        canvas.style.pointerEvents = "auto";
        drawStartTime = Date.now(); 

        setTimeout(() => {
            document.getElementById("actionButtons").style.display = "block";
        }, 5000);

        let drawingCountdown = 60;
        timerDiv.innerText = `Draw: ${drawingCountdown}`;

        drawingTimer = setInterval(() => {
            drawingCountdown--;
            timerDiv.innerText = `Draw: ${drawingCountdown}`;
            if (drawingCountdown <= 0) {
                clearInterval(drawingTimer);
                disableDrawing();
                auto = true; // Auto-submit trigger
                resultDiv.innerHTML = "<em>Time's up! Submitting...</em>";
                finalSubmit(); // Call final submit directly
            }
        }, 1000);
    }

    function disableDrawing() {
        canvas.removeEventListener("mousedown", startDraw);
        canvas.removeEventListener("mousemove", draw);
        canvas.removeEventListener("mouseup", stopDraw);
        canvas.style.pointerEvents = "none";
    }

    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDraw);

    function startDraw(e) {
        drawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function draw(e) {
        if (!drawing) return;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function stopDraw() {
        drawing = false;
    }

    window.clearCanvas = function () {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    window.checkAccuracy = function () {
        let dataUrl = canvas.toDataURL("image/png");
        fetch("/compare", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `drawnImage=${encodeURIComponent(dataUrl)}`
        })
        .then(res => res.json())
        .then(data => {
            accuracy = data.match;
            resultDiv.innerHTML = `<h2>Match: ${accuracy}%</h2>`;
        });
    }

    window.finalSubmit = function () {
        if (!auto && accuracy < 95) {
            alert("Accuracy must be at least 95% to submit.");
            return;
        }

        const elapsedSeconds = Math.floor((Date.now() - drawStartTime) / 1000);
        let dataUrl = canvas.toDataURL("image/png");

        fetch("/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                image: dataUrl,
                accuracy: accuracy,
                autoSubmit: auto,
                timeTaken: elapsedSeconds
            })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
        })
        .catch(() => {
            alert("Something went wrong while submitting.");
        });
    }

    window.submitDrawing = window.checkAccuracy;
};
