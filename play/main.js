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
        window.location.href = '../../logup';
    }
});

const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
});

const db = getFirestore(firebaseApp);

var numberOfPages = 0, pageNumber = 1;

var s = document.styleSheets[0];

var timer;

var canvas = document.getElementById('cnv');
var canvasBox = document.getElementById('canvasBox');

var characters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '@', '#', '$', '%', '^', '*', '(', ')', '_', '+', '=', '-', '[', ']', '{', '}', '\\', '|', '/', '~', '`', '÷', '<', '>', ' ', '&', '.', ',', '?', '!', ':', ';', '"', "'"]

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

function pyth (x1, y1, x2, y2){
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
	document.body.style.cursor = 'cell';
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

canvas.onmousedown = function (e){
	if (document.getElementById('stcm').innerHTML == "Answer"){
		let loc = cursorPoint(e);
		selectedMakerWord = -1;
		for (let i = 0; i <= currentMakerWord; i++){
			try {
				document.getElementById('mw'+i).style.color = '#000000';
			}  catch {}
		}
		let point = canvas.createSVGPoint();
		point.x = loc.x;
		point.y = loc.y;
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

document.onkeydown = function (e){
	if (e.key == 'Backspace' && document.getElementById('stcm').innerHTML == "Answer"){
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

function changeCanvas(){
	if (true){
		let id = +pageNumber;
		
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
		console.log(lastPage);
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
	console.log(previous, 555);
	previous = +pageNumber;
}

document.getElementById('capitalise').onclick = function (){
	if (document.getElementById('stcm').innerHTML == "Answer"){
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
}

document.getElementById('glue').onclick = function (){
	if (document.getElementById('makerBox').childElementCount > 1 && document.getElementById('stcm').innerHTML == "Answer"){
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

//function en(c){var x='charCodeAt',b,e={},f=c.split(""),d=[],a=f[0],g=256;for(b=1;b<f.length;b++)c=f[b],null!=e[a+c]?a+=c:(d.push(1<a.length?e[a]:a[x](0)),e[a+c]=g,g++,a=c);d.push(1<a.length?e[a]:a[x](0));for(b=0;b<d.length;b++)d[b]=String.fromCharCode(d[b]);return d.join("")}

function de(b){var f, o; var a,e={},d=b.split(""),c=f=d[0],g=[c],h=o=256;for(b=1;b<d.length;b++)a=d[b].charCodeAt(0),a=h>a?d[b]:e[a]?e[a]:f+c,g.push(a),c=a.charAt(0),e[o]=f+c,o++,f=a;return g.join("")}

document.getElementById('stcm').onclick = function(){
	switch (document.getElementById('stcm').innerHTML){
		case "Solve":
			document.getElementById('stcm').innerHTML = "Answer";
			document.getElementById('makerBox').innerHTML = "";
			break;

		case "Answer":
			let textBoxWords = document.getElementById('makerBox').children;
			document.getElementById('tries').innerHTML = +document.getElementById('tries').innerHTML+1;
			let ans = textBoxWords[0].innerText;
			for (let i = 1; i < textBoxWords.length; i++){
				ans += (textBoxWords[i].style.paddingLeft == '0vw'?'&':' ') + textBoxWords[i].innerHTML;
			}
			if (pageNumber == numberOfPages){
				if (ans == pages[pageNumber-1].sentence){
					document.getElementById('rightness').innerHTML = '✓';
					document.getElementById('rightness').style.color = "#00f000";
					document.getElementById('stcm').innerHTML = "Finish";
					document.getElementById('correct').innerHTML = +document.getElementById('correct').innerHTML+1;
				} else {
					document.getElementById('rightness').innerHTML = '✗';
					document.getElementById('rightness').style.color = "#f00000";
					document.getElementById('stcm').innerHTML = "Finish";
					document.getElementById('try').style.display = 'block';
				}
			} else {
				if (ans == pages[pageNumber-1].sentence){
					document.getElementById('rightness').innerHTML = '✓';
					document.getElementById('rightness').style.color = "#00f000";
					document.getElementById('stcm').innerHTML = "Next";
					document.getElementById('correct').innerHTML = +document.getElementById('correct').innerHTML+1;
				} else {
					document.getElementById('rightness').innerHTML = '✗';
					document.getElementById('rightness').style.color = "#f00000";
					document.getElementById('stcm').innerHTML = "Next";
					document.getElementById('try').style.display = 'block';
				}
			}
			break;

		case "Next":
			document.getElementById('try').style.display = 'none';
			if (document.getElementById('rightness').innerHTML == '✗'){
				document.getElementById('wrong').innerHTML = +document.getElementById('wrong').innerHTML+1;
			}
			document.getElementById('stcm').innerHTML = "Solve";
			document.getElementById('rightness').innerHTML = '?';
			document.getElementById('rightness').style.color = "#000000";
			document.getElementById('qNo').innerHTML = +document.getElementById('qNo').innerHTML+1;
			pageNumber++;
			changeCanvas();
			break;

		case "Finish":
			let dict = {};
			dict[document.getElementById('namee').value] = [+document.getElementById('correct').innerHTML, +document.getElementById('wrong').innerHTML, +document.getElementById('tries').innerHTML, (Date.now() - timer)/1000];
			updateDoc(doc(db, "Activities/", params.q), dict).then(p => {
				window.location.href = '../../home';
			});
			break;
	}
}

document.getElementById('try').onclick = function(){
	document.getElementById('try').style.display = 'none';
	document.getElementById("stcm").innerHTML = "Answer";
	document.getElementById('rightness').innerHTML = '?';
	document.getElementById('rightness').style.color = "#000000";
}

async function loadLesson(){
	if (params.q != null){
		let changes = [], poz = 0;
		try {
			await getDoc(doc(db, "Activities/", params.q)).then(async dat2 => {
				dat2 = dat2.data()['target'];
				await getDoc(doc(db, "tempWork/", dat2)).then(dat => {
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
					console.log(changes);
					for (let i = 0; i < changes.length; i++){
						let wordList = [], existingWords = [];
						for (let j = 0; j < changes[i].words.length; j++){
							if (changes[i].words[j] != null){
								wordList.push(new canvasWord([changes[i].words[j].content, [changes[i].words[j].start[0], changes[i].words[j].start[1]], [changes[i].words[j].focus[0]-changes[i].words[j].start[0], changes[i].words[j].focus[1]-changes[i].words[j].start[1]], [changes[i].words[j].end[0]-changes[i].words[j].start[0], changes[i].words[j].end[1]-changes[i].words[j].start[1]], '#'+('00'+changes[i].words[j].top[0].toString(16)).slice(-2)+('00'+changes[i].words[j].top[1].toString(16)).slice(-2)+('00'+changes[i].words[j].top[2].toString(16)).slice(-2), '#'+('00'+changes[i].words[j].bottom[0].toString(16)).slice(-2)+('00'+changes[i].words[j].bottom[1].toString(16)).slice(-2)+('00'+changes[i].words[j].bottom[2].toString(16)).slice(-2), changes[i].words[j].size]));
								existingWords.push('t'+j);
							}
						}
						pages.push(new pageMaker(wordList, changes[i].sentence, changes[i].rightness, existingWords));
						numberOfPages++;
						pageNumber++;
					}
					console.log(numberOfPages, "KKKKKKKKKKK")
					previous = +numberOfPages;
					canvas.innerHTML = 
					`<rect id="rectSelect" x="100" y="100" rx="5" width="0" height="0" stroke="black" stroke-width="3" fill="#00000000" />
					<circle id="rotCircle" cx="-100" cy="-100" r="60" stroke="#000000a0" stroke-width="3" fill="#00000000" />
					<circle id="moveCircle" cx="-100" cy="-100" r="10" stroke="#303030" stroke-width="3" fill="#303030" />
					<circle id="colorCircle" cx="-100" cy="-100" r="10" stroke="#000000" stroke-width="2" fill="#ff0000" />
					<rect id="rectScale" x="-100" y="-100" width="20" height="20" stroke="#000000" stroke-width="2" fill="#98fb98" />
					<circle id="originScaleCircle" cx="-100" cy="-100" r="5" stroke="#000000" stroke-width="2" fill="#000000" />`
					console.log(pages)
					wordCount = 0;
					let id = +numberOfPages-1;
					console.log(id, "```");
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

loadLesson().then(x => {
	pageNumber = 1;
	document.getElementById('qTotal').innerHTML = numberOfPages;
	timer = Date.now();
	changeCanvas();
});

/*
//increase arrow size and put them on the sides _/
//Only delete punctuation first _/
//Make the cursor lighter, thinner, make it flashing and make it not apear when typing a non-canvas character _/
//for the moment, remove cursor _/
//When hovering over words, in the canvas maker the cursor should be a grabber and in the text maker it should be a big plus _/
//Disable the save button until at least one sentence was added _/
//Copy link button _/
//Add lessons button in home _/
//Add create lesson button _/
//Disable classes _/
//Future Idea: Add animations between canvas transitions (accelerating and then decelerating); creation and deletion of words is made by fading

Make read and remember:
1. Words apear in the textBox _/
2. The textbox words dissapear and the canvas words were always there _/
3. When you're ready, you click next and clear the textBox and now the canvas words are faded and when you click on them you need to recreate the text box and then submit. If you do it correct, then you pause for a second and then the next sentence automatically loads. If you get it wrong, there's a red X and then you may reset and redo the sentence
4. Repeat
For the read & remember: We have to store Time to solve, how many answers they got wrong
When you start an activity, let students add a name and then start
On the teacher's dashboard, you will see name, score etc
*/