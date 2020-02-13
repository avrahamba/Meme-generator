'use strict';

function uploadImg(elForm, ev) {
    ev.preventDefault();
    document.getElementById('imgData').value = document.querySelector('#meme-canvas').toDataURL("image/jpeg");

    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl);
        var fakeLink = document.createElement('a');
        fakeLink.setAttribute('href', `https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}`);
        fakeLink.setAttribute('target', '_blank')
        fakeLink.click();
    }

    doUploadImg(elForm, onSuccess);
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('http://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
        .then(function (res) {
            return res.text()
        })
        .then(onSuccess)
        .catch(function (err) {
            console.error(err)
        })
}
