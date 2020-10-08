var timeout;
var errorBar = document.getElementById('errorBar');

function verifyError() {
    var errorCode = API.GetLastError();
    if (errorCode !== '0') {
        clearTimeout(timeout);
        timeout = setTimeout(hideErrorBar, 2000);
        errorBar.innerHTML = 'Error ' + errorCode + ' (' + API.GetErrorString(errorCode) + ')';
        errorBar.classList.add('up');
    }
}

function hideErrorBar() {
    errorBar.classList.remove('up');
}