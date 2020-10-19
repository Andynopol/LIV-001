const data = require('./data');
const root = document.getElementById('root');
const controls = [...document.getElementById('controls').getElementsByTagName('button')];

class Rebus{
	constructor(data, root, controls){
		this.data = data;
		this. root = root;
		this.rows = null;
		this.controls = controls;
		this.verify = null;
		this.setVerify();
		console.log(this.verify);
	}

	generate(){
		this.addRows();
		this.addWords();
		this.enableCells();
		this.enableVerify();
	}

	addRows(){
		for(var i = 0; i<this.data.rows; i++){
			const row = document.createElement('div');
			row.classList.add('row');
			this.root.appendChild(row);
		}
		this.rows = [...this.root.getElementsByClassName('row')];
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

			if (key === 13) {
				ev.preventDefault();
				that.focusNextRow(this.parentElement.parentElement);
			}
			else{
				this.value = "";
			}
		
			if (key === 8) {
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
					if(this.value !== ''){
						that.focusNextInput(cell);
					}
					
				}
			} else if (key === 13) {
				ev.preventDefault();
				this.value = this.value;
			} else if (ev.keyCode === 8) {
				ev.preventDefault();
			} else {
				this.value = "";
			}
		});
	}

	setVerify(){
		for(var elem of this.controls){
			if(elem.getAttribute('id') === 'verify'){
				this.verify = elem;
			}
		}
	}

	enableVerify(){
		const that = this;
		this.verify.addEventListener('click', function(){
			that.verifyAll();
		});
	}

	verifyAll(){
		for(var row of this.rows){
			this.verifyRow(row, this.data.words[this.rows.indexOf(row)].word);
		}
	}

	verifyRow(row, word){
		const cells = [...row.getElementsByClassName('cell')];
		console.log(word);
		const letters = [...word];
		for(var cell of cells){
			this.verifyCell(cell, letters[cells.indexOf(cell)]);
		}
	}

	verifyCell(cell, letter){
		const input = cell.querySelector('.letter:first-child');
		if(input.value === letter){
			cell.parentElement.classList.add('correct');
		}
		else{
			cell.parentElement.classList.add('incorrect');
		}
	}
}

const rebus = new Rebus(data, root, controls);
rebus.generate();