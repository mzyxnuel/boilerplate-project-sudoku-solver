class SudokuSolver {

  validate(puzzleString) {
    // Check if puzzle string is exactly 81 characters
    if (!puzzleString || puzzleString.length !== 81) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }
    
    // Check if puzzle string contains only valid characters (1-9 or .)
    const validPattern = /^[1-9.]+$/;
    if (!validPattern.test(puzzleString)) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    }
    
    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    // Convert to 0-based indexing
    const rowIndex = row - 1;
    
    // Check if value already exists in the row
    for (let col = 0; col < 9; col++) {
      const index = rowIndex * 9 + col;
      if (puzzleString[index] === value.toString()) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    // Convert to 0-based indexing
    const colIndex = column - 1;
    
    // Check if value already exists in the column
    for (let row = 0; row < 9; row++) {
      const index = row * 9 + colIndex;
      if (puzzleString[index] === value.toString()) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    // Convert to 0-based indexing
    const rowIndex = row - 1;
    const colIndex = column - 1;
    
    // Find the top-left corner of the 3x3 region
    const regionRowStart = Math.floor(rowIndex / 3) * 3;
    const regionColStart = Math.floor(colIndex / 3) * 3;
    
    // Check if value already exists in the 3x3 region
    for (let r = regionRowStart; r < regionRowStart + 3; r++) {
      for (let c = regionColStart; c < regionColStart + 3; c++) {
        const index = r * 9 + c;
        if (puzzleString[index] === value.toString()) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    const validation = this.validate(puzzleString);
    if (!validation.valid) {
      return false;
    }
    
    // Convert string to array for easier manipulation
    let board = puzzleString.split('');
    
    if (this.solvePuzzle(board)) {
      return board.join('');
    }
    
    return false;
  }
  
  solvePuzzle(board) {
    // Find the next empty cell
    for (let i = 0; i < 81; i++) {
      if (board[i] === '.') {
        const row = Math.floor(i / 9) + 1;
        const col = (i % 9) + 1;
        
        // Try each number from 1-9
        for (let num = 1; num <= 9; num++) {
          if (this.isValidPlacement(board.join(''), row, col, num)) {
            board[i] = num.toString();
            
            // Recursively solve the rest
            if (this.solvePuzzle(board)) {
              return true;
            }
            
            // Backtrack
            board[i] = '.';
          }
        }
        
        // No valid number found for this cell
        return false;
      }
    }
    
    // All cells filled successfully
    return true;
  }
  
  isValidPlacement(puzzleString, row, column, value) {
    return this.checkRowPlacement(puzzleString, row, column, value) &&
           this.checkColPlacement(puzzleString, row, column, value) &&
           this.checkRegionPlacement(puzzleString, row, column, value);
  }
}

module.exports = SudokuSolver;

