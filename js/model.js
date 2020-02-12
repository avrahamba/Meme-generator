'use strict'

let gKeyword = {};
let gImgs = createImges();
let gMeme = {
    selectedImgId: 1,
    seletedLineInx: 0,
    lines: []
}

function createImges() {
    return [{ id: 1, url: '1.jpg', keywords: ['Trump'] }]
}

function getMeme() { return gMeme }

function getImgUrl(id) {
    let img = gImgs.find(img => id === img.id)
    return img.url;
}

function changeTextLine(text) {
    gMeme.lines[gMeme.seletedLineInx].text = text;
}

function addLineService(x, y) {
    gMeme.seletedLineInx = gMeme.lines.length;
    gMeme.lines.push({
        text: '',
        size: 50,
        colorStroke: '#000000',
        colorfill: '#ffffff',
        x, y, width: 0, height: 0
    })
}

function getLine(x, y) {
    let lineInx = gMeme.lines.findIndex(line =>
        x < line.x + line.width / 2 &&
        x > line.x - line.width / 2 &&
        y < line.y + line.height * (2 / 5) &&
        y > line.y - line.height)
    gMeme.seletedLineInx = lineInx;
    return gMeme.lines[lineInx];

}