/* =====================================================
   SAFE AID - AMBULANCE MANAGEMENT
   Search • Filter • Clear • Result Count
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    // ================================================
    // 1. SELECT ELEMENTS
    // ================================================

    const ambulanceGrid = document.getElementById("ambulanceGrid");
    const ambulanceSearch = document.getElementById("ambulanceSearch");
    const clearSearch = document.getElementById("clearSearch");
    const ambulanceCount = document.getElementById("ambulanceCount");
    const noResult = document.getElementById("noResult");

    const filterButtons = document.querySelectorAll(".am-filter-btn");

    if (!ambulanceGrid) return;

    let activeFilter = "all";

    // ================================================
    // 2. AMBULANCE FILTER & SEARCH
    // ================================================

    function filterAmbulances() {

        const cards = ambulanceGrid.querySelectorAll(".am-card");

        const searchText = ambulanceSearch
            ? ambulanceSearch.value.trim().toLowerCase()
            : "";

        let visibleCount = 0;

        cards.forEach(function (card) {

            const ambulanceType = (
                card.dataset.type || ""
            ).toLowerCase();

            const cardText = card.textContent.toLowerCase();

            // Check selected category
            const matchesFilter =
                activeFilter === "all" ||
                ambulanceType === activeFilter;

            // Check search text
            const matchesSearch =
                cardText.includes(searchText);

            // Final visibility
            const shouldShow =
                matchesFilter && matchesSearch;

            card.hidden = !shouldShow;

            if (shouldShow) {
                visibleCount++;
            }

        });

        // ============================================
        // 3. UPDATE RESULT COUNT
        // ============================================

        if (ambulanceCount) {

            ambulanceCount.textContent =
                visibleCount + (
                    visibleCount === 1
                        ? " Service"
                        : " Services"
                );

        }

        // ============================================
        // 4. NO RESULT MESSAGE
        // ============================================

        if (noResult) {

            noResult.hidden = visibleCount !== 0;

        }

    }


    // ================================================
    // 5. FILTER BUTTON CLICK
    // ================================================

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            activeFilter = (
                button.dataset.filter || "all"
            ).toLowerCase();

            // Update active button
            filterButtons.forEach(function (btn) {

                btn.classList.remove("active");

            });

            button.classList.add("active");

            // Apply filter
            filterAmbulances();

        });

    });


    // ================================================
    // 6. LIVE SEARCH
    // ================================================

    if (ambulanceSearch) {

        ambulanceSearch.addEventListener(
            "input",
            filterAmbulances
        );

    }


    // ================================================
    // 7. CLEAR SEARCH
    // ================================================

    if (clearSearch) {

        clearSearch.addEventListener("click", function () {

            if (ambulanceSearch) {
                ambulanceSearch.value = "";
            }

            activeFilter = "all";

            // Reset active filter button
            filterButtons.forEach(function (button) {

                button.classList.toggle(
                    "active",
                    button.dataset.filter === "all"
                );

            });

            filterAmbulances();

        });

    }


    // ================================================
    // 8. INITIALIZE
    // ================================================

    filterAmbulances();

});