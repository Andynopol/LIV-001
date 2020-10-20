(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var timeout;
var errorBar = document.getElementById("errorBar");
const root = document.getElementById("root");
const controls = document.getElementById("controls").getElementsByTagName('button');

// <-- DEFAULT FUNCTIONS -->

function verifyError() {
	var errorCode = API.GetLastError();
	if (errorCode !== "0") {
		clearTimeout(timeout);
		timeout = setTimeout(hideErrorBar, 2000);
		errorBar.innerHTML =
			"Error " + errorCode + " (" + API.GetErrorString(errorCode) + ")";
		errorBar.classList.add("up");
	}
}

function hideErrorBar() {
	errorBar.classList.remove("up");
}

// <-- DEFAULT FUNCTIONS -->

//! <-- Object -->

class CrossWrodsEditor{
	constructor(root, controls){
		this.root = root;
		this.controls = controls;
		this.rows = null;
		this.add = null;
		this.generate = null;
		this.numOfAtempts = null;
		this.atempts = 1;
		this.updateRows();
		this.setControls();
		this.data = {};
		this.vertical = false;
	}

	updateRows(){
		this.rows = [...this.root.getElementsByClassName('row')];
	}

	setControls(){
		for(var item of controls){
			if(item.id === 'addRow'){
				this.add = item;
			}
			if(item.id === 'generate'){
				this.generate = item;
			}
			if(item.id === 'numberOfAtempts'){
				this.numOfAtempts = item;
			}
		}
	}

	bindCells(){
		for(var row of this.rows){
			const line = row.getElementsByClassName('line')[0];
			const cells = line.getElementsByClassName('cell');
			for(var cell of cells){
				this.bindCell(cell);
			}
		}
	}

	bindCell(cell){
		const that = this;
		const input = cell.getElementsByClassName("letter")[0];
		input.addEventListener("keydown", function(ev){
			that.cellKeyDown(ev, this);
		});
		input.addEventListener("keyup", function(ev){
			that.cellKeyUp(ev, this);
		});
	}

	isLastCell(line, cell){
		const cells = line.getElementsByClassName('cell');
		if(cells[cells.length-1] === cell){
			return true;
		}
		return false;
	}

	deleteLastCell(line){
		line.removeChild(line.childNodes[line.childNodes.length - 1]);
	}

	deleteCurrentCell(line, index){
		line.removeChild(line.childNodes[index]);
	}

	noEmptyCells(){
		const inputs = this.root.getElementsByTagName('input');
		for(var input of inputs){
			if(input.value === ''){
				return false;
			}
		}
		return true;
	}

	focusLastInput(line){
		const lastCell = line.getElementsByClassName('cell')[line.getElementsByClassName('cell').length - 1];
		const input = lastCell.getElementsByClassName('letter')[0];
		input.focus();
	}

	focusNextInput(cell){
		const line = cell.parentElement;
		const cells = [...line.getElementsByClassName('cell')];
		const nextInput = cells[cells.indexOf(cell) + 1].getElementsByTagName('input')[0];
		nextInput.focus();
	}

	insertNewCell(line){
		const newCell = document.createElement('div');
		const newInput = document.createElement('input');
		newInput.classList.add('letter');
		newInput.type = 'text';
		newInput.name = 'letter';
		newInput.size = '1';
		newInput.maxLength = '1';
		newCell.classList.add('blank', 'cell');
		newCell.appendChild(newInput);
		line.appendChild(newCell);

		this.bindCell(newCell);
		newInput.focus();
	}


	cellKeyDown(ev, input) {
		const currentValue = input.value;
		const cell = input.parentElement;
		const line = cell.parentElement;
	
		if (ev.keyCode === 13) {
			ev.preventDefault();
			if (currentValue === "") {
				this.deleteLastCell(line);
			} else {
				input.blur();
			}
		} else {
			input.value = "";
		}
	
		if (ev.keyCode === 8) {
			ev.preventDefault();
			if (this.isLastCell(line, cell) && line.querySelectorAll(".cell").length !== 1) {
				if (currentValue === "") {
					ev.preventDefault();
					this.deleteLastCell(line);
					this.focusLastInput(line);
				}
			}
		}
	}
	
	cellKeyUp(ev, input) {
		const cell = input.parentElement;
		const line = cell.parentElement;
		var key = ev.keyCode;
		if ((key >= 65 && key <= 90) || key == 32) {
			if (this.isLastCell(line, cell)) {
				if(input.value!==""){
					this.insertNewCell(line);
				}
				
			} else {
				this.focusNextInput(cell);
			}
		} else if (key === 13) {
			ev.preventDefault();
			input.value = input.value;
		} else if (ev.keyCode === 8) {
			ev.preventDefault();
		} else {
			input.value = "";
		}
	}

	bindPositioners(){
		for(var row of this.rows){
			this.bindPositionersOnCurrentRow(row);
		}
	}

	bindPositionersOnCurrentRow(row){
		const positioners = row.getElementsByClassName('positioner');
		for(var pos of positioners){
			if(pos.classList.contains('left')){
				this.bindLeft(pos);
			}else if(pos.classList.contains('right')){
				this.bindRight(pos);
			}
		}
	}

	clearLine(line){
		line.innerHTML = '';
	}

	injectInLine(line, blanks){
		for(var blank of blanks){
			line.appendChild(blank);
		}
	}

	checkLeft(left, blanks){
		if(blanks[0].classList.contains('cell')){
			left.classList.add('disabled');
		}
		else{
			left.classList.remove('disabled');
		}
	}

	bindLeft(positioner){
		const that = this;
		positioner.addEventListener('click', function(){
			const currentRow = this.parentElement;
			const currentLine = currentRow.getElementsByClassName('line')[0];
			const blanks = [...currentLine.getElementsByClassName('blank')];
			if (!blanks[0].classList.contains("cell")) {
				blanks.shift();
			}
			that.clearLine(currentLine);
			that.injectInLine(currentLine, blanks);
			that.checkLeft(this, blanks);
		});
	}

	bindRight(positioner){
		const that = this;
		positioner.addEventListener('click', function(){
			const currentRow = this.parentElement;
			const currentLine = currentRow.getElementsByClassName('line')[0];
			const blanks = [...currentLine.getElementsByClassName('blank')];
			const newCell = document.createElement("div");
			const left = currentRow.getElementsByClassName('left')[0];
			newCell.classList.add("blank");
			blanks.unshift(newCell);
			that.clearLine(currentLine);
			that.injectInLine(currentLine, blanks);
			that.checkLeft(left, blanks);
		});
	}

	bindDelete(){
		for(var row of this.rows){
			this.bindDeleteOnCurrentRow(row);
		}
	}

	emptyRoot(){
		this.root.innerHTML = '';
	}

	injectInRoot(rows){
		for(var row of rows){
			this.root.appendChild(row);
		}
	}


	checkDelete(){
		const del = this.rows[0].getElementsByClassName('delete')[0];
		if(this.rows.length === 1){
			del.classList.add('disabled');
		}else{
			del.classList.remove('disabled');
		}
	}

	bindDeleteOnCurrentRow(row){
		const that = this;
		const del = row.getElementsByClassName('delete')[0];
		del.addEventListener('click', function(){
			that.rows.splice(that.rows.indexOf(row), 1);
			that.emptyRoot();
			that.injectInRoot(that.rows);
			that.updateRows();
			that.checkDelete();
		});
	}

	bindAdd(){
		const that = this;
		this.add.addEventListener('click', function(){

			//createing the elements
			const newRow = document.createElement('div');
			const newLeft = document.createElement('div');
			const newRight = document.createElement('div');
			const newLine = document.createElement('div');
			const cell = document.createElement('div');
			const input = document.createElement('input');
			const del = document.createElement('div');

			
			//adding the classes and attributes
			newRow.classList.add('row');
			newLeft.classList.add('left', 'positioner', 'disabled');
			newLeft.innerText = '<';
			newRight.classList.add('right', 'positioner');
			newRight.innerText = '>';
			newLine.classList.add('line');
			cell.classList.add('cell','blank');
			input.classList.add('letter');
			input.type = 'text';
			input.name = 'letter';
			input.size = '1';
			input.maxLength = '1';

			del.classList.add('delete');
			del.innerText = 'X';

			//appending to root
			that.root.appendChild(newRow);
			newRow.appendChild(newLeft);
			newRow.appendChild(newRight);
			newRow.appendChild(newLine);
			newRow.appendChild(del);
			newLine.appendChild(cell);
			cell.appendChild(input);

			//binding and checking new elements

			that.updateRows();
			that.bindPositionersOnCurrentRow(newRow);
			that.bindCell(cell);
			that.bindDeleteOnCurrentRow(newRow);
			that.checkDelete();
		});
	}

	bindNumberOfAtempts(){
		const that = this;
		this.numOfAtempts.addEventListener('click', function(){
			const parent = this.parentElement;
			const label = parent.getElementsByTagName('label')[0];
			const input = document.createElement('input');
			input.type = 'number';
			input.name = 'numberOfAtemptsInput';
			input.id = 'numberOfAtemptsInput';
			input.min = '1';
			input.max = '100';
			parent.removeChild(this);
			label.for = input.id;
			parent.appendChild(input);
			input.value = 1;
			input.addEventListener('change', function(){
				that.atempts = Number.parseInt(this.value);
			})
		});
	}

	getCurrentWord(cells){
		var word = '';
		for(var cell of cells){
			const input = cell.getElementsByTagName('input')[0];
			word = word + input.value + '';
		}
		return word;
	}

	deleteLastCells(){
		for(var row of this.rows){
			const line = row.getElementsByClassName('line')[0];
			const cells = [...line.getElementsByClassName('cell')];
			// for(var i = 0; i<cells.length; i++){
			// 	const cell = cells[i];
			// 	const input = cell.getElementsByTagName('input')[0];
			// 	if(input.value === ''){
			// 		this.deleteCurrentCell(line, i+1);
			// 	}
			// }
			const lastCell = cells[cells.length - 1];
			const input = lastCell.getElementsByTagName('input')[0];
			if(input.value === ''){
				this.deleteLastCell(line);
			}
		}
	}

	bindGenerate(){
		const that = this;
		this.generate.addEventListener('click', function(){
			that.deleteLastCells();
			if(that.noEmptyCells()){
				that.data = {};
				that.data.words = [];
				for(var row of that.rows){
					const blanks = row.getElementsByClassName('line')[0].getElementsByClassName('blank');
					const cells = row.getElementsByClassName('line')[0].getElementsByClassName('cell');
					const word = {};
					word.word = that.getCurrentWord(cells);
					word.blanks = blanks.length - cells.length;
					that.data.words.push(word);
				}
				that.data.rows = that.rows.length;
				that.data.vertical = that.vertical;
				if(that.numOfAtempts.value){
					that.atempts = that.numOfAtempts.value;
				}
				that.data.numOfAtemps = that.atempts;
				setTimeout(function(){
					alert(JSON.stringify(that.data));
				}, 1000);
			}
			
		});
		
	}

	start(){
		// this is called to start the editing
		this.bindCells();
		this.bindPositioners();
		this.bindDelete();
		this.bindAdd();
		this.bindGenerate();
		this.bindNumberOfAtempts();
	}
}

const editor = new CrossWrodsEditor(root, controls);
editor.start();


const data = {
    words: [{
        word: "alfabet",
        blanks: 3,
    },
    {
        word: "castravete",
        blanks: 6,
    },
    {
        word: "bila",
        blanks: 4,
    }
],
    rows : 3,
    vertical: false,
    numOfAtemps: 3,
};
},{}]},{},[1]);
