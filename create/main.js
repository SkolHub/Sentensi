import { sentensiCanvas, pageMaker, canvasWord } from "../sentensiClasses.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
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

const db = getFirestore(firebaseApp);

const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
});

var canvas = document.getElementById('cnv'),
	canvasBox = document.getElementById('canvasBox'),
	makerBox = document.getElementById('makerBox'),
	yes = document.getElementById('yes'), no = document.getElementById('no'), audioURL = document.getElementById('audioUrl'),
	canvasSelector = document.getElementById('canvasSelector'),
	nextPage = document.getElementById('nextPage'),
	activityType = document.getElementById('activityType');

var styleSheet = document.styleSheets[0];

var previous = 0;

const sen = new sentensiCanvas();

sen.pt = canvas.createSVGPoint();
sen.canvas = canvas;
sen.canvasBox = canvasBox;
sen.makerBox = makerBox;
sen.colorPicker = document.getElementById('color');
sen.pages.push(new pageMaker([], '', [], 'Remember & write', null));

canvas.onmousedown = function(e){
	if (sen.canvasMode){
		sen.canvasMakerMouseDown(e);
	} else {
		sen.canvasTextMouseDown(e);
	}
}

canvas.onmouseup = function(){
	sen.canvasMouseUp();
}

canvas.onmousemove = function(e){
	sen.canvasMouseMove(e);
}

document.onkeydown = function(e){
	if (sen.canvasMode){
		sen.documentMakerKeyDown(e);
	} else {
		sen.documentTextKeyDown(e);
	}
}

sen.rectScale = document.getElementById('rectScale');
sen.rect = document.getElementById('rectSelect');
sen.moveCircle = document.getElementById('moveCircle');
sen.rotCircle = document.getElementById('rotCircle');
sen.originScaleCircle = document.getElementById('originScaleCircle');
sen.colorCircle = document.getElementById('colorCircle');

let colors = document.getElementsByClassName('clr');
for (let i = 0; i < colors.length; i++){
	colors[i].onclick = function (){
		sen.colorPicker.value = sen.colorValues[colors[i].innerText];
		sen.color = sen.colorPicker.value;
		sen.erasing = false;
		sen.canvas.style.cursor = 'auto';
	}
}

document.getElementById('double').onclick = function(){
	sen.doubleColor = !sen.doubleColor;
	this.innerHTML = sen.doubleColor?'Double color: On':'Double color: Off';
}

function sizeBackground(index){
	for (let i = 1; i <= 4; i++){
		document.getElementById('s'+i).style.backgroundColor = '#f0f0f0';
	}
	document.getElementById('s'+index).style.backgroundColor = "#aaaaaa";
}

function saveProgress(page){
	let type = activityType.value;
	switch (type){
		case "Remember & write":
			sen.pages[page] = sen.currentPage(type, null);
			break;

		case "Right & wrong":
			sen.pages[page] = sen.currentPage(type, (yes.style.backgroundColor=='rgb(170, 170, 170)'?true:(no.style.backgroundColor=='rgb(170, 170, 170)'?false:null)));
			break;

		case "Listen & write":
			sen.pages[page] = sen.currentPage(type, audioURL.value);
			break;
	}
}

function updateType(){
	switch (activityType.value){
		case "Remember & write":
			document.getElementById('right&wrong').style.display = 'none';
			document.getElementById('listen&Write').style.display = 'none';
			break;

		case "Right & wrong":
			document.getElementById('right&wrong').style.display = 'flex';
			document.getElementById('listen&Write').style.display = 'none';
			if (sen.pages[previous].typeData){
				yes.style.backgroundColor = '#AAAAAA';
				no.style.backgroundColor = '#F0F0F0';
			} else {
				yes.style.backgroundColor = '#F0F0F0';
				no.style.backgroundColor = '#AAAAAA';
			}
			break;

		case "Listen & write":
			document.getElementById('right&wrong').style.display = 'none';
			document.getElementById('listen&Write').style.display = 'flex';
			audioURL.value = sen.pages[previous].typeData;
			break;
	}
}

document.getElementById('s1').onclick = function(){
	sen.setSize('2.1', styleSheet);
	sen.initSize = 55.59;
	sizeBackground(1);
}

document.getElementById('s2').onclick = function(){
	sen.setSize('3.045', styleSheet);
	sen.initSize = 79.43;
	sizeBackground(2);
}

document.getElementById('s3').onclick = function(){
	sen.setSize('4.2', styleSheet);
	sen.initSize = 109.22;
	sizeBackground(3);
}

document.getElementById('s4').onclick = function(){
	sen.setSize('8.4', styleSheet);
	sen.initSize = 213.48;
	sizeBackground(4);
}

document.getElementById('color').oninput = function(){
	sen.color = sen.colorPicker.value;
}

document.getElementById('scale').onclick = function(e){
	sen.scaling = !sen.scaling;
	e.target.innerHTML = e.target.innerHTML=='Scale'?'Stretch':'Scale';
}

document.getElementById('bin').onclick = function(){
	sen.erasing = true;
	sen.canvas.style.cursor = 'crosshair';
	sen.color = '';
	sen.colorCircle.setAttribute('cx', -100);
	sen.colorCircle.setAttribute('cy', -100);
}

document.getElementById('canvasBox').onmouseup = function(){
	sen.canvasBoxMouseUp();
}

document.getElementById('sttm').onclick = function(){
	document.getElementById('canvasSide').style.display = 'none';
	document.getElementById('makerSide').style.display = 'flex';
	sen.canvasBox.style.display = 'none';
	sen.makerBox.style.display = 'flex';
	sen.changeStylesheetRule(styleSheet, 'use:hover', 'cursor', 'cell');
	sen.canvasMode = false;
}

document.getElementById('stcm').onclick = function(){
	document.getElementById('makerSide').style.display = 'none';
	document.getElementById('canvasSide').style.display = 'flex';
	sen.makerBox.style.display = 'none';
	sen.canvasBox.style.display = 'flex';
	sen.changeStylesheetRule(styleSheet, 'use:hover', 'cursor', 'grab');
	sen.canvasMode = true;
}

var punctuations = document.getElementsByClassName('punctuation');

for (let i = 0; i < punctuations.length; i++){
	punctuations[i].onclick = function(e){
		sen.addPunctuation(e.target.innerHTML);
	}
}

document.getElementById('capitalise').onclick = function(){
	sen.capitalise();
}

document.getElementById('glue').onclick = function(){
	sen.glue();
}

activityType.oninput = function(){
	switch (activityType.value){
		case "Remember & write":
			document.getElementById('right&wrong').style.display = 'none';
			document.getElementById('listen&Write').style.display = 'none';
			break;

		case "Right & wrong":
			document.getElementById('right&wrong').style.display = 'flex';
			document.getElementById('listen&Write').style.display = 'none';
			break;

		case "Listen & write":
			document.getElementById('right&wrong').style.display = 'none';
			document.getElementById('listen&Write').style.display = 'flex';
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

nextPage.onclick = function(){
	saveProgress(sen.pages.length-1);
	sen.makerBox.innerHTML = "";
	sen.pages.push(structuredClone(sen.pages[sen.pages.length-1]));
	sen.pages[sen.pages.length-1].type = "Remember & write";
	activityType.value = "Remember & write";
	updateType();
	canvasSelector.max++, canvasSelector.value++;
	previous = canvasSelector.max-1;
}

document.getElementById('deletePage').onclick = function(){
	if (sen.pages.length == 1){
		alert("At least one page must exist in a lesson");
	} else {
		sen.pages.splice(canvasSelector.value-1, 1);
		if (canvasSelector.value == canvasSelector.max){
			canvasSelector.value--;
		}
		canvasSelector.max--;
		previous = canvasSelector.value-1;
		sen.selectPage(previous);
		activityType.value = sen.pages[previous].type;
		updateType();
	}
}

canvasSelector.oninput = function(){
	nextPage.style.display = (canvasSelector.value==canvasSelector.max?'flex':'none');
	saveProgress(previous);
	previous = canvasSelector.value-1;
	sen.selectPage(previous);
	activityType.value = sen.pages[previous].type;
	updateType();
}

document.getElementById('addLesson1').onclick = function (){
	document.getElementById('addLesson').style.display = 'flex';
}

document.getElementById('addLesson2').onclick = function (){
	document.getElementById('addLesson').style.display = 'flex';
}

document.getElementById('save').onclick = function(){
	saveProgress(previous);
	setDoc(doc(db, "tempWork/", document.getElementById('lessonName').value), {"v": sen.save()}).then(p => {
		window.location.href = '../home/lessons/';
	});
}

async function load(){
	sen.pages = [];
	try {
		await getDoc(doc(db, "tempWork/", params.q)).then(dat => {
			sen.loadLesson(sen.de(dat.data()['v']));
			canvasSelector.max = sen.pages.length, canvasSelector.value = 1;
			sen.selectPage(previous);
			activityType.value = sen.pages[previous].type;
			updateType();
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

if (params.q != null){
	document.getElementById('lessonName').value = params.q;
	load();
}

/*
To do list:

	- increase arrow size and put them on the sides _/
	- Only delete punctuation first _/
	- Make the cursor lighter, thinner, make it flashing and make it not apear when typing a non-canvas character _/
	- for the moment, remove cursor _/
	- When hovering over words, in the canvas maker the cursor should be a grabber and in the text maker it should be a big plus _/
	- Disable the save button until at least one sentence was added _/
	- Copy link button _/
	- Add lessons button in home _/
	- Add create lesson button _/
	- Disable classes _/
	- Future Idea: Add animations between canvas transitions (accelerating and then decelerating); creation and deletion of words is made by fading
	- Make read and remember: 1. Words apear in the textBox 2. The textbox words dissapear and the canvas words were always there 3. When you're ready, you click next and clear the textBox and now the canvas words are faded and when you click on them you need to recreate the text box and then submit. If you do it correct and then you pause for a second and then the next sentence automatically loads. If you get it wrong, there's a red X and then you may reset and redo the sentence 4. Repeat
	- For the read & remember: We have to store Time to solve, how many answers they got wrong
	- When you start an activity, let students add a name and then start
	- On the teacher's dashboard, you will see name, score etc
	- Clear textbox after answering
	-  Origninal message not showing when clicking try again
	- repair the home page
*/