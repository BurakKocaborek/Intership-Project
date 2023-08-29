document.body.append(document.createElement('textarea'));
document.body.append(document.createElement('button'));
const text = document.querySelector('textarea').value;
let data;
let loginType;
var table = document.getElementById('myTable');

const buildtable = function (data) {
  let curr = '';
  for (let i = 0; i < data.data.length; i++) {
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
  table.innerHTML = curr;
  return data;
};

const deleteUser = function (userID) {
  fetch('https://reqres.in/api/users?page=2')
    .then(response => {
      if (response.status != 200) throw response.status;
      else {
        data.data?.splice(userID, 1);
        buildtable(data);
      }
    })
    .catch(error => console.log(error));
};

const deleteBtnHandler = userId => {
  if (loginType === 'Admin') {
    let a = confirm('Are you sure?');
    if (a === true) deleteUser(userId);
  }
};

const hideBox = function () {
  document.querySelector('.popUp').style.display = 'none';
};

const hideBox2 = function () {
  document.querySelector('.popUpAddUser').style.display = 'none';
};

const editUser = function (userId) {
  document.querySelector('.popUp').style.display = 'block';
  document.querySelector('.sendbtn').addEventListener('click', function () {
    fetch('https://reqres.in/api/users/2')
      .then(response => {
        if (response.status != 200) throw response.status;
        else {
          let userMail = document.querySelector('#email').value;
          let userFirstName = document.querySelector('#firstname').value;
          let userLastName = document.querySelector('#lastname').value;

          data.data[userId].first_name = userFirstName;
          data.data[userId].email = userMail;
          data.data[userId].last_name = userLastName;

          buildtable(data);
        }
      })
      .catch(error => console.log(error));

    document.querySelector('.popUp').style.display = 'none';
  });
  /*
  let userName = document.querySelector('.form-element').FirstName;
  let userId = document.querySelector('.form-element').Id;
  let userLastName = document.querySelector('.form-element').LastName;
  */
  // console.log(userMail);
};

const editBtnHandler = userId => {
  if (loginType === 'Admin') editUser(userId);
};

document.querySelector('.Okbtn').addEventListener('click', function () {
  let userName = document.querySelector('.Username').value;
  let password = document.querySelector('.Password').value;

  if (userName === 'Lorem Ipsum' && password == '1923') loginType = 'Admin';
  else if (userName == 'Guest User' && password === '1919') loginType = 'Guest';
  else console.log('Failed');

  fetch('https://reqres.in/api/users?page=1')
    .then(x => x.json())
    .then(a => {
      data = a;
      buildtable(a);
    })
    .catch(error => console.log(error));

  if (loginType === 'Admin') {
    document
      .querySelector('.newuserbtn')
      .addEventListener('click', function () {
        document.querySelector('.popUpAddUser').style.display = 'block';
        document
          .querySelector('.sendbtn2')
          .addEventListener('click', function () {
            let userMail2 = document.querySelector('#email2').value;
            let userFirstName2 = document.querySelector('#firstname2').value;
            let userLastName2 = document.querySelector('#lastname2').value;
            let userId = document.querySelector('#id2').value;
            const o = new Object();
            o.first_name = userFirstName2;
            o.email = userMail2;
            o.last_name = userLastName2;
            o.id = userId;
            fetch('https://reqres.in/api/users', {
              method: 'POST',
              body: JSON.stringify({
                first_name: o.first_name,
                email: o.email,
                last_name: o.last_name,
                id: o.id,
              }),
            })
              .then(response => {
                if (response.status != 201) {
                  throw response.status;
                } else {
                  data.data.push(o);
                  buildtable(data);
                }
              })
              .catch(error => console.log(error));
            document.querySelector('.popUpAddUser').style.display = 'none';
          });

        /* document.querySelector('.sendbtn2').addEventListener('click', function () {
      console.log(data.data);
    }); */
      });
  }
});
