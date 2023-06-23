import { sentensiCanvas, pageMaker, canvasWord } from "../sentensiClasses.js";
/*import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
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
        window.location.href = '../../logup';
    }
});

const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
});

const db = getFirestore(firebaseApp);*/

var canvas = document.getElementById('cnv');
var canvasBox = document.getElementById('canvasBox');
var makerBox = document.getElementById('makerBox');

var styleSheet = document.styleSheets[0];

var characters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '@', '#', '$', '%', '^', '*', '(', ')', '_', '+', '=', '-', '[', ']', '{', '}', '\\', '|', '/', '~', '`', '÷', '<', '>', ' ', '&', '.', ',', '?', '!', ':', ';', '"', "'"]

const sen = new sentensiCanvas();

sen.pt = canvas.createSVGPoint();
sen.canvas = canvas;
sen.canvasBox = canvasBox;
sen.makerBox = makerBox;
sen.colorPicker = document.getElementById('color');

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

document.getElementById('activityType').oninput = function(e){
	switch (e.target.value){
		case "Remember & write":
			document.getElementById('right&wrong').style.display = 'none';
			document.getElementById('listen&Write').style.display = 'none';
			break;

		case "Right & Wrong":
			document.getElementById('right&wrong').style.display = 'flex';
			document.getElementById('listen&Write').style.display = 'none';
			break;

		case "Listen & Write":
			document.getElementById('right&wrong').style.display = 'none';
			document.getElementById('listen&Write').style.display = 'flex';
			break;
	}
}

document.getElementById('nextPage').onclick = function(){
	let type = document.getElementById('activityType').value;
	switch (type){
		case "Remember & write":
			sen.pages.push(currentPage(type, null));
			break;

		case "Right & Wrong":
			sen.pages.push(currentPage(type, null));
			break;

		case "Listen & Write":
			sen.pages.push(currentPage(type, null));
			break;
	}
}

document.getElementById('canvasSelector').oninput = function(){
	
}


/*
class canvasWord {
	constructor (word){
		if (word[0] == undefined){
			let points = document.getElementById(word.id.replace('t', 'p')).getAttribute('d').split(' ');
			this.content = document.getElementById(word.id.replace('t', 'tp')).innerHTML;
			this.start = [+points[1], +points[2]];
			this.focus = [+points[4], +points[5]];
			this.end = [+points[6], +points[7]];
			this.topColor = document.getElementById('c1' + word.id.replace('t', '')).getAttribute('fill');
			this.bottomColor = document.getElementById('c2' + word.id.replace('t', '')).getAttribute('fill');
			this.fontSize = +(document.getElementById(word.id.replace('t', 'tp')).style.fontSize.replace('px', ''));
		} else {
			this.content = word[0];
			this.start = [word[1][0], word[1][1]];
			this.focus = [word[2][0], word[2][1]];
			this.end = [word[3][0], word[3][1]];
			this.topColor = word[4];
			this.bottomColor = word[5];
			this.fontSize = word[6];
		}
		this.comp = '';
	}

	compressColor(color) {
		return [('000' + Math.floor(parseInt(color.substring(1, 3), 16)/16).toString(2)).slice(-4), ('000' + Math.floor(parseInt(color.substring(3, 5), 16)/16).toString(2)).slice(-4), ('000' + Math.floor(parseInt(color.substring(5, 7), 16)/16).toString(2)).slice(-4)];
	}

	compressString(str) {
		let content = '';
		for (let i = 0; i < str.length; i++){
			content += ('000000' + characters.indexOf(str[i]).toString(2)).slice(-7);
		}
		return content + '1100000';
	}

	compressAll(){
		this.content = this.compressString(this.content);
		this.focus = [('0000000' + Math.min(Math.floor(Math.abs(+this.focus[0]+(+this.start[0]))/16), 127).toString(2)).slice(-7), ('000000' + Math.min(Math.floor(Math.abs(+this.focus[1]+(+this.start[1]))/16), 63).toString(2)).slice(-6)];
		this.end = [('0000000' + Math.min(Math.floor(Math.abs(+this.end[0]+(+this.start[0]))/16), 127).toString(2)).slice(-7), ('000000' + Math.min(Math.floor(Math.abs(+this.end[1]+(+this.start[1]))/16), 63).toString(2)).slice(-6)];
		this.start = [('0000000' + Math.min(Math.floor(Math.abs(+this.start[0])/16), 127).toString(2)).slice(-7), ('000000' + Math.min(Math.floor(Math.abs(this.start[1])/16), 63).toString(2)).slice(-6)];
		this.topColor = this.compressColor(this.topColor);
		this.bottomColor = this.compressColor(this.bottomColor);
		this.fontSize = ('00000000' + Math.min(Math.floor(+(this.fontSize)/4), 255).toString(2)).slice(-8);
		this.comp = this.topColor[0] + this.topColor[1] + this.topColor[2] +
		this.bottomColor[0] + this.bottomColor[1] + this.bottomColor[2] +
		this.start[0] +
		this.start[1] +
		this.focus[0] +
		this.focus[1] +
		this.end[0] +
		this.end[1] +
		this.fontSize +
		this.content;
	}
}

class pageMaker {
	constructor (wordList, textBoxWords, rightness, existingWords){
		this.wordList = wordList;

		if (typeof textBoxWords == 'string'){
			this.sentence = textBoxWords;
		} else {
			this.sentence = textBoxWords[0].innerText;
			for (let i = 1; i < textBoxWords.length; i++){
				this.sentence += (textBoxWords[i].style.paddingLeft == '0vw'?'&':' ') + textBoxWords[i].innerHTML;
			}
		}

		this.rightness = rightness;
		this.existingWords = existingWords;
	}

	compressString(str) {
		let content = '';
		for (let i = 0; i < str.length; i++){
			content += ('000000' + characters.indexOf(str[i]).toString(2)).slice(-7);
		}
		return content + '1100000';
	}

	compressAll(){
		for (let i = 0; i < this.wordList.length; i++){
			if (this.wordList[i] != null){
				this.wordList[i].compressAll();
			}
		}
	}
}
*/

/*
function changeStylesheetRule(stylesheet, selector, property, value) {
	selector = selector.toLowerCase();
	property = property.toLowerCase();
	value = value.toLowerCase();
	for(var i = 0; i < s.cssRules.length; i++) {
		var rule = s.cssRules[i];
		if(rule.selectorText === selector) {
			rule.style[property] = value;
			return;
		}
	}
	stylesheet.insertRule(selector + " { " + property + ": " + value + "; }", 0);
}

function getSize(text, mod = 64){
	let measure = document.getElementById('mes');
	measure.innerHTML = text;
	return [+(measure.clientWidth + 1)*mod/64, +(measure.clientHeight + 1)*mod/64];
}

function pyth(x1, y1, x2, y2){
	return Math.sqrt((x1-x2)**2 + (y1-y2)**2);
}

function angFromPoint(originX, originY, pointX, pointY){
	let ang = Math.asin((originY-pointY)/pyth(originX, originY, pointX, pointY));
	if (pointY <= originY && pointX <= originX){
		return Math.PI - ang;
	} else if (pointY >= originY && pointX <= originX){
		return -Math.PI - ang;
	}
	return ang;
}

function xFromAng(origin, radius, angle){
	let r = origin+radius*Math.cos(angle);
	return isNaN(r)?origin:r;
}

function yFromAng(origin, radius, angle){
	let r = origin+radius*Math.sin(angle);
	return isNaN(r)?origin:r;
}

function pressWD(word, p, e){
	let loc = cursorPoint(e);
	let eventX = Math.floor(loc.x), eventY = Math.floor(loc.y);
	if (p == 0){
		action = 'move';
		target = word.id.replace('tp', 'p');
		details = [[eventX, eventY]]
	} else if (p == word.innerHTML.length-1){
		action = 'stretch';
		target = word.id.replace('tp', 'p');
		let path = document.getElementById(target);
		let points = path.getAttribute('d').split(' ');
		for (let i = 0; i < points.length; i++){
			points[i] = +(points[i]);
		}
		details = [Math.sqrt(points[4]**2 + points[5]**2)/Math.sqrt(points[6]**2 + points[7]**2), -angFromPoint(0, 0, points[4], points[5])+angFromPoint(0, 0, eventX-points[1], eventY-points[2])];
	} else {
		action = 'bend';
		target = word.id.replace('tp', 'p');
	}
	document.body.style.cursor = 'grab';
}

function pressTE (e){
	if (totalWords < 64){
		let loc = cursorPoint(e);
		let eventX = loc.x, eventY = loc.y;
		canvas.innerHTML += 
		`<path id="p${wordCount}" d="M ${eventX} ${eventY} q ${getSize(e.target.innerText, [55.59, 79.43, 109.22, 213.48][size])[0]/2} 0 ${getSize(e.target.innerText, [55.59, 79.43, 109.22, 213.48][size])[0]} 0" stroke="none" stroke-width="1" fill="none"></path>
		<text id="t${wordCount}" font-size="${["55.59", "79.43", "109.22", "213.48"][size] + "px"}">
			<textPath id="tp${wordCount}" class="pathText" style="font-size: ${["55.59", "79.43", "109.22", "213.48"][size] + "px;"}" alignment-baseline="middle" href="#p${wordCount}" startOffset="0%">${e.target.innerText}</textPath>
		</text>
		<path id="dp${wordCount}" d="M ${eventX} ${eventY} q ${getSize(e.target.innerText, [55.59, 79.43, 109.22, 213.48][size])[0]/2} 0 ${getSize(e.target.innerText, [55.59, 79.43, 109.22, 213.48][size])[0]} 0 l 0 -172" stroke="none" stroke-width="1" fill="none"></path>
		<clipPath id="cp${wordCount}">
			<use href="#dp${wordCount}" />
		</clipPath>
		<use id="c1${wordCount}" href="#t${wordCount}" fill="#000000" />
		<use id="c2${wordCount}" href="#t${wordCount}" fill="#000000" clip-path="url(#cp${wordCount})" />
		`
		pressWD(document.getElementById(`tp${wordCount}`), 0, e);
		wordCount++;
		totalWords++;
		e.target.remove();
		currentWord = (canvasBox.children.length > 0)?canvasBox.lastElementChild.id.replace('w', ''):-1;
	} else {
		alert("You may only have a maximum of 64 words on the canvas!");
	}
}

function pressMW (word){
	currentMakerWord++;
	let element = document.createElement('p');
	element.className = 'tbt';
	element.id = 'mw'+currentMakerWord;
	element.onmousedown = pressMWB;
	element.innerHTML = word.innerHTML;
	document.getElementById('makerBox').appendChild(element);
	for (let i = 1; i < currentMakerWord+1; i++){
		if (document.getElementById('mw'+(i-1)) && document.getElementById('mw'+i)){
			for (let j = 0; j < glueList.length; j++){
				if (glueList[j][0] == document.getElementById('mw'+(i-1)).innerHTML && glueList[j][1] == document.getElementById('mw'+i).innerHTML){
					document.getElementById('mw'+i).style.paddingLeft = '0vw';
				}
			}
		}
	}
}

function pressMWB(e){
	selectedMakerWord = e.target.id.replace('mw', '');
	for (let i = 0; i <= currentMakerWord; i++){
		if (i != selectedMakerWord){
			try {
				document.getElementById('mw'+i).style.color = '#000000a0';
			} catch {}
		}
	}
	document.getElementById('mw'+selectedMakerWord).style.color = '#000000';
}

var pt = canvas.createSVGPoint();

function cursorPoint(e){
	pt.x = e.clientX; pt.y = e.clientY;
	return pt.matrixTransform(canvas.getScreenCTM().inverse());
}

var currentWord = -1, currentMakerWord = -1, wordCount = 0, action = '', target = -1, wordTarget = 'w-1', dragging = false, details = [], scaling = false, selectedMakerWord = -1, glueList = [], color = '', size = 2, pages = [], totalWords = 0, erasing = false, lastPage = [[], ""], previous;

canvas.onmouseup = function (e){
	document.body.style.cursor = 'default';
	if (action == 'select'){
		let words = [];
		for (let i = 0; i < wordCount; i++){
			try {
				let path = document.getElementById('p'+i);
				let points = path.getAttribute('d').split(' ');
				let rect = document.getElementById('rectSelect');
				let x = +(rect.getAttribute('x')), y = +(rect.getAttribute('y')), width = +(rect.getAttribute('width')), height = +(rect.getAttribute('height'));
				if ((x <= +(points[1]) && +(points[1]) <= x+width && y <= +(points[2]) && +(points[2]) <= y+height)||(x <= +(points[1])+ +(points[6]) && +(points[1])+ +(points[6]) <= x+width && y <= +(points[2])+ +(points[7]) && +(points[2])+ +(points[7]) <=y+height)){
					words.push(i);
				}
			} catch {}
		}
		if (words.length != 0){
			target = words;
			action = '';
			let medX = 0, medY = 0, nr = 0;
			for (let i = 0; i < target.length; i++){
				let path = document.getElementById('p'+target[i]);
				let points = path.getAttribute('d').split(' ');
				medX += 3*+(points[1])+ +(points[4])+ +(points[6]);
				medY += 3*+(points[2])+ +(points[5])+ +(points[7]);
				nr += 3;
			}
			let rotCircle = document.getElementById('rotCircle');
			rotCircle.setAttribute('cx', medX/nr);
			rotCircle.setAttribute('cy', medY/nr);
			let moveCircle = document.getElementById('moveCircle');
			moveCircle.setAttribute('cx', medX/nr);
			moveCircle.setAttribute('cy', medY/nr-60);
			let rect = document.getElementById('rectSelect');
			let rectScale = document.getElementById('rectScale');
			rectScale.setAttribute('x', +rect.getAttribute('x') + +rect.getAttribute('width') - 10);
			rectScale.setAttribute('y', +rect.getAttribute('y') + +rect.getAttribute('height') - 10);
		} else {
			action = '';
			target = -1;
		}
	} else if (action == 'groupMove' || 'groupRotate') {
		action = '';
		target = -1;
		let moveCircle = document.getElementById('moveCircle'), rotCircle = document.getElementById('rotCircle'), rect = document.getElementById('rectSelect'), rectScale = document.getElementById('rectScale'), originScaleCircle = document.getElementById('originScaleCircle');
		moveCircle.setAttribute('cx', -100);
		moveCircle.setAttribute('cy', -100);
		rotCircle.setAttribute('cx', -100);
		rotCircle.setAttribute('cy', -100);
		rect.setAttribute('x', -10);
		rect.setAttribute('y', -10);
		rect.setAttribute('width', 0);
		rect.setAttribute('height', 0);
		rectScale.setAttribute('x', -100);
		rectScale.setAttribute('y', -100);
		originScaleCircle.setAttribute('cx', +rect.getAttribute('x'));
		originScaleCircle.setAttribute('cy', +rect.getAttribute('y'));
	} else {
		action = '';
		target = -1;
	}
}

canvas.onmousedown = function (e){
	let loc = cursorPoint(e);
	let eventX = loc.x, eventY = loc.y;
	if (document.getElementById('canvasSide').style.display == 'flex'){
		if (color != ''){
			let point = canvas.createSVGPoint();
			point.x = eventX;
			point.y = eventY;
			for (let i = 0; i < wordCount; i++){
				try {
					let p = document.getElementById('tp'+i).getCharNumAtPosition(point);
					if (p != -1){
						if (document.getElementById('double').innerHTML == 'Double color: Off'){
							document.getElementById('c1'+i).setAttribute('fill', color);
							document.getElementById('c2'+i).setAttribute('fill', color);
						} else {
							document.getElementById('c2'+i).setAttribute('fill', document.getElementById('c1'+i).getAttribute('fill'));
							document.getElementById('c1'+i).setAttribute('fill', color);
						}
						return 0;
					}
				} catch {}
			}
			color = '';
			document.getElementById('colorCircle').setAttribute('cx', -100);
			document.getElementById('colorCircle').setAttribute('cy', -100);
		} else if (erasing){
			let point = canvas.createSVGPoint();
			point.x = eventX;
			point.y = eventY;
			for (let i = 0; i < wordCount; i++){
				try {
					let p = document.getElementById('tp'+i).getCharNumAtPosition(point);
					if (p != -1){
						document.getElementById('p'+i).remove();
						document.getElementById('t'+i).remove();
						document.getElementById('dp'+i).remove();
						document.getElementById('cp'+i).remove();
						document.getElementById('c1'+i).remove();
						document.getElementById('c2'+i).remove();
						return 0;
					}
				} catch {}
			}
			erasing = false;
			canvas.style.cursor = 'auto';
		} else {
			let rectScale = document.getElementById('rectScale');
			if (eventX > +rectScale.getAttribute('x') && eventX < +rectScale.getAttribute('x') + 20 && eventY > +rectScale.getAttribute('y') && eventY < +rectScale.getAttribute('y') + 20){
				let moveCircle = document.getElementById('moveCircle'), rotCircle = document.getElementById('rotCircle'), rect = document.getElementById('rectSelect'), originScaleCircle = document.getElementById('originScaleCircle');
				let rectScale = document.getElementById('rectScale');
				details = [pyth(+rect.getAttribute('x'), +rect.getAttribute('y'), +rectScale.getAttribute('x') + 10, +rectScale.getAttribute('y') + 10), +rect.getAttribute('x'), +rect.getAttribute('y'), angFromPoint(+rect.getAttribute('x'), +rect.getAttribute('y'), +rect.getAttribute('x') + +rect.getAttribute('width'), +rect.getAttribute('y') + +rect.getAttribute('height')), pyth(+rect.getAttribute('x'), +rect.getAttribute('y'), +rectScale.getAttribute('x') + +rect.getAttribute('width'), +rectScale.getAttribute('y') + +rect.getAttribute('height')), +rectScale.getAttribute('x') + +rect.getAttribute('width'), []];
				originScaleCircle.setAttribute('cx', +rect.getAttribute('x'));
				originScaleCircle.setAttribute('cy', +rect.getAttribute('y'));
				moveCircle.setAttribute('cx', -100);
				moveCircle.setAttribute('cy', -100);
				rotCircle.setAttribute('cx', -100);
				rotCircle.setAttribute('cy', -100);
				rect.setAttribute('x', -10);
				rect.setAttribute('y', -10);
				rect.setAttribute('width', 0);
				rect.setAttribute('height', 0);
				action = 'groupSize';

				for (let i = 0; i < target.length; i++){
					let points = document.getElementById('p'+target[i]).getAttribute('d').split(' ');
					details[6].push([+points[1], +points[2], +points[4], +points[5], +points[6], +points[7], +document.getElementById('tp'+target[0]).style.fontSize.replace('px', '')]);
				}
				return 0;
			}
			let rect = document.getElementById('rectSelect');
			let x = +(rect.getAttribute('x')), y = +(rect.getAttribute('y')), width = +(rect.getAttribute('width')), height = +(rect.getAttribute('height'));
			if (x <= eventX && eventX <= x+width && y <= eventY && y <= y+height){
				let moveCircle = document.getElementById('moveCircle'), rectScale = document.getElementById('rectScale'), originScaleCircle = document.getElementById('originScaleCircle');
				if (pyth(eventX, eventY, +(moveCircle.getAttribute('cx')), +(moveCircle.getAttribute('cy'))) > 10){
					action = 'groupMove';
					details = [[eventX, eventY]];
					let rotCircle = document.getElementById('rotCircle');
					moveCircle.setAttribute('cx', -100);
					moveCircle.setAttribute('cy', -100);
					rotCircle.setAttribute('cx', -100);
					rotCircle.setAttribute('cy', -100);
					rectScale.setAttribute('x', -100);
					rectScale.setAttribute('y', -100);
					originScaleCircle.setAttribute('cx', -100);
					originScaleCircle.setAttribute('cy', -100);
				} else {
					action = 'groupRotate';
					let rotCircle = document.getElementById('rotCircle');
					details = [[+(rotCircle.getAttribute('cx')), +(rotCircle.getAttribute('cy'))], [[], []]];
					for (let i = 0; i < target.length; i++){
						let path = document.getElementById('p'+target[i]);
						let points = path.getAttribute('d').split(' ');
						for (let j = 0; j < points.length; j++){
							points[j] = +(points[j]);
						}
						details[1][0].push([
							pyth(details[0][0], details[0][1], points[1], points[2]),
							pyth(details[0][0], details[0][1], points[1]+points[4], points[2]+points[5]),
							pyth(details[0][0], details[0][1], points[1]+points[6], points[2]+points[7])
						]);
						details[1][1].push([
							-angFromPoint(details[0][0], details[0][1], points[1], points[2]),
							-angFromPoint(details[0][0], details[0][1], points[1]+points[4], points[2]+points[5]),
							-angFromPoint(details[0][0], details[0][1], points[1]+points[6], points[2]+points[7])
						]);
					}
				}
				let rect = document.getElementById('rectSelect');
				rect.setAttribute('x', -10);
				rect.setAttribute('y', -10);
				rect.setAttribute('width', 0);
				rect.setAttribute('height', 0);
				rectScale.setAttribute('x', -100);
				rectScale.setAttribute('y', -100);
				originScaleCircle.setAttribute('cx', -100);
				originScaleCircle.setAttribute('cy', -100);
			} else {
				let moveCircle = document.getElementById('moveCircle'), rotCircle = document.getElementById('rotCircle'), rect = document.getElementById('rectSelect'), rectScale = document.getElementById('rectScale'), originScaleCircle = document.getElementById('originScaleCircle');
				rect.setAttribute('x', -10);
				rect.setAttribute('y', -10);
				rect.setAttribute('width', 0);
				rect.setAttribute('height', 0);
				moveCircle.setAttribute('cx', -100);
				moveCircle.setAttribute('cy', -100);
				rotCircle.setAttribute('cx', -100);
				rotCircle.setAttribute('cy', -100);
				rectScale.setAttribute('x', -100);
				rectScale.setAttribute('y', -100);
				originScaleCircle.setAttribute('cx', -100);
				originScaleCircle.setAttribute('cy', -100);
				let point = canvas.createSVGPoint();
				point.x = eventX;
				point.y = eventY;
				for (let i = 0; i < wordCount; i++){
					try {
						let p = document.getElementById('tp'+i).getCharNumAtPosition(point);
						if (p != -1){
							pressWD(document.getElementById('tp'+i), p, e);
							return 0;
						}
					} catch {}
				}
				action = 'select';
				details = [[eventX, eventY]];
			}
		}
	} else {
		selectedMakerWord = -1;
		for (let i = 0; i <= currentMakerWord; i++){
			try {
				document.getElementById('mw'+i).style.color = '#000000';
			}  catch {}
		}
		let point = canvas.createSVGPoint();
		point.x = eventX;
		point.y = eventY;
		for (let i = 0; i < wordCount; i++){
			try {
				let p = document.getElementById('tp'+i).getCharNumAtPosition(point);
				if (p != -1){
					pressMW(document.getElementById('tp'+i));
					return 0;
				}
			} catch {}
		}
	}
}

canvas.onmousemove = function (e){
	if (!erasing){
		let loc = cursorPoint(e);
		let eventX = Math.floor(loc.x), eventY = Math.floor(loc.y);
		if (action == 'move'){
			let path = document.getElementById(target);
			let points = path.getAttribute('d').split(' ');
			path.setAttribute('d', `M ${+(points[1])+eventX-details[0][0]} ${+(points[2])+eventY-details[0][1]} q ${points[4]} ${points[5]} ${points[6]} ${points[7]}`);
			details[0] = [eventX, eventY];
		} else if (action == 'stretch'){
			let path = document.getElementById(target);
			let points = path.getAttribute('d').split(' ');
			let s = getSize(document.getElementById('t'+target).innerHTML, !scaling?+document.getElementById('tp'+target.replace('p', '')).style.fontSize.replace('px', ''):64)[0];
			if (isNaN(s)){
				s = getSize(document.getElementById('t'+target).innerHTML, 32)[0];
			}
			if (pyth(points[1], points[2], eventX, eventY) > s){
				path.setAttribute('d', `M ${points[1]} ${points[2]} q ${xFromAng(0, details[0]*pyth(0, 0, eventX-points[1], eventY-points[2]), -angFromPoint(0, 0, eventX-points[1], eventY-points[2])+details[1])} ${yFromAng(0, details[0]*pyth(0, 0, eventX-points[1], eventY-points[2]), -angFromPoint(0, 0, eventX-points[1], eventY-points[2])+details[1])} ${eventX-points[1]} ${eventY-points[2]}`);
			} else {
				let ang = -angFromPoint(points[1], points[2], eventX, eventY);
				let x = xFromAng(0, s, ang), y = yFromAng(0, s, ang);
				path.setAttribute('d', `M ${points[1]} ${points[2]} q ${xFromAng(0, details[0]*pyth(0, 0, x, y), -angFromPoint(0, 0, x, y)+details[1])} ${yFromAng(0, details[0]*pyth(0, 0, x, y), -angFromPoint(0, 0, x, y)+details[1])} ${x} ${y}`);
			}
			points = path.getAttribute('d').split(' ');
			if (scaling){
				document.getElementById('tp'+target.replace('p', '')).style.fontSize = pyth(0, 0, points[6], points[7])/s*64 + "px";
			}
			document.getElementById('tp'+target.replace('p', '')).setAttribute("textLength", path.getTotalLength() + "px");
		} else if (action == 'bend'){
			let path = document.getElementById(target);
			let points = path.getAttribute('d').split(' ');
			let mid = [points[6]/2, points[7]/2];
			let radius = pyth(points[6], points[7], 0, 0);
			if (pyth(mid[0], mid[1], eventX-points[1], eventY-points[2])*1.5 < pyth(points[6], points[7], 0, 0)){
				path.setAttribute('d', `M ${points[1]} ${points[2]} q ${eventX-points[1]} ${eventY-points[2]} ${points[6]} ${points[7]}`);
			} else {
				path.setAttribute('d', `M ${points[1]} ${points[2]} q ${xFromAng(mid[0], radius/1.5, angFromPoint(mid[0], mid[1], eventX-points[1], eventY-points[2]))} ${yFromAng(mid[1], radius/1.5, -angFromPoint(mid[0], mid[1], eventX-points[1], eventY-points[2]))} ${points[6]} ${points[7]}`);
			}
			document.getElementById('tp'+target.replace('p', '')).setAttribute("textLength", path.getTotalLength() + "px");
		} else if (action == 'select'){
			let rect = document.getElementById('rectSelect');
			rect.setAttribute('x', Math.min(details[0][0], eventX));
			rect.setAttribute('y', Math.min(details[0][1], eventY));
			rect.setAttribute('width', Math.abs(details[0][0] - eventX));
			rect.setAttribute('height', Math.abs(details[0][1] - eventY));
		} else if (action == 'groupMove'){
			for (let i = 0; i < target.length; i++){
				let path = document.getElementById('p'+target[i]);
				let points = path.getAttribute('d').split(' ');
				path.setAttribute('d', `M ${+points[1]+eventX-details[0][0]} ${+points[2]+eventY-details[0][1]} q ${points[4]} ${points[5]} ${points[6]} ${points[7]}`);
			}
			details[0] = [eventX, eventY];
		} else if (action == 'groupRotate'){
			let moveCircle = document.getElementById('moveCircle'), ang = -angFromPoint(details[0][0], details[0][1], eventX, eventY);
			moveCircle.setAttribute('cx', xFromAng(details[0][0], 60, ang));
			moveCircle.setAttribute('cy', yFromAng(details[0][1], 60, ang));
			ang += Math.PI/2;
			for (let i = 0; i < target.length; i++){
				let path = document.getElementById('p'+target[i]);
				let x = xFromAng(details[0][0], details[1][0][i][0], details[1][1][i][0]+ang), y = yFromAng(details[0][1], details[1][0][i][0], details[1][1][i][0]+ang);
				path.setAttribute('d', `M ${x} ${y} q ${xFromAng(details[0][0], details[1][0][i][1], details[1][1][i][1]+ang)-x} ${yFromAng(details[0][1], details[1][0][i][1], details[1][1][i][1]+ang)-y} ${xFromAng(details[0][0], details[1][0][i][2], details[1][1][i][2]+ang)-x} ${yFromAng(details[0][1], details[1][0][i][2], details[1][1][i][2]+ang)-y}`);
			}
		} else if (action == 'groupSize'){
			let radius = details[4]+(eventX-details[5])/Math.cos(-details[3]);
			let mod = (radius/details[4]*2);
			let ok = 1;
			for (let i = 0; i < target.length && ok; i++){
				if (details[6][i][6]*mod < 55.59){
					ok = 0;
				}
			}
			if (ok){
				let rectScale = document.getElementById('rectScale');
				rectScale.setAttribute('x', xFromAng(details[1], radius, -details[3]) - 5);
				rectScale.setAttribute('y', yFromAng(details[2], radius, -details[3]) - 5);
				for (let i = 0; i < target.length; i++){
					let path = document.getElementById('p'+target[i]);
					path.setAttribute('d', `M ${details[1]+(details[6][i][0]-details[1])*mod} ${details[2]+(details[6][i][1]-details[2])*mod} q ${details[6][i][2]*mod} ${details[6][i][3]*mod} ${details[6][i][4]*mod} ${details[6][i][5]*mod}`);
					document.getElementById('tp'+target[i]).setAttribute("textLength", path.getTotalLength() + "px");
					document.getElementById('tp'+target[i]).style.fontSize = details[6][i][6]*mod + 'px';
				}
			}
		} else if (color != ''){
			document.getElementById('colorCircle').setAttribute('cx', eventX);
			document.getElementById('colorCircle').setAttribute('cy', eventY);
			document.getElementById('colorCircle').setAttribute('fill', color);
		}
	
		if (target != -1){
			if (typeof target == 'string'){
				let path = document.getElementById('d'+target);
				let points = document.getElementById(target).getAttribute('d').split(' ');
				for (let i = 0; i < points.length; i++){
					points[i] = +(points[i]);
				}
				let radius = pyth(points[1]+points[6], points[2]+points[7], points[1], points[2]), ang = -angFromPoint(points[1], points[2], points[1]+points[6], points[2]+points[7]);
				
				let exA = [
					xFromAng(points[1], radius*2, ang),
					yFromAng(points[2], radius*2,ang),
				];
	
				let exAa = [
					xFromAng(points[1], radius, ang + Math.PI/4),
					yFromAng(points[2], radius, ang + Math.PI/4),
				];
	
				ang = -angFromPoint(points[1]+points[6], points[2]+points[7], points[1], points[2]);
				
				let exB = [
					xFromAng(points[1]+points[6],radius*2, ang),
					yFromAng(points[2]+points[7],radius*2, ang),
				];
	
				path.setAttribute('d', `M ${points[1]} ${points[2]} q ${points[4]} ${points[5]} ${points[6]} ${points[7]} L ${exA[0]} ${exA[1]} L ${exAa[0]} ${exAa[1]} L ${exB[0]} ${exB[1]}`);
			} else {
				for (let i = 0; i < target.length; i++){
					let path = document.getElementById('dp'+target[i]);
					let points = document.getElementById('p'+target[i]).getAttribute('d').split(' ');
					for (let i = 0; i < points.length; i++){
						points[i] = +(points[i]);
					}
					let radius = pyth(points[1]+points[6], points[2]+points[7], points[1], points[2]), ang = -angFromPoint(points[1], points[2], points[1]+points[6], points[2]+points[7]);
					
					let exA = [
						xFromAng(points[1], radius*2, ang),
						yFromAng(points[2], radius*2,ang),
					];
	
					let exAa = [
						xFromAng(points[1], radius, ang + Math.PI/4),
						yFromAng(points[2], radius, ang + Math.PI/4),
					];
	
					ang = -angFromPoint(points[1]+points[6], points[2]+points[7], points[1], points[2]);
					
					let exB = [
						xFromAng(points[1]+points[6],radius*2, ang),
						yFromAng(points[2]+points[7],radius*2, ang),
					];
	
					path.setAttribute('d', `M ${points[1]} ${points[2]} q ${points[4]} ${points[5]} ${points[6]} ${points[7]} L ${exA[0]} ${exA[1]} L ${exAa[0]} ${exAa[1]} L ${exB[0]} ${exB[1]}`);
				}
			}
		}
	}
}

canvasBox.onmouseup = function (e){
	if (action == 'move'){
		totalWords--;
		currentWord++;
		let element = document.createElement('p');
		element.className = 'tbt';
		element.id = 'w'+currentWord;
		element.onmousedown = pressTE;
		element.innerHTML = document.getElementById(target.replace('p', 'tp')).innerHTML;
		canvasBox.appendChild(element);
		document.getElementById(target).remove();
		document.getElementById(target.replace('p', 't')).remove();
		document.getElementById(target.replace('p', 'dp')).remove();
		document.getElementById(target.replace('p', 'cp')).remove();
		document.getElementById(target.replace('p', 'c1')).remove();
		document.getElementById(target.replace('p', 'c2')).remove();
	} else if (action == 'groupMove'){
		for (let i = 0; i < target.length; i++){
			totalWords--;
			currentWord++;
			let element = document.createElement('p');
			element.className = 'tbt';
			element.id = 'w'+currentWord;
			element.onmousedown = pressTE;
			element.innerHTML = document.getElementById('tp'+target[i]).innerHTML;
			canvasBox.appendChild(element);
			document.getElementById('p'+target[i]).remove();
			document.getElementById('t'+target[i]).remove();
		}
	}
}

document.onkeydown = function (e){
	if (document.getElementById('canvasSide').style.display == 'flex'){
		if (currentWord == -1){
			currentWord = 0;
			let element = document.createElement('p');
			element.className = 'tbt';
			element.id = 'w'+currentWord;
			element.onmousedown = pressTE;
			canvasBox.appendChild(element);
		}
		let currentParh = document.getElementById('w'+currentWord);
		if ('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^*()_+=-[]{}\\|/~`÷<>\'?!":;.,-'.includes(e.key)){
			currentParh.innerText += e.key;
		} else if (e.key == " " && currentParh.innerText != ''){
			currentWord++;
			let element = document.createElement('p');
			element.className = 'tbt';
			element.id = 'w'+currentWord;
			element.onmousedown = pressTE;
			canvasBox.appendChild(element);
		} else if (e.key == 'Backspace'){
			let ok = true;
			while (ok){
				try {
					if (currentParh.innerText.length > 0){
						currentParh.innerText = currentParh.innerText.slice(0, -1);
					} else if (currentWord > -1){
						currentParh.remove();
						currentWord--;
					}
					ok = false;
				} catch {
					currentWord--;
					currentParh = document.getElementById('w'+currentWord);
				}
			}
		}
	} else {
		if (e.key == 'Backspace'){
			if (selectedMakerWord == -1){
				if (['.', ',', '?', '!', '"', '-', ':', ';', "'"].includes(document.getElementById('makerBox').lastChild.innerHTML.at(-1))){
					document.getElementById('makerBox').lastChild.innerText = document.getElementById('makerBox').lastChild.innerHTML.slice(0, -1);
				} else {
					document.getElementById('makerBox').lastChild.remove();
				}
			} else {
				document.getElementById('mw'+selectedMakerWord).remove();
				selectedMakerWord = -1;
				for (let i = 0; i <= currentMakerWord; i++){
					try {
						document.getElementById('mw'+i).style.color = '#000000';
					}  catch {}
				}
			}
		}
	}
}

document.getElementById('main').onmousemove = function (e){
	let loc = cursorPoint(e);
	let eventX = loc.x, eventY = loc.y;
	if (wordTarget != -1 && dragging){
		let element = document.getElementById(wordTarget);
		element.style.position = 'absolute';
		element.style.left = eventX+'px';
		element.style.top = eventY+'px';
	}
}

var colors = document.getElementsByClassName('clr');
var colorValues = {'Noun':'#0086ff', 'Pronoun':'#617fe8', 'Determiner':'#808080', 'Preposition':'#8025db', 'Adjective':'#07a807', 'Verb':'#de110d', 'Adverb':'#ff8a05', 'Connective':'#8a4b15', 'Undefined':'#000000'}

for (let i = 0; i < colors.length; i++){
	colors[i].onclick = function (){
		document.getElementById('color').value = colorValues[colors[i].innerText];
		color = document.getElementById('color').value;
		erasing = false;
		canvas.style.cursor = 'auto';
	}
}

for (let i = 0; i < 9; i++){
	document.getElementById(['?', '!', ',', '.', '"', '-', ';', ':', "'"][i]).onclick = function (e){
		if (selectedMakerWord == -1){
			document.getElementById('makerBox').lastChild.innerHTML += e.target.innerHTML;
		} else {
			document.getElementById('mw'+selectedMakerWord).innerHTML += e.target.innerHTML;
			selectedMakerWord = -1;
			for (let i = 0; i <= currentMakerWord; i++){
				try {
					document.getElementById('mw'+i).style.color = '#000000';
				} catch {}
			}
		}
	}
}

document.getElementById('color').oninput = function (){
	color = document.getElementById('color').value;
}

document.getElementById('scale').onclick = function (e){
	scaling = !scaling;
	e.target.innerHTML = e.target.innerHTML=='Scale'?'Stretch':'Scale';
}

document.getElementById('s1').onclick = function (){
	size = 0;
	changeStylesheetRule(s, ".tbt", "font-size", "2.1vw");changeStylesheetRule(s, ".tbt", "padding-left", "1.05vw");
	document.getElementById('s1').style.background = '#aaaaaa';
	document.getElementById('s2').style.background = '#f0f0f0';
	document.getElementById('s3').style.background = '#f0f0f0';
	document.getElementById('s4').style.background = '#f0f0f0';
}

document.getElementById('s2').onclick = function (){
	size = 1;
	changeStylesheetRule(s, ".tbt", "font-size", "3.045vw");changeStylesheetRule(s, ".tbt", "padding-left", "1.5225vw");
	document.getElementById('s2').style.background = '#aaaaaa';
	document.getElementById('s1').style.background = '#f0f0f0';
	document.getElementById('s3').style.background = '#f0f0f0';
	document.getElementById('s4').style.background = '#f0f0f0';
}

document.getElementById('s3').onclick = function (){
	size = 2;
	changeStylesheetRule(s, ".tbt", "font-size", "4.2vw");changeStylesheetRule(s, ".tbt", "padding-left", "2.1vw");
	document.getElementById('s3').style.background = '#aaaaaa';
	document.getElementById('s2').style.background = '#f0f0f0';
	document.getElementById('s1').style.background = '#f0f0f0';
	document.getElementById('s4').style.background = '#f0f0f0';
}

document.getElementById('s4').onclick = function (){
	size = 3;
	changeStylesheetRule(s, ".tbt", "font-size", "8.4vw");changeStylesheetRule(s, ".tbt", "padding-left", "4.2vw");
	document.getElementById('s4').style.background = '#aaaaaa';
	document.getElementById('s2').style.background = '#f0f0f0';
	document.getElementById('s3').style.background = '#f0f0f0';
	document.getElementById('s1').style.background = '#f0f0f0';
}

document.getElementById('bin').onclick = function (){
	erasing = true;
	canvas.style.cursor = 'crosshair';
	color = '';
	document.getElementById('colorCircle').setAttribute('cx', -100);
	document.getElementById('colorCircle').setAttribute('cy', -100);
}

document.getElementById('sttm').onclick = function (){
	document.getElementById('canvasSide').style.display = 'none';
	document.getElementById('makerSide').style.display = 'flex';
	document.getElementById('canvasBox').style.display = 'none';
	document.getElementById('makerBox').style.display = 'flex';
	changeStylesheetRule(s, 'use:hover', 'cursor', 'cell');
}

document.getElementById('stcm').onclick = function (){
	document.getElementById('makerSide').style.display = 'none';
	document.getElementById('canvasSide').style.display = 'flex';
	document.getElementById('makerBox').style.display = 'none';
	document.getElementById('canvasBox').style.display = 'flex';
	changeStylesheetRule(s, 'use:hover', 'cursor', 'grab');
}

document.getElementById('canvasSelector').onchange = function (){
	if (previous != +document.getElementById('canvasSelector').max){
		if (document.getElementById('makerBox').children.length > 0){
			let wordList = [], existingWords = [];
	
			for (let i = 0; i < wordCount; i++){
				try {
					wordList.push(new canvasWord(document.getElementById('t' + i))); // solve error regarding word deletion
					existingWords.push('t' + i);
				} catch {
					wordList.push(null);
				}
			}
	
			var textBoxWords = document.getElementById('makerBox').children;
	
			pages[previous-1] = new pageMaker(wordList, textBoxWords, pages[previous-1].rightness, existingWords);
		}
	} else {
		lastPage = [[], ''];
		var textBoxWords = document.getElementById('makerBox').children;
		if (textBoxWords.length){
			lastPage[1] = textBoxWords[0].innerText;
		}
		for (let i = 1; i < textBoxWords.length; i++){
			lastPage[1] += (textBoxWords[i].style.paddingLeft == '0vw'?'&':' ') + textBoxWords[i].innerHTML;
		}
		for (let i = 0; i < wordCount; i++){
			try {
				lastPage[0].push(new canvasWord(document.getElementById('t' + i))); // solve error regarding word deletion
			} catch {
				lastPage[0].push(null);
			}
		}
		
	}

	if (+document.getElementById('canvasSelector').value != +document.getElementById('canvasSelector').max){
		let id = +document.getElementById('canvasSelector').value;
		document.getElementById('yes').style.backgroundColor = '#f0f0f0';
		document.getElementById('no').style.backgroundColor = '#f0f0f0';
		if (pages[id-1].rightness){
			document.getElementById('yes').style.backgroundColor = '#aaaaaa';
		} else {
			document.getElementById('no').style.backgroundColor = '#aaaaaa';
		}
		
		let sentence = pages[id-1].sentence.split(/([& ])/g);
		document.getElementById('makerBox').innerHTML = '';
		currentMakerWord = 0;
		currentMakerWord++;
		let element = document.createElement('p');
		element.className = 'tbt';
		element.id = 'mw'+currentMakerWord;
		element.onmousedown = pressMWB;
		element.innerHTML = sentence[0];
		document.getElementById('makerBox').appendChild(element);

		for (let i = 2; i < sentence.length; i += 2){
			currentMakerWord++;
			element = document.createElement('p');
			element.className = 'tbt';
			element.id = 'mw'+currentMakerWord;
			element.onmousedown = pressMWB;
			element.innerHTML = sentence[i];
			if (sentence[i-1] == '&'){
				element.style.padding = '0px';
			}

			document.getElementById('makerBox').appendChild(element);
		}

		canvas.innerHTML = 
		`<rect id="rectSelect" x="100" y="100" rx="5" width="0" height="0" stroke="black" stroke-width="3" fill="#00000000" />
		<circle id="rotCircle" cx="-100" cy="-100" r="60" stroke="#000000a0" stroke-width="3" fill="#00000000" />
		<circle id="moveCircle" cx="-100" cy="-100" r="10" stroke="#303030" stroke-width="3" fill="#303030" />
		<circle id="colorCircle" cx="-100" cy="-100" r="10" stroke="#000000" stroke-width="2" fill="#ff0000" />
		<rect id="rectScale" x="-100" y="-100" width="20" height="20" stroke="#000000" stroke-width="2" fill="#98fb98" />
		<circle id="originScaleCircle" cx="-100" cy="-100" r="5" stroke="#000000" stroke-width="2" fill="#000000" />`

		wordCount = 0;

		for (let i = 0; i < pages[id-1].wordList.length; i++){
			if (pages[id-1].wordList[i] != null){
				canvas.innerHTML +=
				`<path id="p${wordCount}" d="M ${pages[id-1].wordList[i].start[0]} ${pages[id-1].wordList[i].start[1]} q ${pages[id-1].wordList[i].focus[0]} ${pages[id-1].wordList[i].focus[1]} ${pages[id-1].wordList[i].end[0]} ${pages[id-1].wordList[i].end[1]}" stroke="none" stroke-width="1" fill="none"></path>
				<text id="t${wordCount}" font-size="${pages[id-1].wordList[i].fontSize + "px"}">
					<textPath id="tp${wordCount}" class="pathText" alignment-baseline="middle" href="#p${wordCount}" startOffset="0%">${pages[id-1].wordList[i].content}</textPath>
				</text>
				<path id="dp${wordCount}" d="M ${pages[id-1].wordList[i].start[0]} ${pages[id-1].wordList[i].start[1]} q ${pages[id-1].wordList[i].focus[0]} ${pages[id-1].wordList[i].focus[1]} ${pages[id-1].wordList[i].end[0]} ${pages[id-1].wordList[i].end[1]} l 0 -172" stroke="none" stroke-width="1" fill="none"></path>
				<clipPath id="cp${wordCount}">
					<use href="#dp${wordCount}" />
				</clipPath>
				<use id="c1${wordCount}" href="#t${wordCount}" fill="${pages[id-1].wordList[i].topColor}" />
				<use id="c2${wordCount}" href="#t${wordCount}" fill="${pages[id-1].wordList[i].bottomColor}" clip-path="url(#cp${wordCount})" />`
				document.getElementById('tp'+wordCount).setAttribute("textLength", document.getElementById('p'+wordCount).getTotalLength() + "px");
				document.getElementById('tp'+wordCount).style.fontSize = pages[id-1].wordList[i].fontSize + "px";
				let path = document.getElementById('dp'+wordCount);
				let points = document.getElementById('p'+wordCount).getAttribute('d').split(' ');
				for (let i = 0; i < points.length; i++){
					points[i] = +(points[i]);
				}
				let radius = pyth(points[1]+points[6], points[2]+points[7], points[1], points[2]), ang = -angFromPoint(points[1], points[2], points[1]+points[6], points[2]+points[7]);
				
				let exA = [
					xFromAng(points[1], radius*2, ang),
					yFromAng(points[2], radius*2,ang),
				];

				let exAa = [
					xFromAng(points[1], radius, ang + Math.PI/4),
					yFromAng(points[2], radius, ang + Math.PI/4),
				];

				ang = -angFromPoint(points[1]+points[6], points[2]+points[7], points[1], points[2]);
				
				let exB = [
					xFromAng(points[1]+points[6],radius*2, ang),
					yFromAng(points[2]+points[7],radius*2, ang),
				];

				path.setAttribute('d', `M ${points[1]} ${points[2]} q ${points[4]} ${points[5]} ${points[6]} ${points[7]} L ${exA[0]} ${exA[1]} L ${exAa[0]} ${exAa[1]} L ${exB[0]} ${exB[1]}`);
				wordCount++;
			}
		}
	} else {
		let sentence = lastPage[1].split(/([& ])/g);
		document.getElementById('makerBox').innerHTML = '';
		currentMakerWord = 0;
		currentMakerWord++;
		let element = document.createElement('p');
		element.className = 'tbt';
		element.id = 'mw'+currentMakerWord;
		element.onmousedown = pressMWB;
		element.innerHTML = sentence[0];
		document.getElementById('makerBox').appendChild(element);

		for (let i = 2; i < sentence.length; i += 2){
			currentMakerWord++;
			element = document.createElement('p');
			element.className = 'tbt';
			element.id = 'mw'+currentMakerWord;
			element.onmousedown = pressMWB;
			element.innerHTML = sentence[i];
			if (sentence[i-1] == '&'){
				element.style.padding = '0px';
			}

			document.getElementById('makerBox').appendChild(element);
		}

		canvas.innerHTML = 
		`<rect id="rectSelect" x="100" y="100" rx="5" width="0" height="0" stroke="black" stroke-width="3" fill="#00000000" />
		<circle id="rotCircle" cx="-100" cy="-100" r="60" stroke="#000000a0" stroke-width="3" fill="#00000000" />
		<circle id="moveCircle" cx="-100" cy="-100" r="10" stroke="#303030" stroke-width="3" fill="#303030" />
		<circle id="colorCircle" cx="-100" cy="-100" r="10" stroke="#000000" stroke-width="2" fill="#ff0000" />
		<rect id="rectScale" x="-100" y="-100" width="20" height="20" stroke="#000000" stroke-width="2" fill="#98fb98" />
		<circle id="originScaleCircle" cx="-100" cy="-100" r="5" stroke="#000000" stroke-width="2" fill="#000000" />`
		wordCount = 0;
		document.getElementById('yes').style.backgroundColor = '#f0f0f0';
		document.getElementById('no').style.backgroundColor = '#f0f0f0';
		for (let i = 0; i < lastPage[0].length; i++){
			if (lastPage[0][i] != null){
				canvas.innerHTML +=
				`<path id="p${wordCount}" d="M ${lastPage[0][i].start[0]} ${lastPage[0][i].start[1]} q ${lastPage[0][i].focus[0]} ${lastPage[0][i].focus[1]} ${lastPage[0][i].end[0]} ${lastPage[0][i].end[1]}" stroke="none" stroke-width="1" fill="none"></path>
				<text id="t${wordCount}" font-size="${lastPage[0][i].fontSize + "px"}">
					<textPath id="tp${wordCount}" class="pathText" alignment-baseline="middle" href="#p${wordCount}" startOffset="0%">${lastPage[0][i].content}</textPath>
				</text>
				<path id="dp${wordCount}" d="M ${lastPage[0][i].start[0]} ${lastPage[0][i].start[1]} q ${lastPage[0][i].focus[0]} ${lastPage[0][i].focus[1]} ${lastPage[0][i].end[0]} ${lastPage[0][i].end[1]} l 0 -172" stroke="none" stroke-width="1" fill="none"></path>
				<clipPath id="cp${wordCount}">
					<use href="#dp${wordCount}" />
				</clipPath>
				<use id="c1${wordCount}" href="#t${wordCount}" fill="${lastPage[0][i].topColor}" />
				<use id="c2${wordCount}" href="#t${wordCount}" fill="${lastPage[0][i].bottomColor}" clip-path="url(#cp${wordCount})" />`
				document.getElementById('tp'+wordCount).setAttribute("textLength", document.getElementById('p'+wordCount).getTotalLength() + "px");
				document.getElementById('tp'+wordCount).style.fontSize = lastPage[0][i].fontSize + "px";
				let path = document.getElementById('dp'+wordCount);
				let points = document.getElementById('p'+wordCount).getAttribute('d').split(' ');
				for (let i = 0; i < points.length; i++){
					points[i] = +(points[i]);
				}
				let radius = pyth(points[1]+points[6], points[2]+points[7], points[1], points[2]), ang = -angFromPoint(points[1], points[2], points[1]+points[6], points[2]+points[7]);
				
				let exA = [
					xFromAng(points[1], radius*2, ang),
					yFromAng(points[2], radius*2,ang),
				];

				let exAa = [
					xFromAng(points[1], radius, ang + Math.PI/4),
					yFromAng(points[2], radius, ang + Math.PI/4),
				];

				ang = -angFromPoint(points[1]+points[6], points[2]+points[7], points[1], points[2]);
				
				let exB = [
					xFromAng(points[1]+points[6],radius*2, ang),
					yFromAng(points[2]+points[7],radius*2, ang),
				];

				path.setAttribute('d', `M ${points[1]} ${points[2]} q ${points[4]} ${points[5]} ${points[6]} ${points[7]} L ${exA[0]} ${exA[1]} L ${exAa[0]} ${exAa[1]} L ${exB[0]} ${exB[1]}`);
				wordCount++;
			}
		}
	}
	previous = +document.getElementById('canvasSelector').value;
}

document.getElementById('capitalise').onclick = function (){
	if (selectedMakerWord == -1){
		let text = document.getElementById('makerBox').lastChild;
		if (text.innerHTML[0] == text.innerHTML[0].toUpperCase()){
			text.innerHTML = text.innerHTML[0].toLowerCase() + text.innerHTML.slice(1);
		} else {
			text.innerHTML = text.innerHTML[0].toUpperCase() + text.innerHTML.slice(1);
		}
	} else {
		let text = document.getElementById('mw'+selectedMakerWord).innerHTML;
		if (text[0] == text[0].toUpperCase()){
			document.getElementById('mw'+selectedMakerWord).innerHTML = text[0].toLowerCase() + text.slice(1);
		} else {
			document.getElementById('mw'+selectedMakerWord).innerHTML = text[0].toUpperCase() + text.slice(1);
		}
		selectedMakerWord = -1;
		for (let i = 0; i <= currentMakerWord; i++){
			try {
				document.getElementById('mw'+i).style.color = '#000000';
			}  catch {}
		}
	}
}

document.getElementById('glue').onclick = function (){
	if (document.getElementById('makerBox').childElementCount > 1){
		let children = document.getElementById('makerBox').children;
		glueList.push([children[children.length-2].innerHTML.replace('.', '').replace(',', '').replace('?', '').replace('!', '').replace('"', '').replace('-', '').replace(';', '').replace(':', ''), children[children.length-1].innerHTML.replace('.', '').replace(',', '').replace('?', '').replace('!', '').replace('"', '').replace('-', '').replace(';', '').replace(':', '')]);
		for (let i = 1; i <= currentMakerWord; i++){
			if (document.getElementById('mw'+(i-1)) && document.getElementById('mw'+i)){
				if (glueList.at(-1)[0] == document.getElementById('mw'+(i-1)).innerHTML.replace('.', '').replace(',', '').replace('?', '').replace('!', '').replace('"', '').replace('-', '').replace(';', '').replace(':', '') && glueList.at(-1)[1] == document.getElementById('mw'+i).innerHTML.replace('.', '').replace(',', '').replace('?', '').replace('!', '').replace('"', '').replace('-', '').replace(';', '').replace(':', '')){
					if (document.getElementById('mw'+i).style.paddingLeft != '0vw'){
						document.getElementById('mw'+i).style.paddingLeft = '0vw';
					} else {
						document.getElementById('mw'+i).style.paddingLeft = '2.1vw';
						glueList.splice(-1, 1);
					}
				}
			}
		}
	}
}

function createPage(rightness){
	if (document.getElementById('canvasSelector').max == document.getElementById('canvasSelector').value){
		if (document.getElementById('makerBox').children.length > 0){
			document.getElementById('addLesson1').disabled = false;
			document.getElementById('addLesson2').disabled = false;
			document.getElementById('canvasSelector').max++;
			document.getElementById('canvasSelector').value++;
			previous = +document.getElementById('canvasSelector').value;
			let wordList = [], existingWords = [];
	
			for (let i = 0; i < wordCount; i++){
				try {
					wordList.push(new canvasWord(document.getElementById('t' + i))); // solve error regarding word deletion
					existingWords.push('t' + i);
				} catch {
					wordList.push(null);
				}
			}
	
			var textBoxWords = document.getElementById('makerBox').children;
	
			pages.push(new pageMaker(wordList, textBoxWords, rightness, existingWords));
			document.getElementById('makerBox').innerHTML = '';
		}
	} else {
		pages[+document.getElementById('canvasSelector').value-1].rightness = rightness;
		document.getElementById('yes').style.backgroundColor = '#f0f0f0';
		document.getElementById('no').style.backgroundColor = '#f0f0f0';
		if (pages[+document.getElementById('canvasSelector').value-1].rightness){
			document.getElementById('yes').style.backgroundColor = '#aaaaaa';
		} else {
			document.getElementById('no').style.backgroundColor = '#aaaaaa';
		}
	}
}

document.getElementById('yes').onclick = function (){
	createPage(true);
}

document.getElementById('no').onclick = function (){
	createPage(false);
}

document.getElementById('addLesson1').onclick = function (e){
	document.getElementById('addLesson').style.display = 'flex';
}

document.getElementById('addLesson2').onclick = function (e){
	document.getElementById('addLesson').style.display = 'flex';
}

function en(c){var x='charCodeAt',b,e={},f=c.split(""),d=[],a=f[0],g=256;for(b=1;b<f.length;b++)c=f[b],null!=e[a+c]?a+=c:(d.push(1<a.length?e[a]:a[x](0)),e[a+c]=g,g++,a=c);d.push(1<a.length?e[a]:a[x](0));for(b=0;b<d.length;b++)d[b]=String.fromCharCode(d[b]);return d.join("")}

function de(b){var f, o; var a,e={},d=b.split(""),c=f=d[0],g=[c],h=o=256;for(b=1;b<d.length;b++)a=d[b].charCodeAt(0),a=h>a?d[b]:e[a]?e[a]:f+c,g.push(a),c=a.charAt(0),e[o]=f+c,o++,f=a;return g.join("")}

document.getElementById('save').onclick = function (e){
	for (let i = 0; i < pages.length; i++){
		pages[i].compressAll();
	}
	var page = pages[0];
	
	var changes = '';
	
	for (let i = 0; i < page.wordList.length; i++){ // check for deleted words /////////////////////////////////////////////////////
		changes += '00' + page.wordList[i].comp;
	}
	
	changes += '11' + (page.rightness?'1':'0') + page.compressString(page.sentence);

	for (let i = 1; i < pages.length; i++){
		let wordNr = +pages[i].existingWords.at(-1).replace('t', '')+1;
		let currentWordId = 0;
		for (let j = 0; j < wordNr; j++){
			let first = pages[i].existingWords.includes('t' + j), second = pages[i-1].existingWords.includes('t' + j);
			if (first && second){ // the word still exists, so it either remained unchanged or was modified
				if (pages[i].wordList[j].comp != pages[i-1].wordList[j].comp){ // the word was modified; we need to see what parts were modified
					changes += '01' + ('000000'+currentWordId.toString(2)).slice(-6);
					let modifications = '';
					if (pages[i].wordList[j].start[0] != pages[i-1].wordList[j].start[0] || pages[i].wordList[j].start[1] != pages[i-1].wordList[j].start[1] || pages[i].wordList[j].focus[0] != pages[i-1].wordList[j].focus[0] || pages[i].wordList[j].focus[1] != pages[i-1].wordList[j].focus[1] || pages[i].wordList[j].end[0] != pages[i-1].wordList[j].end[0] || pages[i].wordList[j].end[1] != pages[i-1].wordList[j].end[1]){
						modifications += '1';
					} else {
						modifications += '0';
					}

					if (pages[i].wordList[j].topColor[0] != pages[i-1].wordList[j].topColor[0] || pages[i].wordList[j].topColor[1] != pages[i-1].wordList[j].topColor[1] || pages[i].wordList[j].topColor[2] != pages[i-1].wordList[j].topColor[2] || pages[i].wordList[j].bottomColor[0] != pages[i-1].wordList[j].bottomColor[0] || pages[i].wordList[j].bottomColor[1] != pages[i-1].wordList[j].bottomColor[1] || pages[i].wordList[j].bottomColor[2] != pages[i-1].wordList[j].bottomColor[2]){
						modifications += '1';
					} else {
						modifications += '0';
					}

					if (pages[i].wordList[j].fontSize != pages[i-1].wordList[j].fontSize){
						modifications += '1';
					} else {
						modifications += '0';
					}

					changes += modifications;

					if (modifications[0] == '1'){
						changes += pages[i].wordList[j].start[0] + pages[i].wordList[j].start[1] + pages[i].wordList[j].focus[0] + pages[i].wordList[j].focus[1] + pages[i].wordList[j].end[0] + pages[i].wordList[j].end[1];
					}
					if (modifications[1] == '1'){
						changes += pages[i].wordList[j].topColor[0] + pages[i].wordList[j].topColor[1] + pages[i].wordList[j].topColor[2] + pages[i].wordList[j].bottomColor[0] + pages[i].wordList[j].bottomColor[1] + pages[i].wordList[j].bottomColor[2];
					}
					if (modifications[2] == '1'){
						changes += pages[i].wordList[j].fontSize
					}
				} // else {} // the word still exists, so we increase currentWordId
				currentWordId++; // the word was found in both pages, so we increase the currentWordId
			} else if (!first && second){ // the word was in the first page, but not in the second page, so it must have been deleted
				changes += '10' + ('000000'+currentWordId.toString(2)).slice(-6);
				currentWordId++;
			} else if (first && !second){ // the word can be found in the second page, but it never existed in the first page, so it must have been added now
				changes += '00' + pages[i].wordList[j].comp;
			} // else {} //the word existed at some point in the second page, however it was deleted, so we ignore it since it is like nothing happened
		}
		changes += '11' + (pages[i].rightness?'1':'0') + pages[i].compressString(pages[i].sentence);
	}

	for (let i = (8-changes.length%8)%8; i; i--){
		changes += '0';
	}

	let changeString = '';

	for (let i = 0; i < changes.length; i += 8){
		changeString += String.fromCharCode(parseInt(changes.slice(i, i+8), 2));
	}

	changeString = en(changeString);

	setDoc(doc(db, "tempWork/", document.getElementById('lessonName').value), {"v": changeString}).then(p => {
		window.location.href = '../../home';
	});
}

async function loadLesson(){
	if (params.q != null){
		let changes = [], poz = 0;
		try {
			await getDoc(doc(db, "tempWork/", params.q)).then(dat => {
				dat = de(dat.data()['v']);
		
				let bin = '';
				
				for (let i = 0; i < dat.length; i++){
					let char = dat.charCodeAt(i).toString(2);
					bin += '0'.repeat(8-char.length)+char.toString(2);
				}
				
				
				while (bin.slice(bin.length-7, bin.length) != '1100000'){
					bin = bin.slice(0, -1);
				}

				console.log(bin);

				document.getElementById('addLesson1').disabled = false;
				document.getElementById('addLesson2').disabled = false;
				
				changes[0] = {'words':[], 'rightness':true, 'sentence':''};
				for (let i = 0; poz < bin.length; i++){
					if (i){
						changes[i] = {'words':[], 'rightness':true, 'sentence':''};
						let j = 0;
						for (j = 0; j < changes[i-1].words.length; j++){
							if (changes[i-1].words[j] == null){
								changes[i].words.push(null);
							} else {
								changes[i].words.push({});
								changes[i].words[j].top = [changes[i-1].words[j].top[0], changes[i-1].words[j].top[1], changes[i-1].words[j].top[2]];
								changes[i].words[j].bottom = [changes[i-1].words[j].bottom[0], changes[i-1].words[j].bottom[1], changes[i-1].words[j].bottom[2]];
								changes[i].words[j].start = [changes[i-1].words[j].start[0], changes[i-1].words[j].start[1]];
								changes[i].words[j].focus = [changes[i-1].words[j].focus[0], changes[i-1].words[j].focus[1]];
								changes[i].words[j].end = [changes[i-1].words[j].end[0], changes[i-1].words[j].end[1]];
								changes[i].words[j].size = changes[i-1].words[j].size;
								changes[i].words[j].content = changes[i-1].words[j].content;
							}
							
						}
					}
					while (bin.slice(poz, poz+2) != '11'){
						switch (bin.slice(poz, poz+2)){
							case '00':
								let word = {'top':[parseInt(bin.slice(poz+2, poz+6), 2)*16, parseInt(bin.slice(poz+6, poz+10), 2)*16, parseInt(bin.slice(poz+10, poz+14), 2)*16], 'bottom':[parseInt(bin.slice(poz+14, poz+18), 2)*16, parseInt(bin.slice(poz+18, poz+22), 2)*16, parseInt(bin.slice(poz+22, poz+26), 2)*16], 'start':[parseInt(bin.slice(poz+26, poz+33), 2)*16, parseInt(bin.slice(poz+33, poz+39), 2)*16], 'focus':[parseInt(bin.slice(poz+39, poz+46), 2)*16, parseInt(bin.slice(poz+46, poz+52), 2)*16], 'end':[parseInt(bin.slice(poz+52, poz+59), 2)*16, parseInt(bin.slice(poz+59, poz+65), 2)*16], 'size':parseInt(bin.slice(poz+65, poz+73), 2)*4, 'content':''};
								poz += 73;
								while (bin.slice(poz, poz+7) != '1100000'){
									word.content += characters[parseInt(bin.slice(poz, poz+7), 2)];
									poz += 7;
								}
								poz += 7;
								changes[i].words.push(word);
								break;
							case '01':
								let occured = bin.slice(poz+8, poz+11), target = parseInt(bin.slice(poz+2, poz+8), 2);
								poz += 11;
								if (occured[0] == '1'){
									changes[i].words[target].start = [parseInt(bin.slice(poz, poz+7), 2)*16, parseInt(bin.slice(poz+7, poz+13), 2)*16];
									changes[i].words[target].focus = [parseInt(bin.slice(poz+13, poz+20), 2)*16, parseInt(bin.slice(poz+20, poz+26), 2)*16];
									changes[i].words[target].end = [parseInt(bin.slice(poz+26, poz+33), 2)*16, parseInt(bin.slice(poz+33, poz+39), 2)*16];
									poz += 39;
								}
								if (occured[1] == '1'){
									changes[i].words[target].top = [parseInt(bin.slice(poz, poz+4), 2)*16, parseInt(bin.slice(poz+4, poz+8), 2)*16, parseInt(bin.slice(poz+8, poz+12), 2)*16];
									changes[i].words[target].bottom = [parseInt(bin.slice(poz+12, poz+16), 2)*16, parseInt(bin.slice(poz+16, poz+20), 2)*16, parseInt(bin.slice(poz+20, poz+24), 2)*16];
									poz += 24;
								}
								if (occured[2] == '1'){
									changes[i].words[target].size = parseInt(bin.slice(poz, poz+8), 2)*4;
									poz += 8;
								}
								break;
							case '10':
								changes[i].words[parseInt(bin.slice(poz+2, poz+8), 2)] = null;
								poz += 8;
								break;
						}
					}
					changes[i].rightness = (bin[poz+2]=='1'?true:false);
					poz += 3;
					while (bin.slice(poz, poz+7) != '1100000'){
						changes[i].sentence += characters[parseInt(bin.slice(poz, poz+7), 2)];
						poz += 7;
					}
					poz += 7;
				}
				for (let i = 0; i < changes.length; i++){
					let wordList = [], existingWords = [];
					for (let j = 0; j < changes[i].words.length; j++){
						if (changes[i].words[j] != null){
							wordList.push(new canvasWord([changes[i].words[j].content, [changes[i].words[j].start[0], changes[i].words[j].start[1]], [changes[i].words[j].focus[0]-changes[i].words[j].start[0], changes[i].words[j].focus[1]-changes[i].words[j].start[1]], [changes[i].words[j].end[0]-changes[i].words[j].start[0], changes[i].words[j].end[1]-changes[i].words[j].start[1]], '#'+('00'+changes[i].words[j].top[0].toString(16)).slice(-2)+('00'+changes[i].words[j].top[1].toString(16)).slice(-2)+('00'+changes[i].words[j].top[2].toString(16)).slice(-2), '#'+('00'+changes[i].words[j].bottom[0].toString(16)).slice(-2)+('00'+changes[i].words[j].bottom[1].toString(16)).slice(-2)+('00'+changes[i].words[j].bottom[2].toString(16)).slice(-2), changes[i].words[j].size]));
							existingWords.push('t'+j);
						}
					}
					pages.push(new pageMaker(wordList, changes[i].sentence, changes[i].rightness, existingWords));
					document.getElementById('canvasSelector').max++;
					document.getElementById('canvasSelector').value++;
				}
				previous = +document.getElementById('canvasSelector').max;
				canvas.innerHTML = 
				`<rect id="rectSelect" x="100" y="100" rx="5" width="0" height="0" stroke="black" stroke-width="3" fill="#00000000" />
				<circle id="rotCircle" cx="-100" cy="-100" r="60" stroke="#000000a0" stroke-width="3" fill="#00000000" />
				<circle id="moveCircle" cx="-100" cy="-100" r="10" stroke="#303030" stroke-width="3" fill="#303030" />
				<circle id="colorCircle" cx="-100" cy="-100" r="10" stroke="#000000" stroke-width="2" fill="#ff0000" />
				<rect id="rectScale" x="-100" y="-100" width="20" height="20" stroke="#000000" stroke-width="2" fill="#98fb98" />
				<circle id="originScaleCircle" cx="-100" cy="-100" r="5" stroke="#000000" stroke-width="2" fill="#000000" />`
				wordCount = 0;
				let id = +document.getElementById('canvasSelector').max-1;
				for (let i = 0; i < pages[id-1].wordList.length; i++){
					if (pages[id-1].wordList[i] != null){
						canvas.innerHTML +=
						`<path id="p${wordCount}" d="M ${pages[id-1].wordList[i].start[0]} ${pages[id-1].wordList[i].start[1]} q ${pages[id-1].wordList[i].focus[0]} ${pages[id-1].wordList[i].focus[1]} ${pages[id-1].wordList[i].end[0]} ${pages[id-1].wordList[i].end[1]}" stroke="none" stroke-width="1" fill="none"></path>
						<text id="t${wordCount}" font-size="${pages[id-1].wordList[i].fontSize + "px"}">
							<textPath id="tp${wordCount}" class="pathText" alignment-baseline="middle" href="#p${wordCount}" startOffset="0%">${pages[id-1].wordList[i].content}</textPath>
						</text>
						<path id="dp${wordCount}" d="M ${pages[id-1].wordList[i].start[0]} ${pages[id-1].wordList[i].start[1]} q ${pages[id-1].wordList[i].focus[0]} ${pages[id-1].wordList[i].focus[1]} ${pages[id-1].wordList[i].end[0]} ${pages[id-1].wordList[i].end[1]} l 0 -172" stroke="none" stroke-width="1" fill="none"></path>
						<clipPath id="cp${wordCount}">
							<use href="#dp${wordCount}" />
						</clipPath>
						<use id="c1${wordCount}" href="#t${wordCount}" fill="${pages[id-1].wordList[i].topColor}" />
						<use id="c2${wordCount}" href="#t${wordCount}" fill="${pages[id-1].wordList[i].bottomColor}" clip-path="url(#cp${wordCount})" />`
						document.getElementById('tp'+wordCount).setAttribute("textLength", document.getElementById('p'+wordCount).getTotalLength() + "px");
						document.getElementById('tp'+wordCount).style.fontSize = pages[id-1].wordList[i].fontSize + "px";
						let path = document.getElementById('dp'+wordCount);
						let points = document.getElementById('p'+wordCount).getAttribute('d').split(' ');
						for (let i = 0; i < points.length; i++){
							points[i] = +(points[i]);
						}
						let radius = pyth(points[1]+points[6], points[2]+points[7], points[1], points[2]), ang = -angFromPoint(points[1], points[2], points[1]+points[6], points[2]+points[7]);
						
						let exA = [
							xFromAng(points[1], radius*2, ang),
							yFromAng(points[2], radius*2,ang),
						];

						let exAa = [
							xFromAng(points[1], radius, ang + Math.PI/4),
							yFromAng(points[2], radius, ang + Math.PI/4),
						];

						ang = -angFromPoint(points[1]+points[6], points[2]+points[7], points[1], points[2]);
						
						let exB = [
							xFromAng(points[1]+points[6],radius*2, ang),
							yFromAng(points[2]+points[7],radius*2, ang),
						];

						path.setAttribute('d', `M ${points[1]} ${points[2]} q ${points[4]} ${points[5]} ${points[6]} ${points[7]} L ${exA[0]} ${exA[1]} L ${exAa[0]} ${exAa[1]} L ${exB[0]} ${exB[1]}`);
						wordCount++;
					}
				}
			});
		} catch (e) {
			if (e.name == 'TypeError'){
				console.log(e);
				alert("The page you were trying to load does not exist or something else happened. An empty canvas will be loaded instead.");
			} else {
				console.log(changes);
				throw e;
			}
		}
	}
}

loadLesson();

*/

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

/*
000
*/