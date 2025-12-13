// quiz data
const questions = [
    {
        q: "It's 3 AM. What are you doing?",
        options: [
            "Sleeping peacefully",
            "Running around like crazy",
            "Eating everything in the kitchen"
        ],
        // 0=sleepy, 1=silly, 2=hungry, 3=grumpy
        scores: [0, 1, 2] 
    },
    {
        q: "A human tries to touch your belly. You...",
        options: [
            "Bite them!",
            "Purr loudly",
            "Demand food instead"
        ],
        scores: [3, 0, 2]
    },
    {
        q: "Pick your favorite toy:",
        options: [
            "A cardboard box",
            "A laser pointer",
            "A dead mouse"
        ],
        scores: [0, 1, 3]
    }
];

// possible results
const results = {
    0: { name: "Sleepy Loaf", desc: "You value comfort above all. Nap time is all the time.", img: "/images/quiz/cat_sleepy.jpg" },
    1: { name: "Silly Cat", desc: "You have too much energy and zero brain cells. We love you.", img: "/images/quiz/cat_silly.jpg" },
    2: { name: "Hungry Beast", desc: "Food is life. You would sell your soul for a treat.", img: "/images/quiz/cat_hungry.jpg" },
    3: { name: "Grumpy Boss", desc: "Don't touch me. I run this house.", img: "/images/quiz/cat_grumpy.jpg" }
};

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
    qText.innerText = questions[currentQ].q;
    btns.forEach((btn, index) => {
        btn.innerText = questions[currentQ].options[index];
    });
}

function answer(choiceIndex) {
    const scoreType = questions[currentQ].scores[choiceIndex];
    userScore[scoreType]++; // increment score for specific type

    currentQ++;

    if (currentQ < questions.length) {
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

    const result = results[winnerIndex];

    document.getElementById('result-title').innerText = result.name;
    document.getElementById('result-desc').innerText = result.desc;
    document.getElementById('result-img').src = result.img;
}