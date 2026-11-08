document.addEventListener("DOMContentLoaded", function () {

    // =================================
    // MOBILE NAVIGATION
    // =================================

    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.getElementById("navLinks");

    menuBtn.addEventListener("click", function () {

        navLinks.classList.toggle("active");

        const icon = menuBtn.querySelector("i");

        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-xmark");

    });


    // Close navigation after clicking a link

    document.querySelectorAll(".nav-links a").forEach(link => {

        link.addEventListener("click", function () {

            navLinks.classList.remove("active");

            const icon = menuBtn.querySelector("i");

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        });

    });


    // =================================
    // SOS MODAL
    // =================================

    const floatingSOS = document.getElementById("floatingSOS");
    const sosOverlay = document.getElementById("sosOverlay");
    const sosNavBtn = document.getElementById("sosNavBtn");
    const closeSOS = document.getElementById("closeSOS");


    function openSOS() {

        sosOverlay.classList.add("active");

        document.body.style.overflow = "hidden";

    }


    function closeSOSModal() {

        sosOverlay.classList.remove("active");

        document.body.style.overflow = "auto";

    }


    floatingSOS.addEventListener("click", openSOS);

    if (sosNavBtn) {
        sosNavBtn.addEventListener("click", openSOS);
    }

    closeSOS.addEventListener("click", closeSOSModal);


    sosOverlay.addEventListener("click", function (event) {

        if (event.target === sosOverlay) {
            closeSOSModal();
        }

    });


    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            closeSOSModal();
        }

    });


    // =================================
    // LIVE LOCATION
    // =================================

    const locationBtn = document.getElementById("locationBtn");
    const locationStatus = document.getElementById("locationStatus");


    locationBtn.addEventListener("click", function () {

        if (!navigator.geolocation) {

            locationStatus.textContent =
                "Your browser does not support location services.";

            return;

        }


        locationStatus.textContent = "Getting your location...";

        locationBtn.disabled = true;


        navigator.geolocation.getCurrentPosition(

            function (position) {

                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;


                locationStatus.textContent =
                    "Location found successfully!";


                locationBtn.disabled = false;


                window.open(
                    `https://www.google.com/maps?q=${latitude},${longitude}`,
                    "_blank"
                );

            },


            function (error) {

                locationBtn.disabled = false;

                locationStatus.textContent =
                    "Unable to get location. Please allow location permission.";

            },

            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }

        );

    });


    // =================================
    // CONTACT FORM DEMO
    // =================================

    const contactForm = document.getElementById("contactForm");


    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        alert(
            "Thank you for contacting Safe Aid! Your form is working in demo mode."
        );

        contactForm.reset();

    });


});


/* =====================================================
   SAFE AID - MISSING PERSON AUTO SLIDER
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const missingGrid = document.querySelector(".missing-grid");

    if (!missingGrid || missingGrid.children.length <= 1) {
        return;
    }

    // Prevent duplicate carousel wrapping
    if (missingGrid.parentElement.classList.contains(
        "missing-carousel-viewport"
    )) {
        return;
    }

    // Create carousel viewport
    const viewport = document.createElement("div");

    viewport.className = "missing-carousel-viewport";

    missingGrid.parentNode.insertBefore(
        viewport,
        missingGrid
    );

    viewport.appendChild(missingGrid);


    // Automatic sliding every 3 seconds
    let sliderInterval;

    function moveMissingCard() {

        const firstCard = missingGrid.firstElementChild;

        if (!firstCard) return;

        const cardWidth = firstCard.getBoundingClientRect().width;

        const gap = parseFloat(
            getComputedStyle(missingGrid).gap
        ) || 0;

        const moveDistance = cardWidth + gap;

        // Move first card to the left
        missingGrid.style.transform =
            `translateX(-${moveDistance}px)`;


        // After sliding, move first card to the end
        setTimeout(function () {

            missingGrid.appendChild(firstCard);

            // Reset position without animation
            missingGrid.style.transition = "none";
            missingGrid.style.transform = "translateX(0)";

            // Restore smooth transition
            requestAnimationFrame(function () {

                requestAnimationFrame(function () {

                    missingGrid.style.transition =
                        "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)";

                });

            });

        }, 850);
    }


    // Start automatic slider
    function startMissingSlider() {

        sliderInterval = setInterval(
            moveMissingCard,
            3000
        );

    }

    startMissingSlider();


    // Stop slider when the page is hidden
    document.addEventListener("visibilitychange", function () {

        if (document.hidden) {

            clearInterval(sliderInterval);

        } else {

            clearInterval(sliderInterval);
            startMissingSlider();

        }

    });

});