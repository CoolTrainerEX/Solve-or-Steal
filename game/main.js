function next() {
    newQuestion();
    resetTimer();
}

function steal(element) {
    resetTimer();
}

function answer(ans) {
    (ans == correct) ? correct : wrong;
}

function newQuestion() {
    removeUsedQuestion();
    getRandomQuestion();
}