import { sentensiCanvas, pageMaker, canvasWord } from "../sentensiClasses.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

const firebaseApp = initializeApp({
    apiKey: "AIzaSyCp7hFFVEOTQhya1YTpmlDLXEzoBJ7HWzQ",
    authDomain: "sentensi-4aedd.firebaseapp.com",
    projectId: "sentensi-4aedd",
    storageBucket: "sentensi-4aedd.appspot.com",
    messagingSenderId: "927772530939",
    appId: "1:927772530939:web:eeb1d50bc68f48aa4b785e",
    measurementId: "G-CGTFDKKXDF"
})

const auth = getAuth(firebaseApp);

auth.onAuthStateChanged(function (user){
    if (user == null){
        window.location.href = '../logup';
    }
});

const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
});

const db = getFirestore(firebaseApp);

var s = document.styleSheets[0];

var canvas = document.getElementById('cnv'),
	makerBox = document.getElementById('makerBox'),
    next = document.getElementById('stcm'),
	yes = document.getElementById('yes'), no = document.getElementById('no'),
    correctness = document.getElementById('rightness');
	

var sen = new sentensiCanvas();

sen.pt = canvas.createSVGPoint();
sen.canvas = canvas;
sen.makerBox = makerBox;
sen.pages = [];
sen.canvasMode = false;

var pageNumber = 0, writable = false, correct = 0, wrong = 0, tries = 0, startTime;

canvas.onmousedown = function(e){
    if (writable){
        sen.canvasTextMouseDown(e);
    }
}

document.onkeydown = function(e){
    if (writable){
        sen.documentTextKeyDown(e);
    }
}

document.getElementById('capitalise').onclick = function(){
    if (writable){
        sen.capitalise();
    }
}

document.getElementById('glue').onclick = function(){
    if (writable){
        sen.glue();
    }
}

var punctuations = document.getElementsByClassName('punctuation');

for (let i = 0; i < punctuations.length; i++){
	punctuations[i].onclick = function(e){
        if (writable){
            sen.addPunctuation(e.target.innerHTML);
        }
	}
}

async function load(){
	sen.pages = [];
	try {
        await getDoc(doc(db, "Activities/", params.q)).then(async dat => {
            await getDoc(doc(db, "tempWork/", dat.data()["target"])).then(dat2 => {
                sen.loadLesson(sen.de(dat2.data()['v']));
                sen.resetCanvas();
                sen.resetMakerBox();
                document.getElementById('qTotal').innerHTML = sen.pages.length;
            });
        });
	} catch (e){
		if (e.name == 'TypeError'){
			console.log(e);
			alert("The page you were trying to load does not exist or something else happened. An empty canvas will be loaded instead.");
		} else {
			throw e;
		}
	}
}

document.getElementById('continue').onclick = function(){
    if (document.getElementById('name').value.trim() == ""){
        alert("Invalid Name!");
        return;
    }
    if (params.q == null){
        alert("No activity opened!");
        return;
    }
    load().then(v => {
        initQuestion(0);
        document.getElementById('addLesson').style.display = 'none';
        startTime = new Date().getTime();
    });
}

function initQuestion(page){
    correctness.innerHTML = '?';
    correctness.style.color = 'black';
    switch (sen.pages[page].type){
        case "Remember & write":
            sen.selectPage(page);
            next.innerHTML = "Solve";
            writable = false;
            break;

        case "Listen & write":
            sen.selectPage(page);
            next.innerHTML = "Answer";
            writable = true;
            sen.resetMakerBox();
            document.getElementById('listen&write').style.display = 'flex';
            document.getElementById('tools').style.display = 'flex';
            document.getElementById('audio').src = sen.pages[page].typeData;
            break;

        case "Right & wrong":
            sen.selectPage(page);
            next.innerHTML = "Answer";
            writable = false;
            document.getElementById('right&wrong').style.display = 'flex';
            break;
    }
    rewriteValues();
}

next.onclick = function(){
    switch(next.innerHTML){
        case "Solve":
            sen.resetMakerBox();
            next.innerHTML = "Answer";
            writable = true;
            document.getElementById('tools').style.display = 'flex';
            break;

        case "Answer":
            if (sen.pages[pageNumber].type == "Right & wrong" && yes.style.backgroundColor == 'rgb(240, 240, 240)' && no.style.backgroundColor == 'rgb(240, 240, 240)'){
                alert("No option selected!");
            }
            document.getElementById('listen&write').style.display = 'none';
            document.getElementById('tools').style.display = 'none';
            document.getElementById('right&wrong').style.display = 'none';
            if (checkAnswer()){
                correctness.innerHTML = '✓';
                correctness.style.color = 'green';
                next.style.display = 'none';
                correct++;
                writable = false;
                setTimeout(function(){
                    ++pageNumber;
                    if (pageNumber == sen.pages.length){
                        finish();
                        return;
                    }
                    initQuestion(pageNumber);
                    document.getElementById('qNo').innerHTML = pageNumber+1;
                    next.style.display = 'block';
                }, 4000);
            } else {
                next.innerHTML = "Try again";
                correctness.innerHTML = '✘';
                correctness.style.color = 'red';
                document.getElementById('ignore').style.display = 'block';
            }
            yes.style.backgroundColor = '#F0F0F0';
	        no.style.backgroundColor = '#F0F0F0';
            break;

        case "Try again":
            tries++;
            document.getElementById('ignore').style.display = 'none';
            initQuestion(pageNumber);
            break;
    }
    rewriteValues();
}

document.getElementById('ignore').onclick = function(){
    document.getElementById('ignore').style.display = 'none';
    ++pageNumber;
    wrong++;
    if (pageNumber == sen.pages.length){
        writable = false;
        finish();
        return;
    }
    initQuestion(pageNumber);
    document.getElementById('qNo').innerHTML = pageNumber+1;
    rewriteValues();
}

function checkAnswer(){
    switch (sen.pages[pageNumber].type){
        case "Remember & write": case "Listen & write":
            if (sen.stringfyMakerBox().trim() == sen.pages[pageNumber].sentence.trim()){
                return true;
            } else {
                return false;
            }
            break;

        case "Right & wrong":
            if (yes.style.backgroundColor == 'rgb(170, 170, 170)'){
                return sen.pages[pageNumber].typeData;
            } else {
                return !sen.pages[pageNumber].typeData;
            }
            break;
    }
}

yes.onclick = function(){
	yes.style.backgroundColor = '#AAAAAA';
	no.style.backgroundColor = '#F0F0F0';
}

no.onclick = function(){
	yes.style.backgroundColor = '#F0F0F0';
	no.style.backgroundColor = '#AAAAAA';
}

function finish(){
    let d = {};
    d[`scores.${document.getElementById('name').value}`] = [correct, wrong, tries, ((new Date().getTime()) - startTime)/1000];
    updateDoc(doc(db, "Activities/", params.q), d).then(v => {
        document.getElementById('congrats').style.display = 'block';
    });
}

function rewriteValues(){
    document.getElementById('correct').innerHTML = correct;
    document.getElementById('wrong').innerHTML = wrong;
    document.getElementById('tries').innerHTML = tries;
}