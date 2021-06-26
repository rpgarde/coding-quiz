// create the questions in objects
let timeEl = document.getElementById('timer')
let startBtn = document.getElementById('start')
let restartBtn = document.getElementById('restart')
let questionEl = document.getElementById('question')
let optionsEl = document.getElementById('options')
let questionIndex = 0
let secondsLeft = ""
let score = ""
let timerInterval
let scoreFormEl = document.getElementById('final-score')
let scoreEl = document.getElementById('score')
let commentEl = document.getElementById('comment')
let scoreButtonEl = document.getElementById('save-score')
let nameInput = document.getElementById('nameinput')
let highScore = []
let highScoreEl = document.getElementById('high-score')
let highScoreH =document.getElementById('high-score-header')
let highScoreListEl =document.getElementById('high-score-list')
let highScoreBtn =document.getElementById('high-score-btn')

// create questions
let quizQuestions = [{
    question: "What function prevents the default action of a browser?",
    options:["preventDefault()","stopPropagation()","return false","disableDefault()"],
    correctAnswer:0,
    comment:"The correct answer is preventDefault()"
}, {
    question: "Inside what HTML do we put javascript?",
    options:["<java>","<javascript>","<script>","<js>"],
    correctAnswer:2,
    comment:"The correct answer is <script>"
}, {
    question: "How do you add a comment in your javascript code?",
    options:["--Like this","/*Like this*/","<!--Like this>","//Like this"],
    correctAnswer:3,
    comment:"The correct answer is //Like this"
}, {
    question: "What is the correct syntax for an array?",
    options:["var arry = (0,1,2)","var arry = 0,1,2","var arry = [0,1,2]","var 0,1,2"],
    correctAnswer:2,
    comment:"The correct answer is var arry = [0,1,2]"
}, {
    question: "How do you clear your Local Storage?",
    options:["localStorage.remove()","localStorage.clear();","local.clear()","clearLocalStorage()"],
    correctAnswer:1,
    comment:"The correct answer is localStorage.clear()"
}
]

// create variables from the questions 
let questionObj = quizQuestions[questionIndex].question
let optionsObj = quizQuestions[questionIndex].options
let correctObj = quizQuestions[questionIndex].correctAnswer
let commentObj = quizQuestions[questionIndex].comment

function startGame(){
    startBtn.remove()
    questionIndex = 0
    questionEl.style.display = "block";
    optionsEl.style.display = "flex";
    scoreFormEl.style.display = "none"
    highScoreEl.style.display = "none"
    highScoreH.innerHTML = "High Scores:"
    buildQuestions()
}

function buildQuestions(){
    // update the values
    questionObj = quizQuestions[questionIndex].question;
    optionsObj = quizQuestions[questionIndex].options
    correctObj = quizQuestions[questionIndex].correctAnswer
    commentObj = quizQuestions[questionIndex].comment
    questionEl.textContent = questionObj;
    
    for(i=0;i<optionsObj.length;i++){
        let optionAdd = document.createElement("button");
        optionAdd.classList.add("option")
        optionAdd.classList.add("btn")
        // checks what is the correct answer and adds a data attribute
        if(correctObj===i){
            optionAdd.setAttribute("data-answer","correct")
        }
        else{
            optionAdd.setAttribute("data-answer","wrong")
        }
        optionAdd.textContent = optionsObj[i]
        optionsEl.appendChild(optionAdd)
    }
}
function showAnswer(x){
    commentEl.className = 'visible'
    commentEl.textContent = x+commentObj;
    // hide answer after 1.5 seconds
    setTimeout(function(){
        document.getElementById('comment').className = 'hidden';
    }, 1500);
}

// pulls high score data from local storage
function pullHighScore(){
    highScore = JSON.parse(localStorage.getItem('highScore'))
    //sorts highScore from highest to lowest
    highScore.sort(function(a,b){
        return b.yourScore - a.yourScore  
      })
}

// Build the high score page with local storage
function buildHighScore(){
    pullHighScore();
    // hide other elements
    startBtn.style.display = "none";
    questionEl.style.display = "none";
    optionsEl.innerHTML = "";
    optionsEl.style.display = "none";
    highScoreEl.style.display = "flex";
    highScoreListEl.innerHTML = "";
// for loop to create all arrays
for (var i = 0; i < highScore.length; i++) {
    var scoreLi = highScore[i];
    var li = document.createElement("li");
    li.textContent = scoreLi.yourName+" got a score of "+scoreLi.yourScore;
    console.log(scoreLi);
    // var button = document.createElement("button");
    // button.textContent = "Complete ✔️";
    highScoreListEl.appendChild(li);
  }
}

// When you click view high scores at the start or at any point in the game
highScoreBtn.addEventListener("click",function (){
    buildHighScore();
    //clears timer
    clearInterval(timerInterval);
    secondsLeft = 60;
    timeEl.textContent = 60;
})

// store the form and display the high scores
scoreButtonEl.addEventListener("click",function (event){
    event.preventDefault()
    let element = event.target;
    let nameInitials = nameInput.value;
    let scoreObj = {
        yourName:nameInitials,
        yourScore:score
    }
    highScore.push(scoreObj)
    nameInput.value = ""
    //storage in local storage 
    localStorage.setItem('highScore', JSON.stringify(highScore))
    console.log(highScore)
    // hide form to then show the highscores
    scoreFormEl.style.display = "none";
    buildHighScore();
});

//Checks if the answer is correct
optionsEl.addEventListener("click",function (event){
    let element = event.target;
    if (element.matches(".option")){
        let check = element.getAttribute("data-answer");
        if(check === "correct"){
            showAnswer("CORRECT! ")
        }
        else {
            secondsLeft-=10
            showAnswer("WRONG! ")
        }
    }

    optionsEl.innerHTML = "";
    questionEl.textContent = "";
    questionIndex++;
    // if statement builds a question as long as there are questions left
    if(questionIndex < quizQuestions.length){
    buildQuestions();
    }
    else {
        if (secondsLeft >=0){
            score = secondsLeft 
        }
        else {
            score = 0
        }
        timeEl.textContent = score;
        clearInterval(timerInterval);
        scoreFormEl.style.display = "block";
        optionsEl.style.display = "none";
        questionEl.style.display = "none";
        scoreEl.textContent = score;
    }
});

function gameOver() {
    highScoreH.innerHTML = "GAME OVER. Here are the high scores:"
    buildHighScore();
}

function timerStart() {
    secondsLeft = 60
    startGame();
  // Sets interval in variable
    timerInterval = setInterval(function() {
    secondsLeft--;
    timeEl.textContent = secondsLeft;

    if(secondsLeft <= 0) {
      secondsLeft = 0
      clearInterval(timerInterval);
      timeEl.textContent = "Game Over";
      gameOver();
    }

  }, 1000);
}

startBtn.addEventListener('click',timerStart)
restartBtn.addEventListener('click',timerStart)

function init(){
    pullHighScore();
    questionEl.style.display = "block";
    highScoreEl.style.display = "none";
}

init();