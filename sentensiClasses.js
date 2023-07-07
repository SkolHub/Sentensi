export class sentensiCanvas {
	constructor (){
		this.characters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '@', '#', '$', '%', '^', '*', '(', ')', '_', '+', '=', '-', '[', ']', '{', '}', '\\', '|', '/', '~', '`', '÷', '<', '>', ' ', '&', '.', ',', '?', '!', ':', ';', '"', "'"];
		this.colorValues = {'Noun':'#0086ff', 'Pronoun':'#617fe8', 'Determiner':'#808080', 'Preposition':'#8025db', 'Adjective':'#07a807', 'Verb':'#de110d', 'Adverb':'#ff8a05', 'Connective':'#8a4b15', 'Undefined':'#000000'}
		this.wordComponents = [];
		this.currentWord = -1;
		this.currentMakerWord = -1;
		this.wordCount = 0;
		this.action = '';
		this.target = -1;
		this.dragging = false;
		this.details = [];
		this.scaling = false;
		this.selectedMakerWord = -1;
		this.glueList = [];
		this.color = '';
		this.initSize = 109.22;
		this.pages = [];
		this.totalWords = 0;
		this.erasing = false;
		this.doubleColor = false;
		this.canvasMode = true;
	}

	changeStylesheetRule(stylesheet, selector, property, value) {
		selector = selector.toLowerCase();
		property = property.toLowerCase();
		value = value.toLowerCase();
		for(var i = 0; i < stylesheet.cssRules.length; i++) {
			var rule = stylesheet.cssRules[i];
			if(rule.selectorText === selector) {
				rule.style[property] = value;
				return;
			}
		}
		stylesheet.insertRule(selector + " { " + property + ": " + value + "; }", 0);
	}

	resetTools(moveCircle, rotCircle, rect, rectScale, originScaleCircle, colorCircle){
		if (moveCircle){
			this.moveCircle.setAttribute('cx', -100);
			this.moveCircle.setAttribute('cy', -100);
		}
		if (rotCircle){
			this.rotCircle.setAttribute('cx', -100);
			this.rotCircle.setAttribute('cy', -100);
		}
		if (rect){
			this.rect.setAttribute('x', -10);
			this.rect.setAttribute('y', -10);
			this.rect.setAttribute('width', 0);
			this.rect.setAttribute('height', 0);
		}
		if (rectScale){
			this.rectScale.setAttribute('x', -100);
			this.rectScale.setAttribute('y', -100);
		}
		if (originScaleCircle){
			this.originScaleCircle.setAttribute('cx', +this.rect.getAttribute('x'));
			this.originScaleCircle.setAttribute('cy', +this.rect.getAttribute('y'));
		}
		if (colorCircle){
			this.colorCircle.setAttribute('cx', -100);
			this.colorCircle.setAttribute('cy', -100);
		}
	}

	deleteWord(id){
		document.getElementById(`p${id}`).remove();
		document.getElementById(`t${id}`).remove();
		document.getElementById(`dp${id}`).remove();
		document.getElementById(`cp${id}`).remove();
		document.getElementById(`c1${id}`).remove();
		document.getElementById(`c2${id}`).remove();
	}

	createWord(id, startX, startY, focusX, focusY, endX, endY, fontSize, content, topColor="#000000", bottomColor="#000000"){
		this.canvas.innerHTML += 
			`<path id="p${id}" d="M ${startX} ${startY} q ${focusX} ${focusY} ${endX} ${endY}" stroke="none" stroke-width="1" fill="none"></path>
			<text id="t${id}" font-size="${fontSize}">
				<textPath id="tp${id}" class="pathText" style="font-size: ${fontSize}" alignment-baseline="middle" href="#p${id}" startOffset="0%">${content}</textPath>
			</text>
			<path id="dp${id}" d="M ${startX} ${startY} q ${focusX} ${focusY} ${endX} ${endY} l 0 -172" stroke="none" stroke-width="1" fill="none"></path>
			<clipPath id="cp${id}">
				<use href="#dp${id}" />
			</clipPath>
			<use id="c1${id}" href="#t${id}" fill="${topColor}" />
			<use id="c2${id}" href="#t${id}" fill="${bottomColor}" clip-path="url(#cp${id})" />
			`
	}

	initMakerWord(){ // Update so that it also works for the other places
		let element = document.createElement('p');
		element.className = 'tbt';
		element.id = 'w'+this.currentWord;
		element.onmousedown = this.pressTE.bind(this);
		this.canvasBox.appendChild(element);
	}

	resetCanvas(){
		this.canvas.innerHTML = `<rect id="rectSelect" x="100" y="100" rx="5" width="0" height="0" stroke="black" stroke-width="3" fill="#00000000" />
			<circle id="rotCircle" cx="-100" cy="-100" r="60" stroke="#000000a0" stroke-width="3" fill="#00000000" />
			<circle id="moveCircle" cx="-100" cy="-100" r="10" stroke="#303030" stroke-width="3" fill="#303030" />
			<circle id="colorCircle" cx="-100" cy="-100" r="10" stroke="#000000" stroke-width="2" fill="#ff0000" />
			<rect id="rectScale" x="-100" y="-100" width="20" height="20" stroke="#000000" stroke-width="2" fill="#98fb98" />
			<circle id="originScaleCircle" cx="-100" cy="-100" r="5" stroke="#000000" stroke-width="2" fill="#000000" />`
	}

	resetMakerBox(){
		this.makerBox.innerHTML = '';
	}

	stringfyMakerBox(){
		let textBoxWords = this.makerBox.children;
		let sentence = textBoxWords[0].innerText;
		for (let i = 1; i < textBoxWords.length; i++){
			sentence += (textBoxWords[i].style.paddingLeft == '0vw'?'&':' ') + textBoxWords[i].innerHTML;
		}
		return sentence;
	}

	updateClipPath(id){
		let path = document.getElementById(`dp${id}`);
		let points = document.getElementById(`p${id}`).getAttribute('d').split(' ');
		for (let i = 0; i < points.length; i++){
			points[i] = +points[i];
		}
		let radius = this.pyth(points[1]+points[6], points[2]+points[7], points[1], points[2]), ang = -this.angFromPoint(points[1], points[2], points[1]+points[6], points[2]+points[7]);
		
		let exA = [
			this.xFromAng(points[1], radius*2, ang),
			this.yFromAng(points[2], radius*2,ang),
		];

		let exAa = [
			this.xFromAng(points[1], radius, ang + Math.PI/4),
			this.yFromAng(points[2], radius, ang + Math.PI/4),
		];

		ang = -this.angFromPoint(points[1]+points[6], points[2]+points[7], points[1], points[2]);
		
		let exB = [
			this.xFromAng(points[1]+points[6],radius*2, ang),
			this.yFromAng(points[2]+points[7],radius*2, ang),
		];

		path.setAttribute('d', `M ${points[1]} ${points[2]} q ${points[4]} ${points[5]} ${points[6]} ${points[7]} L ${exA[0]} ${exA[1]} L ${exAa[0]} ${exAa[1]} L ${exB[0]} ${exB[1]}`);
	}

	setSize(size, styleSheet){
		this.changeStylesheetRule(styleSheet, ".tbt", "font-size", `${size}vw`);
		this.changeStylesheetRule(styleSheet, ".tbt", "padding-left", `${size/2}vw`);
	}

	getSize(text, mod = 64){
		let measure = document.getElementById('mes');
		measure.innerHTML = text;
		return [+(measure.clientWidth + 1)*mod/64, +(measure.clientHeight + 1)*mod/64];
	}

	pyth(x1, y1, x2, y2){
		return Math.sqrt((x1-x2)**2 + (y1-y2)**2);
	}

	angFromPoint(originX, originY, pointX, pointY){
		let ang = Math.asin((originY-pointY)/this.pyth(originX, originY, pointX, pointY));
		if (pointY <= originY && pointX <= originX){
			return Math.PI - ang;
		} else if (pointY >= originY && pointX <= originX){
			return -Math.PI - ang;
		}
		return ang;
	}

	xFromAng(origin, radius, angle){
		let r = origin+radius*Math.cos(angle);
		return isNaN(r)?origin:r;
	}

	yFromAng(origin, radius, angle){
		let r = origin+radius*Math.sin(angle);
		return isNaN(r)?origin:r;
	}

	contained(x, y, lx, ly, w, h){
		return x >= lx && x <= lx+w && y >= ly && y <= ly+h;
	}

	canvasBoxMouseUp(){
		if (this.action == 'move'){
			this.totalWords--;
			this.currentWord++;
			let element = document.createElement('p');
			element.className = 'tbt';
			element.id = 'w'+this.currentWord;
			element.onmousedown = this.pressTE.bind(this);
			element.innerHTML = document.getElementById(this.target.replace('p', 'tp')).innerHTML;
			this.canvasBox.appendChild(element);
			this.deleteWord(this.target.replace('p', ''));
			this.action = '';
			this.target = -1;
		} else if (this.action == 'groupMove'){
			for (let i = 0; i < this.target.length; i++){
				this.totalWords--;
				this.currentWord++;
				let element = document.createElement('p');
				element.className = 'tbt';
				element.id = 'w'+this.currentWord;
				element.onmousedown = this.pressTE.bind(this);
				element.innerHTML = document.getElementById('tp'+this.target[i]).innerHTML;
				canvasBox.appendChild(element);
				this.deleteWord(this.target[i]);
			}
			this.action = '';
			this.target = -1;
		}
	}

	documentMakerKeyDown(e){
		if (this.currentWord == -1){
			this.currentWord = 0;
			this.initMakerWord();
		}
		let currentParh = document.getElementById('w'+this.currentWord);
		if ('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^*()_+=-[]{}\\|/~`÷<>\'?!":;.,-'.includes(e.key)){
			currentParh.innerText += e.key;
		} else if (e.key == " " && currentParh.innerText != ''){
			this.currentWord++;
			this.initMakerWord();
		} else if (e.key == 'Backspace'){
			while (1){
				try {
					if (currentParh.innerText.length > 0){
						currentParh.innerText = currentParh.innerText.slice(0, -1);
					} else if (this.currentWord > -1){
						currentParh.remove();
						this.currentWord--;
					}
					return;
				} catch {
					this.currentWord--;
					currentParh = document.getElementById('w'+this.currentWord);
				}
			}
		}
	}

	documentTextKeyDown(e){
		if (e.key == 'Backspace' && this.makerBox.innerHTML.trim() != ""){
			if (this.selectedMakerWord == -1){
				if (".,?!\"-:;'".includes(this.makerBox.lastChild.innerHTML.at(-1))){
					this.makerBox.lastChild.innerText = this.makerBox.lastChild.innerHTML.slice(0, -1);
				} else {
					this.makerBox.lastChild.remove();
				}
			} else {
				document.getElementById('mw'+this.selectedMakerWord).remove();
				this.selectedMakerWord = -1;
				for (let i = 0; i <= this.currentMakerWord; i++){
					try {
						document.getElementById('mw'+i).style.color = '#000000';
					}  catch {}
				}
			}
		}
	}

	canvasMouseUp() {
		document.body.style.cursor = 'default';
		if (this.action == 'select'){
			let words = [];
			for (let i = 0; i < this.wordCount; i++){
				try {
					let path = document.getElementById('p'+i);
					let points = path.getAttribute('d').split(' ');
					let x = +(this.rect.getAttribute('x')), y = +(this.rect.getAttribute('y')), width = +(this.rect.getAttribute('width')), height = +(this.rect.getAttribute('height'));
					if (this.contained(+points[1], +points[2], x, y, width, height)||this.contained(+points[1]+ +points[6], +points[2]+ +points[7], x, y, width, height)){
						words.push(i);
					}
				} catch {}
			}
			if (words.length){
				this.target = words;
				let medX = 0, medY = 0, nr = 0;
				for (let i = 0; i < this.target.length; i++){
					let path = document.getElementById('p'+this.target[i]);
					let points = path.getAttribute('d').split(' ');
					medX += 3*+points[1]+ +points[4]+ +points[6];
					medY += 3*+points[2]+ +points[5]+ +points[7];
					nr += 3;
				}
				this.rotCircle.setAttribute('cx', medX/nr);
				this.rotCircle.setAttribute('cy', medY/nr);
				this.moveCircle.setAttribute('cx', medX/nr);
				this.moveCircle.setAttribute('cy', medY/nr-60);
				this.rectScale.setAttribute('x', +this.rect.getAttribute('x') + +this.rect.getAttribute('width') - 10);
				this.rectScale.setAttribute('y', +this.rect.getAttribute('y') + +this.rect.getAttribute('height') - 10);
			} else {
				this.target = -1;
			}
		} else if (this.action == 'groupMove' || this.action == 'groupRotate' || this.action == 'groupSize') {
			this.target = -1;
			this.resetTools(1, 1, 1, 1, 1, 1);
		} else {
			this.target = -1;
		}
		this.action = '';
	}

	canvasMakerMouseDown(e){
		let loc = this.cursorPoint(e);
		let eventX = loc.x, eventY = loc.y;
		if (this.color != ''){
			this.pt.x = eventX, this.pt.y = eventY;
			for (let i = 0; i < this.wordCount; i++){
				if (document.getElementById('tp'+i).getCharNumAtPosition(this.pt) != -1){
					if (this.doubleColor){
						document.getElementById('c2'+i).setAttribute('fill', document.getElementById('c1'+i).getAttribute('fill'));
					} else {
						document.getElementById('c2'+i).setAttribute('fill', this.color);
					}
					document.getElementById('c1'+i).setAttribute('fill', this.color);
					return;
				}
			}
			this.color = '';
			this.resetTools(1, 1, 1, 1, 1, 1);
		} else if (this.erasing){
			this.pt.x = eventX, this.pt.y = eventY;
			for (let i = 0; i < this.wordCount; i++){
				try {
					if (document.getElementById('tp'+i).getCharNumAtPosition(this.pt) != -1){
						this.deleteWord(i);
						return;
					}
				} catch {}
			}
			this.erasing = 0;
			this.canvas.style.cursor = 'auto';
			this.resetTools(1, 1, 1, 1, 1, 1);
		} else if (this.contained(eventX, eventY, +this.rectScale.getAttribute('x'), +this.rectScale.getAttribute('y'), 20, 20)){
			this.details = [this.pyth(+this.rect.getAttribute('x'), +this.rect.getAttribute('y'), +this.rectScale.getAttribute('x') + 10, +this.rectScale.getAttribute('y') + 10), +this.rect.getAttribute('x'), +this.rect.getAttribute('y'), this.angFromPoint(+this.rect.getAttribute('x'), +this.rect.getAttribute('y'), +this.rect.getAttribute('x') + +this.rect.getAttribute('width'), +this.rect.getAttribute('y') + +this.rect.getAttribute('height')), this.pyth(+this.rect.getAttribute('x'), +this.rect.getAttribute('y'), +this.rectScale.getAttribute('x') + +this.rect.getAttribute('width'), +this.rectScale.getAttribute('y') + +this.rect.getAttribute('height')), +this.rectScale.getAttribute('x') + +this.rect.getAttribute('width'), []];
			this.originScaleCircle.setAttribute('cx', +this.rect.getAttribute('x'));
			this.originScaleCircle.setAttribute('cy', +this.rect.getAttribute('y'));
			this.action = 'groupSize';
			for (let i = 0; i < this.target.length; i++){
				let points = document.getElementById('p'+this.target[i]).getAttribute('d').split(' ');
				this.details[6].push([+points[1], +points[2], +points[4], +points[5], +points[6], +points[7], +document.getElementById('tp'+this.target[i]).style.fontSize.replace('px', '')]);
			}
			this.resetTools(1, 1, 1, 0, 0, 1);
		} else if (this.pyth(eventX, eventY, +this.moveCircle.getAttribute('cx'), +this.moveCircle.getAttribute('cy')) <= 10){
			this.action = 'groupRotate';
			this.details = [[+this.rotCircle.getAttribute('cx'), +this.rotCircle.getAttribute('cy')], [[], []]];
			for (let i = 0; i < this.target.length; i++){
				let path = document.getElementById('p'+this.target[i]);
				let points = path.getAttribute('d').split(' ');
				for (let j = 0; j < points.length; j++){
					points[j] = +points[j];
				}
				this.details[1][0].push([
					this.pyth(this.details[0][0], this.details[0][1], points[1], points[2]),
					this.pyth(this.details[0][0], this.details[0][1], points[1]+points[4], points[2]+points[5]),
					this.pyth(this.details[0][0], this.details[0][1], points[1]+points[6], points[2]+points[7])
				]);
				this.details[1][1].push([
					-this.angFromPoint(this.details[0][0], this.details[0][1], points[1], points[2]),
					-this.angFromPoint(this.details[0][0], this.details[0][1], points[1]+points[4], points[2]+points[5]),
					-this.angFromPoint(this.details[0][0], this.details[0][1], points[1]+points[6], points[2]+points[7])
				]);
			}
			this.resetTools(0, 0, 1, 1, 1, 1);
		} else if (this.contained(eventX, eventY, +this.rect.getAttribute('x'), +this.rect.getAttribute('y'), +this.rect.getAttribute('width'), +this.rect.getAttribute('height'))){
			this.action = 'groupMove';
			this.details = [[eventX, eventY]];
			this.resetTools(1, 1, 1, 1, 1, 1);
		} else {
			this.pt.x = eventX, this.pt.y = eventY;
			for (let i = 0; i < this.wordCount; i++){
				try {
					let p = document.getElementById('tp'+i).getCharNumAtPosition(this.pt);
					if (p != -1){
						this.pressWD(document.getElementById('tp'+i), p, e);
						return 0;
					}
				} catch {}
			}
			this.action = 'select';
			this.details = [eventX, eventY];
			this.resetTools(1, 1, 1, 1, 1, 1);
		}
	}

	canvasTextMouseDown(e){
		let loc = this.cursorPoint(e);
		let eventX = loc.x, eventY = loc.y;
		this.selectedMakerWord = -1;
		for (let i = 0; i <= this.currentMakerWord; i++){
			try {
				document.getElementById('mw'+i).style.color = '#000000';
			}  catch {}
		}
		this.pt.x = eventX, this.pt.y = eventY;
		for (let i = 0; i < this.wordCount; i++){
			try {
				if (document.getElementById('tp'+i).getCharNumAtPosition(this.pt) != -1){
					this.pressMW(document.getElementById('tp'+i));
					return;
				}
			} catch {}
		}
	}

	canvasMouseMove(e){
		let loc = this.cursorPoint(e);
		let eventX = loc.x, eventY = loc.y;
		var path, points, radius, ang;
		switch (this.action){
			case 'move':
				path = document.getElementById(this.target);
				points = path.getAttribute('d').split(' ');
				path.setAttribute('d', `M ${+points[1]+eventX-this.details[0]} ${+points[2]+eventY-this.details[1]} q ${points[4]} ${points[5]} ${points[6]} ${points[7]}`);
				this.details = [eventX, eventY];
				break;

			case 'stretch':
				path = document.getElementById(this.target); 
				let textPath = document.getElementById('tp'+this.target.replace('p', ''));
				points = path.getAttribute('d').split(' ');
				let s = this.getSize(document.getElementById('t'+this.target).innerHTML, !this.scaling?+textPath.style.fontSize.replace('px', ''):64)[0];
				let x, y, d;
				if (isNaN(s)){
					s = this.getSize(document.getElementById('t'+this.target).innerHTML, 32)[0];
				}
				if (this.pyth(points[1], points[2], eventX, eventY) > s){
					x = eventX-points[1], y = eventY-points[2];
				} else {
					ang = -this.angFromPoint(points[1], points[2], eventX, eventY);
					x = this.xFromAng(0, s, ang), y = this.yFromAng(0, s, ang);
				}
				d = this.pyth(0, 0, x, y), ang = -this.angFromPoint(0, 0, x, y)+this.details[1];
				path.setAttribute('d', `M ${points[1]} ${points[2]} q ${this.xFromAng(0, this.details[0]*d, ang)} ${this.yFromAng(0, this.details[0]*d, ang)} ${x} ${y}`);
				if (this.scaling){
					textPath.style.fontSize = this.pyth(0, 0, x, y)/s*64 + "px";
				}
				textPath.setAttribute("textLength", path.getTotalLength() + "px");
				break;

			case 'bend':
				path = document.getElementById(this.target);
				points = path.getAttribute('d').split(' ');
				let mid = [points[6]/2, points[7]/2];
				radius = this.pyth(points[6], points[7], 0, 0)/1.5;
				if (this.pyth(mid[0], mid[1], eventX-points[1], eventY-points[2]) < radius){
					path.setAttribute('d', `M ${points[1]} ${points[2]} q ${eventX-points[1]} ${eventY-points[2]} ${points[6]} ${points[7]}`);
				} else {
					ang = this.angFromPoint(mid[0], mid[1], eventX-points[1], eventY-points[2]);
					path.setAttribute('d', `M ${points[1]} ${points[2]} q ${this.xFromAng(mid[0], radius, ang)} ${this.yFromAng(mid[1], radius, -ang)} ${points[6]} ${points[7]}`);
				}
				document.getElementById('tp'+this.target.replace('p', '')).setAttribute("textLength", path.getTotalLength() + "px");
				break;

			case 'select':
				this.rect.setAttribute('x', Math.min(this.details[0], eventX));
				this.rect.setAttribute('y', Math.min(this.details[1], eventY));
				this.rect.setAttribute('width', Math.abs(this.details[0] - eventX));
				this.rect.setAttribute('height', Math.abs(this.details[1] - eventY));
				break;

			case 'groupMove':
				for (let i = 0; i < this.target.length; i++){
					let path = document.getElementById('p'+this.target[i]);
					let points = path.getAttribute('d').split(' ');
					path.setAttribute('d', `M ${+points[1]+eventX-this.details[0][0]} ${+points[2]+eventY-this.details[0][1]} q ${points[4]} ${points[5]} ${points[6]} ${points[7]}`);
				}
				this.details[0] = [eventX, eventY];
				break;

			case 'groupRotate':
				ang = -this.angFromPoint(this.details[0][0], this.details[0][1], eventX, eventY);
				this.moveCircle.setAttribute('cx', this.xFromAng(this.details[0][0], 60, ang));
				this.moveCircle.setAttribute('cy', this.yFromAng(this.details[0][1], 60, ang));
				ang += Math.PI/2;
				for (let i = 0; i < this.target.length; i++){
					let x = this.xFromAng(this.details[0][0], this.details[1][0][i][0], this.details[1][1][i][0]+ang), y = this.yFromAng(this.details[0][1], this.details[1][0][i][0], this.details[1][1][i][0]+ang);
					document.getElementById('p'+this.target[i]).setAttribute('d', `M ${x} ${y} q ${this.xFromAng(this.details[0][0], this.details[1][0][i][1], this.details[1][1][i][1]+ang)-x} ${this.yFromAng(this.details[0][1], this.details[1][0][i][1], this.details[1][1][i][1]+ang)-y} ${this.xFromAng(this.details[0][0], this.details[1][0][i][2], this.details[1][1][i][2]+ang)-x} ${this.yFromAng(this.details[0][1], this.details[1][0][i][2], this.details[1][1][i][2]+ang)-y}`);
				}
				break;

			case 'groupSize':
				radius = this.details[4]+(eventX-this.details[5])/Math.cos(-this.details[3]);
				let mod = radius/this.details[4]*2;
				for (let i = 0; i < this.target.length; i++){
					if (this.details[6][i][6]*mod < 55.59){
						return;
					}
				}
				this.rectScale.setAttribute('x', this.xFromAng(this.details[1], radius, -this.details[3]) - 5);
				this.rectScale.setAttribute('y', this.yFromAng(this.details[2], radius, -this.details[3]) - 5);
				for (let i = 0; i < this.target.length; i++){
					let path = document.getElementById('p'+this.target[i]);
					path.setAttribute('d', `M ${this.details[1]+(this.details[6][i][0]-this.details[1])*mod} ${this.details[2]+(this.details[6][i][1]-this.details[2])*mod} q ${this.details[6][i][2]*mod} ${this.details[6][i][3]*mod} ${this.details[6][i][4]*mod} ${this.details[6][i][5]*mod}`);
					document.getElementById('tp'+this.target[i]).setAttribute("textLength", path.getTotalLength() + "px");
					document.getElementById('tp'+this.target[i]).style.fontSize = this.details[6][i][6]*mod + 'px';
				}
				break;

			default:
				if (this.color != ''){
					this.colorCircle.setAttribute('cx', eventX);
					this.colorCircle.setAttribute('cy', eventY);
					this.colorCircle.setAttribute('fill', this.color);
				}
				break;
		}
		if (this.target != -1){
			if (typeof this.target == 'string'){
				this.updateClipPath(this.target.replace('p', ''));
			} else {
				for (let i = 0; i < this.target.length; i++){
					this.updateClipPath(this.target[i]);
				}
			}
		}
	}

	pressWD(word, p, e){
		let loc = this.cursorPoint(e);
		let eventX = Math.floor(loc.x), eventY = Math.floor(loc.y);
		this.target = word.id.replace('tp', 'p');
		if (p == 0){
			this.action = 'move';
			this.details = [eventX, eventY];
		} else if (p == word.innerHTML.length-1){
			this.action = 'stretch';
			let path = document.getElementById(this.target);
			let points = path.getAttribute('d').split(' ');
			for (let i = 0; i < points.length; i++){
				points[i] = +(points[i]);
			}
			this.details = [Math.sqrt(points[4]**2 + points[5]**2)/Math.sqrt(points[6]**2 + points[7]**2), -this.angFromPoint(0, 0, points[4], points[5])+this.angFromPoint(0, 0, eventX-points[1], eventY-points[2])];
		} else {
			this.action = 'bend';
		}
		document.body.style.cursor = 'grab';
	}

	pressTE (e){
		if (this.totalWords > 63){
			alert("You may only have a maximum of 64 words on the canvas!");
			return;
		}
		let loc = this.cursorPoint(e);
		let eventX = loc.x, eventY = loc.y;
		this.createWord(this.wordCount, eventX, eventY, this.getSize(e.target.innerText, this.initSize)[0]/2, 0, this.getSize(e.target.innerText, this.initSize)[0], 0, this.initSize + "px", e.target.innerText)
		this.pressWD(document.getElementById(`tp${this.wordCount}`), 0, e);
		this.wordCount++;
		this.totalWords++;
		e.target.remove();
		this.currentWord = (this.canvasBox.children.length > 0)?this.canvasBox.lastElementChild.id.replace('w', ''):-1;
		this.rectScale = document.getElementById('rectScale');
		this.rect = document.getElementById('rectSelect');
		this.moveCircle = document.getElementById('moveCircle');
		this.rotCircle = document.getElementById('rotCircle');
		this.originScaleCircle = document.getElementById('originScaleCircle');
		this.colorCircle = document.getElementById('colorCircle');
	}

	pressMW (word){
		this.currentMakerWord++;
		let element = document.createElement('p');
		element.className = 'tbt', element.id = 'mw'+this.currentMakerWord, element.onmousedown = this.pressMWB.bind(this), element.innerHTML = word.innerHTML;
		this.makerBox.appendChild(element);
		for (let i = 1; i <= this.currentMakerWord; i++){
			if (document.getElementById(`mw${i-1}`) && document.getElementById(`mw${i}`)){
				for (let j = 0; j < this.glueList.length; j++){
					if (this.glueList[j][0] == document.getElementById(`mw${i-1}`).innerHTML && this.glueList[j][1] == document.getElementById(`mw${i}`).innerHTML){
						document.getElementById('mw'+i).style.paddingLeft = '0vw';
					}
				}
			}
		}
	}

	pressMWB(e){
		this.selectedMakerWord = e.target.id.replace('mw', '');
		for (let i = 0; i <= this.currentMakerWord; i++){
			if (i != this.selectedMakerWord){
				try {
					document.getElementById('mw'+i).style.color = '#000000a0';
				} catch {}
			}
		}
		document.getElementById('mw'+this.selectedMakerWord).style.color = '#000000';
	}

	selectPage(pageNumber){
		let page = this.pages[pageNumber].wordList;
		this.resetCanvas();
		this.wordCount = 0;
		for (let i = 0; i < page.length; i++){
			if (page[i] != null){
				this.createWord(this.wordCount, page[i].start[0], page[i].start[1], page[i].focus[0], page[i].focus[1], page[i].end[0], page[i].end[1], page[i].fontSize + "px", page[i].content, page[i].topColor, page[i].bottomColor);
				document.getElementById('tp'+this.wordCount).setAttribute("textLength", document.getElementById('p'+this.wordCount).getTotalLength() + "px");
				document.getElementById('tp'+this.wordCount).style.fontSize = page[i].fontSize + "px";
				this.updateClipPath(this.wordCount);
				this.wordCount++;
			}
		}
		if (this.pages[pageNumber].sentence){
			let sentence = this.pages[pageNumber].sentence.split(/([& ])/g);
			this.makerBox.innerHTML = '';
			this.currentMakerWord = 1;
			let element = document.createElement('p');
			element.className = 'tbt', element.id = 'mw'+this.currentMakerWord, element.onmousedown = this.pressMWB, element.innerHTML = sentence[0];
			this.makerBox.appendChild(element);
			for (let i = 2; i < sentence.length; i += 2){
				this.currentMakerWord++;
				element = document.createElement('p');
				element.className = 'tbt', element.id = 'mw'+this.currentMakerWord, element.onmousedown = this.pressMWB, element.innerHTML = sentence[i];
				if (sentence[i-1] == '&'){
					element.style.padding = '0px';
				}
				this.makerBox.appendChild(element);
			}
		}
	}

	capitalise(){
		if (this.selectedMakerWord == -1){
			let text = this.makerBox.lastChild;
			if (text.innerHTML[0] == text.innerHTML[0].toUpperCase()){
				text.innerHTML = text.innerHTML[0].toLowerCase() + text.innerHTML.slice(1);
			} else {
				text.innerHTML = text.innerHTML[0].toUpperCase() + text.innerHTML.slice(1);
			}
		} else {
			let text = document.getElementById('mw'+this.selectedMakerWord).innerHTML;
			if (text[0] == text[0].toUpperCase()){
				document.getElementById('mw'+this.selectedMakerWord).innerHTML = text[0].toLowerCase() + text.slice(1);
			} else {
				document.getElementById('mw'+this.selectedMakerWord).innerHTML = text[0].toUpperCase() + text.slice(1);
			}
			this.selectedMakerWord = -1;
			for (let i = 0; i <= this.currentMakerWord; i++){
				try {
					document.getElementById('mw'+i).style.color = '#000000';
				}  catch {}
			}
		}
	}

	glue(){
		if (this.makerBox.childElementCount > 1){
			let children = this.makerBox.children;
			this.glueList.push([children[children.length-2].innerHTML.replace('.', '').replace(',', '').replace('?', '').replace('!', '').replace('"', '').replace('-', '').replace(';', '').replace(':', ''), children[children.length-1].innerHTML.replace('.', '').replace(',', '').replace('?', '').replace('!', '').replace('"', '').replace('-', '').replace(';', '').replace(':', '')]);
			for (let i = 1; i <= this.currentMakerWord; i++){
				if (document.getElementById('mw'+(i-1)) && document.getElementById('mw'+i)){
					if (this.glueList.at(-1)[0] == document.getElementById('mw'+(i-1)).innerHTML.replace('.', '').replace(',', '').replace('?', '').replace('!', '').replace('"', '').replace('-', '').replace(';', '').replace(':', '') && this.glueList.at(-1)[1] == document.getElementById('mw'+i).innerHTML.replace('.', '').replace(',', '').replace('?', '').replace('!', '').replace('"', '').replace('-', '').replace(';', '').replace(':', '')){
						if (document.getElementById('mw'+i).style.paddingLeft != '0vw'){
							document.getElementById('mw'+i).style.paddingLeft = '0vw';
						} else {
							document.getElementById('mw'+i).style.paddingLeft = '2.1vw';
							this.glueList.splice(-1, 1);
						}
					}
				}
			}
		}
	}

	addPunctuation(chr){
		if (this.selectedMakerWord == -1){
			this.makerBox.lastChild.innerHTML += chr;
		} else {
			document.getElementById('mw'+this.selectedMakerWord).innerHTML += chr;
			this.selectedMakerWord = -1;
			for (let i = 0; i <= this.currentMakerWord; i++){
				try {
					document.getElementById('mw'+i).style.color = '#000000';
				} catch {}
			}
		}
	}

	en(c){var x='charCodeAt',b,e={},f=c.split(""),d=[],a=f[0],g=256;for(b=1;b<f.length;b++)c=f[b],null!=e[a+c]?a+=c:(d.push(1<a.length?e[a]:a[x](0)),e[a+c]=g,g++,a=c);d.push(1<a.length?e[a]:a[x](0));for(b=0;b<d.length;b++)d[b]=String.fromCharCode(d[b]);return d.join("")}

	de(b){var f,o;var a,e={},d=b.split(""),c=f=d[0],g=[c],h=o=256;for(b=1;b<d.length;b++)a=d[b].charCodeAt(0),a=h>a?d[b]:e[a]?e[a]:f+c,g.push(a),c=a.charAt(0),e[o]=f+c,o++,f=a;return g.join("")}

	currentPage(type, typeData){
		let wordList = [], existingWords = [];
		for (let i = 0; i < this.wordCount; i++){
			try {
				wordList.push(new canvasWord(document.getElementById('t' + i))); // solve error "regarding word deletion"
				existingWords.push('t' + i); // I think this is what solved the "error regarding word deletion"
			} catch {
				wordList.push(null);
			}
		}
		var textBoxWords = this.makerBox.children;
		return new pageMaker(wordList, textBoxWords, existingWords, type, typeData);
	}

	save(){
		for (let i = 0; i < this.pages.length; i++){
			this.pages[i].compressAll();
		}
		var page = this.pages[0];
		var changes = '';
		for (let i = 0; i < page.wordList.length; i++){ // check for deleted words /////////////////////////////////////////////////////
			changes += '00' + page.wordList[i].comp;
		}
		changes += '11';
		switch (page.type){
			case "Remember & write":
				changes += '0000';
				break;

			case "Listen & write":
				changes += '0001' + this.compressString(page.typeData);
				break;

			case "Right & wrong":
				changes += '0010' + (page.typeData?'1':'0');
				break;
		}
		console.log(page.sentence);
		 changes += this.compressString(page.sentence);
	
		for (let i = 1; i < this.pages.length; i++){
			let wordNr = +this.pages[i].existingWords.at(-1).replace('t', '')+1;
			let currentWordId = 0;
			for (let j = 0; j < wordNr; j++){
				let first = this.pages[i].existingWords.includes('t' + j), second = this.pages[i-1].existingWords.includes('t' + j);
				if (first && second){ // the word still exists, so it either remained unchanged or was modified
					if (this.pages[i].wordList[j].comp != this.pages[i-1].wordList[j].comp){ // the word was modified; we need to see what parts were modified
						changes += '01' + ('000000'+currentWordId.toString(2)).slice(-6);
						let modifications = '';
						if (this.pages[i].wordList[j].start[0] != this.pages[i-1].wordList[j].start[0] || this.pages[i].wordList[j].start[1] != this.pages[i-1].wordList[j].start[1] || this.pages[i].wordList[j].focus[0] != this.pages[i-1].wordList[j].focus[0] || this.pages[i].wordList[j].focus[1] != this.pages[i-1].wordList[j].focus[1] || this.pages[i].wordList[j].end[0] != this.pages[i-1].wordList[j].end[0] || this.pages[i].wordList[j].end[1] != this.pages[i-1].wordList[j].end[1]){
							modifications += '1';
						} else {
							modifications += '0';
						}
						if (this.pages[i].wordList[j].topColor[0] != this.pages[i-1].wordList[j].topColor[0] || this.pages[i].wordList[j].topColor[1] != this.pages[i-1].wordList[j].topColor[1] || this.pages[i].wordList[j].topColor[2] != this.pages[i-1].wordList[j].topColor[2] || this.pages[i].wordList[j].bottomColor[0] != this.pages[i-1].wordList[j].bottomColor[0] || this.pages[i].wordList[j].bottomColor[1] != this.pages[i-1].wordList[j].bottomColor[1] || this.pages[i].wordList[j].bottomColor[2] != this.pages[i-1].wordList[j].bottomColor[2]){
							modifications += '1';
						} else {
							modifications += '0';
						}
						if (this.pages[i].wordList[j].fontSize != this.pages[i-1].wordList[j].fontSize){
							modifications += '1';
						} else {
							modifications += '0';
						}
						changes += modifications;
						if (modifications[0] == '1'){
							changes += this.pages[i].wordList[j].start[0] + this.pages[i].wordList[j].start[1] + this.pages[i].wordList[j].focus[0] + this.pages[i].wordList[j].focus[1] + this.pages[i].wordList[j].end[0] + this.pages[i].wordList[j].end[1];
						}
						if (modifications[1] == '1'){
							changes += this.pages[i].wordList[j].topColor[0] + this.pages[i].wordList[j].topColor[1] + this.pages[i].wordList[j].topColor[2] + this.pages[i].wordList[j].bottomColor[0] + this.pages[i].wordList[j].bottomColor[1] + this.pages[i].wordList[j].bottomColor[2];
						}
						if (modifications[2] == '1'){
							changes += this.pages[i].wordList[j].fontSize;
						}
					} // else {} // the word still exists, so we increase currentWordId
					currentWordId++; // the word was found in both pages, so we increase the currentWordId
				} else if (!first && second){ // the word was in the first page, but not in the second page, so it must have been deleted
					changes += '10' + ('000000'+currentWordId.toString(2)).slice(-6);
					currentWordId++;
				} else if (first && !second){ // the word can be found in the second page, but it never existed in the first page, so it must have been added now
					changes += '00' + this.pages[i].wordList[j].comp;
				} // else {} //the word existed at some point in the second page, however it was deleted, so we ignore it since it is like nothing happened
			}
			changes += '11';
			console.log(6969)
			switch (this.pages[i].type){
				case "Remember & write":
					console.log(0)
					changes += '0000';
					break;

				case "Listen & write":
					console.log(1)
					changes += '0001' + this.compressString(this.pages[i].typeData);
					break;

				case "Right & wrong":
					console.log(2)
					changes += '0010' + (this.pages[i].typeData?'1':'0');
					console.log('0010' + (this.pages[i].typeData?'1':'0'));
					break;
			}
			changes += this.compressString(this.pages[i].sentence);
		}
		for (let i = (8-changes.length%8)%8; i; i--){
			changes += '0';
		}
		console.log(changes);
		let changeString = '';
		for (let i = 0; i < changes.length; i += 8){
			changeString += String.fromCharCode(parseInt(changes.slice(i, i+8), 2));
		}
		console.log(changeString, this.en(changeString))
		return this.en(changeString);
	}
	
	loadLesson(dat){
		//Inits and parsing data
		let changes = [], poz = 0;
		let bin = '';
		for (let i = 0; i < dat.length; i++){
			let char = dat.charCodeAt(i).toString(2);
			bin += '0'.repeat(8-char.length)+char.toString(2);
		}
		while (bin.slice(bin.length-7, bin.length) != '1100000'){
			bin = bin.slice(0, -1);
		}
		changes[0] = {'words':[], 'sentence':'', 'type':null, 'typeData':null};
		//Starting to format data
		for (let i = 0; poz < bin.length; i++){
			if (i){
				changes[i] = {'words':[], 'sentence':'', 'type':null, 'typeData':null};
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
							word.content += this.characters[parseInt(bin.slice(poz, poz+7), 2)];
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
			console.log(bin.slice(poz+2, poz+6));
			switch (bin.slice(poz+2, poz+6)){
				case '0000':
					changes[i].type = "Remember & write";
					changes[i].typeData = null;
					poz += 6;
					break;

				case '0001':
					changes[i].type = "Listen & write";
					poz += 6;
					changes[i].typeData = "";
					while (bin.slice(poz, poz+7) != '1100000'){
						changes[i].typeData += this.characters[parseInt(bin.slice(poz, poz+7), 2)];
						poz += 7;
					}
					poz += 7;
					break;

				case '0010':
					changes[i].type = "Right & wrong";
					changes[i].typeData = (bin[poz+6]=='1'?true:false);
					console.log("cv xv", (bin[poz+6]=='1'?true:false))
					poz += 7;
					break;
			}
			console.log(poz, bin.slice(poz, poz+7))
			while (bin.slice(poz, poz+7) != '1100000'){
				try{
					changes[i].sentence += this.characters[parseInt(bin.slice(poz, poz+7), 2)];
				} catch {
					console.log(bin, bin.slice(poz, poz+7), parseInt(bin.slice(poz, poz+7), 2), this.characters[parseInt(bin.slice(poz, poz+7), 2)], poz);
					return;
				}
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
			this.pages.push(new pageMaker(wordList, changes[i].sentence, existingWords, changes[i].type, changes[i].typeData));
		}
		this.resetCanvas()
		this.selectPage(0);
		console.log(this.pages);
	}

	cursorPoint(e){
		this.pt.x = e.clientX; this.pt.y = e.clientY;
		return this.pt.matrixTransform(this.canvas.getScreenCTM().inverse());
	}

	compressString(str) {
		let content = '';
		for (let i = 0; i < str.length; i++){
			content += ('000000' + this.characters.indexOf(str[i]).toString(2)).slice(-7);
		}
		return content + '1100000';
	}
}

export class canvasWord {
	constructor (word){
		this.characters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '@', '#', '$', '%', '^', '*', '(', ')', '_', '+', '=', '-', '[', ']', '{', '}', '\\', '|', '/', '~', '`', '÷', '<', '>', ' ', '&', '.', ',', '?', '!', ':', ';', '"', "'"];
		if (word[0] == undefined){
			let points = document.getElementById(word.id.replace('t', 'p')).getAttribute('d').split(' ');
			this.content = document.getElementById(word.id.replace('t', 'tp')).innerHTML;
			this.start = [+points[1], +points[2]];
			this.focus = [+points[4], +points[5]];
			this.end = [+points[6], +points[7]];
			this.topColor = document.getElementById('c1' + word.id.replace('t', '')).getAttribute('fill');
			this.bottomColor = document.getElementById('c2' + word.id.replace('t', '')).getAttribute('fill');
			this.fontSize = +document.getElementById(word.id.replace('t', 'tp')).style.fontSize.replace('px', '');
		} else {
			this.content = word[0];
			this.start = [word[1][0], word[1][1]];
			this.focus = [word[2][0], word[2][1]];
			this.end = [word[3][0], word[3][1]];
			this.topColor = word[4];
			this.bottomColor = word[5];
			this.fontSize = word[6];
		}
	}

	compressColor(color) {
		return [('000' + Math.floor(parseInt(color.substring(1, 3), 16)/16).toString(2)).slice(-4), ('000' + Math.floor(parseInt(color.substring(3, 5), 16)/16).toString(2)).slice(-4), ('000' + Math.floor(parseInt(color.substring(5, 7), 16)/16).toString(2)).slice(-4)];
	}

	compressString(str) {
		let content = '';
		for (let i = 0; i < str.length; i++){
			content += ('000000' + this.characters.indexOf(str[i]).toString(2)).slice(-7);
		}
		return content + '1100000';
	}

	compressAll(){
		this.content = this.compressString(this.content);
		this.focus = [('0000000' + Math.min(Math.floor(Math.abs(+this.focus[0]+(+this.start[0]))/16), 127).toString(2)).slice(-7), ('000000' + Math.min(Math.floor(Math.abs(+this.focus[1]+(+this.start[1]))/16), 63).toString(2)).slice(-6)];
		this.end = [('0000000' + Math.min(Math.floor(Math.abs(+this.end[0]+(+this.start[0]))/16), 127).toString(2)).slice(-7), ('000000' + Math.min(Math.floor(Math.abs(+this.end[1]+(+this.start[1]))/16), 63).toString(2)).slice(-6)];
		this.start = [('0000000' + Math.min(Math.floor(Math.abs(+this.start[0])/16), 127).toString(2)).slice(-7), ('000000' + Math.min(Math.floor(Math.abs(this.start[1])/16), 63).toString(2)).slice(-6)];
		console.log(this.topColor)
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

export class pageMaker {
	constructor (wordList, textBoxWords, existingWords, type, typeData){
		this.wordList = wordList;
		if (typeof textBoxWords == 'string'){
			this.sentence = textBoxWords;
		} else if (textBoxWords.length){
			this.sentence = textBoxWords[0].innerText;
			for (let i = 1; i < textBoxWords.length; i++){
				this.sentence += (textBoxWords[i].style.paddingLeft == '0vw'?'&':' ') + textBoxWords[i].innerHTML;
			}
		} else {
			this.sentence = '';
		}
		this.existingWords = existingWords;
		this.type = type;
		this.typeData = typeData;
		/*
			- Remember & write:   Doesn't store anything. ~ 0000
			- Listen & write:     Stores audio. Will be more compressed later ~ 0001
			- Right & wrong:      Stores the rightness of the page. One bit ~ 0010
		*/
	}

	compressAll(){
		for (let i = 0; i < this.wordList.length; i++){
			if (this.wordList[i] != null){
				this.wordList[i].compressAll();
			}
		}
	}
}