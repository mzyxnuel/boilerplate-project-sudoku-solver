'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      
      // Check for missing required fields
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }
      
      // Validate puzzle
      const validation = solver.validate(puzzle);
      if (!validation.valid) {
        return res.json({ error: validation.error });
      }
      
      // Validate coordinate format (A1-I9)
      const coordinateRegex = /^[A-I][1-9]$/;
      if (!coordinateRegex.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }
      
      // Validate value (1-9)
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }
      
      // Convert coordinate to row/column
      const row = coordinate.charCodeAt(0) - 64; // A=1, B=2, etc.
      const column = parseInt(coordinate[1]);
      
      // Check if the position is already filled with the same value
      const index = (row - 1) * 9 + (column - 1);
      if (puzzle[index] === value) {
        return res.json({ valid: true });
      }
      
      // Check if the position is already filled with a different value
      if (puzzle[index] !== '.') {
        return res.json({ valid: true });
      }
      
      // Check placement validity
      const conflicts = [];
      
      if (!solver.checkRowPlacement(puzzle, row, column, value)) {
        conflicts.push('row');
      }
      
      if (!solver.checkColPlacement(puzzle, row, column, value)) {
        conflicts.push('column');
      }
      
      if (!solver.checkRegionPlacement(puzzle, row, column, value)) {
        conflicts.push('region');
      }
      
      if (conflicts.length === 0) {
        return res.json({ valid: true });
      } else {
        return res.json({ valid: false, conflict: conflicts });
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      
      // Check for missing puzzle
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }
      
      // Validate puzzle
      const validation = solver.validate(puzzle);
      if (!validation.valid) {
        return res.json({ error: validation.error });
      }
      
      // Attempt to solve
      const solution = solver.solve(puzzle);
      
      if (solution) {
        return res.json({ solution: solution });
      } else {
        return res.json({ error: 'Puzzle cannot be solved' });
      }
    });
};
