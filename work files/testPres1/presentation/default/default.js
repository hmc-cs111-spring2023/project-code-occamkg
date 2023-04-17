let currentKeyframe = -1;
let URLparams = new URLSearchParams(location.search);

function advanceKeyframe() {
    if (currentKeyframe + 1 < allFrames.length) {
        currentKeyframe += 1;
        updateKeyframe();
        for (let transition of allFrames[currentKeyframe]) {
            let elems = document.querySelectorAll(transition.selector);
            for (let elem of elems) {
                switch (transition.effect) {
                    case 'class':
                        if (transition.add) {
                            elem.classList.add(transition.value);
                        }
                        else {
                            elem.classList.remove(transition.value);
                        }
                        break;
                    case 'transform':
                        elem.style.transform += transition.value;
                        break;
                    case 'style':
                        elem.style.cssText = `${elem.style.cssText} ${transition.value}`;
                        break;
                }
            }
        }
    }
}

function backKeyframe() {
    if (currentKeyframe > 0) {
        for (let transition of allFrames[currentKeyframe]) {
            let elems = document.querySelectorAll(transition.selector);
            for (let elem of elems) {
                switch (transition.effect) {
                    case 'class':
                        if (transition.add) {
                            elem.classList.remove(transition.value);
                        }
                        else {
                            elem.classList.add(transition.value);
                        }
                        break;
                    case 'transform':
                        elem.style.transform = elem.style.transform.replace(transition.value, '');
                        break;
                    case 'style':
                        elem.style.cssText = elem.style.cssText.replace(transition.value, '');
                        break;
                }
            }
        }
        currentKeyframe -= 1;
        updateKeyframe();
    }
}

function updateKeyframe() {
    document.getElementById('frame-num').value = currentKeyframe;
    let newURL = window.location.origin +
        window.location.pathname +
        "?frame=" + currentKeyframe;
    window.history.replaceState({}, "", newURL);

    if (currentKeyframe == allFrames.length - 1) {
        document.getElementById('fwd-frame').disabled = true;
    }
    else {
        document.getElementById('fwd-frame').disabled = false;
    }
    if (currentKeyframe == 0) {
        document.getElementById('back-frame').disabled = true;
    }
    else {
        document.getElementById('back-frame').disabled = false;
    }
}

function goToKeyframe(keyframe) {
    document.body.classList.add('no-transition');
    if (keyframe >= 0 && keyframe < allFrames.length) {
        while (currentKeyframe < keyframe) {
            advanceKeyframe();
        }
        while (currentKeyframe > keyframe) {
            backKeyframe();
        }
    }
    else {
        goToKeyframe(0);
    }
    document.body.classList.remove('no-transition');
}

function hideElements() {
    document.body.classList.add('no-transition');
    for (frame of allFrames) {
        for (transition of frame) {
            if (transition.effect == 'class' && transition.value == 'show') {
                let elems = document.querySelectorAll(transition.selector);
                for (let elem of elems) {
                    if (transition.add && !elem.classList.contains('show')) {
                        elem.classList.add('hide');
                    }
                    else if (!transition.add && !elem.classList.contains('hide')) {
                        elem.classList.add('hide');
                        elem.classList.add('show');
                    }
                }
            }
        }
    }
    document.body.classList.remove('no-transition');
}

window.addEventListener('keydown', function(e) {
    if (e.key == "ArrowRight" || e.key == " ") {
        advanceKeyframe();
    }
    else if (e.key == "ArrowLeft") {
        backKeyframe();
    }
});
// window.addEventListener('click', function(e) {
//     e.preventDefault();
//     if (e.clientX < window.innerWidth/2) {
//         backKeyframe();
//     }
//     else {
//         advanceKeyframe();
//     }
// })

window.addEventListener('load', function() {
    hideElements();
    feather.replace();
    document.getElementById('cover').classList.add('hide');

    if (URLparams.has('frame')) {
        if (URLparams.get('frame') >= 0 && URLparams.get('frame') < allFrames.length) {
            goToKeyframe(URLparams.get('frame'))
        }
        else {
            advanceKeyframe();
        }
    }
    else {
        advanceKeyframe();
    }
})