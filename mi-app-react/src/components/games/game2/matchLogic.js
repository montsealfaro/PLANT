const COLORS = ["red", "blue", "green", "yellow"]

export function createBoard(size) {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () =>
      COLORS[Math.floor(Math.random() * COLORS.length)]
    )
  )
}

export function findMatches(board) {
  const matches = []

  // horizontales
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board.length - 2; c++) {
      if (
        board[r][c] &&
        board[r][c] === board[r][c + 1] &&
        board[r][c] === board[r][c + 2]
      ) {
        matches.push([r, c], [r, c + 1], [r, c + 2])
      }
    }
  }

  return matches
}

export function removeMatches(board, matches) {
  matches.forEach(([r, c]) => {
    board[r][c] = null
  })
  return board
}

export function dropPieces(board) {
  for (let c = 0; c < board.length; c++) {
    let col = board.map(row => row[c]).filter(Boolean)

    while (col.length < board.length) {
      col.unshift(randomColor())
    }

    for (let r = 0; r < board.length; r++) {
      board[r][c] = col[r]
    }
  }
  return board
}

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}