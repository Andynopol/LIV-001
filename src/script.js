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
		this.rows = document.getElementsByClassName('row');
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
		input.addEventListener('');
	}
}

const rebus = new Rebus(data, root);
rebus.generate();