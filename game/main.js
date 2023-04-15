var players = [document.getElementById("bottom"), document.getElementById("left"), document.getElementById("top"), document.getElementById("right")];
var screen = document.getElementById("screen");
var questionDisplay = screen.firstElementChild;
var questions = []
fetch("questions.json")
.then(response => response.json())
.then(data => questions = data);

const oldScreen = "<p></p><button onclick=\"nextTurn()\">Next Question</button>";
const inputScreen = "<textarea></textarea>";
var currentQuestion = 0;
var currentPlayer = screen;

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

// Initial shuffle
shuffle(questions);

function nextTurn() {
    if (questions[currentQuestion]) {
        shuffle(questions);
        currentQuestion = 0;
    }

    currentPlayer = players[currentQuestion % 4];
    currentPlayer.firstElementChild.setAttribute("fill", "lightgreen");
    questionDisplay.innerHTML = questions[currentQuestion].question;
    MathJax.typeset();

    // Timer

    // Resets all countdowns
    for (let i = 0; i < 255; i++) clearInterval(i);
    
    let time = 20;
    var countdown = setInterval(() => {
        players.forEach(player => {
            player.lastElementChild.innerHTML = time;
        });
        time--;
        if (time == 0) {
            clearInterval(countdown);

            // Input screen
            screen.innerHTML = inputScreen;
            players.forEach(player => {
                player.lastElementChild.innerHTML = "";
            });
            currentPlayer.firstElementChild.innerHTML = Submit;
            currentPlayer.firstElementChild.addEventListener("click", () => {
                // Check answer
                if (screen.firstElementChild.textContent == currentQuestion.answer) nextTurn();
                else toStealScreen();
            });
        };
    }, 1000);
}