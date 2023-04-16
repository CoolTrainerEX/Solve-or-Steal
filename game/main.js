var players = [document.getElementById("bottom"), document.getElementById("left"), document.getElementById("top"), document.getElementById("right")];
var screen = document.getElementById("screen");
var questions = []
fetch("questions.json")
.then(response => response.json())
.then(data => questions = data);

const questionScreen = "<p></p>";
const inputScreen = "<textarea placeholder=\"Input answer\"></textarea>";
var currentQuestion = 0;
var currentPlayer = null;

function setPlayerButton(string) {
    players.forEach(player => {
                player.lastElementChild.innerHTML = string;
            });
}

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
    if (questions[currentQuestion] == undefined) {
        shuffle(questions);
        currentQuestion = 0;
    }

    screen.innerHTML = questionScreen;
    if (currentPlayer == null) currentPlayer = currentQuestion % 4;
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
    var countdown = setInterval(() => {
        setPlayerButton(time);
        time--;
        if (time < 0) {
            clearInterval(countdown);

            // Input screen
            screen.innerHTML = inputScreen;
            setPlayerButton("");
            players[currentPlayer].lastElementChild.innerHTML = "Submit";
            players[currentPlayer].addEventListener("click", () => {
                if (screen.firstElementChild.value == questions[currentQuestion].answer) {
                    currentQuestion++;
                    currentPlayer = null;
                    nextTurn();
                } else {
                    players.forEach(player => {
                        player.firstElementChild.setAttribute("fill", "lightgreen");
                        player.addEventListener("click", steal());
                    });
                    setPlayerButton("Steal");
                }
            });
        };
    }, 100);
}