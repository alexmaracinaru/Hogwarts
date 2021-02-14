"use strict";

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];

// ----- P R O T O T Y P E -----

const Student = {
  firstName: "unknown",
  midName: "unknown",
  nickname: "unknown",
  lastName: "unknown",
  gender: "unknown",
  imageFileName: "unknown",
  house: "unknown",
};

function start() {
  console.log("ready");

  loadJSON();
}

function loadJSON() {
  fetch("./students.json")
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare objects
      prepareObjects(jsonData);
    });
}

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
  console.log(capitalizedWord)
  if (capitalizedWord.trim()) {
    return capitalizedWord;
  } else {
    return "Non existing"
  }
  
};

function prepareObjects(jsonData) {
  jsonData.forEach((jsonObject) => {
    // New object with cleaned data - and store that in the allStudents array
    const student = Object.create(Student);
    console.log(jsonObject);

    const rawFullName = jsonObject.fullname.trim();
    const firstLetter = rawFullName.substring(0, 1);
    const firstSpace = rawFullName.indexOf(" ");
    const firstName =
      firstLetter.toUpperCase() + rawFullName.substring(1, firstSpace);
    const lastSpace = rawFullName.lastIndexOf(" ");
    const lastName = rawFullName.substring(lastSpace + 1);
    const midfirstLetter = rawFullName.substring(firstSpace + 1).toUpperCase();
    let midName = rawFullName.substring(firstSpace + 1, lastSpace);
    const imageFileName = ('./images/' +lastName + "_" + firstLetter + ".png").toLowerCase();
let nickname = "";
    if (midName.startsWith('"') && midName.endsWith('"')) {
      nickname = midName;
     midName = "Non existing";
      console.log(nickname);
    }

    /* The following should be changed, as the positions vary depending on if the
    student has a middle name or nickname also */
    student.firstName = capitalize(firstName);
    student.midName = capitalize(midName);
    student.nickname = capitalize(nickname);
    student.lastName = capitalize(lastName);
    student.gender = capitalize(jsonObject.gender);
    student.imageFileName = imageFileName; // have to somehow add imageFileNames!
    student.house = capitalize(jsonObject.house.trim());
    allStudents.push(student);
  });

  displayList();
}

function displayList() {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  allStudents.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=midName]").textContent = student.midName;
  clone.querySelector("[data-field=nickname]").textContent = student.nickname;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=gender]").textContent = student.gender;
  clone.querySelector("[data-field=imageFileName] img").src = student.imageFileName;
  clone.querySelector("[data-field=house]").textContent = student.house;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
