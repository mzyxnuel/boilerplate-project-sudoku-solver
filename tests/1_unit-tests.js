const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const solvedPuzzle = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

suite('Unit Tests', () => {
  
  test('Logic handles a valid puzzle string of 81 characters', function() {
    const result = solver.validate(validPuzzle);
    assert.isTrue(result.valid);
  });
  
  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function() {
    const invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3X.';
    const result = solver.validate(invalidPuzzle);
    assert.isFalse(result.valid);
    assert.equal(result.error, 'Invalid characters in puzzle');
  });
  
  test('Logic handles a puzzle string that is not 81 characters in length', function() {
    const shortPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3';
    const result = solver.validate(shortPuzzle);
    assert.isFalse(result.valid);
    assert.equal(result.error, 'Expected puzzle to be 81 characters long');
  });
  
  test('Logic handles a valid row placement', function() {
    const result = solver.checkRowPlacement(validPuzzle, 1, 2, 3);
    assert.isTrue(result);
  });
  
  test('Logic handles an invalid row placement', function() {
    const result = solver.checkRowPlacement(validPuzzle, 1, 2, 1);
    assert.isFalse(result);
  });
  
  test('Logic handles a valid column placement', function() {
    const result = solver.checkColPlacement(validPuzzle, 1, 2, 3);
    assert.isTrue(result);
  });
  
  test('Logic handles an invalid column placement', function() {
    const result = solver.checkColPlacement(validPuzzle, 1, 2, 6);
    assert.isFalse(result);
  });
  
  test('Logic handles a valid region (3x3 grid) placement', function() {
    const result = solver.checkRegionPlacement(validPuzzle, 1, 2, 3);
    assert.isTrue(result);
  });
  
  test('Logic handles an invalid region (3x3 grid) placement', function() {
    const result = solver.checkRegionPlacement(validPuzzle, 1, 2, 1);
    assert.isFalse(result);
  });
  
  test('Valid puzzle strings pass the solver', function() {
    const result = solver.solve(validPuzzle);
    assert.isString(result);
    assert.equal(result.length, 81);
  });
  
  test('Invalid puzzle strings fail the solver', function() {
    const invalidPuzzle = '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.solve(invalidPuzzle);
    assert.isFalse(result);
  });
  
  test('Solver returns the expected solution for an incomplete puzzle', function() {
    const result = solver.solve(validPuzzle);
    assert.equal(result, solvedPuzzle);
  });
  
});
