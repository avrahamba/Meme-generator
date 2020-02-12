'use strict'

function initGrid() { }

function initMemeGenerator() {
    let meme = getMeme();
    render(meme);
}

function render(meme) {
    let canvas = document.querySelector('#meme-canvas');
    let ctx = canvas.getContext('2d');
    let img = new Image()
    img.src = `../images/full/${getImgUrl(meme.selectedImgId)}`;
    let ratio = img.height / img.width;
    resizeCanvas(ratio);

    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }

}

function resizeCanvas(ratio) {
    let canvas = document.querySelector('#meme-canvas');
    let elContainer = document.querySelector('.canvas-container');
    // Note: changing the canvas dimension this way clears the canvas

    console.log(elContainer.offsetWidth)
    elContainer.style.height = elContainer.offsetWidth / ratio+'px'
    canvas.width = elContainer.offsetWidth;
    canvas.height = elContainer.offsetHeight;
}
