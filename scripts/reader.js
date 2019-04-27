document.querySelector('input#files').addEventListener('change', handleFileSelect, false);
let reader = new FileReader();
let words = [];

function handleFileSelect(evt) {
    let files = evt.target.files;
    let words = [];

    reader.onload = (handleFileRead);

    reader.readAsText(files[Math.floor(Math.random() * (files.length - 1))]);
    document.querySelector('input#files').hidden = true;
}

function handleFileRead() {
    words = reader.result.split("\n").map(function(x) {
        return x.trim()
    })
    let title = words.shift();
    document.querySelector("h1#title").innerHTML = title;
    document.querySelector("title").innerHTML = title;
    words.shift();
    genSearch();
}
