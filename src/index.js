/*
Form Requirements
    - Data: email, Country, ZIP Code, Password
    Password Confirmation
    - Functionality: 
        -check the validation as the user
        progresses through the form
        - when the user leaves a field it should
        automatically validate
        -highlight invalid inputs and give
        suggestions to correct the mistakes
        and make the input valid
        - test all possible cases
        - show a message when the form is submitted
        saying that it was successfully submitted
    - Structure:
        - input element with a span beneath it;
        - if the input is not valid provide
        suggestions in the span
        - remove the text when the input is valid
        - show using css when the input is invalid
        - show using css when the input is valid
*/

const emailField = document.getElementById("email");
const emailErrorField = document.getElementById("email-error");
const zipField = document.getElementById("zip");
const zipErrorField = document.getElementById("zip-error");
const countryField = document.getElementById("country");
const countryErrorField = document.getElementById("country-error");

function showError(errorField, errorMessage) {
    errorField.textContent = errorMessage;
    errorField.classList.add("error");
    if (errorField.classList.contains("valid")) {
        errorField.classList.remove("valid");
    }
}

function removeError(errorField) {
    errorField.textContent = "";
    errorField.classList.remove("error");
    errorField.classList.add("valid");
}

emailField.addEventListener("input", function(event) {
    if (emailField.validity.valueMissing) {
        showError(emailErrorField, "You need to input an email address.");
        event.preventDefault();
    }
    if (!emailField.validity.tooShort) {
        removeError(emailErrorField);
    } else if (emailField.validity.tooShort) {
        showError(emailErrorField, "The email address is too short.");
        return event.preventDefault();
    }
    if (emailField.validity.typeMismatch) {
        showError(emailErrorField, "This is not a valid email address.");
        return event.preventDefault();
    }
    if (emailField.validity.valid) {
        removeError(emailErrorField);
    }
});

function getCountryFieldValue() {
    return countryField.value;
}

zipField.addEventListener("input", function(event) {
    let currentCountry = getCountryFieldValue();

    // this allows letters to be used when Great Britain is
    // selected as the country
    if (currentCountry === 'Great Britain') {
        zipField.setAttribute("pattern", "[A-Za-z0-9]+");
    }
    if (currentCountry === 'United States' || currentCountry === 'Romania') {
        zipField.setAttribute("pattern", "[0-9]*")
    }




    if (zipField.validity.patternMismatch) {
        showError(zipErrorField, "This is not a valid ZIP code.");
        return event.preventDefault();
    }
    if (currentCountry === "Romania") {
        zipField.setAttribute("minlength", "6");
        zipField.setAttribute("maxlength", "6");
        if (!zipField.validity.tooShort && !zipField.validity.tooLong) {
            removeError(zipErrorField);
        } else if (zipField.validity.tooShort) {
            showError(zipErrorField, "The ZIP code is too short.");
            return event.preventDefault();
        } else if (zipField.validity.tooLong) {
            showError(zipErrorField, "The ZIP code is too long.");
            return event.preventDefault();
        }
    }
    if (currentCountry === "United States") {
        zipField.setAttribute("minlength", "5");
        zipField.setAttribute("maxlength", "5");
        if (!zipField.validity.tooShort && !zipField.validity.tooLong) {
            removeError(zipErrorField);
        } else if (zipField.validity.tooShort) {
            showError(zipErrorField, "The ZIP code is too short.");
            return event.preventDefault();
        } else if (zipField.validity.tooLong) {
            showError(zipErrorField, "The ZIP code is too long.");
            return event.preventDefault();
        }
    }
    if (currentCountry === "Great Britain") {
        zipField.setAttribute("minlength", "6");
        zipField.setAttribute("maxlength", "8");
        if (!zipField.validity.tooShort) {
            removeError(zipErrorField);
        } else if (zipField.validity.tooShort) {
            showError(zipErrorField, "The ZIP code is too short.");
            return event.preventDefault();
        }
    }

    if (zipField.validity.valid) {
        removeError(zipErrorField);
    }
});

countryField.addEventListener("input", function(event) {
    // this prevents incorrect ZIPs being submitted if the user
    // changes the country
    if (!zipField.value) return;

    if (zipField.getAttribute("pattern") === "[A-Za-z0-9]+" && countryField.value !== "Great Britain") {
        showError(zipErrorField, "This is not a valid ZIP code.")
        zipField.setAttribute("pattern", "[0-9]*");
    }

    if (countryField.value === "United States" && zipField.value.length > 5) {
        showError(zipErrorField, "The ZIP code is too long.")
    } else if (countryField.value === "United States" && zipField.value.length < 5) {
        showError(zipErrorField, "The ZIP code is too short.")
    } else {
        removeError(zipErrorField)
    }

    if (countryField.value === "Romania" && zipField.value.length < 6) {
        showError(zipErrorField, "The ZIP code is too short.")
        zipField.setAttribute("minlength", "6");
        zipField.setAttribute("maxlength", "6");
    } else if (countryField.value === "Romania" && zipField.value.length > 6) {
        showError(zipErrorField, "The ZIP code is too long.")
    }
    if (countryField.value === "Great Britain" && zipField.value.length < 6) {
        showError(zipErrorField, "The ZIP code is too short.")
        zipField.setAttribute("minlength", "6");
        zipField.setAttribute("maxlength", "8");
    }

});