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
        word: "blia",
        blanks: 2,
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
			this.addCells(word, row);
		}
	}

	addCells(word, row){
		const blanks = word.blanks
		const letterArray = [...word.word];
		const wordLength = blanks + letterArray.length;
		console.log(wordLength);
	}
}

const rebus = new Rebus(data, root);
rebus.generate();
},{"./data":1}]},{},[1,2]);
