function EditRow(rowNumber) {
    let rows = document.getElementById("users-table").rows;
    let row = rows[rowNumber];
    
    let inputfields = document.getElementById("edit-user-fields")

    for (let i = 0; i < row.cells.length; i++) {
        //console.log(row.cells[i].innerText, i, inputfields.children.length);
        
        let j = i + 1;
        
        if (j > inputfields.children.length) {
            break;
        }

        inputfields.children[i].value = row.cells[i].innerText;
    }
}

async function DeleteRow(rowNumber) {
    let rows = document.getElementById("users-table").rows;
    let row = rows[rowNumber];

    let inputUsername = row.cells[0].innerHTML;
    let inputPassword = row.cells[1].innerHTML;

    //console.log(inputUsername, inputPassword);

    let deletionConfirmation = confirm("Are you sure you want to delete the " + username + " account\nResult is permanent.");

    if (deletionConfirmation) {
        let baseurl = "//localhost/rest-api-2/api.php";
        
        const myheaders = new Headers();
        myheaders.append("Content-Type", "application/json");

        const response = await fetch(baseurl, {
            method: "DELETE",
            body: JSON.stringify({
                username: inputUsername,
                password: inputPassword
            }),
            Headers: myheaders
        })
        .then((response) => response.json())
        .then((data) => {
        })
        .catch((error) => {
            console.error(error);
        });
        
        location.reload();
    }
}

async function EncodeImageFromInput() {
    let image = document.getElementById("picture").files[0];
    
    if (!image) {
        return null;
    }

    const blobToBase64DataURL = imageBlob => new Promise(  
        resolvePromise => {
            const reader = new FileReader();
            
            reader.onloadend = () => {
                let base64 = reader.result.replace("data:", "").replace(/^.+,/, "");
                resolvePromise(base64);
            }

            reader.readAsDataURL(imageBlob);
        }
    );

    let b64String = await blobToBase64DataURL(image).then(function(result) {
        console.log(result);
        return result;
    });

    return b64String;
}

async function GetUsers() {
    let baseurl = "//localhost/rest-api-2/api.php?listusers=all";
    
    const myheaders = new Headers();
    myheaders.append("Content-Type", "application/json");

    const response = await fetch(baseurl, {
        method: "GET",
        Headers: myheaders
    })
    .then((response) => response.json())
    .then((data) => {
        //console.log(data);
        return data;
    })
    .catch((error) => {
        console.error(error);
    });

    return response;
}

async function BuildTable() {
    //console.log("Getting users");
    let users = await GetUsers();
    //console.log("users", users);

    var table = document.getElementById("users-table");

    for (let i = 0; i < users.length; i++) {
        var row = document.createElement("tr");

        var cellUsername = document.createElement("td");
        var textUsername = document.createTextNode(users[i]["username"]);
        cellUsername.appendChild(textUsername);
        row.appendChild(cellUsername);

        var cellPassword = document.createElement("td");
        var textPassword = document.createTextNode(users[i]["password"]);
        cellPassword.appendChild(textPassword);
        row.appendChild(cellPassword);

        var cellName = document.createElement("td");
        var textName = document.createTextNode(users[i]["name"]);
        cellName.appendChild(textName);
        row.appendChild(cellName);

        var cellEMail = document.createElement("td");
        var textEMail = document.createTextNode(users[i]["email"]);
        cellEMail.appendChild(textEMail);
        row.appendChild(cellEMail);

        var cellAddress = document.createElement("td");
        var textAddress = document.createTextNode(users[i]["address"]);
        cellAddress.appendChild(textAddress);
        row.appendChild(cellAddress);

        var cellCity = document.createElement("td");
        var textCity = document.createTextNode(users[i]["city"]);
        cellCity.appendChild(textCity);
        row.appendChild(cellCity);

        var cellPostal = document.createElement("td");
        var textPostal = document.createTextNode(users[i]["postalcode"]);
        cellPostal.appendChild(textPostal);
        row.appendChild(cellPostal);

        var cellCountry = document.createElement("td");
        var textCountry = document.createTextNode(users[i]["country"]);
        cellCountry.appendChild(textCountry);
        row.appendChild(cellCountry);

        var cellPicture = document.createElement("td");
        var image = document.createElement("img");
        image.src = "data:image/png; base64," + users[i]["picture"];
        image.style.width = "100px";
        image.style.height = "100px";
        cellPicture.appendChild(image);
        row.appendChild(cellPicture);

        var cellButton = document.createElement("td");
        var button = document.createElement("button");

        button.innerHTML = "Edit";
        button.addEventListener('click', function () {
            let rowNumber = i + 1;
            EditRow(rowNumber);
        });
        cellButton.appendChild(button);
        row.appendChild(cellButton);
        
        var cellDeleteButton = document.createElement("td");
        var deleteButton = document.createElement("button");
        
        deleteButton.innerHTML = "Delete";
        deleteButton.addEventListener('click', function () {
            let rowNumber = i + 1;
            DeleteRow(rowNumber);
        });
        cellDeleteButton.appendChild(deleteButton);
        row.appendChild(cellDeleteButton);

        table.appendChild(row);
    }
}

function ClearInput() {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("address").value = "";
    document.getElementById("city").value = "";
    document.getElementById("postalcode").value = "";
    document.getElementById("country").value = "";
    document.getElementById("picture").value = "";
}

async function SubmitNewUser () {
    let submitButton = document.getElementById("submit-button");
    let baseurl = "//localhost/rest-api-2/api.php";

    let imageBase64string = await EncodeImageFromInput();
    
    const myheaders = new Headers();
    myheaders.append("Content-Type", "application/json");
    
    if (submitButton.value === "Edit") {
        console.log("Edit button clicked!");

        const response = await fetch(baseurl, {
            method: "PUT",
            body: JSON.stringify ({
                username: document.getElementById("username").value,
                password: document.getElementById("password").value,
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                address: document.getElementById("address").value,
                city: document.getElementById("city").value,
                postalcode: document.getElementById("postalcode").value,
                country: document.getElementById("country").value,
                picture: imageBase64string
            }),
            Headers: myheaders
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.error(error);
        });
    } else {
        console.log("Submit button clicked!");

        const response = await fetch(baseurl, {
            method: "POST",
            body: JSON.stringify ({
                username: document.getElementById("username").value,
                password: document.getElementById("password").value,
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                address: document.getElementById("address").value,
                city: document.getElementById("city").value,
                postalcode: document.getElementById("postalcode").value,
                country: document.getElementById("country").value,
                picture: imageBase64string
            }),
            Headers: myheaders
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.error(error);
        });

    }

    ClearInput();
    //location.reload();
}

window.onload = function () {
    document.getElementById("submit-button").onclick = function () {
        SubmitNewUser();
    }

    BuildTable();
}