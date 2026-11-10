document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // ELEMENTS
    // =====================================

    const loginForm = document.getElementById("loginForm");

    const identityInput = document.getElementById("identity");
    const passwordInput = document.getElementById("password");

    const identityError = document.getElementById("identityError");
    const passwordError = document.getElementById("passwordError");

    const togglePassword = document.getElementById("togglePassword");

    const loginMessage = document.getElementById("loginMessage");


    // =====================================
    // SHOW / HIDE PASSWORD
    // =====================================

    togglePassword.addEventListener("click", function () {

        const isPassword = passwordInput.type === "password";

        passwordInput.type = isPassword ? "text" : "password";

        togglePassword.innerHTML = isPassword
            ? '<i class="fa-regular fa-eye-slash"></i>'
            : '<i class="fa-regular fa-eye"></i>';

        togglePassword.setAttribute(
            "aria-label",
            isPassword ? "Hide password" : "Show password"
        );

    });


    // =====================================
    // VALIDATION HELPERS
    // =====================================

    function showError(input, errorElement, message) {

        input.classList.add("invalid");
        errorElement.textContent = message;

    }


    function clearError(input, errorElement) {

        input.classList.remove("invalid");
        errorElement.textContent = "";

    }


    function validateIdentity(value) {

        // Email validation
        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Phone validation
        const phonePattern =
            /^\+?[0-9]{7,15}$/;

        const cleanedValue = value.replace(/[\s()-]/g, "");

        return emailPattern.test(value) ||
               phonePattern.test(cleanedValue);

    }


    // =====================================
    // REAL-TIME ERROR CLEARING
    // =====================================

    identityInput.addEventListener("input", function () {

        clearError(identityInput, identityError);

        loginMessage.className = "login-message";
        loginMessage.textContent = "";

    });


    passwordInput.addEventListener("input", function () {

        clearError(passwordInput, passwordError);

        loginMessage.className = "login-message";
        loginMessage.textContent = "";

    });


    // =====================================
    // LOGIN FORM SUBMISSION
    // =====================================

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const identity = identityInput.value.trim();
        const password = passwordInput.value;

        let isValid = true;


        // Clear previous messages

        clearError(identityInput, identityError);
        clearError(passwordInput, passwordError);

        loginMessage.className = "login-message";
        loginMessage.textContent = "";


        // Validate Email / Phone

        if (!identity) {

            showError(
                identityInput,
                identityError,
                "Please enter your email or phone number."
            );

            isValid = false;

        }

        else if (!validateIdentity(identity)) {

            showError(
                identityInput,
                identityError,
                "Please enter a valid email or phone number."
            );

            isValid = false;

        }


        // Validate Password

        if (!password.trim()) {

            showError(
                passwordInput,
                passwordError,
                "Please enter your password."
            );

            isValid = false;

        }


        if (!isValid) return;


        // =================================
        // FRONTEND DEMO RESPONSE
        // =================================

        loginMessage.textContent =
            "Your information is valid. Login authentication will be connected later.";

        loginMessage.className = "login-message success";

    });


    // =====================================
    // FORGOT PASSWORD DEMO
    // =====================================

    const forgotPassword =
        document.getElementById("forgotPassword");

    forgotPassword.addEventListener("click", function (event) {

        event.preventDefault();

        alert(
            "Password recovery will be available after backend integration."
        );

    });

});