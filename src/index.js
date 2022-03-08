import '../src/style.css'
const form = document.getElementsByTagName("form")[0];

const emailField = document.getElementById("email");
const emailErrorField = document.getElementById("email-error");
const zipField = document.getElementById("zip");
const zipErrorField = document.getElementById("zip-error");
const countryField = document.getElementById("country");
const countryErrorField = document.getElementById("country-error");

const passwordField = document.getElementById("password");
const passwordErrorField = document.getElementById("password-error");
const passwordConfirmationField = document.getElementById("confirmation");
const passwordConfirmationErrorField =
    document.getElementById("confirmation-error");

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
    }
    if (!emailField.validity.tooShort) {
        removeError(emailErrorField);
    } else if (emailField.validity.tooShort) {
        showError(emailErrorField, "The email address is too short.");
    }
    if (emailField.validity.typeMismatch) {
        showError(emailErrorField, "This is not a valid email address.");
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
    if (currentCountry === "Great Britain") {
        zipField.setAttribute("pattern", "[A-Za-z0-9]+");
    }
    if (currentCountry === "United States" || currentCountry === "Romania") {
        zipField.setAttribute("pattern", "[0-9]*");
    }
    if (zipField.validity.patternMismatch) {
        return showError(zipErrorField, "This is not a valid ZIP code.");
    }
    if (currentCountry === "Romania") {
        zipField.setAttribute("minlength", "6");
        zipField.setAttribute("maxlength", "6");
        if (!zipField.validity.tooShort && !zipField.validity.tooLong) {
            removeError(zipErrorField);
        } else if (zipField.validity.tooShort) {
            return showError(zipErrorField, "The ZIP code is too short.");
        } else if (zipField.validity.tooLong) {
            return showError(zipErrorField, "The ZIP code is too long.");
        }
    }
    if (currentCountry === "United States") {
        zipField.setAttribute("minlength", "5");
        zipField.setAttribute("maxlength", "5");
        if (!zipField.validity.tooShort && !zipField.validity.tooLong) {
            removeError(zipErrorField);
        } else if (zipField.validity.tooShort) {
            showError(zipErrorField, "The ZIP code is too short.");
            return;
        } else if (zipField.validity.tooLong) {
            showError(zipErrorField, "The ZIP code is too long.");
            return;
        }
    }
    if (currentCountry === "Great Britain") {
        zipField.setAttribute("minlength", "6");
        zipField.setAttribute("maxlength", "8");
        if (!zipField.validity.tooShort) {
            removeError(zipErrorField);
        } else if (zipField.validity.tooShort) {
            return showError(zipErrorField, "The ZIP code is too short.");
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
    if (
        zipField.getAttribute("pattern") === "[A-Za-z0-9]+" &&
        countryField.value !== "Great Britain"
    ) {
        showError(zipErrorField, "This is not a valid ZIP code.");
        zipField.setAttribute("pattern", "[0-9]*");
    }
    if (countryField.value === "United States" && zipField.value.length > 5) {
        showError(zipErrorField, "The ZIP code is too long.");
    } else if (
        countryField.value === "United States" &&
        zipField.value.length < 5
    ) {
        showError(zipErrorField, "The ZIP code is too short.");
    } else {
        removeError(zipErrorField);
    }
    if (countryField.value === "Romania" && zipField.value.length < 6) {
        showError(zipErrorField, "The ZIP code is too short.");
        zipField.setAttribute("minlength", "6");
        zipField.setAttribute("maxlength", "6");
    } else if (countryField.value === "Romania" && zipField.value.length > 6) {
        showError(zipErrorField, "The ZIP code is too long.");
    }
    if (countryField.value === "Great Britain") {
        zipField.setAttribute("minlength", "6");
        zipField.setAttribute("maxlength", "8");
    }
    if (countryField.value === "Great Britain" && zipField.value.length < 6) {
        showError(zipErrorField, "The ZIP code is too short.");
    }
});

passwordField.addEventListener("input", function(event) {
    if (passwordField.validity.tooShort) {
        return showError(passwordErrorField, "The password is too short.");
    }
    if (passwordField.validity.patternMismatch) {
        return showError(
            passwordErrorField,
            "The password must contain at least one uppercase and lowercase letter, one number and one special character."
        );
    } else if (!passwordField.validity.patternMismatch) {
        removeError(passwordErrorField);
    }
});

passwordConfirmationField.addEventListener("input", function(event) {
    if (passwordConfirmationField.value !== passwordField.value) {
        showError(passwordConfirmationErrorField, "The passwords to do not match.");
    } else if (passwordConfirmationField.value === passwordField.value) {
        removeError(passwordConfirmationErrorField);
    }
});

form.addEventListener("submit", function(event) {
    if (!emailField.validity.valid ||
        !zipField.validity.valid ||
        !countryField.validity.valid ||
        !passwordField.validity.valid ||
        !passwordConfirmationField.validity.valid ||
        passwordConfirmationField.value !== passwordField.value
    ) {
        event.preventDefault();
    }
});