document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // MOBILE NAVIGATION
    // =====================================

    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.getElementById("navLinks");

    if (menuBtn && navLinks) {

        menuBtn.addEventListener("click", function () {

            navLinks.classList.toggle("active");

            const icon = menuBtn.querySelector("i");

            if (icon) {
                icon.classList.toggle("fa-bars");
                icon.classList.toggle("fa-xmark");
            }

        });


        navLinks.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", function () {

                navLinks.classList.remove("active");

                const icon = menuBtn.querySelector("i");

                if (icon) {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }

            });

        });

    }


    // =====================================
    // VOLUNTEER REGISTRATION FORM
    // =====================================

    const volunteerForm = document.getElementById("volunteerForm");

    if (!volunteerForm) return;


    const fields = {

        fullName: document.getElementById("fullName"),
        email: document.getElementById("email"),
        phone: document.getElementById("phone"),
        dateOfBirth: document.getElementById("dateOfBirth"),
        gender: document.getElementById("gender"),

        address: document.getElementById("address"),
        district: document.getElementById("district"),

        interest: document.getElementById("interest"),
        availability: document.getElementById("availability"),
        motivation: document.getElementById("motivation")

    };


    const agreement = document.getElementById("agreement");

    const submitButton = document.getElementById("submitVolunteer");

    const messageBox = document.getElementById("volunteerMessage");


    // =====================================
    // SET MAX DATE OF BIRTH
    // =====================================

    const today = new Date();

    const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    fields.dateOfBirth.max = localToday;


    // =====================================
    // ERROR HANDLING
    // =====================================

    function showError(field, message) {

        field.classList.add("invalid");

        const errorElement = document.getElementById(
            field.id + "Error"
        );

        if (errorElement) {
            errorElement.textContent = message;
        }

    }


    function clearError(field) {

        field.classList.remove("invalid");

        const errorElement = document.getElementById(
            field.id + "Error"
        );

        if (errorElement) {
            errorElement.textContent = "";
        }

    }


    function clearAllErrors() {

        Object.values(fields).forEach(field => {

            if (field) {
                clearError(field);
            }

        });

        const agreementError =
            document.getElementById("agreementError");

        agreementError.textContent = "";

        document.querySelector(".volunteer-agreement")
            .classList.remove("invalid");

    }


    // =====================================
    // EMAIL VALIDATION
    // =====================================

    function validEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    }


    // =====================================
    // PHONE VALIDATION
    // =====================================

    function validPhone(phone) {

        const cleanedPhone = phone.replace(/[\s()-]/g, "");

        return /^\+?[0-9]{7,15}$/.test(cleanedPhone);

    }


    // =====================================
    // FORM VALIDATION
    // =====================================

    function validateForm() {

        let valid = true;

        clearAllErrors();


        // Full Name

        if (fields.fullName.value.trim().length < 2) {

            showError(
                fields.fullName,
                "Please enter your full name."
            );

            valid = false;

        }


        // Email

        if (!validEmail(fields.email.value.trim())) {

            showError(
                fields.email,
                "Please enter a valid email address."
            );

            valid = false;

        }


        // Phone

        if (!validPhone(fields.phone.value.trim())) {

            showError(
                fields.phone,
                "Please enter a valid phone number."
            );

            valid = false;

        }


        // Date of Birth

        if (!fields.dateOfBirth.value) {

            showError(
                fields.dateOfBirth,
                "Please select your date of birth."
            );

            valid = false;

        }

        else if (fields.dateOfBirth.value > localToday) {

            showError(
                fields.dateOfBirth,
                "Date of birth cannot be in the future."
            );

            valid = false;

        }


        // Gender

        if (!fields.gender.value) {

            showError(
                fields.gender,
                "Please select your gender."
            );

            valid = false;

        }


        // Address

        if (fields.address.value.trim().length < 5) {

            showError(
                fields.address,
                "Please enter your present address."
            );

            valid = false;

        }


        // District

        if (fields.district.value.trim().length < 2) {

            showError(
                fields.district,
                "Please enter your district."
            );

            valid = false;

        }


        // Volunteer Interest

        if (!fields.interest.value) {

            showError(
                fields.interest,
                "Please select your preferred activity."
            );

            valid = false;

        }


        // Availability

        if (!fields.availability.value) {

            showError(
                fields.availability,
                "Please select your availability."
            );

            valid = false;

        }


        // Motivation

        if (fields.motivation.value.trim().length < 10) {

            showError(
                fields.motivation,
                "Please write at least 10 characters."
            );

            valid = false;

        }


        // Agreement

        if (!agreement.checked) {

            document.getElementById("agreementError").textContent =
                "You must accept the volunteer guidelines.";

            document.querySelector(".volunteer-agreement")
                .classList.add("invalid");

            valid = false;

        }


        return valid;

    }


    // =====================================
    // REAL-TIME ERROR CLEARING
    // =====================================

    Object.values(fields).forEach(field => {

        if (!field) return;

        field.addEventListener("input", function () {

            clearError(field);

            messageBox.className = "volunteer-message";
            messageBox.textContent = "";

        });

        field.addEventListener("change", function () {

            clearError(field);

        });

    });


    agreement.addEventListener("change", function () {

        if (agreement.checked) {

            document.getElementById("agreementError").textContent = "";

            document.querySelector(".volunteer-agreement")
                .classList.remove("invalid");

        }

    });


    // =====================================
    // FORM SUBMISSION - FRONTEND DEMO
    // =====================================

    volunteerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        messageBox.className = "volunteer-message";
        messageBox.textContent = "";


        if (!validateForm()) {

            messageBox.textContent =
                "Please correct the highlighted fields and try again.";

            messageBox.className = "volunteer-message error";

            const firstInvalid =
                volunteerForm.querySelector(".invalid");

            if (firstInvalid) {
                firstInvalid.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }

            return;

        }


        // Frontend Demo Only

        messageBox.innerHTML =
            '<i class="fa-solid fa-circle-check"></i> ' +
            '<strong>Registration form completed successfully!</strong><br>' +
            'This is a frontend demo. Your information has not been submitted to a server.';

        messageBox.className = "volunteer-message success";


        volunteerForm.reset();

        clearAllErrors();

        fields.dateOfBirth.max = localToday;

        messageBox.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    });


});