async function trylogin() {
    let name = document.getElementById('username').value;
    let pass = document.getElementById('password').value;

    //Insert encryption of password here

    let baseurl = "//localhost/rest-api-2/api.php?login";

    console.log("Base url - ", baseurl);
    const myheaders = new Headers();
    myheaders.append("Content-Type", "application/json");

    const response = await fetch(baseurl, {
        method: "POST",
        body: JSON.stringify ({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        }),
        Headers: myheaders
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data);

        if (!data) {
            console.log("Login failed");
        } else {
            console.log("Login successful", data.length);
            window.location.href = "users.html";
        }
    })
    .catch((error) => {
        console.error(error);
    });

}

window.onload = function () {
    document.getElementById('submit-button').onclick = function(){
        trylogin();
    }
};