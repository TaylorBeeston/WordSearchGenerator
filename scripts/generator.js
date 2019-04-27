const ROWS = 20;
const COLS = 20;
const VALID_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOG_ANSWERS = true;

let grid = []; // 2-dimensional array of all letters
let taken = []; // 2-dimensional array of taken spaces

// generates word search and displays it on screen
function genSearch() {
    buildMatrices(); // initialize grid and taken matrices

    genAnswers(); // add answers to the grid and update taken matrix

    displayWordSearch(); // display finished product
}

// initializes grid and taken matrices
function buildMatrices() {
    let tempLine1 = []; // used to generate random letters
    let tempLine2 = []; // used to build up taken matrix

    for (let i = 0; i < ROWS; i++) {

        // build up each line
        for (let j = 0; j < COLS; j++) {
            tempLine1[j] = randomLetter();
            tempLine2[j] = false;
        }

        // push each line onto matrices
        grid[i] = tempLine1.slice(0);
        taken[i] = tempLine2.slice(0);
    }
}

// adds answers to the grid matrix while updating the taken matrix
function genAnswers() {
    let currentWord = []; // current word to add to grid
    let starts = []; // [x, y] coordinates of the starting point for a word
    let dir; // current direction, -1 for diag, 0 for horiz, 1 for vert

    for (let i in words) {
        // generate a new random direction
        dir = (Math.floor(Math.random() * 3) - 1) % 2

        currentWord = words[i].toUpperCase().replace(/\s+/g, "").split(""); // convert word to char array
        console.log(currentWord);

        // randomly reverse words
        if (Math.floor(Math.random() * 2) === 1)
            currentWord = currentWord.reverse();

        // find a valid starting place
        starts = getValidStart(currentWord.length, dir);

        // log starting place
        if (LOG_ANSWERS)
            console.log(words[i] + ": at (" + starts[0] + ", " + starts[1] + ")");

        // place word in grid
        for (let j in currentWord) {
            grid[starts[1]][starts[0]] = currentWord[j];
            taken[starts[1]][starts[0]] = true;
            starts[1] += dir;
            if (dir <= 0) {
                starts[0]++;
            }
        }
    }
}

// displays finished product
function displayWordSearch() {
    let line; // <p> containing one line of the grid
    let word // <p> containing one word

    for (let i in grid) {
        line = document.createElement("p");
        line.innerHTML = grid[i].join(" ");
        document.querySelector("div#grid").appendChild(line);
    }

    for (let i in words) {
        word = document.createElement("p");
        word.innerHTML = words[i];
        document.querySelector("div#words").appendChild(word);
    }
}

// generate a random letter
function randomLetter() {
    return VALID_LETTERS[Math.floor(Math.random() * 25)];
}

// valids start and end points, returning true if valid and false if not
// start is an [x, y] coordinate array of the starting letter
// end is an [x, y] coordinate array of the ending letter
// dir is the direction where -1 is diagonal, 0 is horizontal, and 1 is vertical
function valid(start, end, dir) {
    let i, j; // iterators

    // invalid if out of bounds
    if (end[1] < 0 || end[1] >= ROWS || end[0] < 0 || end[0] >= COLS)
        return false;

    // loop through all elements to make sure that spot isn't taken
    if (dir === 1) {

        // vertical
        for (i = start[1]; i < end[1]; i++) {
            if (taken[i][start[0]]) {
                return false;
            }
        }
    } else if (dir === 0) {

        // horizontal
        for (i = start[0]; i < end[0]; i++) {
            if (taken[start[1]][i]) {
                return false;
            }
        }
    } else {

        // diagonal
        for (i = start[0], j = start[1]; i < end[0]; i++, j--) {
            if (taken[j][i]) {
                return false;
            }
        }
    }

    return true;
}

// randomly generates starting points for a word, making sure they are valid
// len is the length of the word
// dir is the direction where -1 is diagonal, 0 is horizontal, and 1 is vertical
function getValidStart(len, dir) {
    let startX; // starting X coordinate
    let startY; // starting Y coordinate
    let endX; // ending X coordinate
    let endY; // ending Y coordinate

    do {
        // generate starting coordinates
        startX = Math.floor(Math.random() * (COLS - 1));
        startY = Math.floor(Math.random() * (ROWS - 1));

        // generate end coordinates
        endY = startY + (len * dir);
        endX = dir <= 0 ? startX + len : startX;
    } while (!valid([startX, startY], [endX, endY], dir)) // validate start points

    return [startX, startY];
}
