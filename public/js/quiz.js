let currentQ = 0;
let userScore = [0, 0, 0, 0]; // index corresponds to cat type

// DOM elements
const startBtn = document.getElementById('start-quiz-btn');
const quizBox = document.getElementById('quiz-box');
const resultBox = document.getElementById('result-box');
const qText = document.getElementById('question-text');
const btns = document.querySelectorAll('.quiz-option');

function startQuiz() {
    startBtn.classList.add('hidden');
    quizBox.classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    qText.innerText = window.quizData.questions[currentQ].q;
    btns.forEach((btn, index) => {
        btn.innerText = window.quizData.questions[currentQ].options[index];
    });
}

function answer(choiceIndex) {
    const scoreType = window.quizData.questions[currentQ].scores[choiceIndex];
    userScore[scoreType]++; 

    currentQ++;

    if (currentQ < window.quizData.questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    quizBox.classList.add('hidden');
    resultBox.classList.remove('hidden');
    // find the highest score
    let maxScore = -1;
    let winnerIndex = 0;
    
    for(let i=0; i<userScore.length; i++) {
        if(userScore[i] > maxScore) {
            maxScore = userScore[i];
            winnerIndex = i;
        }
    }
    // fallback for 0 scores
    if (maxScore === 0) winnerIndex = Math.floor(Math.random() * 4);

    const result = window.quizData.results[winnerIndex];

    document.getElementById('result-title').innerText = result.name;
    document.getElementById('result-desc').innerText = result.desc;
    document.getElementById('result-img').src = result.img;
}