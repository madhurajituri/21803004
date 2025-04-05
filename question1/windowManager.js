function updateWindow(currentWindow, newNumbers, maxSize) {
    const set = new Set(currentWindow);
  
    for (const num of newNumbers) {
      if (!set.has(num)) {
        currentWindow.push(num);
        set.add(num);
      }
  
      if (currentWindow.length > maxSize) {
        const removed = currentWindow.shift();
        set.delete(removed);
      }
    }
  
    return currentWindow;
  }
  
  module.exports = { updateWindow };
  