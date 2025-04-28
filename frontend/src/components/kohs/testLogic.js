export function rotateBlock(blockType) {
    // With simple colors, rotation has no effect
    return blockType;
  }
  
  export function compareGrids(userGrid, targetGrid) {
    if (userGrid.length !== targetGrid.length) return false;
    
    for (let i = 0; i < targetGrid.length; i++) {
      if (userGrid[i].length !== targetGrid[i].length) return false;
      
      for (let j = 0; j < targetGrid[i].length; j++) {
        if (userGrid[i][j] !== targetGrid[i][j]) return false;
      }
    }
    
    return true;
  }
  
  export function calculateScore(userGrid, targetGrid, timeInSeconds) {
    let correctCells = 0;
    let totalCells = 0;
    
    for (let i = 0; i < targetGrid.length; i++) {
      for (let j = 0; j < targetGrid[i].length; j++) {
        totalCells++;
        if (userGrid[i] && userGrid[i][j] === targetGrid[i][j]) {
          correctCells++;
        }
      }
    }
    
    const accuracy = totalCells > 0 ? correctCells / totalCells : 0;
    const baseScore = Math.round(accuracy * 100);
    const timeBonus = Math.max(0, 30 - Math.floor(timeInSeconds / 10));
    const score = baseScore + timeBonus;
    const maxScore = 100 + 30;
    
    return { score, maxScore, accuracy };
  }
  
  export function createEmptyGrid(rows, cols) {
    return Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(null));
  }