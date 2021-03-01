"use strict";
window.addEventListener("DOMContentLoaded", init);

const allStudents = [];
const expelledStudents = [];
let hasBeenHacked = false;

let activeModalStudent = null;

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
  bloodStatus: "",
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
      loadJSON2(jsonData);
    });
};

//! FAMILIES J•SON

const loadJSON2 = (jsonData) => {
  fetch("https://petlatkea.dk/2021/hogwarts/families.json")
    .then((response) => response.json())
    .then((familiesData) => {
      // when loaded, prepare objects
      prepareObjects(jsonData, familiesData);
      showTotalNumber();
      searchThrough();
    });
};

//! ••••• Preparing data after loading •••••
const prepareObjects = (jsonData, familiesData) => {
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
    student.firstName = capitalize(firstName);
    student.midName = capitalize(midName);
    student.nickname = capitalize(nickname);
    student.lastName = capitalize(lastName);
    student.gender = capitalize(jsonObject.gender);
    student.imageFileName = imageFileName; // have to somehow add imageFileNames!
    student.house = capitalize(jsonObject.house.trim());
    student.prefect = false;
    student.iSquad = false;
    student.expelled = false;
    student.bloodStatus = determineBloodStatus(familiesData, student);
    allStudents.push(student);
  });
  displayList(allStudents);
};

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

  //*  REGARDING THE MODAL:
  // My first thought process: I wanna click on, say Pansy, and open the modal.Pansy is under the
  //.body-row (css class) therefore I have to first select it and add an eventListener to it.
  clone.querySelector(".body-row").addEventListener("click", () => {
    activeModalStudent = student;
    openModal();
  });
  // appending clone to table------------------------------
  document.querySelector("#table tbody").appendChild(clone);
};

//! ••••••  T H E  •  M O D A L •••••

function openModal() {
  const modal = document.querySelector("#modal");
  const modalBg = document.querySelector("#modal-background");
  // so that I can toggle the modal
  let student = activeModalStudent;
  //Changing the colors of the text in the modal
  modal.className = "";
  modal.classList.add(student.house.toLowerCase());
  //house
  modal.querySelector(".modal-house").textContent = student.house;
  //full names with mids and nicknames
  modal.querySelector(".modal-student").textContent =
    student.firstName +
    " " +
    student.midName +
    " " +
    student.nickname +
    " " +
    student.lastName;
  //gender
  modal.querySelector(".gender").textContent = student.gender;
  //images
  modal.querySelector(".modal-upside img").src = student.imageFileName;
  //blodd status
  modal.querySelector(".modal-blood-status").textContent = student.bloodStatus;

  //? BADGES CHANGE WHEN THE STATUS OF THE STUDENT CHANGES
  //the default badge
  let badgeSrc = `./${student.house}.svg`;
  const prefectBtn = modal.querySelector(".modal-prefect-btn");
  const iSquaqBtn = modal.querySelector(".modal-i-squad-btn");
  //prefect badge and text
  if (student.prefect) {
    badgeSrc = "./PrefectsBadge.svg";
    prefectBtn.textContent = "Revoke prefect";
  } else {
    prefectBtn.textContent = "Appoint prefect";
  }
  //i-Squad badge and text
  if (student.iSquad) {
    iSquaqBtn.textContent = "Remove from Inq-Squad";
    modal.querySelector(".iSquadBadge").classList.remove("hidden");
  } else {
    iSquaqBtn.textContent = "Add to Inquisitorial Squad";
    modal.querySelector(".iSquadBadge").classList.add("hidden");
  }
  //expelled "mode"
  if (student.expelled) {
    modal.querySelector(".expelled-overlay").classList.add("active");
  } else {
    modal.querySelector(".expelled-overlay").classList.remove("active");
  }
  modal.querySelector(".badge").src = badgeSrc;
  modalBg.classList.add("show");
}

//?  APPOINT PREFECT
// todo: don't let more than 2 from the same house
// todo: a boy and a girl from the house, preferably.
function togglePrefect() {
  // the long version of the toggle:
  /* if (student.prefect === true) {
      student.prefect = false;
    } else {
      student.prefect = true;
    } */
  // the short version of the code above
  activeModalStudent.prefect = !activeModalStudent.prefect;
  // refresh the modal
  openModal();
}
modal
  .querySelector(".modal-prefect-btn")
  .addEventListener("click", togglePrefect);

//? ADD TO I-SQUAD
// Make it only able to add pure-bloods and the ones from Slytherin
//while the rest get the alert with the text.
modal.querySelector(".modal-i-squad-btn").addEventListener("click", () => {
  if (
    activeModalStudent.bloodStatus === "Pure-blood" ||
    activeModalStudent.house === "Slytherin"
  ) {
    activeModalStudent.iSquad = !activeModalStudent.iSquad;
  } else {
    alert(
      `Not pure-blood nor part of the Slytherin house,
      therefore not eligible to be part of the Inquisitorial Squad`
    );
  }
  // refresh the modal
  openModal();
});

//? EXPEL student and remove from allStudents list
modal.querySelector(".modal-expel-btn").addEventListener("click", () => {
  if (hasBeenHacked === true && activeModalStudent.firstName === "Alexandra") {
    alert("Cannot expel me, yo!");
    return;
  }
  activeModalStudent.expelled = true;
  //find the index of the active student
  let index = allStudents.indexOf(activeModalStudent);
  //remove from the  allStudents list
  allStudents.splice(index, 1);
  //add student to the expelledStudent[]
  expelledStudents.push(activeModalStudent);
  // refresh the modal
  openModal();
});

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

//// ••••• The active state of the buttons •••••
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

//// ••••• THE  SEARCH •••••
// Getting the element
function searchThrough() {
  const searchBar = document.querySelector("#searchBar");
  //console.log(searchBar);
  searchBar.addEventListener("keyup", (e) => {
    const searchString = e.target.value.toLowerCase();
    const filteredStudents = allStudents.filter((student) => {
      return (
        student.firstName.toLowerCase().includes(searchString) ||
        student.lastName.toLowerCase().includes(searchString)
      );
    });
    displayList(filteredStudents);
  });
}

//// ••••• EventListeners for FILTERS + MODAL •••••
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
    .querySelector("[data-filter=all]")
    .addEventListener("click", () => filterListByHouse("all"));
  document
    .querySelector("[data-sort=last-name]")
    .addEventListener("click", (event) => sortByLastName(event.target));
  document
    .querySelector("[data-sort=first-name]")
    .addEventListener("click", (event) => sortByFirstName(event.target));
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

//// ••••• F I L T E R I N G •••••
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
  let filteredList = expelledStudents;
  filteredList = expelledStudents.filter(isExpelled);
  displayList(filteredList);
}
// todo: remove from student list once expelled
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

//// ••••• S O R T I N G •••••
// todo: THE Z-A PART (direction change)

function sortByFirstName(target) {
  const direction = target.dataset.direction;
  let order = -1;
  if (direction === "ascending") {
    order = 1;
    target.dataset.direction = "descending";
  } else {
    target.dataset.direction = "ascending";
  }
  let sortedList = allStudents;
  sortedList = allStudents.sort((student1, student2) => {
    if (student1.firstName < student2.firstName) {
      return -1 * order;
    } else {
      return 1 * order;
    }
  });

  displayList(sortedList);
}

function sortByLastName(target) {
  const direction = target.dataset.direction;
  let order = -1;
  if (direction === "ascending") {
    order = 1;
    target.dataset.direction = "descending";
  } else {
    target.dataset.direction = "ascending";
  }
  let sortedList = allStudents;
  sortedList = allStudents.sort((student1, student2) => {
    if (student1.lastName < student2.lastName) {
      return -1 * order;
    } else {
      return 1 * order;
    }
  });
  displayList(sortedList);
}

//// ••••• SHOW total students and house totals •••••
function showTotalNumber() {
  const all = allStudents.length;
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

//// ••••• CAPITALIZATION •••••
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

//? Blood status
function determineBloodStatus(familiesData, student) {
  const pureBlood = familiesData.pure.includes(student.lastName);
  const halfBlood = familiesData.half.includes(student.lastName);
  if (halfBlood === true) {
    return "Half-blood";
  } else if (pureBlood === true) {
    return "Pure-blood";
  } else {
    return "Muggle";
  }
}
//! ••••• THE TITLESCREEN •••••
document.querySelector(".ts-bg button").addEventListener("click", () => {
  document.querySelector(".ts-bg").classList.add("hidden");
});

//! •••••• HACK THE STYSTEM ••••••

function hackTheSystem() {
  const myself = Object.create(Student);
  myself.firstName = "Alexandra";
  myself.lastName = "Maracinaru";
  myself.midName = "";
  myself.nickname = "";
  myself.imageFileName = "myself.png";
  myself.house = "Ravenclaw";
  myself.gender = "Girl";
  myself.prefect = true;
  myself.expelled = false;
  myself.bloodStatus = "Pure-blood, baby!";
  myself.iSquad = true;
  allStudents.unshift(myself);
  displayList(allStudents);
  hasBeenHacked = true;
}

//? expelling pseudocode
// click on 'Expel' in the modal
// remove class hidden
// write 'Expelled'
// create a different array for the expelled students
// remove them from allStudents
// add them to the expelledStudents

//? prefects pseudocode
// click on 'Make prefect' in the modal
// replace the house badge with the prefect badge
// replace 'Make prefect' with 'Revoke prefect'
// show outside the modal when clicked on 'prefects' filter
// return to house badge when clicked on 'Revoke prefect'

//? Blood status pseudocode
// load the other json
// extract the bloods by last name of the student
// if student.pure === true, return 'Pure-blood'
// else if student.half === ture, return 'Half-blood'
// else just 'Muggle'
// if student.pure -> eligible for inquisitorial squad
// medd up the blood when hackTheSystem (blood-type random?!)

//? hackTheSystem function
// insert my name into the allStudents
// when click on 'Expel' alert 'Cannot expel, duh!'
