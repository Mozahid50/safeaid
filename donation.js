/* =========================================
   SAFE AID - DONATION PAGE JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const amountButtons = document.querySelectorAll(".amount-btn");
    const customAmount = document.getElementById("customAmount");

    const paymentOptions = document.querySelectorAll(
        'input[name="paymentMethod"]'
    );

    const summaryAmount = document.getElementById("summaryAmount");
    const summaryMethod = document.getElementById("summaryMethod");
    const summaryPurpose = document.getElementById("summaryPurpose");

    const purposeSelect = document.getElementById("donationPurpose");

    const paymentDescription =
        document.getElementById("paymentDescription");

    const accountLabel =
        document.getElementById("accountLabel");

    const accountNumber =
        document.getElementById("accountNumber");

    const paymentCards =
        document.querySelectorAll(".payment-option");

    const paymentProof =
        document.getElementById("paymentProof");

    const filePreview =
        document.getElementById("filePreview");

    const donationForm =
        document.getElementById("donationForm");

    const modal =
        document.getElementById("messageModal");

    const modalTitle =
        document.getElementById("modalTitle");

    const modalMessage =
        document.getElementById("modalMessage");


    /* DEFAULT AMOUNT */

    let selectedAmount = 500;

    function updateAmount(amount) {

        selectedAmount = Number(amount) || 0;

        summaryAmount.textContent =
            "৳" + selectedAmount.toLocaleString("en-BD");

        customAmount.value = amount || "";

    }


    /* AMOUNT BUTTONS */

    amountButtons.forEach(button => {

        button.addEventListener("click", () => {

            amountButtons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            updateAmount(button.dataset.amount);

        });

    });


    /* CUSTOM AMOUNT */

    customAmount.addEventListener("input", () => {

        amountButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        updateAmount(customAmount.value);

    });


    /* PAYMENT METHODS */

    function updatePaymentMethod() {

        const selected = document.querySelector(
            'input[name="paymentMethod"]:checked'
        );

        if (!selected) return;

        const method = selected.value;

        summaryMethod.textContent = method;

        paymentCards.forEach(card => {

            const radio = card.querySelector("input");

            card.classList.toggle(
                "selected",
                radio.checked
            );

        });


        if (method === "bKash") {

            paymentDescription.textContent =
                "Please contact Safe Aid for the official verified bKash donation account details.";

            accountLabel.textContent =
                "Official bKash Account";

            accountNumber.textContent =
                "Available from Safe Aid Admin";

        }

        else if (method === "Nagad") {

            paymentDescription.textContent =
                "Please contact Safe Aid for the official verified Nagad donation account details.";

            accountLabel.textContent =
                "Official Nagad Account";

            accountNumber.textContent =
                "Available from Safe Aid Admin";

        }

        else {

            paymentDescription.textContent =
                "Please contact Safe Aid Admin to receive the verified bank account and transfer instructions.";

            accountLabel.textContent =
                "Official Bank Account";

            accountNumber.textContent =
                "Available from Safe Aid Admin";

        }

    }


    paymentOptions.forEach(option => {

        option.addEventListener(
            "change",
            updatePaymentMethod
        );

    });


    /* DONATION PURPOSE */

    purposeSelect.addEventListener("change", () => {

        summaryPurpose.textContent =
            purposeSelect.value.replace(" Fund", "");

    });


    /* SCREENSHOT PREVIEW */

    paymentProof.addEventListener("change", () => {

        const file = paymentProof.files[0];

        filePreview.textContent = "";

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png"
        ];

        if (!allowedTypes.includes(file.type)) {

            showMessage(
                "Invalid File",
                "Please upload a JPG, JPEG or PNG image."
            );

            paymentProof.value = "";
            return;

        }

        if (file.size > 5 * 1024 * 1024) {

            showMessage(
                "File Too Large",
                "Screenshot size must not exceed 5 MB."
            );

            paymentProof.value = "";
            return;

        }

        filePreview.innerHTML =
            '<i class="fa-solid fa-file-image"></i> ' +
            file.name;

    });


    /* MESSAGE MODAL */

    function showMessage(title, message) {

        modalTitle.textContent = title;
        modalMessage.textContent = message;

        modal.classList.add("show");

    }

    document.getElementById("closeModal")
        .addEventListener("click", () => {

            modal.classList.remove("show");

        });

    modal.addEventListener("click", event => {

        if (event.target === modal) {
            modal.classList.remove("show");
        }

    });


    /* FORM VALIDATION */

    donationForm.addEventListener("submit", event => {

        event.preventDefault();

        const name =
            document.getElementById("donorName").value.trim();

        const phone =
            document.getElementById("donorPhone").value.trim();

        const transaction =
            document.getElementById("transactionId").value.trim();

        const anonymous =
            document.getElementById("anonymousDonation").checked;

        const consent =
            document.getElementById("donationConsent").checked;

        const method = document.querySelector(
            'input[name="paymentMethod"]:checked'
        ).value;


        if (!selectedAmount || selectedAmount <= 0) {

            showMessage(
                "Invalid Amount",
                "Please enter a valid donation amount."
            );

            return;

        }

        if (!anonymous && !name) {

            showMessage(
                "Name Required",
                "Please enter your name or select anonymous donation."
            );

            return;

        }

        if (!/^01[3-9]\d{8}$/.test(phone)) {

            showMessage(
                "Invalid Mobile Number",
                "Please enter a valid Bangladeshi mobile number."
            );

            return;

        }

        if (!transaction) {

            showMessage(
                "Transaction ID Required",
                "Please enter your payment transaction ID."
            );

            return;

        }

        if (!consent) {

            showMessage(
                "Confirmation Required",
                "Please confirm the payment information."
            );

            return;

        }


        /*
          FRONTEND DEMO ONLY

          This page does not submit or store
          any real donation information.

          Backend and Admin verification
          must be connected before launch.
        */

        showMessage(
            "Frontend Demo",
            "Your donation form has passed frontend validation. No payment information has been submitted or saved. Please connect the secure backend and Admin verification system before accepting real donations."
        );

    });


    /* INITIALIZE */

    updateAmount(500);
    updatePaymentMethod();

});


/* =====================================
   PUBLIC DONATION TRANSPARENCY
===================================== */

async function loadPublicDonationReport() {

    const totalDonation =
        document.getElementById("publicTotalDonation");

    const totalDistributed =
        document.getElementById("publicTotalDistributed");

    const availableBalance =
        document.getElementById("publicAvailableBalance");

    const distributionList =
        document.getElementById("publicDistributionList");

    try {

        const response = await fetch("donation-report.php");

        if (!response.ok) {
            throw new Error("Report unavailable");
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error("Report loading failed");
        }

        const formatMoney = amount =>
            "৳" + Number(amount).toLocaleString("en-BD");

        totalDonation.textContent =
            formatMoney(data.total_donations);

        totalDistributed.textContent =
            formatMoney(data.total_distributed);

        availableBalance.textContent =
            formatMoney(data.available_balance);

        distributionList.innerHTML = "";

        if (!data.distributions || data.distributions.length === 0) {

            distributionList.innerHTML = `
                <tr>
                    <td colspan="4" class="loading-records">
                        No verified assistance records available yet.
                    </td>
                </tr>
            `;

            return;
        }

        data.distributions.forEach(record => {

            const row = document.createElement("tr");

            [
                record.beneficiary,
                record.purpose,
                formatMoney(record.amount),
                record.date
            ].forEach(value => {

                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);

            });

            distributionList.appendChild(row);

        });

    } catch (error) {

        console.error("Donation report:", error);

        totalDonation.textContent = "Unavailable";
        totalDistributed.textContent = "Unavailable";
        availableBalance.textContent = "Unavailable";

        distributionList.innerHTML = `
            <tr>
                <td colspan="4" class="loading-records">
                    Donation report will be available soon.
                </td>
            </tr>
        `;

    }

}

loadPublicDonationReport();