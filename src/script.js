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
		this.updateRows();
		this.setAdd();
	}

	updateRows(){
		this.rows = [...this.root.getElementsByClassName('row')];
	}

	setAdd(){
		for(var item of controls){
			if(item.id === 'addRow'){
				this.add = item;
				break;
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

			//appending to root
			that.root.appendChild(newRow);
			newRow.appendChild(newLeft);
			newRow.appendChild(newRight);
			newRow.appendChild(newLine);
			newLine.appendChild(cell);
			cell.appendChild(input);

			//binding new elements

			that.updateRows();
			that.bindPositionersOnCurrentRow(newRow);
			that.bindCell(cell);

			//TODO add the remove current row button

		});
	}

	start(){
		// this is called to start the editing
		this.bindCells();
		this.bindPositioners();
		this.bindAdd();
	}
}

const editor = new CrossWrodsEditor(root, controls);
editor.start();