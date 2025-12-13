const gridElement = document.getElementById('grid');
const faceBtn = document.getElementById('face-btn');
const bombCountElement = document.getElementById('bomb-count');

// modal elements
const modal = document.getElementById('game-modal');
const modalTitle = document.getElementById('modal-title');
const modalText = document.getElementById('modal-text');

// settings
const width = 9;
const height = 9;
const bombAmount = 10;

let squares = [];
let isGameOver = false;
let flags = 0;

// assets path
const assets = {
    closed: '/images/minesweeper/cell_closed.png',
    bomb: '/images/minesweeper/bomb.png',
    bombRed: '/images/minesweeper/bomb_red.png', 
    flag: '/images/minesweeper/flag.png',
    faceHappy: '/images/minesweeper/face_happy.png',
    faceWin: '/images/minesweeper/face_win.png',
    faceDead: '/images/minesweeper/face_dead.png',
    nums: [
        null, // 0 index unused
        '/images/minesweeper/num_1.png',
        '/images/minesweeper/num_2.png',
        '/images/minesweeper/num_3.png',
        '/images/minesweeper/num_4.png',
        '/images/minesweeper/num_4.png', // fallback for 5>
        '/images/minesweeper/num_4.png',
        '/images/minesweeper/num_4.png',
        '/images/minesweeper/num_4.png'
    ]
};

// INITIALIZE GAME
function initGame() {
    modal.classList.remove('active');
    gridElement.innerHTML = '';
    squares = [];
    isGameOver = false;
    flags = 0;
    bombCountElement.innerText = '0' + bombAmount;
    faceBtn.src = assets.faceHappy;

    // randomize bombs
    const bombsArray = Array(bombAmount).fill('bomb');
    const emptyArray = Array(width * height - bombAmount).fill('valid');
    const gameArray = emptyArray.concat(bombsArray).sort(() => Math.random() - 0.5);

    // create board
    for (let i = 0; i < width * height; i++) {
        const square = document.createElement('div');
        square.setAttribute('id', i);
        square.classList.add('cell');
        
        const img = document.createElement('img');
        img.src = assets.closed;
        img.style.opacity = '1';
        square.appendChild(img);

        square.dataset.type = gameArray[i];
        gridElement.appendChild(square);
        squares.push(square);

        // click handlers
        square.addEventListener('click', function(e) { click(square); });
        square.oncontextmenu = function(e) {
            e.preventDefault();
            addFlag(square);
        }
    }

    // calculate numbers for bombs nearby
    for (let i = 0; i < squares.length; i++) {
        let total = 0;
        const isLeftEdge = (i % width === 0);
        const isRightEdge = (i % width === width - 1);

        if (squares[i].dataset.type === 'valid') {
            if (i > 0 && !isLeftEdge && squares[i - 1].dataset.type === 'bomb') total++;
            if (i > 9 && !isRightEdge && squares[i + 1 - width].dataset.type === 'bomb') total++;
            if (i > 10 && squares[i - width].dataset.type === 'bomb') total++;
            if (i > 11 && !isLeftEdge && squares[i - 1 - width].dataset.type === 'bomb') total++;
            if (i < 80 && !isRightEdge && squares[i + 1].dataset.type === 'bomb') total++;
            if (i < 70 && !isLeftEdge && squares[i - 1 + width].dataset.type === 'bomb') total++;
            if (i < 72 && !isRightEdge && squares[i + 1 + width].dataset.type === 'bomb') total++;
            if (i < 71 && squares[i + width].dataset.type === 'bomb') total++;
            squares[i].setAttribute('data', total);
        }
    }
}

// ADD FLAG
function addFlag(square) {
    if (isGameOver) return;
    const img = square.querySelector('img');

    if (!square.classList.contains('checked') && (flags < bombAmount)) {
        if (!square.classList.contains('flag')) {
            square.classList.add('flag');
            img.src = assets.flag;
            flags++;
            bombCountElement.innerText = '0' + (bombAmount - flags);
            checkForWin();
        } else {
            square.classList.remove('flag');
            img.src = assets.closed;
            flags--;
            bombCountElement.innerText = '0' + (bombAmount - flags);
        }
    }
}

// HANDLE CLICK 
function click(square) {
    let currentId = square.id;
    if (isGameOver) return;
    if (square.classList.contains('checked') || square.classList.contains('flag')) return;

    if (square.dataset.type === 'bomb') {
        gameOver(square);
        return;
    } 
    
    let total = square.getAttribute('data');
    if (total != 0) {
        square.classList.add('checked');
        if (assets.nums[total]) {
            square.querySelector('img').src = assets.nums[total];
        } else {
            square.querySelector('img').style.opacity = '0';
        }
        return;
    }
    
    // if empty (0) -> check neighbors
    checkSquare(square, currentId);
    
    square.classList.add('checked');
    square.querySelector('img').style.opacity = '0';
    square.style.cursor = 'default';
}

// RECURSIVE CHECK 
function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0);
    const isRightEdge = (currentId % width === width - 1);

    setTimeout(() => {
        if (currentId > 0 && !isLeftEdge) click(document.getElementById(squares[parseInt(currentId) - 1].id));
        if (currentId > 9 && !isRightEdge) click(document.getElementById(squares[parseInt(currentId) + 1 - width].id));
        if (currentId > 10) click(document.getElementById(squares[parseInt(currentId - width)].id));
        if (currentId > 11 && !isLeftEdge) click(document.getElementById(squares[parseInt(currentId) - 1 - width].id));
        if (currentId < 80 && !isRightEdge) click(document.getElementById(squares[parseInt(currentId) + 1].id));
        if (currentId < 70 && !isLeftEdge) click(document.getElementById(squares[parseInt(currentId) - 1 + width].id));
        if (currentId < 72 && !isRightEdge) click(document.getElementById(squares[parseInt(currentId) + 1 + width].id));
        if (currentId < 71) click(document.getElementById(squares[parseInt(currentId) + width].id));
    }, 10);
}

// GAME OVER 
function gameOver(square) {
    isGameOver = true;
    faceBtn.src = assets.faceDead;
    
    squares.forEach(sq => {
        if (sq.dataset.type === 'bomb') {
            const bombImg = sq.querySelector('img');
            bombImg.src = assets.bomb;
            bombImg.style.opacity = '1';
        }
    });

    const explodedImg = square.querySelector('img');
    explodedImg.src = assets.bombRed; 
    explodedImg.style.opacity = '1';

    setTimeout(() => {
        modalTitle.innerText = "Game Over";
        modalTitle.style.color = "red";
        modalText.innerText = "Oh no! You hit a bomb.";
        modal.classList.add('active');
    }, 2000);
}

// CHECK WIN 
function checkForWin() {
    let matches = 0;
    for (let i = 0; i < squares.length; i++) {
        if (squares[i].classList.contains('flag') && squares[i].dataset.type === 'bomb') {
            matches++;
        }
    }
    if (matches === bombAmount) {
        isGameOver = true;
        faceBtn.src = assets.faceWin;
        
        setTimeout(() => {
            modalTitle.innerText = "You Won!";
            modalTitle.style.color = "#ff4081";
            modalText.innerText = "All safe spots found! The cats are safe.";
            modal.classList.add('active');
        }, 2000);
    }
}

initGame();