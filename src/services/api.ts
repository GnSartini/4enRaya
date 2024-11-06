const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwXwGhkjsHHTNKhs0vXmikJ0nIdQxWE6Jrom45EJgxI-wQUnT4kUgoYD3we_9tJme1c/exec';

export async function fetchGameState() {
  try {
    const response = await fetch(SCRIPT_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch game state:', error);
    return null;
  }
}

export async function updateGameState(
  color: string,
  position: { row: number; col: number },
  playerCount: number
) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        color,
        position,
        playerCount,
        sheetId: '1c32d8tjsGpFJ53xDIeSXwCj_NP1VOnJEoXHfBHKypDA',
        sheetName: 'Hoja 1'
      })
    });
    
    // Since no-cors doesn't return JSON, we need to fetch the latest state
    return await fetchGameState();
  } catch (error) {
    console.error('Failed to update game state:', error);
    return null;
  }
}

export async function resetGame(playerCount?: number) {
  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        reset: true,
        playerCount,
        sheetId: '1c32d8tjsGpFJ53xDIeSXwCj_NP1VOnJEoXHfBHKypDA',
        sheetName: 'Hoja 1'
      })
    });
    
    return await fetchGameState();
  } catch (error) {
    console.error('Failed to reset game:', error);
    return null;
  }
}