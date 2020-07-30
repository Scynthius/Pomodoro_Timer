
function registerUser() {
    var firstName = document.getElementById("regFName").value;
    var lastName = document.getElementById("regLName").value;
    var email = document.getElementById("regEmail").value;
    var password = document.getElementById("regPW").value;
    var data = {
        "firstName"        : firstName,
        "lastName"         : lastName,
        "email"            : email,
        "password"         : password
    }

    var request = new XMLHttpRequest();
    request.open('POST', '/register', true);
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
    var registerButton = document.getElementById('registerButton');
    registerButton.addEventListener('click', function (event) {
        event.preventDefault();
        registerUser();
    });
    
} catch {
    
};