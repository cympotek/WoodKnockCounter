// Web Worker for handling tap requests in batches
let pendingTaps = 0;
let isProcessing = false;

self.onmessage = function(e) {
  const { type, count } = e.data;
  
  if (type === 'ADD_TAPS') {
    pendingTaps += count;
    processTaps();
  }
};

async function processTaps() {
  if (isProcessing || pendingTaps === 0) return;
  
  isProcessing = true;
  const tapsToProcess = pendingTaps;
  pendingTaps = 0;
  
  try {
    // Send batch request to server
    const response = await fetch('/api/taps/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ count: tapsToProcess }),
    });
    
    if (response.ok) {
      const result = await response.json();
      self.postMessage({
        type: 'BATCH_SUCCESS',
        data: result
      });
    } else {
      // If batch fails, add taps back to pending
      pendingTaps += tapsToProcess;
      self.postMessage({
        type: 'BATCH_ERROR',
        error: 'Failed to process taps'
      });
    }
  } catch (error) {
    // If request fails, add taps back to pending
    pendingTaps += tapsToProcess;
    self.postMessage({
      type: 'BATCH_ERROR',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
  
  isProcessing = false;
  
  // Process any remaining taps
  if (pendingTaps > 0) {
    setTimeout(processTaps, 100);
  }
}