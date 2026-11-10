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


/* =====================================
   SAFE AID - PUBLIC COMMUNITY FEED
   FRONTEND DEMO USING LOCAL STORAGE
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    const postForm = document.getElementById("communityPostForm");

    // Stop if Community Feed is not present
    if (!postForm) return;

    const authorInput = document.getElementById("communityAuthor");
    const anonymousInput = document.getElementById("communityAnonymous");
    const postTextInput = document.getElementById("communityPostText");
    const imageInput = document.getElementById("communityPostImage");
    const locationInput = document.getElementById("communityPostLocation");
    const imagePreview = document.getElementById("communityImagePreview");
    const postsList = document.getElementById("communityPostsList");
    const postCount = document.getElementById("communityPostCount");
    const adminMode = document.getElementById("communityAdminMode");

    const STORAGE_KEY = "safeAidCommunityPosts";

    let selectedImage = "";

    function getPosts() {
        try {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return [];
        }
    }

    function savePosts(posts) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
            return true;
        } catch (error) {
            alert("Storage is full. Please remove some posts or images.");
            return false;
        }
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[char];
        });
    }

    function createID() {
        return window.crypto && crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now().toString() + Math.random().toString(16).slice(2);
    }

    function formatDate(dateValue) {
        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) return "Recently";

        return date.toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "short"
        });
    }

    // Image preview and size validation
    imageInput.addEventListener("change", function () {

        const file = imageInput.files[0];

        selectedImage = "";
        imagePreview.innerHTML = "";

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image.");
            imageInput.value = "";
            return;
        }

        if (file.size > 1024 * 1024) {
            alert("Please select an image smaller than 1 MB.");
            imageInput.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {
            selectedImage = event.target.result;

            const preview = document.createElement("img");
            preview.src = selectedImage;
            preview.alt = "Selected image preview";

            imagePreview.appendChild(preview);
        };

        reader.readAsDataURL(file);
    });

    // Anonymous checkbox
    anonymousInput.addEventListener("change", function () {
        authorInput.disabled = anonymousInput.checked;

        if (anonymousInput.checked) {
            authorInput.value = "";
        }
    });

    // Create new post
    postForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const text = postTextInput.value.trim();

        if (!text) {
            alert("Please write something before publishing.");
            return;
        }

        const author = anonymousInput.checked
            ? "Anonymous"
            : authorInput.value.trim() || "Anonymous";

        const posts = getPosts();

        const newPost = {
            id: createID(),
            author: author,
            text: text,
            image: selectedImage,
            location: locationInput.value.trim(),
            createdAt: new Date().toISOString(),
            likes: 0,
            liked: false,
            comments: [],
            reports: 0,
            hidden: false
        };

        posts.unshift(newPost);

        if (!savePosts(posts)) return;

        postForm.reset();
        selectedImage = "";
        imagePreview.innerHTML = "";
        authorInput.disabled = false;

        renderPosts();

        alert("Your post has been published!");
    });

    // Render all posts
    function renderPosts() {

        const posts = getPosts();
        const isAdmin = adminMode.checked;

        const visiblePosts = isAdmin
            ? posts
            : posts.filter(post => !post.hidden);

        postCount.textContent = visiblePosts.length + " Posts";

        if (visiblePosts.length === 0) {
            postsList.innerHTML = `
                <div class="community-empty">
                    <i class="fa-regular fa-comments"></i>
                    <strong>No community posts yet</strong>
                    <p>Be the first person to share an update.</p>
                </div>
            `;
            return;
        }

        postsList.innerHTML = visiblePosts.map(function (post) {

            const comments = Array.isArray(post.comments)
                ? post.comments
                : [];

            const imageHTML = post.image
                ? `<img class="community-post-image"
                         src="${escapeHTML(post.image)}"
                         alt="Community post image">`
                : "";

            const locationHTML = post.location
                ? `<div class="community-location">
                       <i class="fa-solid fa-location-dot"></i>
                       ${escapeHTML(post.location)}
                   </div>`
                : "";

            const commentsHTML = comments.map(function (comment) {
                return `
                    <div class="community-comment">
                        <strong>${escapeHTML(comment.author)}:</strong>
                        ${escapeHTML(comment.text)}
                    </div>
                `;
            }).join("");

            const moderationHTML = isAdmin
                ? `
                    <div class="community-moderation">
                        <button type="button" data-action="hide" data-id="${escapeHTML(post.id)}">
                            ${post.hidden ? "Show Post" : "Hide Post"}
                        </button>

                        <button type="button" class="delete"
                            data-action="delete" data-id="${escapeHTML(post.id)}">
                            <i class="fa-solid fa-trash"></i> Delete
                        </button>
                    </div>
                `
                : "";

            return `
                <article class="community-post-card"
                    data-post-id="${escapeHTML(post.id)}">

                    <div class="community-post-header">
                        <div class="community-author-info">
                            <div class="community-avatar">
                                <i class="fa-solid fa-user"></i>
                            </div>

                            <div>
                                <strong>${escapeHTML(post.author)}</strong>
                                <span class="community-post-time">
                                    ${escapeHTML(formatDate(post.createdAt))}
                                </span>
                                ${locationHTML}
                            </div>
                        </div>
                    </div>

                    ${post.hidden ? `
                        <p class="community-post-text">
                            This post is currently hidden.
                        </p>
                    ` : `
                        <div class="community-post-text">
                            ${escapeHTML(post.text)}
                        </div>
                        ${imageHTML}
                    `}

                    <div class="community-post-stats">
                        <i class="fa-solid fa-thumbs-up"></i>
                        ${Number(post.likes) || 0} Likes
                        &nbsp; · &nbsp;
                        ${comments.length} Comments
                        &nbsp; · &nbsp;
                        ${Number(post.reports) || 0} Reports
                    </div>

                    <div class="community-post-actions">
                        <button type="button"
                            class="community-action-btn ${post.liked ? "liked" : ""}"
                            data-action="like"
                            data-id="${escapeHTML(post.id)}">
                            <i class="fa-solid fa-thumbs-up"></i>
                            ${post.liked ? "Liked" : "Like"}
                        </button>

                        <button type="button"
                            class="community-action-btn"
                            data-action="focus-comment"
                            data-id="${escapeHTML(post.id)}">
                            <i class="fa-regular fa-comment"></i>
                            Comment
                        </button>

                        <button type="button"
                            class="community-action-btn report"
                            data-action="report"
                            data-id="${escapeHTML(post.id)}">
                            <i class="fa-regular fa-flag"></i>
                            Report
                        </button>
                    </div>

                    <div class="community-comments">
                        ${commentsHTML}

                        <form class="community-comment-form"
                            data-comment-form="${escapeHTML(post.id)}">

                            <input
                                type="text"
                                class="community-comment-input"
                                name="comment"
                                placeholder="Write a comment..."
                                maxlength="300"
                                required
                            >

                            <button type="submit" aria-label="Send comment">
                                <i class="fa-solid fa-paper-plane"></i>
                            </button>
                        </form>
                    </div>

                    ${moderationHTML}

                </article>
            `;
        }).join("");
    }

    // Handle post actions
    postsList.addEventListener("click", function (event) {

        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const action = button.dataset.action;
        const postID = button.dataset.id;

        const posts = getPosts();
        const post = posts.find(item => item.id === postID);

        if (!post) return;

        if (action === "like") {
            if (post.liked) {
                post.likes = Math.max(0, (Number(post.likes) || 0) - 1);
                post.liked = false;
            } else {
                post.likes = (Number(post.likes) || 0) + 1;
                post.liked = true;
            }
        }

        else if (action === "report") {
            if (!confirm("Are you sure you want to report this post?")) {
                return;
            }

            post.reports = (Number(post.reports) || 0) + 1;
            alert("Your report has been recorded in this demo.");
        }

        else if (action === "focus-comment") {
            const commentInput = postsList.querySelector(
                `[data-comment-form="${CSS.escape(postID)}"] input`
            );

            if (commentInput) {
                commentInput.focus();
            }

            return;
        }

        else if (action === "hide") {
            if (!adminMode.checked) return;

            post.hidden = !post.hidden;
        }

        else if (action === "delete") {
            if (!adminMode.checked) return;

            if (!confirm("Delete this post permanently from this browser?")) {
                return;
            }

            const updatedPosts = posts.filter(item => item.id !== postID);
            savePosts(updatedPosts);
            renderPosts();
            return;
        }

        if (savePosts(posts)) {
            renderPosts();
        }
    });

    // Add comments
    postsList.addEventListener("submit", function (event) {

        const form = event.target.closest(".community-comment-form");

        if (!form) return;

        event.preventDefault();

        const postID = form.dataset.commentForm;
        const input = form.querySelector('input[name="comment"]');
        const commentText = input.value.trim();

        if (!commentText) return;

        const posts = getPosts();
        const post = posts.find(item => item.id === postID);

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

    // Frontend demo moderation switch
    adminMode.addEventListener("change", renderPosts);

    // Initial feed
    renderPosts();

});


const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {

    menuBtn.addEventListener("click", () => {

        navLinks.classList.toggle("active");

        const icon = menuBtn.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-bars");
            icon.classList.toggle("fa-xmark");
        }

    });

    navLinks.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("active");

            const icon = menuBtn.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }

        });

    });
}



