//We have access to topframe - no longer a contentscript
// console.log('troughData has values ' + troughData.length);
var ourLocalStorageObject = {
  troughData: window.troughData
};
var dataString = JSON.stringify(ourLocalStorageObject);
localStorage.setItem("hijackedTroughData", dataString);