"use strict";

//Regex variables
const USERNAME_REGEX = "^[a-z0-9]{4,12}$";
const EMAIL_REGEX = "^\\w+@[a-zA-Z]+(.com|.net|.org|.edu)$";
const PHONE_REGEX = "\\d{3}-\\d{3}-\\d{4}";

//Get elements of the input form
const formElements = document.getElementById("myForm").elements;

//Set up initial values
init();

//Call clearInput at page load to clear any prior data
clearInput();

/**
 * Clears the input of all form elements. Also clears radio buttons/checkboxes.
 * Runs every time the "Clear" button is clicked, but also at page load
 */
function clearInput() {
  for (let element of formElements) {
    //Clear all text-based input fields with loop
    if (
      element.type !== "button" &&
      element.type !== "radio" &&
      element.type !== "select" &&
      element.type !== "checkbox"
    )
      element.value = "";
  }

  //Clear radio buttons
  for (let button of document.getElementsByName("gender")) {
    button.checked = false;
  }

  //Set dropdown to default
  document.getElementById("birthday__month").selectedIndex = 0;
  document.getElementById("birthday__day").selectedIndex = 0;
  document.getElementById("birthday__year").selectedIndex = 0;

  //Clear checkboxes
  for (let button of document.getElementsByName("music")) {
    button.checked = false;
  }

  //Clear output content
  document.querySelector(".output").innerHTML = "";
}

/**
 * Function that retrieves all input from input form elements.
 * Outputs errors if any fields lack input at all or if the input
 * is invalid.
 */
function getInput() {
  let outputData = {
    invalidEntries: "",
    noEntries: "",
    allEntriesValid: true,
  };
  //Report any fields with invalid entries
  //Username can have lowercase and numbers, 4-12 characters
  validateField(
    document.getElementsByName("username")[0].value,
    USERNAME_REGEX,
    "username",
    outputData
  );

  //Email address must have @ and end with .net, .com, .org, or .edu
  validateField(
    document.getElementsByName("email")[0].value,
    EMAIL_REGEX,
    "email address",
    outputData
  );

  //Phone number should be 10 digits with hyphens: ###-###-####
  validateField(
    document.getElementsByName("phone")[0].value,
    PHONE_REGEX,
    "phone number",
    outputData
  );

  //Password should contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special
  //Validate 'confirmed' password as well
  validatePassword(
    document.getElementsByName("enterPass")[0].value,
    outputData
  );

  //Verify that any of the gender radio buttons have been selected
  checkForOptionSelection(
    document.getElementsByName("gender"),
    "gender",
    outputData
  );

  //Verify that all three birthday dates are selected
  if (
    document.getElementById("birthday__month").selectedIndex === 0 &&
    document.getElementById("birthday__day").selectedIndex === 0 &&
    document.getElementById("birthday__year").selectedIndex === 0
  ) {
    outputData.noEntries += `<p>Please select a <span class='no__entry'>birthday date</span></p>`;
  } else if (
    document.getElementById("birthday__month").selectedIndex === 0 ||
    document.getElementById("birthday__day").selectedIndex === 0 ||
    document.getElementById("birthday__year").selectedIndex === 0
  ) {
    outputData.noEntries += `<p>Please select a <span class='invalid__entry'>birthday date</span></p>`;
  }
  //Verify that at least one favorite music checkbox is checked
  checkForOptionSelection(
    document.getElementsByName("music"),
    "favorite music",
    outputData
  );

  //Output all errors
  document.querySelector(".output").innerHTML =
    outputData.invalidEntries + outputData.noEntries;

  //Only continue if there are no errors
  if (document.querySelector(".output").innerHTML === "") {
    //Last thing to check for - if passwords match. Do not re-direct if they do not
    if (
      document.getElementsByName("enterPass")[0].value !==
      document.getElementsByName("confirmPass")[0].value
    ) {
      alert("Passwords do not match");
    } else {
      window.location.href = "https://dawsonschoolaccount.github.io/";
    }
  }
}

/**
 *
 * @param {obj} elements - array of button/selection options to determine if any of the group are selected
 * @param {string} fieldName - name of the field that the group belongs to
 * @param {invalidEntries : string, noEntries : string} output - The output data, appended to if there is an error
 * @returns - immediately returns if any button/option is selected
 */
function checkForOptionSelection(elements, fieldName, output) {
  for (let option of elements) {
    if (option.checked === true) {
      return;
    }
  }

  //If no elements are checked, output error
  output.noEntries += `<p>Please select an option for <span class='no__entry'>${fieldName}</span></p>`;
}

/**
 *
 * @param {string} enteredPassword - The first password the user enters
 * @param {string} confirmedPassword - The second password the user enters to confirm the first
 * @param {invalidEntries : string, noEntries : string} output - The output data, appended to if there is an error
 * @returns {} - returns null if password is found to be invalid
 */
function validatePassword(enteredPassword, output) {
  const passwordRequirements = [
    `[!@#$%^&*(),.?":{}|<>]+`,
    "[A-Z]+",
    "[a-z]+",
    "\\d+",
  ];

  //Validate that password passes all requirements
  if (enteredPassword === "") {
    output.noEntries += `<p>Please enter <span class='no__entry'>password</span></p>`;
  } else {
    for (let req of passwordRequirements) {
      if (!validateRegex(enteredPassword, req)) {
        output.invalidEntries += `<p>Please enter <span class='invalid__entry'>a valid password</span></p>`;
        return;
      }
    }
  }
}

/**
 *
 * @param {string} element - The value of the element to be validated
 * @param {string} regexString - the RegEx expression against which to validate the string
 * @param {string} fieldName - The name of the field of the passed in element
 * @param {invalidEntries : string, noEntries : string} output - The output data, appended to if there is an error
 */
function validateField(element, regexString, fieldName, output) {
  if (element === "") {
    output.noEntries += `<p>Please enter <span class='no__entry'>${fieldName}</span></p>`;
  } else {
    if (!validateRegex(element, regexString)) {
      output.invalidEntries += `<p>Please enter <span class='invalid__entry'>a valid ${fieldName}</span></p>`;
    }
  }
}

/**
 *
 * @param {string} input - the input string to be checked against RegEx
 * @param {string} regex - the RegEx expression as a string
 * @returns {boolean} - tells whether the passed in input is valid or not
 */
function validateRegex(input, regex) {
  const expression = new RegExp(regex);
  return expression.test(input);
}

/**
 * Sets up values in HTML
 */
function init() {
  //Insert 31 days for birthday selection
  let birthdayDate = document.getElementById("birthday__day");
  birthdayDate.insertAdjacentHTML("beforeend", `<option value="0"></option>`);

  for (let count = 1; count < 32; count++) {
    birthdayDate.insertAdjacentHTML(
      "beforeend",
      `<option value="${count}">${count}</option>`
    );
  }

  //Set up years for birthday selection
  let birthdayYear = document.getElementById("birthday__year");
  birthdayYear.insertAdjacentHTML("beforeend", `<option value="0"></option>`);

  for (let count = 1970; count <= 2010; count++) {
    birthdayYear.insertAdjacentHTML(
      "beforeend",
      `<option value="${count}">${count}</option>`
    );
  }
}
