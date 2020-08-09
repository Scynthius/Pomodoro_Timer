function updateAccount() {
    var email = document.getElementById("updateEmail").value;
    var password = document.getElementById("updatePW").value;
    var firstName = document.getElementById("updateFName").value;
    var lastName = document.getElementById("updateLName").value;
    var data = {
        "email"            : email,
        "password"         : password,
        "firstName"        : firstName,
        "lastName"         : lastName
    }

    var request = new XMLHttpRequest();
    request.open('PUT', '/account', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener('load', function () {
        if (request.status >= 200 && request.status < 400) {
            $('#validUpdate').modal({backdrop: 'static', keyboard: false})  
            $('#validUpdate').modal('show');
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