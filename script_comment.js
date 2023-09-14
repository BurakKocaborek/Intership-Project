// Create a textarea and button element and append them to the document body
// text alanı ve buton elemanı oluşturup dosya body'sine eklendi.
document.body.append(document.createElement("textarea"));
document.body.append(document.createElement("button"));

// Initialize variables
const text = document.querySelector("textarea").value;
let data;
let loginType;
var table = document.getElementById("myTable");

// Function to build a table from data
// API verileriyle tablo olusturan fonksyon
const buildtable = function (data) {
  let curr = "";
  for (let i = 0; i < data.data.length; i++) {
    // Create table rows with user data
    // Tablo satırlarını kullanıcı bilgileriyle doldur
    let row = `<tr>
                    <td><img src=${data.data[i].avatar} <img/></td>
                    <td>${data.data[i].email}</td>
                    <td>${data.data[i].first_name}</td>
                    <td>${data.data[i].id}</td>
                    <td>${data.data[i].last_name}</td>
                    <td><input onClick = "editBtnHandler(${i})" class = "Editbtn${i} btnHandler" type = button value = Edit /> <input onClick ="deleteBtnHandler(${i})" class = "Deletebtn${i} btnHandler" type = button value = Delete /></td>
                    </tr>`;
    curr += row;
  }
  // Set the inner HTML of the table element to the generated rows
  // oluşturulan tabloyu html dosyasına koy
  table.innerHTML = curr;
  return data;
};

// Function to delete a user
// Kullanıcı silmek için kullanılan fonksiyon
const deleteUser = function (userID) {
  fetch("https://reqres.in/api/users?page=2")
    .then((response) => {
      if (response.status != 200) throw response.status;
      else {
        // Remove the user from the data and rebuild the table
        data.data?.splice(userID, 1);
        buildtable(data);
      }
    })
    .catch((error) => console.log(error));
};

// Function to handle delete button click
// Sil butonu ile ilgilenen fonksiyon
const deleteBtnHandler = (userId) => {
  if (loginType === "Admin") {
    // Display a confirmation dialog and delete the user if confirmed
    let a = confirm("Are you sure?");
    if (a === true) deleteUser(userId);
  }
};

// Function to hide a pop-up box
// popup kutusu  gizleme ile ilgilenen fonksiyon
const hideBox = function () {
  document.querySelector(".popUp").style.display = "none";
};

// Function to hide another pop-up box
// popup kutusu gizlemekle ilgilenen bir başka fonksiyon(farklı popuplar)
const hideBox2 = function () {
  document.querySelector(".popUpAddUser").style.display = "none";
};

// Function to edit a user's information
// Kullanıcı bilgilerini düzenleyen fonksiyon
const editUser = function (userId) {
  // Display the edit user pop-up box
  // Düzenle popup'ını göster
  document.querySelector(".popUp").style.display = "block";
  document.querySelector(".sendbtn").addEventListener("click", function () {
    fetch("https://reqres.in/api/users/2")
      .then((response) => {
        if (response.status != 200) throw response.status;
        else {
          // Update user information and rebuild the table
          let userMail = document.querySelector("#email").value;
          let userFirstName = document.querySelector("#firstname").value;
          let userLastName = document.querySelector("#lastname").value;

          data.data[userId].first_name = userFirstName;
          data.data[userId].email = userMail;
          data.data[userId].last_name = userLastName;

          buildtable(data);
        }
      })
      .catch((error) => console.log(error));

    // Hide the edit user pop-up box
    // Kullanıcı düzenle popup kutusunu gizle
    document.querySelector(".popUp").style.display = "none";
  });
};

// Function to handle edit button click
// edit butonuyla ilgilenen fonksiyon
const editBtnHandler = (userId) => {
  if (loginType === "Admin") editUser(userId);
};

// Function to handle login and load user data
// kullanıcı login ve kullanıcı load ile ilgili fonksiyon
document.querySelector(".Okbtn").addEventListener("click", function () {
  let userName = document.querySelector(".Username").value;
  let password = document.querySelector(".Password").value;

  if (userName === "Lorem Ipsum" && password == "1923") loginType = "Admin";
  else if (userName == "Guest User" && password === "1919") loginType = "Guest";
  else console.log("Failed");

  // Fetch user data based on login type
  // Login tipine göre API call fonksyionu
  fetch("https://reqres.in/api/users?page=1")
    .then((x) => x.json())
    .then((a) => {
      data = a;
      buildtable(a);
    })
    .catch((error) => console.log(error));

  if (loginType === "Admin") {
    // Show the "Add User" pop-up box for Admin users
    // Admin kullanıcıları için Kullanıcı ekle popup'ı
    document
      .querySelector(".newuserbtn")
      .addEventListener("click", function () {
        document.querySelector(".popUpAddUser").style.display = "block";
        document
          .querySelector(".sendbtn2")
          .addEventListener("click", function () {
            // Create a new user and add it to the data, then rebuild the table
            let userMail2 = document.querySelector("#email2").value;
            let userFirstName2 = document.querySelector("#firstname2").value;
            let userLastName2 = document.querySelector("#lastname2").value;
            let userId = document.querySelector("#id2").value;
            const o = new Object();
            o.first_name = userFirstName2;
            o.email = userMail2;
            o.last_name = userLastName2;
            o.id = userId;
            fetch("https://reqres.in/api/users", {
              method: "POST",
              body: JSON.stringify({
                first_name: o.first_name,
                email: o.email,
                last_name: o.last_name,
                id: o.id,
              }),
            })
              .then((response) => {
                if (response.status != 201) {
                  throw response.status;
                } else {
                  data.data.push(o);
                  buildtable(data);
                }
              })
              .catch((error) => console.log(error));
            // Hide the "Add User" pop-up box
            // Kullanıcı ekle popup'ını gizle
            document.querySelector(".popUpAddUser").style.display = "none";
          });
      });
  }
});
