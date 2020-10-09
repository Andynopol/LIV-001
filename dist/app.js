(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var timeout;
var errorBar = document.getElementById("errorBar");
var lines = document.getElementsByClassName("line");
var positioners = document.getElementsByClassName("positioner");
const root = document.getElementById("root");

const add = document.getElementById("addRow");
const remove = document.getElementById("removeRow");
const controls = document.getElementById("controls");
const start = document.getElementById("start");

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

//? <-- SECONDARY FUNCTIONS -->

function checkLeft(button) {
	if (button.classList.contains("right")) {
		button.parentElement
			.getElementsByClassName("left")[0]
			.classList.remove("disabled");
	} else {
		if (
			!button.parentElement
				.getElementsByClassName("line")[0]
				.firstChild.classList.contains("empty")
		) {
			button.classList.add("disabled");
		} else {
			button.classList.remove("disabled");
		}
	}
}

function clearLine(line) {
	line.innerHTML = "";
}

function injectInLine(line, arr) {
	if (Array.isArray(arr)) {
		line.innerHTML = "";
		for (var i = 0; i < arr.length; i++) {
			const elem = arr[i];
			line.appendChild(elem);
		}
	}
}

function linkPositionerOnCurrentRow(row) {
	const currentPositioners = row.getElementsByClassName("positioner");
	for (var i = 0; i < currentPositioners.length; i++) {
		linkPositioner(currentPositioners[i]);
	}
}

function linkPositioner(pos) {
	pos.addEventListener("click", function (e) {
		const row = this.parentElement;
		const line = row.getElementsByClassName("line")[0];
		const cells = line.getElementsByClassName("cell");
		const arr = [...cells];
		if (this.classList.contains("left")) {
			if (cells[0].classList.contains("empty")) {
				arr.shift();
			}
			clearLine(line);
			injectInLine(line, arr);
			checkLeft(this);
		} else if (this.classList.contains("right")) {
			const newCell = document.createElement("div");
			newCell.classList.add("cell", "empty");
			arr.unshift(newCell);
			injectInLine(line, arr);
			checkLeft(this);
		}
	});
}

function focustLastInput(line) {
	const lastInput = line.querySelector(".full:last-child > .letter");
	lastInput.focus();
}

function focusNextInput(cell) {
	const line = cell.parentElement;
	const cells = [...line.getElementsByClassName("full")];
	const nextCellInput = cells[cells.indexOf(cell) + 1].querySelector(
		".letter:first-child",
	);
	nextCellInput.focus();
}

function deleteLastCell(line) {
	const cells = [...line.getElementsByClassName("cell")];
	console.log(cells);
	cells.pop();
	injectInLine(line, cells);
}

function isLastCell(line, cell) {
	const lastCell = line.querySelector(".full:last-child");
	if (lastCell === cell) {
		return true;
	}
	return false;
}

function insertNewCell(line) {
	// const cells = [...line.getElementsByClassName('full')];
	const newCell = document.createElement("div");
	newCell.classList.add("cell", "full");
	const newInput = document.createElement("input");
	newInput.type = "text";
	newInput.classList.add("letter");
	newInput.size = 1;
	newInput.maxlength = 1;
	newCell.appendChild(newInput);
	line.appendChild(newCell);
	enableCurrentCell(newCell);
	focustLastInput(line);
}

function cellKeyUpOnEdit(ev) {
	const currentValue = this.value;
	const cell = this.parentElement;
	const line = cell.parentElement;

	if (ev.keyCode === 13) {
		ev.preventDefault();
		if (currentValue === "") {
			deleteLastCell(line);
		} else {
			this.blur();
		}
	} else {
		this.value = "";
	}

	if (ev.keyCode === 8) {
		ev.preventDefault();
		if (isLastCell(line, cell) && line.querySelectorAll(".full").length !== 1) {
			if (currentValue === "") {
				ev.preventDefault();
				deleteLastCell(line);
				focustLastInput(line);
			}
		}
	}
}

function cellKeyDownOnEdit(ev) {
	const cell = this.parentElement;
	const line = cell.parentElement;
	var key = ev.keyCode;
	if ((key >= 65 && key <= 90) || key == 32) {
		if (isLastCell(line, cell)) {
			if(this.value!==""){
				insertNewCell(line);
			}
			
		} else {
			focusNextInput(cell);
		}
	} else if (key === 13) {
		ev.preventDefault();
		this.value = this.value;
	} else if (ev.keyCode === 8) {
		ev.preventDefault();
	} else {
		this.value = "";
	}
}

function enableCurrentCell(cell) {
	const input = cell.getElementsByClassName("letter")[0];
	input.addEventListener("keydown", cellKeyUpOnEdit);
	input.addEventListener("keyup", cellKeyDownOnEdit);
}

function enableCellsOnCurrentLine(line) {
	const cells = [...line.getElementsByClassName("full")];
	for (var i = 0; i < cells.length; i++) {
		const cell = cells[i];
		enableCurrentCell(cell);
	}
}

function disableControls(controls) {
	const btns = controls.getElementsByTagName("button");
	for (var i = 0; i < btns.length; i++) {
		const btn = btns[i];
		if (btn.id !== "start") {
			btn.classList.add("disabled");
		}
	}

	const positioners = document.getElementsByClassName("positioner");
	for (var i = 0; i < positioners.length; i++) {
		const positioner = positioners[i];
		positioner.classList.add("invisible");
	}
}

function enableControls(controls) {
	const btns = controls.getElementsByTagName("button");
	for (var i = 0; i < btns.length; i++) {
		const btn = btns[i];
		if (btn.classList.contains("disabled")) {
			btn.classList.remove("disabled");
		}
	}

	const positioners = document.getElementsByClassName("positioner");
	for (var i = 0; i < positioners.length; i++) {
		const positioner = positioners[i];
		positioner.classList.remove("invisible");
	}
}

function emptyCells(lines) {
	for (var i = 0; i < lines.length; i++) {
		const line = lines[i];
		emptyCellsOnCurrentLine(line);
	}
}

function emptyCellsOnCurrentLine(line) {
	var word = "";
	const cells = line.getElementsByClassName("full");
	for (var i = 0; i < cells.length; i++) {
		const cell = cells[i];
		const input = cell.querySelector("input:first-child");
		if (isLastCell(line, cell) && input.value === "") {
			deleteLastCell(line);
		} else {
			if (input.value !== "") {
				word = word + input.value;
				cell.setAttribute('letter', input.value);
				input.value = "";
			} else {
				forcedRefill(line, word);
				alert("No cells can be empty!");
				stopGame(true);
				break;
			}
		}
	}
	console.log(word);
	line.setAttribute("word", word);
}

function forcedRefill(line, word) {
	const cells = line.getElementsByClassName("full");
	for (var i = 0; i < word.length; i++) {
		const cell = cells[i];
		const input = cell.querySelector("input:first-child");
		input.value = word[i];
	}
}

function refillCells(lines) {
	for (var i = 0; i < lines.length; i++) {
		const line = lines[i];
		refillCellsOnCurrentLine(line);
	}
}

function refillCellsOnCurrentLine(line) {
	// var word = line.getAttribute("word");
	const cells = line.getElementsByClassName("full");
	for (var i = 0; i < cells.length; i++) {
		const cell = cells[i];
		const input = cell.querySelector("input:first-child");
		input.value = cell.getAttribute('letter');
	}
}

// ? <-- SECONDARY FUNCTIONS -->

// ! <-- Main functions -->

function enableCells(lines) {
	for (var i = 0; i < lines.length; i++) {
		const line = lines[i];
		enableCellsOnCurrentLine(line);
	}
}

function disableCells() {
	const lines = document.getElementsByClassName("line");
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const newLine = line.cloneNode(true);
		const row = line.parentNode;
		console.log(row);
		row.replaceChild(newLine, line);
	}
}

function enablePositioners(positioners) {
	for (var i = 0; i < positioners.length; i++) {
		const positioner = positioners[i];
		linkPositioner(positioner);
	}
}

function enableAddRemove(add, remove) {
	add.addEventListener("click", function (e) {
		const row = document.createElement("div");
		const left = document.createElement("div");
		const line = document.createElement("div");
		const cell = document.createElement("div");
		const input = document.createElement("input");
		const right = document.createElement("div");

		//left button
		left.classList.add("left", "positioner", "disabled");
		left.innerText = "<";
		row.appendChild(left);

		//line
		line.classList.add("line");
		row.appendChild(line);

		//cell
		cell.classList.add("cell", "full");
		line.appendChild(cell);

		//input
		input.type = "text";
		input.classList.add("letter");
		input.size = 1;
		input.maxlength = 1;
		cell.appendChild(input);

		//right
		right.classList.add("right", "positioner");
		right.innerText = ">";
		row.appendChild(right);

		//add to root
		row.classList.add("row");
		root.appendChild(row);

		//link events
		enableCellsOnCurrentLine(line);
		linkPositionerOnCurrentRow(row);
	});

	remove.addEventListener("click", function () {
		const lastRow = root.querySelector(".row:last-child");
		if (lastRow !== root.querySelector(".row:first-child")) {
			root.removeChild(lastRow);
		}
	});
}

function stopGame(forced) {
	if (forced) {
		start.innerText = "START";
		start.removeEventListener("click", stopGame);
		start.addEventListener("click", startGame);
		end(forced);
	} else {
		this.innerText = "START";
		this.removeEventListener("click", stopGame);
		this.addEventListener("click", startGame);
		end();
	}
}

function startGame() {
	this.innerText = "STOP";
	this.removeEventListener("click", startGame);
	this.addEventListener("click", stopGame);
	play();
}

function enableStart(start) {
	start.addEventListener("click", startGame);
}

function end() {
	enableControls(controls);
	const lines = root.getElementsByClassName("line");
	refillCells(lines);
	enableCells(lines);
}

function play() {
	disableControls(controls);
	emptyCells(root.getElementsByClassName("line"));
	disableCells();
}

// ! <-- MAIN FUNCTIONS -->

enablePositioners(positioners);
enableCells(lines);
enableAddRemove(add, remove);
enableStart(start);

},{}]},{},[1]);
