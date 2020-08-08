function updateAccount() {
    var email = document.getElementById("regEmail").value;
    var password = document.getElementById("regPW").value;
    var data = {
        "email"            : email,
        "password"         : password
    }

    var request = new XMLHttpRequest();
    request.open('POST', '/updateAccount', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener('load', function () {
        if (request.status >= 200 && request.status < 400) {
            $('#validReg').modal('show');
        } else {
            console.log('Error');
        }
    });

    request.send(JSON.stringify(data));
};

try {
    var updateButton = document.getElementById('updateAccountButton');
    updateButton.addEventListener('click', function (event) {
        event.preventDefault();
        updateAccount();
    });
    
} catch {
    
};