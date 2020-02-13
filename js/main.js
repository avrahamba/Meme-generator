'use strict'

let activeLine = null;
let gImg;
const gPropsCont = 5;
let gStartProps = 1;
let avtiveLineOrProp = false;
function init() {
    initGallery();
    window.addEventListener('click', () => { avtiveLineOrProp = false; render(); })
}
function initGallery() {
    let container = document.querySelector('.gallery-container');
    let strHtml = getImages().map(img => `
    <div class="card" onclick="enterGenerator(${img.id})">
        <img src="images/full/${img.url}"/>
    </div>
    `).join('');
    container.innerHTML = strHtml;
}
function enterGenerator(id) {
    setImg(id);
    document.querySelector('.gallery-container').classList.add('hidden');
    document.querySelector('.editor-container').classList.remove('hidden');
    document.querySelector('.about').classList.add('hidden');
    initMemeGenerator();
}
function initMemeGenerator() {
    let meme = getMeme();
    document.querySelector('.hidden-img').src = `images/full/${getImgUrl(meme.selectedImgId)}`;
    render(meme);
    addline();
    renderProps();
}

function render() {
    let meme = getMeme();
    let canvas = document.querySelector('#meme-canvas');
    let ctx = canvas.getContext('2d');
    var elImg = document.querySelector('.hidden-img')
    let ratio = elImg.width / elImg.height;
    resizeCanvas(ratio);
    ctx.drawImage(elImg, 0, 0, canvas.width, canvas.height)
    meme.props.forEach(prop => {
        let { x, y, fakeImg } = prop;
        ctx.drawImage(fakeImg, x - prop.height() / 2, y - prop.width() / 2, prop.height(), prop.width())
    })
    meme.lines.forEach((line, inx) => {

        ctx.strokeStyle = line.colorStroke;
        ctx.fillStyle = line.colorfill;
        ctx.font = `${line.size}px ${line.font}`;
        ctx.textAlign = 'center'
        line.height = ctx.measureText(line.text).actualBoundingBoxAscent;
        line.width = ctx.measureText(line.text).width;


        if (avtiveLineOrProp && inx === getMeme().seletedLineInx) {

            ctx.beginPath()
            ctx.rect(line.x - line.width / 2, line.y - line.height, line.width, line.height)
            ctx.strokeStyle = '555555'
            ctx.stroke()

        }

        ctx.fillText(line.text, line.x, line.y);
        ctx.strokeText(line.text, line.x, line.y);
    });
}

function resizeCanvas(ratio) {
    let canvas = document.querySelector('#meme-canvas');
    let elContainer = document.querySelector('.canvas-container');
    elContainer.style.height = elContainer.offsetWidth / ratio + 'px'
    canvas.width = elContainer.offsetWidth;
    canvas.height = elContainer.offsetHeight;
}


function changeText(elText, ev) {
    ev.stopPropagation();
    avtiveLineOrProp = true;
    changeTextLine(elText.value);
    render();;
}
function addline() {
    avtiveLineOrProp = true;
    let memeLineCount = getMeme().lines.length;
    let canvas = document.querySelector('#meme-canvas');
    let y = canvas.height / 2;
    if (memeLineCount === 0 || memeLineCount === 1) y = (memeLineCount) ? canvas.height - 100 : 100;
    addLineService(canvas.width / 2, y)
    document.querySelector('.edit-text').value = '';
    document.querySelector('.select-font').value = 'Impact';
}

function clickOnCanvas(ev) {
    ev.stopPropagation();
    avtiveLineOrProp = true;
    let { offsetX, offsetY } = ev;
    let line = getLine(offsetX, offsetY);
    
    if (line&&line.type==='line') {   
        document.querySelector('.select-font').value = line.font;
        document.querySelector('.edit-text').value = line.text;
    }else if(line&&line.type==='prop'){
        document.querySelector('.select-font').value = 'Impact';
        document.querySelector('.edit-text').value = '';
    }else{
        document.querySelector('.select-font').value = 'Impact';
        document.querySelector('.edit-text').value = '';
        avtiveLineOrProp=false;
    }
    render();
}

function onRemoveLine() {
    removeLine();
    render();;
}

function onMoveLine(diff) {
    moveLine({ x: 0, y: diff });
    render();;
}

function onChangeSize(diff, ev) {
    ev.stopPropagation();
    avtiveLineOrProp = true;
    changeSize(diff);
    render();;
}

function onChangeColor(elColor, fill) {

    changeColor(elColor.value, fill)
    render();;
}
function onDownload(elLink) {
    let canvas = document.querySelector('#meme-canvas');
    const data = canvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-meme.png';
}

function loadGallery() {
    document.querySelector('.editor-container').classList.add('hidden');
    document.querySelector('.about').classList.remove('hidden');
    document.querySelector('.gallery-container').classList.remove('hidden');
    initGallery();

}

function onMouseDownCanvas(ev) {
    avtiveLineOrProp = true;
    let { offsetX, offsetY } = ev;
    activeLine = getLine(offsetX, offsetY);
    window.addEventListener('mouseup', () => { activeLine = null });
}
function onMousMoveCanvas(ev) {
    if (!activeLine) return;
    moveLineTo(ev.offsetX, ev.offsetY);
    render();;
}

function onMoveToRight(ev) {
    ev.stopPropagation();
    avtiveLineOrProp = true;
    moveLineTo(document.querySelector('#meme-canvas').width - getLineWidth() / 2, -1)
    render();;
}
function onMoveToLeft(ev) {
    ev.stopPropagation();
    avtiveLineOrProp = true;
    moveLineTo(getLineWidth() / 2, -1)
    render();;
}
function onMoveToCenter(ev) {
    ev.stopPropagation();
    avtiveLineOrProp = true;
    moveLineTo(document.querySelector('#meme-canvas').width / 2, -1)
    render();;
}

function onChanchFont(font, ev) {
    ev.stopPropagation();
    avtiveLineOrProp = true;
    changeFont(font);
    render();
}

function onReplaceLineSelected(ev) {
    ev.stopPropagation();
    avtiveLineOrProp = true;
    replaceLineSelected();
    document.querySelector('.edit-text').value = getMeme().lines[getMeme().seletedLineInx].text;
    render();
}

function shareToWhatsapp() {
    var fakeLink = document.createElement('a');
    fakeLink.setAttribute('href', 'whatsapp://send?text=' + encodeURIComponent(imageURL));
    fakeLink.setAttribute('data-action', 'share/whatsapp/share');
    fakeLink.click();
}

function changeProps(next) {
    if (next) {
        gStartProps++;
        if (gStartProps + 2 > gPropsCont) gStartProps = 1;
    } else {
        gStartProps--;
        if (gStartProps < 1) gStartProps = gPropsCont - 2;
    }

    renderProps();
}

function renderProps() {
    let elProp1 = document.querySelector('.prop1 img');
    let elProp2 = document.querySelector('.prop2 img');
    let elProp3 = document.querySelector('.prop3 img');
    elProp1.dataset.pic = gStartProps;
    elProp1.src = `images/props/${gStartProps}.png`;
    elProp2.dataset.pic = gStartProps + 1;
    elProp2.src = `images/props/${gStartProps + 1}.png`;
    elProp3.dataset.pic = gStartProps + 2;
    elProp3.src = `images/props/${gStartProps + 2}.png`;
}

function onAddProp(el) {
    let canvas = document.querySelector('#meme-canvas');
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let propId = el.dataset.pic;
    addProp(x, y, propId);
    render();
}