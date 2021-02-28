"use strict";

window.addEventListener("DOMContentLoaded", init);

const allStudents = [];
//! PROTOTYPE
const Student = {
  firstName: "unknown",
  midName: "",
  nickname: "",
  lastName: "unknown",
  gender: "unknown",
  imageFileName: "",
  house: "unknown",
  prefect: false,
  iSquad: false,
  expelled: false,
};

//! INITIALIZING
function init() {
  registerListeners();
  loadJSON();
  buttonsActive();
}

//! LOADING  J•SON
const loadJSON = () => {
  fetch("./students.json")
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare objects
      prepareObjects(jsonData);
      showTotalNumber();
      searchThrough();
    });
};

//! FAMILY  J•SON

/* const loadJSON2 = () => {
  fetch("https://petlatkea.dk/2021/hogwarts/families.json")
    .then((response) => response.json())
    .then((familiesData) => {
      prepareFamilyStatus(familiesData);
    });
}; */

//! ••••• CAPITALIZATION •••••

const capitalize = (word) => {
  let capitalizedWord;
  const firstL = word.substring(0, 1).toUpperCase();

  if (word.includes("-")) {
    const firstHyphenIndex = word.indexOf("-");
    const firstRemainingLetters = word
      .substring(1, firstHyphenIndex)
      .toLowerCase();
    const firstLetterAfterHyphen = word
      .substring(firstHyphenIndex + 1, firstHyphenIndex + 2)
      .toUpperCase();
    const secondRemainingLetters = word
      .substring(firstHyphenIndex + 2)
      .toLowerCase();
    capitalizedWord =
      firstL +
      firstRemainingLetters +
      "-" +
      firstLetterAfterHyphen +
      secondRemainingLetters;
  } else {
    const remainingLetters = word.substring(1).toLowerCase();
    capitalizedWord = firstL + remainingLetters;
  }
  if (capitalizedWord.trim()) {
    return capitalizedWord;
  } else {
    return "";
  }
};

//! ••••• Preparing data after loading •••••
const prepareObjects = (jsonData) => {
  jsonData.forEach((jsonObject) => {
    // New object with cleaned data + store it in the allStudents array.
    const student = Object.create(Student);
    //?Cleaning up the Json
    const rawFullName = jsonObject.fullname.trim();
    const firstLetter = rawFullName.substring(0, 1);
    const firstSpace = rawFullName.indexOf(" ");
    const firstName =
      firstLetter.toUpperCase() + rawFullName.substring(1, firstSpace);
    const lastSpace = rawFullName.lastIndexOf(" ");
    const lastName = rawFullName.substring(lastSpace + 1);
    const midfirstLetter = rawFullName.substring(firstSpace + 1).toUpperCase();
    let midName = rawFullName.substring(firstSpace + 1, lastSpace);
    const imageFileName = (
      "./images/" +
      lastName +
      "_" +
      firstLetter +
      ".png"
    ).toLowerCase();
    let nickname = "";
    if (midName.startsWith('"') && midName.endsWith('"')) {
      nickname = midName;
      midName = "";
    }
    //?Final cleaning and displaying
    student.prefect = false;
    student.expelled = false;
    student.iSquad = false;
    student.firstName = capitalize(firstName);
    student.midName = capitalize(midName);
    student.nickname = capitalize(nickname);
    student.lastName = capitalize(lastName);
    student.gender = capitalize(jsonObject.gender);
    student.imageFileName = imageFileName; // have to somehow add imageFileNames!
    student.house = capitalize(jsonObject.house.trim());
    allStudents.push(student);
  });
  displayList(allStudents);
};

// todo THE Z-A PART OF IT!!!!!!

//? Clearing the list, taking eash student and displaying it
const displayList = (studentList) => {
  // clear the list
  document.querySelector("#table tbody").innerHTML = "";
  // display each student from the list that comes in as a parameter
  studentList.forEach(displayStudent);
};

//! ••••• TEMPLATE + CLONING + APPENDING  + !!!MODAL!!! •••••
const displayStudent = (student) => {
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=gender]").textContent = student.gender;
  clone.querySelector("[data-field=house] span").textContent = student.house;
  clone.querySelector("[data-field=house] img").src = student.house + ".svg";
  //* ••••• REGARDING THE MODAL •••••
  // My first thought process: I wanna click on, say Pansy, and open the modal.Pansy is under the
  //.body-row (css class) therefore I have to first select it and add an eventListener to it.
  clone.querySelector(".body-row").addEventListener("click", () => {
    openModal(student);
  });

  // appending clone to table------------------------------
  document.querySelector("#table tbody").appendChild(clone);
};

//! ••••••  T H E   M O D A L •••••

function openModal(student) {
  const modal = document.querySelector("#modal");
  const modalBg = document.querySelector("#modal-background");
  modal
    .querySelector(".modal-prefect-btn")
    .removeEventListener("click", togglePrefect);
  //one way of changing the colors.
  modal.className = "";
  modal.classList.add(student.house.toLowerCase());

  // ONE WAY OF CHANGING COLORS -------------------------------
  /*  modal.querySelector(
    ".modal-text-up"
  ).style.color = `var(--${student.house.toLowerCase()})`; */
  //ANOTHER WAT OF CHANGING COLORS
  modal.querySelector(".modal-house").textContent = student.house;
  console.log(student);
  modal.querySelector(".modal-student").textContent =
    student.firstName +
    " " +
    student.midName +
    " " +
    student.nickname +
    " " +
    student.lastName;
  modal.querySelector(".gender").textContent = student.gender;
  modal.querySelector(".modal-upside img").src = student.imageFileName;

  //* REPLACING BADGES WHEN THE STATUS OF THE STUDENT CHANGES
  let badgeSrc = `./${student.house}.svg`;
  const prefectBtn = modal.querySelector(".modal-prefect-btn");
  const iSquaqBtn = modal.querySelector(".modal-i-squad-btn");
  const expelBtn = modal.querySelector(".modal-expel-btn");
  if (student.prefect) {
    badgeSrc = "./PrefectsBadge.svg";
    prefectBtn.textContent = "Revoke prefect";
  } else {
    prefectBtn.textContent = "Appoint prefect";
  }
  if (student.iSquad) {
    iSquaqBtn.textContent = "Remove from Inq-Squad";
    modal.querySelector(".iSquadBadge").classList.remove("hidden");
  } else {
    iSquaqBtn.textContent = "Add to Inquisitorial Squad";
    modal.querySelector(".iSquadBadge").classList.add("hidden");
  }
  if (student.expelled) {
    modal.querySelector(".expelled-overlay").classList.add("active");
  } else {
    modal.querySelector(".expelled-overlay").classList.remove("active");
  }
  modal.querySelector(".badge").src = badgeSrc;

  modalBg.classList.add("show");

  // *  APPOINT PREFECT EVENT
  function togglePrefect() {
    // √ toggle prefect and return to house svg
    //? the long version of the toggle
    /* if (student.prefect === true) {
      student.prefect = false;
    } else {
      student.prefect = true;
    } */
    //? the short version of the code above
    student.prefect = !student.prefect;
    // refresh the modal
    openModal(student);
  }
  modal
    .querySelector(".modal-prefect-btn")
    .addEventListener("click", togglePrefect, { once: true });

  // * ADD TO I-SQUAD EVENT
  modal.querySelector(".modal-i-squad-btn").addEventListener("click", () => {
    student.iSquad = true;
    // refresh the modal
    openModal(student);
  });
  // * EXPEL EVENT
  modal.querySelector(".modal-expel-btn").addEventListener("click", () => {
    student.expelled = true;
    // todo add a layer (multiply mode) and the word "EXPELLED"
    // refresh the modal
    openModal(student);
  });
}

// closing the modal when clicking X
document.querySelector(".close-btn").addEventListener("click", () => {
  const modal = document.querySelector("#modal-background");
  modal.classList.remove("show");
});
// closing the modal when clicking on the background also
const modalBg = document.querySelector("#modal-background");
modalBg.addEventListener("click", (event) => {
  // if clicked element (event.target) is the same as the modal background then we want to hide the modal
  // otherwise the click was inside the modal and we don't want to close it
  if (event.target === modalBg) {
    modalBg.classList.remove("show");
  }
});

//* The active state of the buttons_______________________________
function buttonsActive() {
  document.querySelectorAll("button.filter").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("button.filter").forEach((button) => {
        button.classList.remove("active");
      });
      button.classList.add("active");
    });
  });
}

//* THE  SEARCH_______________________________________________
// Getting the element
function searchThrough() {
  const searchBar = document.querySelector("#searchBar");
  //console.log(searchBar);
  searchBar.addEventListener("keyup", (e) => {
    const searchString = e.target.value.toLowerCase();
    //console.log(student);
    const filteredStudents = allStudents.filter((student) => {
      return (
        student.firstName.toLowerCase().includes(searchString) ||
        student.lastName.toLowerCase().includes(searchString)
      );
    });
    displayList(filteredStudents);
  });
}

//* EventListeners for FILTERS + MODAL_________________________________
function registerListeners() {
  document
    .querySelector("[data-filter=gryffindor]")
    .addEventListener("click", () => filterListByHouse("gryffindor"));
  document
    .querySelector("[data-filter=slytherin]")
    .addEventListener("click", () => filterListByHouse("slytherin"));
  document
    .querySelector("[data-filter=ravenclaw]")
    .addEventListener("click", () => filterListByHouse("ravenclaw"));
  document
    .querySelector("[data-filter=hufflepuff]")
    .addEventListener("click", () => filterListByHouse("hufflepuff"));
  document
    .querySelector("[data-filter=girls]")
    .addEventListener("click", () => filterListByGender("girl"));
  document
    .querySelector("[data-filter=boys]")
    .addEventListener("click", () => filterListByGender("boy"));
  document
    .querySelector("[data-filter=boys]")
    .addEventListener("click", () => filterListByGender("boy"));
  document
    .querySelector("[data-sort=first-name]")
    .addEventListener("click", () => sortByFirstName());
  document
    .querySelector("[data-filter=prefects]")
    .addEventListener("click", () => filterListByPrefect());
  document
    .querySelector("[data-filter=i-squad]")
    .addEventListener("click", () => filterListByInqSquad());
  document
    .querySelector("[data-filter=expelled]")
    .addEventListener("click", () => filterListByExpelled());
}

//* F I L T E R I N G______________________________
function filterListByHouse(studentsHouse) {
  let filteredList = allStudents;
  if (studentsHouse === "gryffindor") {
    //create a list with only the Gryffindors
    filteredList = allStudents.filter(isGryffindor);
  } else if (studentsHouse === "slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (studentsHouse === "hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (studentsHouse === "ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else {
    filteredList = allStudents;
  }
  displayList(filteredList);
}
function filterListByGender(studentGender) {
  let filteredList = allStudents;
  if (studentGender === "girl") {
    filteredList = allStudents.filter(isGirl);
  } else {
    filteredList = allStudents.filter(isBoy);
  }
  displayList(filteredList);
}
function filterListByPrefect() {
  let filteredList = allStudents;
  filteredList = allStudents.filter(isPrefect);
  displayList(filteredList);
}
function filterListByInqSquad() {
  let filteredList = allStudents;
  filteredList = allStudents.filter(isInqSquad);
  displayList(filteredList);
}
function filterListByExpelled() {
  let filteredList = allStudents;
  filteredList = allStudents.filter(isExpelled);
  displayList(filteredList);
}

function isGryffindor(student) {
  console.log(student.house);
  return student.house === "Gryffindor";
}
function isSlytherin(student) {
  console.log(student.house);
  return student.house === "Slytherin";
}
function isHufflepuff(student) {
  console.log(student.house);
  return student.house === "Hufflepuff";
}
function isRavenclaw(student) {
  //console.log(student.house);
  return student.house === "Ravenclaw";
}
function isGirl(student) {
  return student.gender === "Girl";
}
function isBoy(student) {
  return student.gender === "Boy";
}

function isPrefect(student) {
  return student.prefect === true;
}
function isInqSquad(student) {
  return student.iSquad === true;
}
function isExpelled(student) {
  return student.expelled === true;
}
//* S O R T I N G_________________________
function sortByFirstName() {
  let sortedList = allStudents;
  sortedList = allStudents.sort(byFirstName);
  displayList(sortedList);
}

function sortByLastName() {
  let sortedList = allStudents;
  sortedList = allStudents.sort(byLastName);
  displayList(sortedList);
}
function byFirstName(student1, student2) {
  if (student1.firstName < student2.firstName) {
    return -1;
  } else {
    return 1;
  }
}
function byLastName(student1, student2) {
  if (student1.lastName < student2.lastName) {
    return -1;
  } else {
    return 1;
  }
}
//* SHOWING  nº OF STUDENTS IN THE BUTTONS
function showTotalNumber() {
  const all = allStudents.length;
  //console.log(all);
  console.log(allStudents.length);
  document.querySelector(".filter.all-students span").textContent = all;
  const onlyGryffindorNumber = allStudents.filter(isGryffindor).length;
  document.querySelector(
    ".filter.gryffindor span"
  ).textContent = onlyGryffindorNumber;
  const onlySlytherinNumber = allStudents.filter(isSlytherin).length;
  document.querySelector(
    ".filter.slytherin span"
  ).textContent = onlySlytherinNumber;
  const onlyRavenclawNumber = allStudents.filter(isRavenclaw).length;
  document.querySelector(
    ".filter.ravenclaw span"
  ).textContent = onlyRavenclawNumber;
  const onlyHufflepuffNumber = allStudents.filter(isHufflepuff).length;
  document.querySelector(
    ".filter.hufflepuff span"
  ).textContent = onlyHufflepuffNumber;
}
