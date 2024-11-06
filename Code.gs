function doGet() {
  const sheet = SpreadsheetApp.openById('1c32d8tjsGpFJ53xDIeSXwCj_NP1VOnJEoXHfBHKypDA').getSheetByName('Hoja 1');
  const board = getBoard(sheet);
  const gameState = getGameState(sheet);
  
  return ContentService.createTextOutput(JSON.stringify({
    board: board,
    currentTurn: gameState.currentTurn,
    lastPlayer: gameState.lastPlayer,
    playerCount: gameState.playerCount
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.openById('1c32d8tjsGpFJ53xDIeSXwCj_NP1VOnJEoXHfBHKypDA').getSheetByName('Hoja 1');
  const data = JSON.parse(e.postData.contents);
  
  if (data.reset) {
    clearBoard(sheet);
    if (data.playerCount) {
      updateGameState(sheet, {
        currentTurn: 'yellow',
        lastPlayer: null,
        playerCount: data.playerCount
      });
    }
  } else {
    const { color, position, playerCount } = data;
    const gameState = getGameState(sheet);
    
    // Only update if it's the player's turn
    if (gameState.currentTurn === color) {
      updateCell(sheet, position.row, position.col, color);
      
      // Update turn to next player
      const players = ['yellow', 'red', 'green', 'blue'].slice(0, playerCount);
      const currentIndex = players.indexOf(color);
      const nextPlayer = players[(currentIndex + 1) % players.length];
      
      updateGameState(sheet, {
        currentTurn: nextPlayer,
        lastPlayer: color,
        playerCount: playerCount
      });
    }
  }
  
  return ContentService.createTextOutput('Success').setMimeType(ContentService.MimeType.TEXT);
}

function getBoard(sheet) {
  const board = [];
  for (let row = 0; row < 6; row++) {
    const rowData = [];
    for (let col = 0; col < 7; col++) {
      const value = sheet.getRange(row + 1, col + 1).getValue();
      rowData.push(value || null);
    }
    board.push(rowData);
  }
  return board;
}

function getGameState(sheet) {
  const stateRange = sheet.getRange('I1:K1');
  const [currentTurn, lastPlayer, playerCount] = stateRange.getValues()[0];
  return {
    currentTurn: currentTurn || 'yellow',
    lastPlayer: lastPlayer || null,
    playerCount: playerCount || 2
  };
}

function updateGameState(sheet, state) {
  const stateRange = sheet.getRange('I1:K1');
  stateRange.setValues([[
    state.currentTurn,
    state.lastPlayer || '',
    state.playerCount
  ]]);
}

function updateCell(sheet, row, col, color) {
  sheet.getRange(row + 1, col + 1).setValue(color);
}

function clearBoard(sheet) {
  sheet.getRange(1, 1, 6, 7).clearContent();
  updateGameState(sheet, {
    currentTurn: 'yellow',
    lastPlayer: null,
    playerCount: 2
  });
}

// This function sets up the initial spreadsheet format (run once)
function setupSheet() {
  const sheet = SpreadsheetApp.openById('1c32d8tjsGpFJ53xDIeSXwCj_NP1VOnJEoXHfBHKypDA').getSheetByName('Hoja 1');
  
  // Clear any existing content and formatting
  sheet.clear();
  
  // Set column widths to make cells square
  for (let i = 1; i <= 7; i++) {
    sheet.setColumnWidth(i, 50);
  }
  
  // Set row heights to match column widths
  for (let i = 1; i <= 6; i++) {
    sheet.setRowHeight(i, 50);
  }
  
  // Create the 6x7 grid with borders
  const range = sheet.getRange(1, 1, 6, 7);
  range.setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
  
  // Set background color to make it look like a Connect Four board
  range.setBackground('#1e40af'); // Blue background
  
  // Add data validation to only allow specific colors
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['yellow', 'red', 'green', 'blue'], true)
    .build();
  range.setDataValidation(rule);
  
  // Set up game state columns
  sheet.getRange('I1').setValue('yellow'); // Current turn
  sheet.getRange('J1').setValue(''); // Last player
  sheet.getRange('K1').setValue(2); // Player count
}