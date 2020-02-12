'use strict'

let gKeyword = {};
let gImgs = createImges();
let gMeme = {
    selectedImgId: 1,
    seletedLineInx: 0,
    lines: []
}

function setImg(id) {
    gMeme.selectedImgId = id;
}

function createImges() {
    let inx = 1;
    return [
        { id: inx, url: `${inx++}.jpg`, keywords: ['Trump'] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: ['potin'] },
        { id: inx, url: `${inx++}.jpg`, keywords: ['every'] }
    ]
}

function getMeme() { return gMeme; }
function getImages() { return gImgs; }

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

function removeLine() {
    gMeme.lines.splice(gMeme.seletedLineInx, 1);
}

function moveLine(diff) {
    gMeme.lines[gMeme.seletedLineInx].y += diff;
}

function changeSize(diff) {
    gMeme.lines[gMeme.seletedLineInx].size += diff
}

function changeColor(value, fill) {
    if (fill) gMeme.lines[gMeme.seletedLineInx].colorfill = value;
    else gMeme.lines[gMeme.seletedLineInx].colorStroke = value;

}