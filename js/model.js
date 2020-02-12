'use strict'

let gKeyword = {};
let gImgs = createImges();
let gMeme = {
    selectedImgId: 1,
    seletedLineInx: 1,
    linse: [
        {
            text: 'I learn JS',
            size: 50,
            align: 'left',
            colorStroke: '#000000',
            colorfill:'#ffffff'
        }
    ]
}

function createImges() {
    return [{ id: 1, url: '1.jpg', keywords: ['Trump'] }]
}

function getMeme() { return gMeme }

function getImgUrl(id) {
    let img =gImgs.find(img => id === img.id)
    return img.url;
}