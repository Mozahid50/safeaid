/* =====================================================
   SAFE AID - COMPLETE JAVASCRIPT
   Updated Full Replacement Version
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    // ================================================
    // 1. MOBILE NAVIGATION
    // ================================================

    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.getElementById("navLinks");

    function closeNavigation() {

        if (!menuBtn || !navLinks) return;

        navLinks.classList.remove("active");

        const icon = menuBtn.querySelector("i");

        if (icon) {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }

        menuBtn.setAttribute("aria-expanded", "false");
    }

    if (menuBtn && navLinks) {

        menuBtn.addEventListener("click", function () {

            const isOpen = navLinks.classList.toggle("active");

            const icon = menuBtn.querySelector("i");

            if (icon) {
                icon.classList.toggle("fa-bars", !isOpen);
                icon.classList.toggle("fa-xmark", isOpen);
            }

            menuBtn.setAttribute("aria-expanded", String(isOpen));

        });

        navLinks.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", closeNavigation);

        });

        // Close menu with Escape key
        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {
                closeNavigation();
            }

        });

    }


    // ================================================
    // 2. SOS MODAL
    // ================================================

    const floatingSOS = document.getElementById("floatingSOS");
    const sosOverlay = document.getElementById("sosOverlay");
    const sosNavBtn = document.getElementById("sosNavBtn");
    const closeSOS = document.getElementById("closeSOS");

    function openSOS() {

        if (!sosOverlay) return;

        sosOverlay.classList.add("active");

        document.body.style.overflow = "hidden";

    }

    function closeSOSModal() {

        if (!sosOverlay) return;

        sosOverlay.classList.remove("active");

        document.body.style.overflow = "";

    }

    // Floating SOS button
    if (floatingSOS) {
        floatingSOS.addEventListener("click", openSOS);
    }

    // Navbar SOS button
    if (sosNavBtn) {
        sosNavBtn.addEventListener("click", function (event) {

            event.preventDefault();

            closeNavigation();
            openSOS();

        });
    }

    // Close SOS modal
    if (closeSOS) {
        closeSOS.addEventListener("click", closeSOSModal);
    }

    // Close by clicking outside modal content
    if (sosOverlay) {

        sosOverlay.addEventListener("click", function (event) {

            if (event.target === sosOverlay) {
                closeSOSModal();
            }

        });

    }

    // Close with Escape
    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            closeSOSModal();
        }

    });


    // ================================================
    // 3. LIVE LOCATION - INTERACTIVE LEAFLET MAP
    // ================================================

    const locationBtn = document.getElementById("locationBtn");
    const locationStatus = document.getElementById("locationStatus");
    const mapElement = document.getElementById("homeLiveMap");

    let safeAidMap = null;
    let currentLocationMarker = null;
    let currentAccuracyCircle = null;

    // Initialize map
    if (mapElement && typeof L !== "undefined") {

        safeAidMap = L.map("homeLiveMap", {
            zoomControl: true,
            scrollWheelZoom: true
        }).setView([23.6850, 90.3563], 7);

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,
                attribution:
                    '&copy; OpenStreetMap contributors'
            }
        ).addTo(safeAidMap);

        // Fix map display when section becomes visible
        setTimeout(function () {
            safeAidMap.invalidateSize();
        }, 300);

        // Handle page resizing
        window.addEventListener("resize", function () {
            safeAidMap.invalidateSize();
        });

    } else if (mapElement && locationStatus) {

        locationStatus.textContent =
            "Map library could not load. Please check your internet connection.";

    }


    // Find current location
    if (locationBtn) {

        locationBtn.addEventListener("click", function () {

            if (!navigator.geolocation) {

                if (locationStatus) {
                    locationStatus.textContent =
                        "Your browser does not support location services.";
                }

                return;
            }

            if (!window.isSecureContext) {

                if (locationStatus) {
                    locationStatus.textContent =
                        "Location access requires HTTPS or localhost.";
                }

                return;
            }

            if (locationStatus) {
                locationStatus.textContent =
                    "Getting your current location...";
            }

            locationBtn.disabled = true;

            locationBtn.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Finding Location...';


            navigator.geolocation.getCurrentPosition(

                function (position) {

                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const accuracy = position.coords.accuracy;

                    const userLocation = [latitude, longitude];

                    // Update inline map
                    if (safeAidMap) {

                        if (currentLocationMarker) {
                            safeAidMap.removeLayer(currentLocationMarker);
                        }

                        if (currentAccuracyCircle) {
                            safeAidMap.removeLayer(currentAccuracyCircle);
                        }

                        currentLocationMarker = L.marker(userLocation)
                            .addTo(safeAidMap)
                            .bindPopup(
                                "<b>Your Current Location</b>"
                            );

                        currentAccuracyCircle = L.circle(userLocation, {
                            radius: accuracy,
                            color: "#315B68",
                            fillColor: "#78aaa9",
                            fillOpacity: 0.2,
                            weight: 2
                        }).addTo(safeAidMap);

                        safeAidMap.flyTo(userLocation, 15, {
                            duration: 1.5
                        });

                        currentLocationMarker.openPopup();

                    }

                    if (locationStatus) {
                        locationStatus.textContent =
                            "Location found successfully! Accuracy: approximately " +
                            Math.round(accuracy) + " meters.";
                    }

                    locationBtn.disabled = false;

                    locationBtn.innerHTML =
                        '<i class="fa-solid fa-crosshairs"></i> Find My Location';

                    // Preserve previous Google Maps functionality
                    window.open(
                        `https://www.google.com/maps?q=${latitude},${longitude}`,
                        "_blank",
                        "noopener,noreferrer"
                    );

                },

                function (error) {

                    locationBtn.disabled = false;

                    locationBtn.innerHTML =
                        '<i class="fa-solid fa-crosshairs"></i> Find My Location';

                    if (locationStatus) {

                        if (error.code === error.PERMISSION_DENIED) {

                            locationStatus.textContent =
                                "Location permission denied. Please allow location access.";

                        } else if (error.code === error.TIMEOUT) {

                            locationStatus.textContent =
                                "Location request timed out. Please try again.";

                        } else {

                            locationStatus.textContent =
                                "Unable to get location. Please try again.";

                        }

                    }

                },

                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0
                }

            );

        });

    }
    // ================================================
    // 4. CONTACT FORM - DEMO
    // ================================================

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {

        contactForm.addEventListener("submit", function (event) {

            event.preventDefault();

            alert(
                "Thank you for contacting Safe Aid! Your form is working in demo mode."
            );

            contactForm.reset();

        });

    }

/* ================================================
   5. MISSING PERSONS SLIDER
   Mobile: Animation ON
   Desktop: Animation OFF
================================================ */

const missingGrid = document.querySelector(".missing-grid");

if (missingGrid) {

    const missingCards = Array.from(
        missingGrid.querySelectorAll(".missing-card")
    );

    // Desktop/Laptop: Stop animation
    if (window.innerWidth > 768) {

        missingGrid.style.animation = "none";

        missingCards.forEach(card => {
            card.style.animation = "none";
            card.style.transform = "none";
        });

    }

}
    // ================================================
    // 6. PUBLIC COMMUNITY FEED
    // FRONTEND DEMO USING LOCAL STORAGE
    // ================================================

    const postForm = document.getElementById("communityPostForm");

    if (postForm) {

        const authorInput =
            document.getElementById("communityAuthor");

        const anonymousInput =
            document.getElementById("communityAnonymous");

        const postTextInput =
            document.getElementById("communityPostText");

        const imageInput =
            document.getElementById("communityPostImage");

        const locationInput =
            document.getElementById("communityPostLocation");

        const imagePreview =
            document.getElementById("communityImagePreview");

        const postsList =
            document.getElementById("communityPostsList");

        const postCount =
            document.getElementById("communityPostCount");

        const adminMode =
            document.getElementById("communityAdminMode");

        const STORAGE_KEY = "safeAidCommunityPosts";

        let selectedImage = "";

        // Required elements check
        if (postTextInput && postsList) {


            // --------------------------------------------
            // GET POSTS
            // --------------------------------------------

            function getPosts() {

                try {

                    const data = JSON.parse(
                        localStorage.getItem(STORAGE_KEY)
                    );

                    return Array.isArray(data) ? data : [];

                } catch (error) {

                    console.error(
                        "Community Feed loading error:",
                        error
                    );

                    return [];

                }

            }


            // --------------------------------------------
            // SAVE POSTS
            // --------------------------------------------

            function savePosts(posts) {

                try {

                    localStorage.setItem(
                        STORAGE_KEY,
                        JSON.stringify(posts)
                    );

                    return true;

                } catch (error) {

                    alert(
                        "Storage is full. Please remove some posts or images."
                    );

                    console.error(error);

                    return false;

                }

            }


            // --------------------------------------------
            // ESCAPE HTML
            // --------------------------------------------

            function escapeHTML(value) {

                return String(value ?? "").replace(
                    /[&<>"']/g,
                    function (char) {

                        return {
                            "&": "&amp;",
                            "<": "&lt;",
                            ">": "&gt;",
                            '"': "&quot;",
                            "'": "&#039;"
                        }[char];

                    }
                );

            }


            // --------------------------------------------
            // CREATE UNIQUE ID
            // --------------------------------------------

            function createID() {

                return window.crypto &&
                    typeof window.crypto.randomUUID === "function"

                    ? window.crypto.randomUUID()

                    : Date.now().toString() +
                      Math.random().toString(16).slice(2);

            }


            // --------------------------------------------
            // FORMAT DATE
            // --------------------------------------------

            function formatDate(dateValue) {

                const date = new Date(dateValue);

                if (Number.isNaN(date.getTime())) {
                    return "Recently";
                }

                return date.toLocaleString([], {

                    dateStyle: "medium",
                    timeStyle: "short"

                });

            }


            // --------------------------------------------
            // IMAGE PREVIEW & VALIDATION
            // --------------------------------------------

            if (imageInput) {

                imageInput.addEventListener("change", function () {

                    const file = imageInput.files[0];

                    selectedImage = "";

                    if (imagePreview) {
                        imagePreview.innerHTML = "";
                    }

                    if (!file) return;

                    // Validate image type
                    if (!file.type.startsWith("image/")) {

                        alert("Please select a valid image.");

                        imageInput.value = "";

                        return;

                    }

                    // Maximum 1 MB
                    if (file.size > 1024 * 1024) {

                        alert(
                            "Please select an image smaller than 1 MB."
                        );

                        imageInput.value = "";

                        return;

                    }

                    const reader = new FileReader();

                    reader.onload = function (event) {

                        selectedImage = event.target.result;

                        if (imagePreview) {

                            const preview = document.createElement("img");

                            preview.src = selectedImage;

                            preview.alt = "Selected image preview";

                            imagePreview.appendChild(preview);

                        }

                    };

                    reader.onerror = function () {

                        alert("Unable to read this image. Please try again.");

                        selectedImage = "";

                    };

                    reader.readAsDataURL(file);

                });

            }


            // --------------------------------------------
            // ANONYMOUS POSTING
            // --------------------------------------------

            if (anonymousInput && authorInput) {

                anonymousInput.addEventListener("change", function () {

                    authorInput.disabled = anonymousInput.checked;

                    if (anonymousInput.checked) {

                        authorInput.value = "";

                    }

                });

            }


            // --------------------------------------------
            // CREATE NEW POST
            // --------------------------------------------

            postForm.addEventListener("submit", function (event) {

                event.preventDefault();

                const text = postTextInput.value.trim();

                if (!text) {

                    alert("Please write something before publishing.");

                    return;

                }

                const author = anonymousInput && anonymousInput.checked

                    ? "Anonymous"

                    : (authorInput && authorInput.value.trim())
                        || "Anonymous";


                const posts = getPosts();

                const newPost = {

                    id: createID(),

                    author: author,

                    text: text,

                    image: selectedImage,

                    location: locationInput
                        ? locationInput.value.trim()
                        : "",

                    createdAt: new Date().toISOString(),

                    likes: 0,

                    liked: false,

                    comments: [],

                    reports: 0,

                    hidden: false

                };

                posts.unshift(newPost);

                if (!savePosts(posts)) return;

                // Reset form
                postForm.reset();

                selectedImage = "";

                if (imagePreview) {
                    imagePreview.innerHTML = "";
                }

                if (authorInput) {
                    authorInput.disabled = false;
                }

                renderPosts();

                alert("Your post has been published!");

            });


            // --------------------------------------------
            // RENDER COMMUNITY POSTS
            // --------------------------------------------

            function renderPosts() {

                const posts = getPosts();

                const isAdmin = adminMode
                    ? adminMode.checked
                    : false;

                const visiblePosts = isAdmin

                    ? posts

                    : posts.filter(function (post) {
                        return !post.hidden;
                    });


                if (postCount) {

                    postCount.textContent =
                        visiblePosts.length + " Posts";

                }


                if (visiblePosts.length === 0) {

                    postsList.innerHTML = `

                        <div class="community-empty">

                            <i class="fa-regular fa-comments"></i>

                            <strong>No community posts yet</strong>

                            <p>
                                Be the first person to share an update.
                            </p>

                        </div>

                    `;

                    return;

                }


                postsList.innerHTML = visiblePosts.map(function (post) {

                    const comments = Array.isArray(post.comments)

                        ? post.comments

                        : [];


                    const likes = Number(post.likes) || 0;

                    const reports = Number(post.reports) || 0;


                    // Post image
                    const imageHTML = post.image

                        ? `

                            <img
                                class="community-post-image"
                                src="${escapeHTML(post.image)}"
                                alt="Community post image"
                            >

                        `

                        : "";


                    // Post location
                    const locationHTML = post.location

                        ? `

                            <div class="community-location">

                                <i class="fa-solid fa-location-dot"></i>

                                ${escapeHTML(post.location)}

                            </div>

                        `

                        : "";


                    // Comments
                    const commentsHTML = comments.map(

                        function (comment) {

                            return `

                                <div class="community-comment">

                                    <strong>
                                        ${escapeHTML(comment.author)}:
                                    </strong>

                                    ${escapeHTML(comment.text)}

                                </div>

                            `;

                        }

                    ).join("");


                    // Admin moderation
                    const moderationHTML = isAdmin

                        ? `

                            <div class="community-moderation">

                                <button
                                    type="button"
                                    data-action="hide"
                                    data-id="${escapeHTML(post.id)}"
                                >

                                    ${post.hidden
                                        ? "Show Post"
                                        : "Hide Post"}

                                </button>


                                <button
                                    type="button"
                                    class="delete"
                                    data-action="delete"
                                    data-id="${escapeHTML(post.id)}"
                                >

                                    <i class="fa-solid fa-trash"></i>

                                    Delete

                                </button>

                            </div>

                        `

                        : "";


                    // Complete post card
                    return `

                        <article
                            class="community-post-card"
                            data-post-id="${escapeHTML(post.id)}"
                        >

                            <div class="community-post-header">

                                <div class="community-author-info">

                                    <div class="community-avatar">

                                        <i class="fa-solid fa-user"></i>

                                    </div>

                                    <div>

                                        <strong>
                                            ${escapeHTML(post.author)}
                                        </strong>

                                        <span class="community-post-time">

                                            ${escapeHTML(
                                                formatDate(post.createdAt)
                                            )}

                                        </span>

                                        ${locationHTML}

                                    </div>

                                </div>

                            </div>


                            ${
                                post.hidden

                                ? `

                                    <p class="community-post-text">

                                        This post is currently hidden.

                                    </p>

                                `

                                : `

                                    <div class="community-post-text">

                                        ${escapeHTML(post.text)}

                                    </div>

                                    ${imageHTML}

                                `
                            }


                            <div class="community-post-stats">

                                <i class="fa-solid fa-thumbs-up"></i>

                                ${likes} Likes

                                &nbsp; · &nbsp;

                                ${comments.length} Comments

                                &nbsp; · &nbsp;

                                ${reports} Reports

                            </div>


                            <div class="community-post-actions">

                                <button
                                    type="button"
                                    class="community-action-btn
                                    ${post.liked ? "liked" : ""}"
                                    data-action="like"
                                    data-id="${escapeHTML(post.id)}"
                                >

                                    <i class="fa-solid fa-thumbs-up"></i>

                                    ${post.liked ? "Liked" : "Like"}

                                </button>


                                <button
                                    type="button"
                                    class="community-action-btn"
                                    data-action="focus-comment"
                                    data-id="${escapeHTML(post.id)}"
                                >

                                    <i class="fa-regular fa-comment"></i>

                                    Comment

                                </button>


                                <button
                                    type="button"
                                    class="community-action-btn report"
                                    data-action="report"
                                    data-id="${escapeHTML(post.id)}"
                                >

                                    <i class="fa-regular fa-flag"></i>

                                    Report

                                </button>

                            </div>


                            <div class="community-comments">

                                ${commentsHTML}


                                <form
                                    class="community-comment-form"
                                    data-comment-form="${escapeHTML(post.id)}"
                                >

                                    <input
                                        type="text"
                                        class="community-comment-input"
                                        name="comment"
                                        placeholder="Write a comment..."
                                        maxlength="300"
                                        required
                                    >


                                    <button
                                        type="submit"
                                        aria-label="Send comment"
                                    >

                                        <i class="fa-solid fa-paper-plane"></i>

                                    </button>

                                </form>

                            </div>


                            ${moderationHTML}


                        </article>

                    `;

                }).join("");

            }


            // --------------------------------------------
            // HANDLE POST ACTIONS
            // --------------------------------------------

            postsList.addEventListener("click", function (event) {

                const button = event.target.closest(
                    "button[data-action]"
                );

                if (!button || !postsList.contains(button)) return;

                const action = button.dataset.action;

                const postID = button.dataset.id;

                const posts = getPosts();

                const post = posts.find(function (item) {

                    return item.id === postID;

                });

                if (!post) return;


                // LIKE / UNLIKE
                if (action === "like") {

                    if (post.liked) {

                        post.likes = Math.max(
                            0,
                            (Number(post.likes) || 0) - 1
                        );

                        post.liked = false;

                    } else {

                        post.likes =
                            (Number(post.likes) || 0) + 1;

                        post.liked = true;

                    }

                }


                // REPORT POST
                else if (action === "report") {

                    if (!confirm(
                        "Are you sure you want to report this post?"
                    )) {

                        return;

                    }

                    post.reports =
                        (Number(post.reports) || 0) + 1;

                    alert(
                        "Your report has been recorded in this demo."
                    );

                }


                // FOCUS COMMENT INPUT
                else if (action === "focus-comment") {

                    const commentForm = Array.from(

                        postsList.querySelectorAll(
                            "[data-comment-form]"
                        )

                    ).find(function (form) {

                        return form.dataset.commentForm === postID;

                    });

                    if (commentForm) {

                        const commentInput = commentForm.querySelector(
                            'input[name="comment"]'
                        );

                        if (commentInput) {
                            commentInput.focus();
                        }

                    }

                    return;

                }


                // HIDE / SHOW POST
                else if (action === "hide") {

                    if (!adminMode || !adminMode.checked) return;

                    post.hidden = !post.hidden;

                }


                // DELETE POST
                else if (action === "delete") {

                    if (!adminMode || !adminMode.checked) return;

                    if (!confirm(
                        "Delete this post permanently from this browser?"
                    )) {

                        return;

                    }

                    const updatedPosts = posts.filter(function (item) {

                        return item.id !== postID;

                    });

                    if (savePosts(updatedPosts)) {
                        renderPosts();
                    }

                    return;

                }


                // SAVE CHANGES
                if (savePosts(posts)) {

                    renderPosts();

                }

            });


            // --------------------------------------------
            // ADD COMMENTS
            // --------------------------------------------

            postsList.addEventListener("submit", function (event) {

                const form = event.target.closest(
                    ".community-comment-form"
                );

                if (!form) return;

                event.preventDefault();

                const postID = form.dataset.commentForm;

                const input = form.querySelector(
                    'input[name="comment"]'
                );

                if (!input) return;

                const commentText = input.value.trim();

                if (!commentText) return;


                const posts = getPosts();

                const post = posts.find(function (item) {

                    return item.id === postID;

                });

                if (!post) return;


                if (!Array.isArray(post.comments)) {

                    post.comments = [];

                }


                post.comments.push({

                    author: "Community Member",

                    text: commentText,

                    createdAt: new Date().toISOString()

                });


                if (savePosts(posts)) {

                    renderPosts();

                }

            });


            // --------------------------------------------
            // ADMIN MODE SWITCH
            // --------------------------------------------

            if (adminMode) {

                adminMode.addEventListener(
                    "change",
                    renderPosts
                );

            }


            // --------------------------------------------
            // INITIAL COMMUNITY FEED
            // --------------------------------------------

            renderPosts();

        }

    }

});

/* =====================================================
   END OF SAFE AID JAVASCRIPT
===================================================== */