const players = [document.getElementById("bottom"), document.getElementById("left"), document.getElementById("top"), document.getElementById("right")];
const screen = document.getElementById("screen");
var questions = []
fetch("questions.json")
.then(response => response.json())
.then(data => questions = data);

const questionScreen = "<p></p>";
const inputScreen = "<textarea placeholder=\"Input answer\"></textarea>";
const correctScreen = "<p>Correct!</p>"
const incorrectScreen = "<p>Incorrect!</p>"
const nextQuestionButton = "<button onclick=\"nextTurn()\">Next Question</button>"
var currentQuestion = 0;
var currentPlayer = null;
var playersAnswered = [];

function setPlayerButton(string) {
    players.forEach(player => {
                player.lastElementChild.innerHTML = string;
            });
}

function shuffleQuestions() {
    let currentIndex = questions.length,  randomIndex;
  
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [questions[currentIndex], questions[randomIndex]] = [questions[randomIndex], questions[currentIndex]];
    }
}

// Initial shuffle
shuffleQuestions();

function nextTurn() {
    players.forEach(player => {
        player.removeEventListener("click", checkAnswer);
        player.removeEventListener("click", steal);
    });

    if (questions[currentQuestion] == undefined) {
        shuffleQuestions();
        currentQuestion = 0;
    }

    screen.innerHTML = questionScreen;
    if (currentPlayer == null) currentPlayer = currentQuestion % 4;
    playersAnswered.push(currentPlayer);
    players.forEach(player => {
        player.firstElementChild.setAttribute("fill", "blue");
    });

    players[currentPlayer].firstElementChild.setAttribute("fill", "lightgreen");
    screen.firstElementChild.innerHTML = questions[currentQuestion].question;
    MathJax.typeset();

    // Timer

    // Resets all countdowns
    for (let i = 0; i < 255; i++) clearInterval(i);
    
    let time = 20;
    const countdown = setInterval(() => {
        setPlayerButton(time);
        time--;
        if (time < 0) {
            clearInterval(countdown);

            // Input screen
            screen.innerHTML = inputScreen;
            setPlayerButton("");
            players[currentPlayer].lastElementChild.innerHTML = "Submit";
            players[currentPlayer].addEventListener("click", checkAnswer);
        };
    }, 100);
}

function checkAnswer() {
    if (screen.firstElementChild.value == questions[currentQuestion].answer || playersAnswered.length == 4) {
        if (playersAnswered.length == 4) {
            screen.innerHTML = incorrectScreen;
        } else {
            screen.innerHTML = correctScreen;
        }
        
        currentQuestion++;
        currentPlayer = null;
        playersAnswered = [];
        screen.innerHTML += nextQuestionButton;
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