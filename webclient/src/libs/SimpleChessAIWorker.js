self.addEventListener('message', (e) => {
  console.log(e.data);
  self.postMessage('abc');
}, false);
