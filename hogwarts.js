"use strict";

window.addEventListener("DOMContentLoaded", init);

const allStudents = [];
console.log(allStudents);

// ----- P R O T O T Y P E -----
const Student = {
  firstName: "unknown",
  //midName: "unknown",
  //nickname: "unknown",
  lastName: "unknown",
  gender: "unknown",
  //imageFileName: "unknown",
  house: "unknown",
};
//
//
//

// ------ I N I T I A T I N G --------
function init() {
  registerListeners();
  loadJSON();
  buttonsActive();
}
//
//
//

// ----------- L O A D I N G -------------
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
//
//
//
//
// --------- T H E  C A P I T A L I Z A T I O N ---------
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
  //console.log(capitalizedWord);
  if (capitalizedWord.trim()) {
    return capitalizedWord;
  } else {
    return "Non existing";
  }
};
//
//
//
//------------ P R E P A R I N G  D A T A  A F T E R  L O A D I N G ----------
const prepareObjects = (jsonData) => {
  jsonData.forEach((jsonObject) => {
    // New object with cleaned data - and store that in the allStudents array
    const student = Object.create(Student);
    //console.log(jsonObject);

    // ------------ C L E A N I N G  U P  T H E  J S O N -----------------

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
      midName = "Non existing";
      //console.log(nickname);
    }

    // ----------- F I N A L  C L E A N I N G  A N D  D I S P L A Y I N G ----------
    student.firstName = capitalize(firstName);
    //student.midName = capitalize(midName);
    //student.nickname = capitalize(nickname);
    student.lastName = capitalize(lastName);
    student.gender = capitalize(jsonObject.gender);
    //student.imageFileName = imageFileName; // have to somehow add imageFileNames!
    student.house = capitalize(jsonObject.house.trim());
    allStudents.push(student);
  });

  displayList(allStudents);
};
//
//
//
//
// ---------- EVENT LISTENERS  FOR THE FILTERS ----------------------------
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
    .querySelector("[data-sort=last-name]")
    .addEventListener("click", () => sortByLastName());
}

//
//
//
//
//
//
// ---------- F I L T E R I N G -------------------------//
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

//
//
//
//
//
//
//
//
// ---------- S O R T  I N G ---------------//
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

//
//
//
//
//
//
//
//

//---- SHOWING THE NUMBER OF STUDENTS IN THEIR RESPECTIVE BUTTONS --------
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

// --- CLEARING THE LIST AND THEN TAKING EACH STUDENT AND DISPLAYING IT ------------
const displayList = (studentList) => {
  //console.log(studentList);
  // clear the list
  document.querySelector("#table tbody").innerHTML = "";

  // display each student from the list that comes in as a parameter
  studentList.forEach(displayStudent);
};

// ------ TEMPLATE + CLONING + COPY + APPENDING -------------
const displayStudent = (student) => {
  // create clone
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  //clone.querySelector("[data-field=midName]").textContent = student.midName;
  //clone.querySelector("[data-field=nickname]").textContent = student.nickname;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=gender]").textContent = student.gender;
  //clone.querySelector("[data-field=imageFileName] img").src = student.imageFileName;
  clone.querySelector("[data-field=house] span").textContent = student.house;
  clone.querySelector("[data-field=house] img").src = student.house + ".svg";

  // append clone to table
  document.querySelector("#table tbody").appendChild(clone);
};

// ------------ T H E  A C T I V E  S T A T E  O F  T H E  B U T T O N S
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

// ------  T H E  S E A R C H * By name and house ------
// Getting the element
function searchThrough() {
  const searchBar = document.querySelector("#searchBar");
  //console.log(searchBar);
  searchBar.addEventListener("keyup", (e) => {
    const searchString = e.target.value;
    //console.log(student);
    const filteredStudents = allStudents.filter((student) => {
      return (
        student.firstName.toLowerCase().includes(searchString) ||
        student.lastName.toLowerCase().includes(searchString) ||
        student.house.toLowerCase().includes(searchString)
      );
    });
    displayList(filteredStudents);
  });
}

// ------ T H E  M O D A L -------
