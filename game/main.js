const players = [document.getElementById("bottom"), document.getElementById("left"), document.getElementById("top"), document.getElementById("right")];
const screen = document.getElementById("screen");
var questions = []
fetch("questions.json")
.then(response => response.json())
.then(data => {
    questions = data;
    shuffleQuestions();
});

var currentQuestion = 0;
var currentPlayer = null;
var playersAnswered = [];

function setPlayerButton(string) {
    players.forEach(player => {
                player.lastElementChild.innerHTML = string;
            });
}

function shuffleQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = questions[i];
        questions[i] = questions[j];
        questions[j] = temp;
      }
}

function nextTurn() {
    players.forEach(player => {
        player.removeEventListener("click", checkAnswer);
        player.removeEventListener("click", steal);
    });

    if (questions[currentQuestion] == undefined) {
        shuffleQuestions();
        currentQuestion = 0;
    }

    screen.innerHTML = "<p></p>";
    if (currentPlayer == null) currentPlayer = currentQuestion % 4;
    playersAnswered.push(currentPlayer);
    players.forEach(player => {
        player.firstElementChild.setAttribute("fill", "blue");
    });

    players[currentPlayer].firstElementChild.setAttribute("fill", "lightgreen");
    katex.render(questions[currentQuestion].question, screen.firstElementChild);

    // Timer

    // Resets all countdowns
    for (let i = 0; i < 255; i++) clearInterval(i);
    
    let time = 20;
    setPlayerButton(time);
    const countdown = setInterval(() => {
        time--;
        setPlayerButton(time);
        if (time == 0) {
            clearInterval(countdown);

            // Input screen
            screen.innerHTML = "<textarea placeholder=\"Input answer\"></textarea>";
            setPlayerButton("");
            players[currentPlayer].lastElementChild.innerHTML = "Submit";
            players[currentPlayer].addEventListener("click", checkAnswer);
        };
    }, 1000);
}

const incorrectScreen = "<p>Incorrect!</p>";

function checkAnswer() {
    if (screen.firstElementChild.value == questions[currentQuestion].answer || playersAnswered.length == 4) {
        if (playersAnswered.length == 4) {
            screen.innerHTML = incorrectScreen;
        } else {
            screen.innerHTML = `<p>Correct!<br>Difficulty: ${questions[currentQuestion].difficulty}</p>`;
        }

        currentQuestion++;
        currentPlayer = null;
        playersAnswered = [];
        screen.innerHTML += "<button onclick=\"nextTurn()\">Next Question</button>";
    } else {
        screen.innerHTML = incorrectScreen;
        
        for (let i = 0; i < players.length; i++) {
            let playerAnswered;

            playersAnswered.forEach(playerIndex => {
                if (i == playerIndex) {
                    playerAnswered = true;
                }
            });

            if (!playerAnswered) {
                const player = players[i];
                player.addEventListener("click", steal);
                player.setAttribute("fill", "lightgreen");
                player.lastElementChild.innerHTML = "Steal!";
            }
        }

        players[currentPlayer].lastElementChild.innerHTML = "";
    }
}

function steal(event) {
    for (let i = 0; i < players.length; i++) {
        for (const playerChild of players[i].children) {
            if (event.srcElement == playerChild) {
                    currentPlayer = i;
            }
        }
    }

    nextTurn();
}