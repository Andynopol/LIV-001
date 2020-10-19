(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
    vertical: false
};

module.exports = data;
},{}],2:[function(require,module,exports){
const data = require('./data');
const root = document.getElementById('root');

class Rebus{
	constructor(data , root){
		this.data = data;
		this. root = root;
		this.rows = null;
	}

	generate(){
		this.addRows();
		this.addWords();
		this.enableCells();
	}

	addRows(){
		for(var i = 0; i<this.data.rows; i++){
			const row = document.createElement('div');
			row.classList.add('row');
			this.root.appendChild(row);
		}
		this.rows = [...document.getElementsByClassName('row')];
	}

	addWords(){
		const words = this.data.words;
		
		for(let i = 0; i < words.length; i++){
			const word = words[i];
			const row = this.rows[i];
			this.addBlanks(word, row);
			this.addCells(word, row);
		}
	}

	addBlanks(word, row){
		const blanks = word.blanks
		for(var i = 0; i<blanks; i++){
			const blank = document.createElement('div');
			blank.classList.add('blank');
			row.appendChild(blank);
		}
	}
	
	addCells(word, row){
		const letters = [...word.word];
		for(var i = 0; i<letters.length; i++){
			const letter = letters[i];
			const cell = document.createElement('div');
			const input = document.createElement('input');
			input.setAttribute('type', 'text');
			input.setAttribute('class', 'letter');
			input.setAttribute('size', '1');
			input.setAttribute('maxlength', '1');
			cell.classList.add('blank','cell');
			cell.setAttribute('letter', letter);
			cell.appendChild(input);
			row.appendChild(cell);
		}
	}

	isLastCell(row, cell) {
		const lastCell = row.querySelector(".cell:last-child");
		if (lastCell === cell) {
			return true;
		}
		return false;
	}

	isFirstCell(row, cell){
		const firstCell = row.getElementsByClassName("cell")[0];
		if (firstCell === cell) {
			return true;
		}
		return false;
	}

	focusFirstInput(row){
		const firstCell = row.getElementsByClassName('cell')[0];
		const input = firstCell.querySelector(
			".letter:first-child",
		);
		input.focus();
	}

	focusNextInput(cell) {
		const row = cell.parentElement;
		const cells = [...row.getElementsByClassName("cell")];
		const nextCellInput = cells[cells.indexOf(cell) + 1].querySelector(
			".letter:first-child",
		);
		nextCellInput.focus();
	}

	focusPrevInput(cell){
		const row = cell.parentElement;
		const cells = [...row.getElementsByClassName("cell")];
		const prevCellInput = cells[cells.indexOf(cell) - 1].querySelector(
			".letter:first-child",
		);
		prevCellInput.focus();
	}

	focusNextRow(row){
		console.log(row);
		if(this.rows[this.rows.indexOf(row)] === this.rows[this.rows.length - 1]){
			return;
		}
		else{
			const nextRow = this.rows[this.rows.indexOf(row)+1];
			console.log(nextRow);
			this.focusFirstInput(nextRow);
		}
	}

	enableCells(){
		for(var i = 0; i<this.rows.length; i++){
			const row = this.rows[i];
			this.enableCellsOnCurrentRow(row);
		}
	}

	enableCellsOnCurrentRow(row){
		const cells = row.getElementsByClassName('cell');
		for(var i = 0; i<cells.length; i++){
			const cell = cells[i];
			this.enableCurrentCell(cell);
		}
	}

	enableCurrentCell(cell){
		console.log(cell);
		const input = cell.firstChild;
		this.enableInput(input)
	}

	enableInput(input){
		const that = this;
		input.addEventListener("keydown", function(ev){
			// const currentValue = this.value;
			const cell = this.parentElement;
			const row = cell.parentElement;
			var key = ev.keyCode;

			if ((key >= 65 && key <= 90) || key == 32) {
				this.value = '';
			}

			if (ev.keyCode === 13) {
				ev.preventDefault();
				this.blur();
				that.focusNextRow(this.parentElement.parentElement);
			}
		
			if (ev.keyCode === 8) {
				ev.preventDefault();
				this.value = "";
				console.log(that.isFirstCell(row, cell));
				if(that.isFirstCell(row, cell))
				{
					console.log("CEVA");
				}else{
					that.focusPrevInput(cell);
				}	
			}
		});
		input.addEventListener("keyup", function(ev){

			const cell = this.parentElement;
			const row = cell.parentElement;
			var key = ev.keyCode;
			if ((key >= 65 && key <= 90) || key == 32) {
				if(that.isLastCell(row, cell)){
					
				}
				else{
					that.focusNextInput(cell);
				}
			} else if (key === 13) {
				ev.preventDefault();
				this.value = this.value;
				// that.focusNextRow(this.parentElement.parentElement);
			} else if (ev.keyCode === 8) {
				ev.preventDefault();
			} else {
				this.value = "";
			}
		});
	}

	

	cellKeyUp(ev) {
		const currentValue = this.value;
		const cell = this.parentElement;
		const line = cell.parentElement;
		console.log(this);
		// console.log(super.root);
	
		if (ev.keyCode === 13) {
			ev.preventDefault();
			// this.blur();
			
		}
	
		if (ev.keyCode === 8) {
			ev.preventDefault();
			if (isLastCell(line, cell) && line.querySelectorAll(".full").length !== 1) {
				if (currentValue === "") {
					ev.preventDefault();
				}
			}
		}
	}

	cellKeyDown(ev) {
		const currentValue = this.value;
		const cell = this.parentElement;
		const line = cell.parentElement;
		var key = ev.keyCode;
		if ((key >= 65 && key <= 90) || key == 32) {
			
		}
	}


}

const rebus = new Rebus(data, root);
rebus.generate();
},{"./data":1}]},{},[1,2]);
