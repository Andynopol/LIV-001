(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const data = { "words": [ { "word": "retrogradare", "blanks": 0 }, { "word": "accept", "blanks": 3 }, { "word": "ceata", "blanks": 3 }, { "word": "munte", "blanks": 2 }, { "word": "capcana", "blanks": 2 } ], "rows": 5, "vertical": false, "numOfAtemps": 5 };

module.exports = data;
},{}],2:[function(require,module,exports){
mobile = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

module.exports = mobile;
},{}],3:[function(require,module,exports){
const data = require( './data' );
const isMobile = require( './mobile' );
console.log( isMobile() );
const root = document.getElementById( 'root' );
const controls = [ ...document.getElementById( 'controls' ).getElementsByTagName( 'button' ) ];

class CorssWords {
	constructor( data, root, controls ) {
		this.data = data;
		this.root = root;
		this.rows = null;
		this.controls = controls;
		this.verify = null;
		this.retry = null;
		this.setVerify();
		this.setRetry();
		this.atempts = 1;
		console.log( this.retry );
	}

	generate() {
		this.addRows();
		this.addWords();
		this.enableCells();
		this.numberCells();
		this.enableVerify();
	}

	addRows() {
		for ( var i = 0; i < this.data.rows; i++ ) {
			const row = document.createElement( 'div' );
			row.classList.add( 'row' );
			this.root.appendChild( row );
		}
		this.rows = [ ...this.root.getElementsByClassName( 'row' ) ];
	}

	addWords() {
		const words = this.data.words;

		for ( let i = 0; i < words.length; i++ ) {
			const word = words[ i ];
			const row = this.rows[ i ];
			this.addBlanks( word, row );
			this.addCells( word, row );
		}
	}

	addBlanks( word, row ) {
		const blanks = word.blanks
		for ( var i = 0; i < blanks; i++ ) {
			const blank = document.createElement( 'div' );
			blank.classList.add( 'blank' );
			row.appendChild( blank );
			if ( i === blanks - 1 ) {
				blank.style.borderRight = 'none';
			}
		}
	}

	addCells( word, row ) {
		const letters = [ ...word.word ];
		for ( var i = 0; i < letters.length; i++ ) {
			const letter = letters[ i ];
			const cell = document.createElement( 'div' );
			const input = document.createElement( 'input' );
			input.type = 'text';
			input.classList.add( 'letter' );
			input.size = '1';
			input.maxlength = '1';
			cell.classList.add( 'blank', 'cell' );
			cell.setAttribute( 'letter', letter );
			cell.appendChild( input );
			row.appendChild( cell );
			if ( isMobile() ) {
				input.setAttribute( 'salt', true );
			}
		}

	}

	numberCells() {
		for ( var row of this.rows ) {
			const firstCell = row.getElementsByClassName( 'cell' )[ 0 ];
			const num = document.createElement( 'div' );
			num.classList.add( 'row-number' );
			num.innerText = this.rows.indexOf( row ) + 1;
			firstCell.appendChild( num );
		}
	}

	isLastCell( row, cell ) {
		const lastCell = row.querySelector( ".cell:last-child" );
		if ( lastCell === cell ) {
			return true;
		}
		return false;
	}

	isFirstCell( row, cell ) {
		const firstCell = row.getElementsByClassName( "cell" )[ 0 ];
		if ( firstCell === cell ) {
			return true;
		}
		return false;
	}

	focusFirstInput( row ) {
		const firstCell = row.getElementsByClassName( 'cell' )[ 0 ];
		const input = firstCell.querySelector(
			".letter:first-child",
		);
		input.focus();
	}

	focusNextInput( cell ) {
		const row = cell.parentElement;
		const cells = [ ...row.getElementsByClassName( "cell" ) ];
		const nextCellInput = cells[ cells.indexOf( cell ) + 1 ].querySelector(
			".letter:first-child",
		);
		nextCellInput.focus();
		if ( isMobile() ) {
			nextCellInput.value = ' ';
		}
	}

	focusPrevInput( cell ) {
		const row = cell.parentElement;
		const cells = [ ...row.getElementsByClassName( "cell" ) ];
		const prevCellInput = cells[ cells.indexOf( cell ) - 1 ].querySelector(
			".letter:first-child",
		);
		prevCellInput.focus();
	}

	focusNextRow( row ) {
		console.log( row );
		if ( this.rows[ this.rows.indexOf( row ) ] === this.rows[ this.rows.length - 1 ] ) {
			return;
		} else {
			const nextRow = this.rows[ this.rows.indexOf( row ) + 1 ];
			console.log( nextRow );
			this.focusFirstInput( nextRow );
		}
	}

	enableCells() {
		for ( var i = 0; i < this.rows.length; i++ ) {
			const row = this.rows[ i ];
			this.enableCellsOnCurrentRow( row );
		}
	}

	enableCellsOnCurrentRow( row ) {
		const cells = row.getElementsByClassName( 'cell' );
		for ( var i = 0; i < cells.length; i++ ) {
			const cell = cells[ i ];
			this.enableCurrentCell( cell );
		}
	}

	enableCurrentCell( cell ) {
		console.log( cell );
		const input = cell.firstChild;
		this.enableInput( input );
	}

	enableInput( input ) {
		const that = this;
		if ( !isMobile() ) {
			input.addEventListener( "keydown", function ( ev ) {
				const currentValue = this.value;
				const cell = this.parentElement;
				const row = cell.parentElement;
				var key = ev.keyCode;

				if ( key === 13 ) {
					ev.preventDefault();
					that.focusNextRow( this.parentElement.parentElement );
				} else {
					this.value = "";
				}

				if ( key === 8 ) {
					ev.preventDefault();
					if ( that.isFirstCell( row, cell ) ) {
						this.value = '';
					} else {
						if ( currentValue === '' ) {
							that.focusPrevInput( cell );
						} else {
							this.value = '';
						}
					}
				}
			} );
			input.addEventListener( "keyup", function ( ev ) {

				const cell = this.parentElement;
				const row = cell.parentElement;
				var key = ev.keyCode;
				if ( ( key >= 65 && key <= 90 ) || key == 32 ) {
					if ( that.isLastCell( row, cell ) ) {

					} else {
						if ( this.value !== '' ) {
							that.focusNextInput( cell );
						}

					}
				} else if ( key === 13 ) {
					ev.preventDefault();
					this.value = this.value;
				} else if ( ev.keyCode === 8 ) {
					ev.preventDefault();
				} else {
					ev.preventDefault();
				}
			} );

			// input.addEventListener( 'change', function ( ev ) {
			// 	console.log( ev );
			// } );
		} else {
			input.addEventListener( 'input', function ( ev ) {
				console.log( ev );
				const cell = this.parentElement;
				const row = cell.parentElement;

				if ( ev.inputType === "insertText" ) {
					this.value = ev.data;
					this.setAttribute( 'salt', false );
					if ( !that.isLastCell( row, cell ) ) {
						that.focusNextInput( cell );
					}

				} else if ( ev.inputType === "deleteContentBackward" ) {
					ev.preventDefault();
					if ( this.getAttribute( 'salt' ) === 'true' ) {
						if ( !that.isFirstCell( row, cell ) ) {
							that.focusPrevInput( cell );
						}
					} else {
						this.setAttribute( 'salt', true );
						this.value = ' ';
					}
				}

				// } else if ( ev.inputType === "deleteContentBackward" && this.value === ' ' ) {
				// 	ev.preventDefault();
				// 	console.log( 'focusam inputul precendent' );
				// 	this.value = '';
				// 	console.log( !that.isFirstCell( row, cell ) );
				// 	if ( !that.isFirstCell( row, cell ) ) {
				// 		that.focusPrevInput( cell );
				// 	}
				// }
			} );

			input.addEventListener( 'keypress', function ( ev ) {
				console.log( ev );
			} );
		}



	}

	setVerify() {
		for ( var elem of this.controls ) {
			if ( elem.getAttribute( 'id' ) === 'verify' ) {
				this.verify = elem;
			}
		}
	}

	enableVerify() {
		const that = this;
		this.verify.addEventListener( 'click', function () {
			that.verifyAll();
		} );
	}

	verifyAll() {
		this.enableRetry();
		this.verify.classList.add( 'invisible' );
		for ( var row of this.rows ) {
			this.verifyRow( row, this.data.words[ this.rows.indexOf( row ) ].word );
		}
	}

	verifyRow( row, word ) {
		const cells = [ ...row.getElementsByClassName( 'cell' ) ];
		var correct = true;
		console.log( word );
		const letters = [ ...word ];
		for ( var cell of cells ) {
			if ( !this.verifyCell( cell, letters[ cells.indexOf( cell ) ] ) ) {
				correct = false;
				break;
			}
		}

		if ( correct ) {
			row.classList.add( 'verified', 'correct' );
		} else {
			row.classList.add( 'verified', 'incorrect' );
		}
	}

	verifyCell( cell, letter ) {
		const input = cell.querySelector( '.letter:first-child' );
		input.setAttribute( 'readonly', '' );
		input.classList.add( 'petrified' );
		if ( input.value === letter ) {
			return true;
		} else {
			return false;
		}
	}

	setRetry() {
		for ( var elem of this.controls ) {
			if ( elem.getAttribute( 'id' ) === 'retry' ) {
				this.retry = elem;
			}
		}
	}

	enableRetry() {
		const that = this;
		this.retry.classList.remove( 'invisible' );
		this.retry.addEventListener( 'click', function handler() {
			console.log( 'reset' );
			that.reset( that );
			this.removeEventListener( 'click', handler );
			this.classList.add( 'invisible' );
		} );
	}

	reset() {
		console.log( 'reset' );
		if ( this.atempts < this.data.numOfAtemps ) {
			console.log( 'reste' );
			this.atempts++;
			for ( var row of this.rows ) {
				row.classList.remove( 'correct', 'incorrect', 'verified' );
				const cells = row.getElementsByClassName( 'cell' );
				for ( var cell of cells ) {
					const input = cell.querySelector( '.letter:first-child' );
					input.classList.remove( 'petrified' );
					input.value = '';
					input.removeAttribute( 'readonly', '' );
				}
			}
			if ( this.atempts === this.data.numOfAtemps ) {
				this.retry.style.visibility = 'hidden';
			}
			this.verify.classList.remove( 'invisible' );
		}
		this.focusFirstInput( this.rows[ 0 ] );

	}
}

const crosswords = new CorssWords( data, root, controls );
crosswords.generate();
},{"./data":1,"./mobile":2}]},{},[1,2,3]);
