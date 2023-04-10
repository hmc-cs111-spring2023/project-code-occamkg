let currentKeyframe = -1;
let numFrames = 5;
let URLparams = new URLSearchParams(location.search);

window.addEventListener('load', function() {
    let g1 = document.getElementById("group1");
    let g2 = document.getElementById("group2");
    let t1 = document.getElementById("2text1");
    let t2 = document.getElementById("2text2");
    let t3 = document.getElementById("2text3");

    function advanceKeyframe() {
        currentKeyframe = Math.min(numFrames, currentKeyframe + 1);
        updateKeyframe();
        switch(currentKeyframe) {
            case 0:
                g1.style.opacity = 1;
                g1.style.visibility = "visible";
                break;
            case 1:
                g1.classList.remove("delay-transition");
                g1.style.transform = "translateX(100%)";
                g2.classList.add("delay-transition");
                g2.style.visibility = "hidden";
                g2.style.opacity = 1;
                g2.style.visibility = "visible";
                break;
            case 2:
                t1.style.opacity = 1;
                t1.style.visibility = "visible";
                break;
            case 3:
                t1.style.opacity = 0.5;
                t1.style.fontSize = "28pt";
                t2.style.opacity = 1;
                t2.style.visibility = "visible";
                break;
            case 4:
                t2.style.opacity = 0.5;
                t2.style.fontSize = "28pt";
                t3.style.opacity = 1;
                t3.style.visibility = "visible";
                break;
            case 5:
                g2.style.opacity = 0;
                g2.style.visibility = "hidden";
                break;
        }
    }

    function backKeyframe() {
        currentKeyframe = Math.max(0, currentKeyframe - 1);
        updateKeyframe();
        switch(currentKeyframe) {
            case 0:
                g1.classList.add("delay-transition");
                g1.style.transform = "translateX(0)";
                g1.style.visibility = "visible";
                g2.classList.remove("delay-transition");
                g2.style.opacity = 0;
                g2.style.visibility = "hidden";
                break;
            case 1:                
                t1.style.opacity = 0;
                t1.style.visibility = "hidden";
                break;
            case 2:                
                t1.style.opacity = 1;
                t1.style.fontSize = "36pt";
                t2.style.opacity = 0;
                t2.style.visibility = "hidden";
                break;
            case 3:                
                t2.style.opacity = 1;
                t2.style.fontSize = "36pt";
                t3.style.opacity = 0;
                t3.style.visibility = "hidden";
                break;
            case 4:
                g2.style.opacity = 1;
                g2.style.visibility = "visible";
                break;
            case 5:
                break;
        }
    }

    function updateKeyframe() {
        // console.log(currentKeyframe);
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