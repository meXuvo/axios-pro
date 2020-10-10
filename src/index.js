import axios from "axios";

const BASE_URL = "http://localhost:3007/profile";

//for ajax request
window.onload = function () {
  let tbody = document.querySelector("#tbody");

  //GET data from server and fill the table when page loaded
  axios
    .get(BASE_URL)
    .then((res) => {
      res.data.forEach((profile) => {
        createTDElement(profile, tbody);
      });
    })
    .catch();

  // Add EventListener to Save Contact Button
  let saveContactBtn = document.querySelector("#saveContact");
  saveContactBtn.addEventListener("click", function () {
    createNewElement();
  });
};

//create new element
function createNewElement() {
  let nameField = document.querySelector("#nameField");
  let phoneField = document.querySelector("#phoneField");
  let emailField = document.querySelector("#emailField");

  let profile = {
    name: nameField.value,
    phone: phoneField.value,
    email: emailField.value,
  };
  axios
    .post(BASE_URL, profile)
    .then((res) => {
      let tbody = document.querySelector("#tbody");
      createTDElement(res.data, tbody);

      nameField.value = "";
      phoneField.value = "";
      emailField.value = "";
    })
    .catch((err) => console.log(err));
}

//new add tableData element and appeding html document
function createTDElement(profile, parentElement) {
  //make tr element for parentElement
  const TR = document.createElement("tr");

  //make 4 td element (name,phone,email)  for tr
  //1
  const tdName = document.createElement("td");
  tdName.innerHTML = profile.name ? profile.name : "";
  TR.appendChild(tdName);

  //2
  const tdPhone = document.createElement("td");
  tdPhone.innerHTML = profile.phone ? profile.phone : "";
  TR.appendChild(tdPhone);

  //3
  const tdEmail = document.createElement("td");
  tdEmail.innerHTML = profile.email ? profile.email : "";
  TR.appendChild(tdEmail);

  //4
  const tdAction = document.createElement("td");
  //edit button and delete button for tdAction
  const tdEdit = document.createElement("button");
  tdEdit.className = "btn btn-warning uppercase";
  tdEdit.innerHTML = "edit";
  tdEdit.addEventListener("click", function () {
    let mainModal = $("#contactEditModal");
    mainModal.modal("toggle");

    let editName = document.querySelector("#edit-name");
    let editPhone = document.querySelector("#edit-phone");
    let editEmail = document.querySelector("#edit-email");

    editName.value = profile.name;
    editPhone.value = profile.phone ? profile.phone : "";
    editEmail.value = profile.email ? profile.email : "";

    let updateBtn = document.querySelector("#updateContact");
    updateBtn.addEventListener("click", function () {
      axios
        .put(`${BASE_URL}/${profile.id}`, {
          name: editName.value,
          phone: editPhone.value,
          email: editEmail.value,
        })
        .then((res) => {
          tdName.innerHTML = res.data.name;
          tdPhone.innerHTML = res.data.phone;
          tdEmail.innerHTML = res.data.email;

          mainModal.modal("hide");
        })
        .catch((err) => console.log(err));
    });
  });
  tdAction.appendChild(tdEdit);

  const tdDelete = document.createElement("button");
  tdDelete.className = "btn btn-danger uppercase";
  tdDelete.innerHTML = "Delete";
  tdDelete.addEventListener("click", function () {
    axios
      .delete(`${BASE_URL}/${profile.id}`)
      .then((res) => {
        parentElement.removeChild(TR);
      })
      .catch((err) => console.log(err));
  });
  tdAction.appendChild(tdDelete);
  TR.appendChild(tdAction);

  //finally appending TR
  parentElement.appendChild(TR);
}
