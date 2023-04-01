// added as a script to the iFrame HTML, this allows us to grab javascript variable
// so that we can lookup the field names while trying to replace them in the Page
// layout floating panel thing
var ourLocalStorageObject = {
  troughData: window.troughData
};
var dataString = JSON.stringify(ourLocalStorageObject);
localStorage.setItem("hijackedTroughData", dataString);