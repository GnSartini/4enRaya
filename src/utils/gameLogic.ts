export const checkWinner = (board: (string | null)[][]): string | null => {
  // Check horizontal
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      const color = board[row][col];
      if (color &&
          color === board[row][col + 1] &&
          color === board[row][col + 2] &&
          color === board[row][col + 3]) {
        return color;
      }
    }
  }

  // Check vertical
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 7; col++) {
      const color = board[row][col];
      if (color &&
          color === board[row + 1][col] &&
          color === board[row + 2][col] &&
          color === board[row + 3][col]) {
        return color;
      }
    }
  }

  // Check diagonal (positive slope)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const color = board[row][col];
      if (color &&
          color === board[row + 1][col + 1] &&
          color === board[row + 2][col + 2] &&
          color === board[row + 3][col + 3]) {
        return color;
      }
    }
  }

  // Check diagonal (negative slope)
  for (let row = 3; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      const color = board[row][col];
      if (color &&
          color === board[row - 1][col + 1] &&
          color === board[row - 2][col + 2] &&
          color === board[row - 3][col + 3]) {
        return color;
      }
    }
  }

  return null;
}