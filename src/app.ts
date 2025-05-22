type Cell = {
    value: number;
    readonly: boolean;
  };
  
  type Board = Cell[][];
  
  const PUZZLE: number[][] = [
    [5,3,0, 0,7,0, 0,0,0],
    [6,0,0, 1,9,5, 0,0,0],
    [0,9,8, 0,0,0, 0,6,0],
    [8,0,0, 0,6,0, 0,0,3],
    [4,0,0, 8,0,3, 0,0,1],
    [7,0,0, 0,2,0, 0,0,6],
    [0,6,0, 0,0,0, 2,8,0],
    [0,0,0, 4,1,9, 0,0,5],
    [0,0,0, 0,8,0, 0,7,9]
  ];
  
  let originalBoard: Board;
  let currentBoard: Board;
  
  function createBoard(numbers: number[][]): Board {
    const board: Board = [];
    for (let i = 0; i < 9; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < 9; j++) {
        const v = numbers[i][j];
        row.push({
          value: v,
          readonly: v !== 0
        });
      }
      board.push(row);
    }
    return board;
  }
  
  function copyBoard(src: Board): Board {
    const newBoard: Board = [];
    for (let i = 0; i < 9; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < 9; j++) {
        const cell = src[i][j];
        row.push({
          value: cell.value,
          readonly: cell.readonly
        });
      }
      newBoard.push(row);
    }
    return newBoard;
  }
  
  const gridEl = document.getElementById("grid")!;
  
  function renderBoard(board: Board) {
    gridEl.innerHTML = "";
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const cell = board[i][j];
        const input = document.createElement("input");
        input.className = cell.readonly ? "cell readonly" : "cell";
        input.type = "text";
        input.maxLength = 1;
        input.value = cell.value ? cell.value.toString() : "";
        input.disabled = cell.readonly;
  
        input.addEventListener("input", () => {
          const n = parseInt(input.value) || 0;
          if (n >= 1 && n <= 9) {
            board[i][j].value = n;
          } else {
            board[i][j].value = 0;
            input.value = "";
          }
        });
  
        gridEl.appendChild(input);
      }
    }
  }
  
  function hasNoDuplicates(arr: number[]): boolean {
    const seen = new Set<number>();
    for (const x of arr) {
      if (x === 0) continue;
      if (seen.has(x)) return false;
      seen.add(x);
    }
    return true;
  }
  
  function isValid(board: Board): boolean {
    for (let i = 0; i < 9; i++) {
      const rowVals: number[] = [];
      const colVals: number[] = [];
      for (let j = 0; j < 9; j++) {
        rowVals.push(board[i][j].value);
        colVals.push(board[j][i].value);
      }
      if (!hasNoDuplicates(rowVals) || !hasNoDuplicates(colVals)) {
        return false;
      }
    }
  
    for (let blockRow = 0; blockRow < 3; blockRow++) {
      for (let blockCol = 0; blockCol < 3; blockCol++) {
        const blockVals: number[] = [];
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            blockVals.push(
              board[blockRow * 3 + r][blockCol * 3 + c].value
            );
          }
        }
        if (!hasNoDuplicates(blockVals)) {
          return false;
        }
      }
    }
  
    return true;
  }
  
  function solveBoard(board: Board): boolean {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j].value === 0) {
          for (let n = 1; n <= 9; n++) {
            board[i][j].value = n;
            if (isValid(board) && solveBoard(board)) {
              return true;
            }
          }
          board[i][j].value = 0;
          return false;
        }
      }
    }
    return true;
  }
  
  document.getElementById("check")!.addEventListener("click", () => {
    if (isValid(currentBoard)) {
      alert("No conflicts!");
    } else {
      alert("Conflict detected!");
    }
  });
  
  document.getElementById("solve")!.addEventListener("click", () => {
    if (solveBoard(currentBoard)) {
      renderBoard(currentBoard);
    } else {
      alert("No solution found.");
    }
  });
  
  document.getElementById("reset")!.addEventListener("click", () => {
    currentBoard = copyBoard(originalBoard);
    renderBoard(currentBoard);
  });
  
  function init() {
    originalBoard = createBoard(PUZZLE);
    currentBoard = copyBoard(originalBoard);
    renderBoard(currentBoard);
  }
  
  init();
  