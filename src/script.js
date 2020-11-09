const data = require( './data' );
const isMobile = require( './mobile' );
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

				if ( ev.inpuType === 'insertText' ) {
					if ( !that.isLastCell( row, cell ) ) {
						that.focusNextInput( cell );
					}

				} else if ( ev.inpuType === 'deleteContentBackword' && this.value !== ' ' ) {
					this.value = ' ';
				} else if ( ev.inpuType === 'deleteContentBackword' && this.value === ' ' ) {
					if ( !that.isFirstCell( row, cell ) ) {
						that.focusPrevInput( cell );
					}
				}
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