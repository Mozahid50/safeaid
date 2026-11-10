document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // ELEMENTS
    // =========================================

    const form = document.getElementById("incidentReportForm");

    if (!form) return;

    const incidentType = document.getElementById("incidentType");
    const incidentTitle = document.getElementById("incidentTitle");

    const incidentLocation = document.getElementById("incidentLocation");
    const incidentDate = document.getElementById("incidentDate");
    const incidentTime = document.getElementById("incidentTime");

    const incidentDescription = document.getElementById("incidentDescription");
    const descriptionCount = document.getElementById("descriptionCount");

    const evidenceInput = document.getElementById("incidentEvidence");
    const filePreview = document.getElementById("incidentFilePreview");

    const reporterName = document.getElementById("reporterName");
    const reporterPhone = document.getElementById("reporterPhone");
    const reporterEmail = document.getElementById("reporterEmail");

    const locationBtn = document.getElementById("getIncidentLocation");
    const locationStatus = document.getElementById("incidentLocationStatus");

    const submitBtn = document.getElementById("submitIncidentBtn");


    // =========================================
    // INCIDENT CATEGORY FROM URL
    // =========================================

    const params = new URLSearchParams(window.location.search);

    const selectedType = params.get("type");

    const validTypes = [
        "road-accident",
        "fire",
        "flood",
        "other"
    ];

    if (selectedType && validTypes.includes(selectedType)) {
        incidentType.value = selectedType;
    }


    // =========================================
    // CURRENT DATE AND TIME
    // =========================================

    const now = new Date();

    const today = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
    ].join("-");

    const currentTime = [
        String(now.getHours()).padStart(2, "0"),
        String(now.getMinutes()).padStart(2, "0")
    ].join(":");

    incidentDate.max = today;

    incidentDate.value = today;
    incidentTime.value = currentTime;


    // =========================================
    // DESCRIPTION CHARACTER COUNTER
    // =========================================

    incidentDescription.addEventListener("input", function () {

        descriptionCount.textContent =
            incidentDescription.value.length;

    });


    // =========================================
    // CURRENT LOCATION
    // =========================================

    locationBtn.addEventListener("click", function () {

        if (!navigator.geolocation) {

            locationStatus.textContent =
                "Your browser does not support location services.";

            return;
        }

        locationStatus.textContent =
            "Getting your current location...";

        locationBtn.disabled = true;

        locationBtn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Getting Location...
        `;


        navigator.geolocation.getCurrentPosition(

            function (position) {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                incidentLocation.value =
                    latitude.toFixed(6) + ", " +
                    longitude.toFixed(6);

                locationStatus.textContent =
                    "Location detected successfully!";

                locationBtn.disabled = false;

                locationBtn.innerHTML = `
                    <i class="fa-solid fa-location-check"></i>
                    Location Detected
                `;

            },


            function (error) {

                locationBtn.disabled = false;

                locationBtn.innerHTML = `
                    <i class="fa-solid fa-location-crosshairs"></i>
                    Use My Current Location
                `;

                if (error.code === error.PERMISSION_DENIED) {

                    locationStatus.textContent =
                        "Location permission denied. Please allow location access.";

                }

                else if (error.code === error.TIMEOUT) {

                    locationStatus.textContent =
                        "Location request timed out. Please try again.";

                }

                else {

                    locationStatus.textContent =
                        "Unable to detect your location. Enter it manually.";

                }

            },

            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }

        );

    });


    // =========================================
    // FILE UPLOAD SETTINGS
    // =========================================

    const MAX_FILES = 5;
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    let selectedFiles = [];


    // =========================================
    // FILE SIZE FORMAT
    // =========================================

    function formatFileSize(size) {

        if (size < 1024 * 1024) {
            return (size / 1024).toFixed(1) + " KB";
        }

        return (size / (1024 * 1024)).toFixed(2) + " MB";

    }


    // =========================================
    // FILE PREVIEW
    // =========================================

    function renderFilePreview() {

        filePreview.innerHTML = "";

        selectedFiles.forEach(function (file, index) {

            const item = document.createElement("div");

            item.className = "incident-file-item";


            // Image Preview

            if (file.type.startsWith("image/")) {

                const image = document.createElement("img");

                image.src = URL.createObjectURL(file);

                image.alt = "Selected incident evidence";

                item.appendChild(image);

            }

            // Video Icon

            else {

                const videoIcon = document.createElement("i");

                videoIcon.className =
                    "fa-solid fa-file-video";

                item.appendChild(videoIcon);

            }


            // File Name

            const fileName = document.createElement("span");

            fileName.textContent =
                file.name + " (" + formatFileSize(file.size) + ")";

            item.appendChild(fileName);


            // Remove Button

            const removeButton =
                document.createElement("button");

            removeButton.type = "button";

            removeButton.className =
                "incident-file-remove";

            removeButton.innerHTML =
                '<i class="fa-solid fa-xmark"></i>';

            removeButton.setAttribute(
                "aria-label",
                "Remove " + file.name
            );

            removeButton.addEventListener("click", function () {

                selectedFiles.splice(index, 1);

                renderFilePreview();

                evidenceInput.value = "";

            });

            item.appendChild(removeButton);

            filePreview.appendChild(item);

        });

    }


    // =========================================
    // FILE SELECTION AND VALIDATION
    // =========================================

    evidenceInput.addEventListener("change", function () {

        const files = Array.from(evidenceInput.files);

        let addedCount = 0;

        files.forEach(function (file) {

            // File Type Validation

            const validImage =
                file.type.startsWith("image/");

            const validVideo =
                file.type.startsWith("video/");

            if (!validImage && !validVideo) {

                alert(
                    file.name + " is not a valid image or video."
                );

                return;
            }


            // File Size Validation

            if (file.size > MAX_FILE_SIZE) {

                alert(
                    file.name + " exceeds the 5 MB file size limit."
                );

                return;
            }


            // Duplicate File Check

            const alreadyExists = selectedFiles.some(function (existing) {

                return (
                    existing.name === file.name &&
                    existing.size === file.size &&
                    existing.lastModified === file.lastModified
                );

            });

            if (alreadyExists) return;


            // Maximum File Limit

            if (selectedFiles.length >= MAX_FILES) {

                alert("You can upload a maximum of 5 files.");

                return;
            }


            selectedFiles.push(file);

            addedCount++;

        });


        renderFilePreview();

        evidenceInput.value = "";

    });


    // =========================================
    // PHONE NUMBER VALIDATION
    // =========================================

    function validatePhone(phone) {

        const cleanPhone = phone.replace(/[\s-]/g, "");

        return /^(\+?8801|01)[3-9]\d{8}$/.test(cleanPhone);

    }


    // =========================================
    // FORM SUBMISSION
    // FRONTEND DEMO ONLY
    // =========================================

    form.addEventListener("submit", function (event) {

        event.preventDefault();


        // Required Field Validation

        if (!form.checkValidity()) {

            form.reportValidity();

            return;
        }


        // Phone Validation

        if (!validatePhone(reporterPhone.value.trim())) {

            alert(
                "Please enter a valid Bangladeshi mobile number."
            );

            reporterPhone.focus();

            return;
        }


        // Incident Date Validation

        if (incidentDate.value > today) {

            alert(
                "Incident date cannot be in the future."
            );

            incidentDate.focus();

            return;
        }


        // Prevent Double Submission

        submitBtn.disabled = true;

        submitBtn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Processing...
        `;


        // Demo Report Data

        const reportData = {

            id: "INC-" + Date.now(),

            incidentType: incidentType.value,

            incidentTitle: incidentTitle.value.trim(),

            incidentLocation: incidentLocation.value.trim(),

            incidentDate: incidentDate.value,

            incidentTime: incidentTime.value,

            incidentDescription:
                incidentDescription.value.trim(),

            reporterName: reporterName.value.trim(),

            reporterPhone: reporterPhone.value.trim(),

            reporterEmail: reporterEmail.value.trim(),

            evidenceCount: selectedFiles.length,

            submittedAt: new Date().toISOString(),

            status: "Pending"

        };


        // Demo Success Message

        console.log(
            "Incident Report Demo Data:",
            reportData
        );


        alert(
            "Your incident report has been submitted successfully in demo mode!\n\n" +
            "Report ID: " + reportData.id +
            "\n\nBackend and database connection will be added later."
        );


        // Reset Form

        form.reset();

        selectedFiles = [];

        filePreview.innerHTML = "";

        descriptionCount.textContent = "0";

        incidentDate.value = today;

        incidentTime.value = currentTime;

        locationStatus.textContent =
            "You can enter the location manually or use your current location.";

        locationBtn.disabled = false;

        locationBtn.innerHTML = `
            <i class="fa-solid fa-location-crosshairs"></i>
            Use My Current Location
        `;


        // Restore Selected Category

        if (selectedType && validTypes.includes(selectedType)) {

            incidentType.value = selectedType;

        }


        // Restore Button

        submitBtn.disabled = false;

        submitBtn.innerHTML = `
            <i class="fa-solid fa-paper-plane"></i>
            Submit Report
        `;

    });


});