'use strict'

let gKeyword = {};
let gImgs = createImges();
let gMeme = {
    selectedImgId: 1,
    seletedLineInx: 0,
    seletedPropInx: -1,
    lines: [],
    props: []
}

function setImg(id) {
    gMeme.selectedImgId = id;
    gMeme.seletedLineInx = 0;
    gMeme.seletedPropInx = -1;
    gMeme.lines = [];
    gMeme.props = [];

}

function createImges() {
    let inx = 1;
    return [
        { id: inx, url: `${inx++}.jpg`, keywords: ['Trump', 'טרמפ'] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: ['dogs', 'כלבים'] },
        { id: inx, url: `${inx++}.jpg`, keywords: ['baby', 'תינוק'] },
        { id: inx, url: `${inx++}.jpg`, keywords: ['baby', 'dog', 'תינוק', 'כלב'] },
        { id: inx, url: `${inx++}.jpg`, keywords: ['cat', 'חתול'] },
        { id: inx, url: `${inx++}.jpg`, keywords: ['man', 'איש'] },
        { id: inx, url: `${inx++}.jpg`, keywords: ['baby', 'תינוק'] },
        { id: inx, url: `${inx++}.jpg`, keywords: ['man', 'איש'] },
        { id: inx, url: `${inx++}.jpg`, keywords: ['man', 'איש'] },
        { id: inx, url: `${inx++}.jpg`, keywords: ['man', 'איש'] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: ['trump', 'טרמפ'] },
        { id: inx, url: `${inx++}.jpg`, keywords: ['baby', 'תינוק'] },
        { id: inx, url: `${inx++}.jpg`, keywords: ['dog', 'כלב'] },
        { id: inx, url: `${inx++}.jpg`, keywords: ['obama', 'אובמה'] },
        { id: inx, url: `${inx++}.jpg`, keywords: ['sport', 'ספורט'] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: ['morpheus', 'מורפיוס', 'מטריקס'] },
        { id: inx, url: `${inx++}.jpg`, keywords: [] },
        { id: inx, url: `${inx++}.jpg`, keywords: ['win', 'ניצחון'] },
        { id: inx, url: `${inx++}.jpg`, keywords: ['suprise', 'הפתעה'] },
        { id: inx, url: `${inx++}.jpg`, keywords: ['potin', 'פוטין'] },
        { id: inx, url: `${inx++}.jpg`, keywords: ['everywhere', 'בכל מקום'] }
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
        type: 'line',
        text: '',
        size: 50,
        colorStroke: '#000000',
        colorfill: '#ffffff',
        x, y, width: 0, height: 0,
        font: 'Impact'
    })
}

function getLine(x, y) {
    let lineInx = gMeme.lines.findIndex(line =>
        x < line.x + line.width / 2 &&
        x > line.x - line.width / 2 &&
        y < line.y + line.height * (2 / 5) &&
        y > line.y - line.height);
    gMeme.seletedLineInx = lineInx;
    if (lineInx === -1) {
        let propInx = gMeme.props.findIndex(prop =>
            x < prop.x + prop.width() / 2 &&
            x > prop.x - prop.width() / 2 &&
            y < prop.y + prop.height() / 2 &&
            y > prop.y - prop.height() / 2
        );
        gMeme.seletedPropInx = propInx;
        if (propInx != -1) return gMeme.props[propInx];
    }
    gMeme.seletedPropInx = -1;

    return gMeme.lines[lineInx];
}

function removeLine() {
    gMeme.lines.splice(gMeme.seletedLineInx, 1);
}
function getLineWidth() {
    return gMeme.lines[gMeme.seletedLineInx].width;
}
function moveLineTo(x, y) {
    if (y === -1) {
        gMeme.lines[gMeme.seletedLineInx].x = x;
    } else {
        if (gMeme.seletedLineInx !== -1) {
            gMeme.lines[gMeme.seletedLineInx].x = x;
            gMeme.lines[gMeme.seletedLineInx].y = y;
        } else if (gMeme.seletedPropInx !== -1) {
            gMeme.props[gMeme.seletedPropInx].x = x;
            gMeme.props[gMeme.seletedPropInx].y = y;
        }
    }

}

function moveLine(diff, startMove) {
    if (startMove) {
        gMeme.lines[gMeme.seletedLineInx].x = startMove.x - diff.x;
        gMeme.lines[gMeme.seletedLineInx].y = startMove.y - diff.y;

    } else {
        gMeme.lines[gMeme.seletedLineInx].x += diff.x;
        gMeme.lines[gMeme.seletedLineInx].y += diff.y;
    }
}
function changeSize(diff) {
    if (gMeme.seletedLineInx != -1) {
        gMeme.lines[gMeme.seletedLineInx].size += diff
    }
    if (gMeme.seletedPropInx !== -1) {
        gMeme.props[gMeme.seletedPropInx].setSize(diff)
    }
}

function changeColor(value, fill) {
    if (fill) gMeme.lines[gMeme.seletedLineInx].colorfill = value;
    else gMeme.lines[gMeme.seletedLineInx].colorStroke = value;
}
function changeFont(font) {
    gMeme.lines[gMeme.seletedLineInx].font = font;
}
function replaceLineSelected() {
    if (gMeme.seletedLineInx + 1 === gMeme.lines.length) gMeme.seletedLineInx = 0;
    else gMeme.seletedLineInx++;
}

function addProp(x, y, propId) {
    let fakeImg = document.createElement('img');
    fakeImg.src = `images/props/${propId}.png`;
    let propRatio = fakeImg.width / fakeImg.height;
    let size = 150;
    gMeme.props.push({
        type: 'prop',
        propId,
        fakeImg,
        setSize: (diff) => { size += diff; },
        x,
        y,
        height: () => size / propRatio,
        width: () => size,
    })
}

function saveMeme() {
    let savedMemes = loadFromStorage('savedMemes');
    if (!savedMemes) savedMemes = [];
    let copyMeme = JSON.parse(JSON.stringify(gMeme));
    copyMeme.props.forEach((prop, inx) => {
        prop.fakeImg = null;
        prop.size = gMeme.props[inx].width()
        prop.propRatio = gMeme.props[inx].width() / gMeme.props[inx].height()
    });
    savedMemes.push(copyMeme);
    saveToStorage('savedMemes', savedMemes);
}

function getSavedMeme() {
    return loadFromStorage('savedMemes');
}