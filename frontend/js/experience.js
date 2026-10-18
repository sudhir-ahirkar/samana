// =====================================================
// SAMANA EXPERIENCE DETAILS
// =====================================================

// =====================================================
// API BASE URL
// =====================================================

const EXPERIENCE_API_URL =
    getBackendUrl() + "/api";


// =====================================================
// BACKEND SERVER URL
// =====================================================

const EXPERIENCE_BACKEND_URL =
    getBackendUrl();


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    loadExperienceDetails();


    const bookButton =
        document.getElementById(
            "bookExperienceButton"
        );


    if (bookButton) {

        bookButton.addEventListener(
            "click",
            openBookingForCurrentExperience
        );

    }


    const confirmButton =
        document.getElementById(
            "confirmBookingButton"
        );


    if (confirmButton) {

        confirmButton.addEventListener(
            "click",
            createBooking
        );

    }

});


// =====================================================
// GET EXPERIENCE ID FROM URL
// =====================================================

function getExperienceIdFromUrl() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("id");
}


// =====================================================
// LOAD EXPERIENCE
// =====================================================

async function loadExperienceDetails() {

    const experienceId =
        getExperienceIdFromUrl();


    const loading =
        document.getElementById(
            "experienceLoading"
        );


    const content =
        document.getElementById(
            "experienceContent"
        );


    if (!experienceId) {

        showMessage(
            "No experience ID was provided.",
            "danger"
        );


        if (loading) {

            loading.style.display =
                "none";

        }

        return;
    }


    try {

        console.log(
            "Loading experience:",
            experienceId
        );


        const response =
            await fetch(
                `${EXPERIENCE_API_URL}/experiences/${experienceId}`
            );


        console.log(
            "Experience API status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "Experience could not be loaded."
            );

        }


        const experience =
            await response.json();


        console.log(
            "Experience details:",
            experience
        );


        displayExperience(
            experience
        );


        // =================================================
        // LOAD HOST PROFILE
        // =================================================

        await loadHostProfile(
            experience.hostId
        );


        if (loading) {

            loading.style.display =
                "none";

        }


        if (content) {

            content.style.display =
                "block";

        }


    } catch (error) {

        console.error(
            "Experience loading error:",
            error
        );


        if (loading) {

            loading.style.display =
                "none";

        }


        showMessage(
            error.message ||
            "Unable to load this experience.",
            "danger"
        );

    }

}


// =====================================================
// DISPLAY EXPERIENCE
// =====================================================

function displayExperience(
    experience
) {

    // =================================================
    // TITLE
    // =================================================

    setText(
        "experienceTitle",
        experience.title ||
        "Experience"
    );


    // =================================================
    // DESCRIPTION
    // =================================================

    setText(
        "experienceDescription",
        experience.description ||
        "No description available."
    );


    // =================================================
    // CATEGORY
    // =================================================

    setText(
        "experienceCategory",
        experience.categoryName ||
        "Cultural Experience"
    );


    // =================================================
    // LOCATION
    // =================================================

    setText(
        "experienceLocation",
        experience.location ||
        "Not specified"
    );


    // =================================================
    // DURATION
    // =================================================

    setText(
        "experienceDuration",
        formatDuration(
            experience.duration
        )
    );


    // =================================================
    // MAX GUESTS
    // =================================================

    setText(
        "experienceGuests",
        experience.maxGuests
            ? `${experience.maxGuests} guests`
            : "Not specified"
    );


    // =================================================
    // MEETING POINT
    // =================================================

    setText(
        "experienceMeetingPoint",
        experience.meetingPoint ||
        "Not specified"
    );


    // =================================================
    // WHAT YOU WILL DO
    // =================================================

    setText(
        "whatYouWillDo",
        experience.whatYouWillDo ||
        "Not specified"
    );


    // =================================================
    // INCLUDED
    // =================================================

    setText(
        "included",
        experience.included ||
        "Not specified"
    );


    // =================================================
    // NOT INCLUDED
    // =================================================

    setText(
        "notIncluded",
        experience.notIncluded ||
        "Not specified"
    );


    // =================================================
    // CANCELLATION POLICY
    // =================================================

    setText(
        "cancellationPolicy",
        experience.cancellationPolicy ||
        "Not specified"
    );


    // =================================================
    // PRICE
    // =================================================

    setText(
        "experiencePrice",
        `₹${experience.price || 0}`
    );


    // =================================================
    // AVAILABILITY
    // =================================================

    const availabilityBadge =
        document.getElementById(
            "availabilityBadge"
        );


    const bookButton =
        document.getElementById(
            "bookExperienceButton"
        );


    if (availabilityBadge) {

        if (experience.available) {

            availabilityBadge.className =
                "alert alert-success";

            availabilityBadge.innerHTML = `

                <i class="fa-solid fa-circle-check me-2"></i>

                Available

            `;

        } else {

            availabilityBadge.className =
                "alert alert-danger";

            availabilityBadge.innerHTML = `

                <i class="fa-solid fa-circle-xmark me-2"></i>

                Currently unavailable

            `;


            if (bookButton) {

                bookButton.disabled =
                    true;

            }

        }

    }


    // =================================================
    // COVER IMAGE
    // =================================================

    displayCoverImage(
        experience
    );


    // =================================================
    // ADDITIONAL IMAGES
    // =================================================

    displayAdditionalImages(
        experience
    );


    // =================================================
    // VIDEO
    // =================================================

    displayVideo(
        experience.videoUrl
    );


    // =================================================
    // SAVE CURRENT EXPERIENCE
    // =================================================

    window.currentExperience =
        experience;

}


// =====================================================
// LOAD HOST PROFILE
// =====================================================

async function loadHostProfile(
    hostId
) {

    const hostSection =
        document.getElementById(
            "hostSection"
        );


    if (!hostSection) {

        return;

    }


    // =================================================
    // NO HOST ID
    // =================================================

    if (!hostId) {

        console.warn(
            "No hostId was provided by the experience."
        );


        hostSection.style.display =
            "none";

        return;

    }


    try {

        console.log(
            "Loading host profile:",
            hostId
        );


        const response =
            await fetch(
                `${EXPERIENCE_API_URL}/hosts/profile/${hostId}`
            );


        console.log(
            "Host profile API status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "Host profile could not be loaded."
            );

        }


        const host =
            await response.json();


        console.log(
            "Host profile:",
            host
        );


        displayHostProfile(
            host
        );


    } catch (error) {

        console.error(
            "Host profile loading error:",
            error
        );


        hostSection.style.display =
            "none";

    }

}


// =====================================================
// DISPLAY HOST PROFILE
// =====================================================

function displayHostProfile(
    host
) {

    const hostSection =
        document.getElementById(
            "hostSection"
        );


    if (!hostSection) {

        return;

    }


    // =================================================
    // HOST NAME
    // =================================================

    setText(
        "hostName",
        host.hostName ||
        "SAMANA Host"
    );


    // =================================================
    // LOCATION
    // =================================================

    setText(
        "hostLocation",
        host.location ||
        "Location not specified"
    );


    // =================================================
    // ABOUT HOST
    // =================================================

    setText(
        "hostAbout",
        host.aboutHost ||
        "This host enjoys welcoming travelers and sharing local experiences."
    );


    // =================================================
    // RATING
    // =================================================

    const rating =
        Number(
            host.averageRating || 0
        );


    setText(
        "hostRating",
        rating > 0
            ? rating.toFixed(1)
            : "New"
    );


    // =================================================
    // REVIEW COUNT
    // =================================================

    const reviewCount =
        Number(
            host.reviewCount || 0
        );


    setText(
        "hostReviewCount",
        reviewCount === 1
            ? "1 review"
            : `${reviewCount} reviews`
    );


    // =================================================
    // EXPERIENCES HOSTED
    // =================================================

    const experiencesHosted =
        Number(
            host.experiencesHosted || 0
        );


    setText(
        "hostExperiencesHosted",
        experiencesHosted
    );


    // =================================================
    // YEARS HOSTING
    // =================================================

    if (
        host.yearsOfHosting !== null &&
        host.yearsOfHosting !== undefined
    ) {

        setText(
            "hostYearsHosting",
            `${host.yearsOfHosting} ${
                Number(host.yearsOfHosting) === 1
                    ? "year"
                    : "years"
            } hosting`
        );

    } else {

        setText(
            "hostYearsHosting",
            "Host"
        );

    }


    // =================================================
    // PROFILE PHOTO
    // =================================================

    const image =
        document.getElementById(
            "hostProfileImage"
        );


    const placeholder =
        document.getElementById(
            "hostProfilePlaceholder"
        );


    if (image && placeholder) {

        const imageUrl =
            getMediaUrl(
                host.profilePhotoUrl
            );


        if (imageUrl) {

            image.src =
                imageUrl;

            image.alt =
                host.hostName ||
                "Host profile photo";

            image.style.display =
                "block";

            placeholder.style.display =
                "none";


            image.onerror =
                function () {

                    image.style.display =
                        "none";

                    placeholder.style.display =
                        "flex";

                };

        } else {

            image.style.display =
                "none";

            placeholder.style.display =
                "flex";

        }

    }


    // =================================================
    // FULL PROFILE LINK
    // =================================================

    const profileLink =
        document.getElementById(
            "viewHostProfileButton"
        );


    if (profileLink) {

        profileLink.href =
            `host-profile.html?userId=${host.userId}`;

    }


    // =================================================
    // SHOW SECTION
    // =================================================

    hostSection.style.display =
        "block";

}


// =====================================================
// SAFE TEXT SETTER
// =====================================================

function setText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.textContent =
            value;

    }

}


// =====================================================
// FORMAT DURATION
// =====================================================

function formatDuration(
    duration
) {

    if (!duration) {

        return "Not specified";

    }


    if (Number(duration) === 1) {

        return "1 day";

    }


    return `${duration} days`;

}


// =====================================================
// DISPLAY COVER IMAGE
// =====================================================

function displayCoverImage(
    experience
) {

    const container =
        document.getElementById(
            "imageContainer"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    const coverImageUrl =
        getMediaUrl(
            experience.coverImageUrl
        );


    if (!coverImageUrl) {

        container.innerHTML = `

            <div class="media-placeholder">

                <i class="fa-solid fa-image me-2"></i>

                No cover image available

            </div>

        `;

        return;

    }


    const image =
        document.createElement(
            "img"
        );


    image.src =
        coverImageUrl;


    image.alt =
        experience.title ||
        "Experience";


    image.className =
        "experience-hero-image";


    image.loading =
        "lazy";


    image.onerror =
        function () {

            console.error(
                "Cover image could not be loaded:",
                coverImageUrl
            );


            container.innerHTML = `

                <div class="media-placeholder">

                    <i class="fa-solid fa-image me-2"></i>

                    Image could not be loaded

                </div>

            `;

        };


    container.appendChild(
        image
    );

}


// =====================================================
// DISPLAY ADDITIONAL IMAGES
// =====================================================

function displayAdditionalImages(
    experience
) {

    const container =
        document.getElementById(
            "additionalImagesContainer"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (!experience.imageUrls) {

        return;

    }


    let imageUrls = [];


    if (Array.isArray(experience.imageUrls)) {

        imageUrls =
            experience.imageUrls;

    } else {

        imageUrls =
            String(
                experience.imageUrls
            )
            .split(",")
            .map(
                url => url.trim()
            )
            .filter(
                url => url.length > 0
            );

    }


    if (imageUrls.length === 0) {

        return;

    }


    imageUrls.forEach(
        function (url) {

            const imageUrl =
                getMediaUrl(
                    url
                );


            if (!imageUrl) {

                return;

            }


            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.className =
                "col-md-6";


            const image =
                document.createElement(
                    "img"
                );


            image.src =
                imageUrl;


            image.alt =
                experience.title ||
                "Experience image";


            image.className =
                "additional-experience-image";


            image.loading =
                "lazy";


            image.onerror =
                function () {

                    wrapper.remove();

                };


            wrapper.appendChild(
                image
            );


            container.appendChild(
                wrapper
            );

        }
    );

}


// =====================================================
// MEDIA URL
// =====================================================

function getMediaUrl(
    url
) {

    if (!url) {

        return "";

    }


    const cleanUrl =
        String(url).trim();


    if (!cleanUrl) {

        return "";

    }


    // =================================================
    // ALREADY COMPLETE URL
    // =================================================

    if (
        cleanUrl.startsWith("http://") ||
        cleanUrl.startsWith("https://")
    ) {

        return cleanUrl;

    }


    // =================================================
    // BACKEND RELATIVE URL
    // =================================================

    if (
        cleanUrl.startsWith("/")
    ) {

        return `${EXPERIENCE_BACKEND_URL}${cleanUrl}`;

    }


    // =================================================
    // RELATIVE URL WITHOUT /
    // =================================================

    return `${EXPERIENCE_BACKEND_URL}/${cleanUrl}`;

}


// =====================================================
// DISPLAY VIDEO
// =====================================================

function displayVideo(
    videoUrl
) {

    const section =
        document.getElementById(
            "videoSection"
        );


    const container =
        document.getElementById(
            "videoContainer"
        );


    if (!section || !container) {

        return;

    }


    if (
        !videoUrl ||
        String(videoUrl).trim() === ""
    ) {

        section.style.display =
            "none";

        container.innerHTML =
            "";

        return;

    }


    const url =
        String(videoUrl).trim();


    // =================================================
    // YOUTUBE
    // =================================================

    if (
        url.includes("youtube.com") ||
        url.includes("youtu.be")
    ) {

        const embedUrl =
            convertYoutubeUrl(
                url
            );


        if (embedUrl) {

            container.innerHTML = `

                <iframe
                    src="${embedUrl}"
                    class="experience-video"
                    title="Experience Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>

            `;


            section.style.display =
                "block";


            return;

        }

    }


    // =================================================
    // NORMAL VIDEO FILE
    // =================================================

    const videoSource =
        getMediaUrl(
            url
        );


    container.innerHTML = `

        <video
            controls
            class="experience-video">

            <source
                src="${videoSource}">

            Your browser does not support
            video playback.

        </video>

    `;


    section.style.display =
        "block";

}


// =====================================================
// YOUTUBE URL CONVERTER
// =====================================================

function convertYoutubeUrl(
    url
) {

    let videoId =
        "";


    // =================================================
    // YOUTUBE SHORT URL
    // =================================================

    if (
        url.includes("youtu.be/")
    ) {

        videoId =
            url
                .split("youtu.be/")[1]
                .split("?")[0]
                .split("&")[0];

    }


    // =================================================
    // YOUTUBE WATCH URL
    // =================================================

    if (
        url.includes("youtube.com/watch")
    ) {

        const questionMarkIndex =
            url.indexOf("?");


        if (
            questionMarkIndex !== -1
        ) {

            const queryString =
                url.substring(
                    questionMarkIndex + 1
                );


            const params =
                new URLSearchParams(
                    queryString
                );


            videoId =
                params.get("v");

        }

    }


    if (!videoId) {

        return null;

    }


    return `https://www.youtube.com/embed/${videoId}`;

}


// =====================================================
// OPEN BOOKING
// =====================================================

function openBookingForCurrentExperience() {

    const token =
        localStorage.getItem(
            "token"
        );


    if (!token) {

        alert(
            "Please login before booking an experience."
        );


        window.location.href =
            "login.html";


        return;

    }


    const experience =
        window.currentExperience;


    if (!experience) {

        alert(
            "Experience information is not available."
        );


        return;

    }


    const experienceIdInput =
        document.getElementById(
            "selectedExperienceId"
        );


    const experienceTitleInput =
        document.getElementById(
            "selectedExperienceTitle"
        );


    const numberOfPeopleInput =
        document.getElementById(
            "numberOfPeople"
        );


    const bookingDateInput =
        document.getElementById(
            "bookingDate"
        );


    const bookingMessage =
        document.getElementById(
            "bookingFormMessage"
        );


    const confirmButton =
        document.getElementById(
            "confirmBookingButton"
        );


    if (experienceIdInput) {

        experienceIdInput.value =
            experience.id;

    }


    if (experienceTitleInput) {

        experienceTitleInput.value =
            experience.title;

    }


    if (numberOfPeopleInput) {

        numberOfPeopleInput.value =
            1;

    }


    if (bookingDateInput) {

        bookingDateInput.value =
            "";

    }


    if (bookingMessage) {

        bookingMessage.innerHTML =
            "";

    }


    if (confirmButton) {

        confirmButton.disabled =
            false;

        confirmButton.style.display =
            "inline-block";

    }


    const modalElement =
        document.getElementById(
            "bookingModal"
        );


    if (!modalElement) {

        return;

    }


    const modal =
        new bootstrap.Modal(
            modalElement
        );


    modal.show();

}


// =====================================================
// CREATE BOOKING
// =====================================================

async function createBooking() {

    const message =
        document.getElementById(
            "bookingFormMessage"
        );


    const button =
        document.getElementById(
            "confirmBookingButton"
        );


    const experienceId =
        document.getElementById(
            "selectedExperienceId"
        ).value;


    const numberOfPeople =
        document.getElementById(
            "numberOfPeople"
        ).value;


    const bookingDate =
        document.getElementById(
            "bookingDate"
        ).value;


    // =================================================
    // VALIDATION
    // =================================================

    if (!experienceId) {

        message.innerHTML = `

            <div class="alert alert-danger">

                Experience is missing.

            </div>

        `;

        return;

    }


    if (
        !numberOfPeople ||
        Number(numberOfPeople) < 1
    ) {

        message.innerHTML = `

            <div class="alert alert-danger">

                Number of people must be at least 1.

            </div>

        `;

        return;

    }


    if (!bookingDate) {

        message.innerHTML = `

            <div class="alert alert-danger">

                Please select a booking date and time.

            </div>

        `;

        return;

    }


    // =================================================
    // FUTURE DATE
    // =================================================

    const selectedDate =
        new Date(
            bookingDate
        );


    const now =
        new Date();


    if (
        selectedDate <= now
    ) {

        message.innerHTML = `

            <div class="alert alert-danger">

                Booking date must be in the future.

            </div>

        `;

        return;

    }


    // =================================================
    // DISABLE BUTTON
    // =================================================

    button.disabled =
        true;


    button.innerHTML = `

        <span
            class="spinner-border spinner-border-sm me-2">
        </span>

        Creating Booking...

    `;


    try {

        const requestData = {

            experienceId:
                Number(experienceId),

            numberOfPeople:
                Number(numberOfPeople),

            bookingDate:
                bookingDate

        };


        console.log(
            "Booking request:",
            requestData
        );


        const response =
            await apiRequest(
                "/bookings",
                {

                    method: "POST",

                    body:
                        JSON.stringify(
                            requestData
                        )

                }
            );


        console.log(
            "Booking created:",
            response
        );


        message.innerHTML = `

            <div class="alert alert-success">

                <h5>

                    <i class="fa-solid fa-circle-check me-2"></i>

                    Booking Created Successfully!

                </h5>


                <p class="mb-1">

                    <strong>
                        Booking ID:
                    </strong>

                    ${response.id}

                </p>


                <p class="mb-1">

                    <strong>
                        People:
                    </strong>

                    ${response.numberOfPeople}

                </p>


                <p class="mb-1">

                    <strong>
                        Booking Date:
                    </strong>

                    ${response.bookingDate}

                </p>


                <p class="mb-0">

                    <strong>
                        Total Price:
                    </strong>

                    ₹${response.totalPrice}

                </p>

            </div>

        `;


        button.style.display =
            "none";


        setTimeout(
            function () {

                window.location.href =
                    "bookings.html";

            },
            2000
        );


    } catch (error) {

        console.error(
            "Create booking error:",
            error
        );


        message.innerHTML = `

            <div class="alert alert-danger">

                <h6>

                    <i class="fa-solid fa-circle-exclamation me-2"></i>

                    Booking Failed

                </h6>


                <p class="mb-0">

                    ${
                        error.message ||
                        "Unable to create booking."
                    }

                </p>

            </div>

        `;


        button.disabled =
            false;


        button.innerHTML = `

            <i class="fa-solid fa-calendar-check me-2"></i>

            Book Now

        `;

    }

}


// =====================================================
// MESSAGE
// =====================================================

function showMessage(
    message,
    type
) {

    const messageContainer =
        document.getElementById(
            "experienceMessage"
        );


    if (!messageContainer) {

        return;

    }


    messageContainer.innerHTML = `

        <div class="alert alert-${type}">

            ${message}

        </div>

    `;

}


// =====================================================
// LOGOUT
// =====================================================

function logoutUser() {

    localStorage.removeItem(
        "token"
    );


    localStorage.removeItem(
        "userId"
    );


    localStorage.removeItem(
        "userName"
    );


    localStorage.removeItem(
        "userEmail"
    );


    localStorage.removeItem(
        "userRole"
    );


    window.location.href =
        "login.html";

}