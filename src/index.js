//import "../src/style.css";
(function() {
    const form = document.getElementById("form");
    const emailField = document.getElementById("email");
    const emailErrorField = document.getElementById("email-error");
    const zipField = document.getElementById("zip");
    const zipErrorField = document.getElementById("zip-error");
    const countryField = document.getElementById("country");
    const passwordField = document.getElementById("password");
    const passwordErrorField = document.getElementById("password-error");
    const passwordConfirmationField = document.getElementById("confirmation");
    const passwordConfirmationErrorField =
        document.getElementById("confirmation-error");

    function showError(errorField, errorMessage, InputElement) {
        errorField.textContent = errorMessage;
        InputElement.classList.add("error");
        if (InputElement.classList.contains("valid")) {
            InputElement.classList.remove("valid");
        }
    }

    function removeError(errorField, inputElement) {
        errorField.textContent = "";
        inputElement.classList.remove("error");
        inputElement.classList.add("valid");
    }

    emailField.addEventListener("input", function(event) {
        if (emailField.validity.valueMissing) {
            showError(
                emailErrorField,
                "You need to input an email address.",
                emailField
            );
        }
        if (!emailField.validity.tooShort) {
            removeError(emailErrorField, emailField);
        } else if (emailField.validity.tooShort) {
            showError(emailErrorField, "The email address is too short.", emailField);
        }
        if (emailField.validity.typeMismatch) {
            showError(
                emailErrorField,
                "This is not a valid email address.",
                emailField
            );
        }
        if (emailField.validity.valid) {
            removeError(emailErrorField, emailField);
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
            return showError(
                zipErrorField,
                "This is not a valid ZIP code.",
                zipField
            );
        }
        if (currentCountry === "Romania") {
            zipField.setAttribute("minlength", "6");
            zipField.setAttribute("maxlength", "6");
            if (!zipField.validity.tooShort && !zipField.validity.tooLong) {
                removeError(zipErrorField, zipField);
            } else if (zipField.validity.tooShort) {
                return showError(zipErrorField, "The ZIP code is too short.", zipField);
            } else if (zipField.validity.tooLong) {
                return showError(zipErrorField, "The ZIP code is too long.", zipField);
            }
        }
        if (currentCountry === "United States") {
            zipField.setAttribute("minlength", "5");
            zipField.setAttribute("maxlength", "5");
            if (!zipField.validity.tooShort && !zipField.validity.tooLong) {
                removeError(zipErrorField, zipField);
            } else if (zipField.validity.tooShort) {
                showError(zipErrorField, "The ZIP code is too short.", zipField);
                return;
            } else if (zipField.validity.tooLong) {
                showError(zipErrorField, "The ZIP code is too long.", zipField);
                return;
            }
        }
        if (currentCountry === "Great Britain") {
            zipField.setAttribute("minlength", "6");
            zipField.setAttribute("maxlength", "8");
            if (!zipField.validity.tooShort) {
                removeError(zipErrorField, zipField);
            } else if (zipField.validity.tooShort) {
                return showError(zipErrorField, "The ZIP code is too short.", zipField);
            }
        }
        if (zipField.validity.valid) {
            removeError(zipErrorField, zipField);
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
            showError(zipErrorField, "This is not a valid ZIP code.", zipField);
            zipField.setAttribute("pattern", "[0-9]*");
        }
        if (countryField.value === "United States" && zipField.value.length > 5) {
            showError(zipErrorField, "The ZIP code is too long.", zipField);
        } else if (
            countryField.value === "United States" &&
            zipField.value.length < 5
        ) {
            showError(zipErrorField, "The ZIP code is too short.", zipField);
        } else {
            removeError(zipErrorField, zipField);
        }
        if (countryField.value === "Romania" && zipField.value.length < 6) {
            showError(zipErrorField, "The ZIP code is too short.", zipField);
            zipField.setAttribute("minlength", "6");
            zipField.setAttribute("maxlength", "6");
        } else if (countryField.value === "Romania" && zipField.value.length > 6) {
            showError(zipErrorField, "The ZIP code is too long.", zipField);
        }
        if (countryField.value === "Great Britain") {
            zipField.setAttribute("minlength", "6");
            zipField.setAttribute("maxlength", "8");
        }
        if (countryField.value === "Great Britain" && zipField.value.length < 6) {
            showError(zipErrorField, "The ZIP code is too short.", zipField);
        }
    });

    passwordField.addEventListener("input", function(event) {
        if (passwordField.validity.tooShort) {
            return showError(
                passwordErrorField,
                "The password is too short.",
                passwordField
            );
        }
        if (passwordField.validity.patternMismatch) {
            return showError(
                passwordErrorField,
                "The password must contain at least one uppercase and lowercase letter, one number and one special character.",
                passwordField
            );
        } else if (!passwordField.validity.patternMismatch) {
            removeError(passwordErrorField, passwordField);
        }
    });

    passwordConfirmationField.addEventListener("input", function(event) {
        if (passwordConfirmationField.value !== passwordField.value) {
            showError(
                passwordConfirmationErrorField,
                "The passwords to do not match.",
                passwordConfirmationField
            );
        } else if (passwordConfirmationField.value === passwordField.value) {
            removeError(passwordConfirmationErrorField, passwordConfirmationField);
        }
    });

    form.addEventListener("click", function(event) {
        if (!form.checkValidity() ||
            !emailField.checkValidity() ||
            !zipField.checkValidity() ||
            !passwordField.checkValidity() ||
            !passwordConfirmationField.checkValidity() ||
            passwordConfirmationField.value !== passwordField.value
        ) {
            event.preventDefault();
        } else {
            const body = document.getElementsByTagName("body")[0];
            let submittedModalWindow = document.createElement("div");
            submittedModalWindow.setAttribute("id", "submitted-modal");
            let closeModalBtn = document.createElement("button");
            let modalText = document.createElement("p");
            closeModalBtn.setAttribute("id", "modal-close");
            modalText.setAttribute("id", "modal-text");
            closeModalBtn.textContent = "X";
            modalText.textContent = "Your form has been submitted";
            submittedModalWindow.appendChild(closeModalBtn);
            submittedModalWindow.appendChild(modalText);
            body.appendChild(submittedModalWindow);

            closeModalBtn.addEventListener("click", () => {
                submittedModalWindow.remove();
                setTimeout(function() {
                    window.location.reload();
                }, 500);
            });
        }
    });
})();