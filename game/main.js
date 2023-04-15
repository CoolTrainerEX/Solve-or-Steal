var players = [document.getElementById("bottom"), document.getElementById("left"), document.getElementById("top"), document.getElementById("right")];
var question = document.getElementById("screen").children[0]
function nextQuestion() {
    katex.render("\\frac {2x^2 - 8x + 8} {2x - 4} \\text { continuous at } [0, 1)", question);
}