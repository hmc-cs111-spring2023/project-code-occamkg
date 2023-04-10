let currentKeyframe = -1;
let numFrames = 0;
let URLparams = new URLSearchParams(location.search);

window.addEventListener('load', function() {

    function advanceKeyframe() {
        currentKeyframe = Math.min(numFrames, currentKeyframe + 1);
        updateKeyframe();
        switch(currentKeyframe) {
        }
    }

    function backKeyframe() {
        currentKeyframe = Math.max(0, currentKeyframe - 1);
        updateKeyframe();
        switch(currentKeyframe) {
        }
    }

    function updateKeyframe() {
        let newURL = window.location.origin +
            window.location.pathname +
            "?frame=" + currentKeyframe;
        window.history.replaceState({}, "", newURL);
    }

    function goToKeyframe(keyframe) {
        if (keyframe >= 0 && keyframe <= numFrames) {
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
    }

    window.addEventListener('keydown', function(e) {
        if (e.key == "ArrowRight" || e.key == " ") {
            advanceKeyframe();
        }
        else if (e.key == "ArrowLeft") {
            backKeyframe();
        }
    });
    window.addEventListener('click', function(e) {
        e.preventDefault();
        if (e.clientX < window.innerWidth/2) {
            backKeyframe();
        }
        else {
            advanceKeyframe();
        }
    })

    if (URLparams.has('frame')) {
        if (URLparams.get('frame') >= 0 && URLparams.get('frame') <= numFrames) {
            goToKeyframe(URLparams.get('frame'))
        }
        else {
            advanceKeyframe();
        }
    }
    else {
        advanceKeyframe();
    }
});