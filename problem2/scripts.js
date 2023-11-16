document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("startButton");
    startButton.addEventListener("click", createCountdown);
});

// countdown subscription. storing here so we can unsubscribe and re-subscribe to new countdowns depending on user input
let countdown$;

function createCountdown() {
    const countdownHours = document.getElementById("hours");
    const countdownMinutes = document.getElementById("minutes");
    const countdownSeconds = document.getElementById("seconds");
    const timer = document.getElementById("timer");

    const hours = parseInt(countdownHours.value) || 0;
    const minutes = parseInt(countdownMinutes.value) || 0;
    const seconds = parseInt(countdownSeconds.value) || 0;

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (totalSeconds <= 0) {
        alert("Please enter a valid time.");
        return;
    }

    // Unsubscribe from the previous countdown if it exists
    if (countdown$) {
        countdown$.unsubscribe();
    }

    // start a new countdown subscription
    countdown$ = rxjs
        .interval(1000)
        .pipe(
            rxjs.operators.take(totalSeconds + 1),
            rxjs.operators.map((value) => totalSeconds - value)
        )
        .subscribe(
            (value) => {
                const displayHours = Math.floor(value / 3600);
                const displayMinutes = Math.floor((value % 3600) / 60);
                const displaySeconds = value % 60;

                // Construct the timer display based on user input
                let timerText = "";
                if (hours > 0) {
                    timerText += `${displayHours
                        .toString()
                        .padStart(2, "0")}:`;
                }
                if (minutes > 0 || hours > 0) {
                    timerText += `${displayMinutes
                        .toString()
                        .padStart(2, "0")}:`;
                }
                timerText += `${displaySeconds
                    .toString()
                    .padStart(2, "0")}`;

                timer.innerHTML = timerText;
            },
            null,
            () => {
                timer.innerHTML = "00";
                alert("Countdown Complete!");
            }
        );
}
