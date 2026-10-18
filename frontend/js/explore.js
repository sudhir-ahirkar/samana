// =========================================================
// SAMANA - EXPLORE EXPERIENCES
// =========================================================


// =========================================================
// BACKEND SERVER URL
// =========================================================

const EXPLORE_BACKEND_URL = getBackendUrl();


// =========================================================
// DOM ELEMENTS
// =========================================================

const experienceContainer =
    document.getElementById("experienceContainer");

const loadingMessage =
    document.getElementById("loadingMessage");

const errorMessage =
    document.getElementById("errorMessage");

const resultCount =
    document.getElementById("resultCount");

const sortFilter =
    document.getElementById("sortFilter");


// =========================================================
// EXPERIENCES DATA
// =========================================================

let allExperiences = [];


// =========================================================
// IMAGE URL
// =========================================================

function getExploreImageUrl(url) {

    if (!url) {
        return "images/placeholder.jpg";
    }

    const cleanUrl = String(url).trim();

    if (!cleanUrl) {
        return "images/placeholder.jpg";
    }

    if (
        cleanUrl.startsWith("http://") ||
        cleanUrl.startsWith("https://")
    ) {
        return cleanUrl;
    }

    if (cleanUrl.startsWith("/")) {
        return `${EXPLORE_BACKEND_URL}${cleanUrl}`;
    }

    return `${EXPLORE_BACKEND_URL}/${cleanUrl}`;
}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeExploreHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =========================================================
// LOAD EXPERIENCES
// =========================================================

async function loadExperiences() {

    console.log("=================================");
    console.log("SAMANA: Loading experiences...");
    console.log("API:", `${API_BASE_URL}/experiences`);
    console.log("=================================");


    try {

        if (loadingMessage) {
            loadingMessage.style.display = "block";
        }

        if (errorMessage) {
            errorMessage.style.display = "none";
        }


        // =================================================
        // CALL BACKEND
        // =================================================

        const response = await fetch(
            `${API_BASE_URL}/experiences`
        );


        console.log(
            "API status:",
            response.status
        );


        const responseText =
            await response.text();


        console.log(
            "API response:",
            responseText
        );


        // =================================================
        // CHECK RESPONSE
        // =================================================

        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        // =================================================
        // PARSE JSON
        // =================================================

        let data;

        try {

            data = responseText
                ? JSON.parse(responseText)
                : [];

        } catch (error) {

            console.error(
                "JSON parsing error:",
                error
            );

            throw new Error(
                "Backend returned invalid JSON."
            );

        }


        // =================================================
        // CHECK ARRAY
        // =================================================

        if (!Array.isArray(data)) {

            console.error(
                "Unexpected API data:",
                data
            );

            throw new Error(
                "Backend did not return an experience list."
            );

        }


        // =================================================
        // SAVE DATA
        // =================================================

        allExperiences = data;


        console.log(
            "Experiences successfully loaded:",
            allExperiences
        );


        // =================================================
        // RESULT COUNT
        // =================================================

        if (resultCount) {

            resultCount.innerText =
                `${allExperiences.length} Experiences`;

        }


        // =================================================
        // DISPLAY
        // =================================================

        renderExperiences(
            allExperiences
        );


    } catch (error) {

        console.error(
            "Experience loading failed:",
            error
        );


        if (resultCount) {

            resultCount.innerText =
                "Unable to load experiences";

        }


        if (errorMessage) {

            errorMessage.style.display =
                "block";

            errorMessage.innerHTML = `

                <i
                    class="fa-solid fa-circle-exclamation me-2"
                ></i>

                <strong>
                    Unable to load experiences.
                </strong>

                <br>

                <small>
                    ${escapeExploreHtml(error.message)}
                </small>

            `;

        }

    } finally {

        if (loadingMessage) {

            loadingMessage.style.display =
                "none";

        }

    }

}


// =========================================================
// RENDER EXPERIENCES
// =========================================================

function renderExperiences(experiences) {

    if (!experienceContainer) {

        console.error(
            "experienceContainer not found."
        );

        return;

    }


    experienceContainer.innerHTML = "";


    // =================================================
    // NO EXPERIENCES
    // =================================================

    if (
        !experiences ||
        experiences.length === 0
    ) {

        experienceContainer.innerHTML = `

            <div class="col-12">

                <div class="text-center py-5">

                    <i
                        class="fa-solid fa-compass fa-3x text-muted mb-3"
                    ></i>

                    <h4>
                        No experiences available
                    </h4>

                    <p class="text-muted">
                        Check back soon for new cultural experiences.
                    </p>

                </div>

            </div>

        `;

        return;

    }


    // =================================================
    // CREATE CARDS
    // =================================================

    experiences.forEach(
        function (experience) {

            experienceContainer.insertAdjacentHTML(
                "beforeend",
                createExperienceCard(experience)
            );

        }
    );


    // =================================================
    // WISHLIST
    // =================================================

    setupWishlistButtons();

}


// =========================================================
// EXPERIENCE CARD
// =========================================================

function createExperienceCard(experience) {

    const id =
        experience.id;


    const title =
        escapeExploreHtml(
            experience.title ||
            "Cultural Experience"
        );


    const description =
        escapeExploreHtml(
            experience.description ||
            ""
        );


    const location =
        escapeExploreHtml(
            experience.location ||
            "India"
        );


    const price =
        experience.price !== null &&
        experience.price !== undefined
            ? Number(
                experience.price
              ).toLocaleString("en-IN")
            : "0";


    const duration =
        experience.duration ||
        "N/A";


    const maxGuests =
        experience.maxGuests ||
        "N/A";


    const imageUrl =
        getExploreImageUrl(
            experience.coverImageUrl
        );


    // =================================================
    // CATEGORY
    // =================================================

    let categoryName =
        "Cultural Experience";


    if (
        experience.category &&
        experience.category.name
    ) {

        categoryName =
            experience.category.name;

    }


    categoryName =
        escapeExploreHtml(
            categoryName
        );


    return `

        <div
            class="col-lg-4 col-md-6 mb-4"
        >

            <div
                class="experience-card h-100"
            >


                <!-- IMAGE -->

                <div
                    class="experience-image"
                >

                    <img
                        src="${imageUrl}"
                        alt="${title}"
                        loading="lazy"
                        onerror="
                            this.style.display='none';
                            this.parentElement.innerHTML='<div style=\"width:100%; height:250px; background:#f0f0f0; display:flex; align-items:center; justify-content:center;\"><i class=\"fa-solid fa-image\" style=\"font-size:3rem; color:#999;\"></i></div>';
                        "
                    >


                    <!-- WISHLIST -->

                    <span
                        class="wishlist"
                        data-id="${id}"
                        title="Add to wishlist"
                    >

                        <i
                            class="fa-regular fa-heart"
                        ></i>

                    </span>

                </div>


                <!-- BODY -->

                <div
                    class="experience-body"
                >


                    <!-- CATEGORY -->

                    <span
                        class="badge bg-success"
                    >

                        ${categoryName}

                    </span>


                    <!-- TITLE -->

                    <h4 class="mt-3">

                        ${title}

                    </h4>


                    <!-- LOCATION -->

                    <p>

                        <i
                            class="fa-solid fa-location-dot me-1"
                        ></i>

                        ${location}

                    </p>


                    <!-- DURATION -->

                    <p>

                        <i
                            class="fa-solid fa-clock me-1"
                        ></i>

                        ${duration} hours

                    </p>


                    <!-- GUESTS -->

                    <p>

                        <i
                            class="fa-solid fa-users me-1"
                        ></i>

                        Up to ${maxGuests} guests

                    </p>


                    <!-- DESCRIPTION -->

                    <p
                        class="text-muted"
                    >

                        ${description}

                    </p>


                    <!-- PRICE -->

                    <h5>

                        ₹${price}

                        <small>
                            /person
                        </small>

                    </h5>


                    <!-- VIEW DETAILS -->

                    <a
                        href="experience.html?id=${id}"
                        class="btn btn-success w-100"
                    >

                        View Details

                    </a>

                </div>

            </div>

        </div>

    `;

}


// =========================================================
// WISHLIST
// =========================================================

function setupWishlistButtons() {

    document
        .querySelectorAll(".wishlist")
        .forEach(
            function (item) {

                item.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();


                        const icon =
                            item.querySelector("i");


                        if (!icon) {
                            return;
                        }


                        icon.classList.toggle(
                            "fa-regular"
                        );

                        icon.classList.toggle(
                            "fa-solid"
                        );


                        if (
                            icon.classList.contains(
                                "fa-solid"
                            )
                        ) {

                            icon.style.color =
                                "red";

                        } else {

                            icon.style.color =
                                "";

                        }

                    }
                );

            }
        );

}


// =========================================================
// SORT
// =========================================================

function sortExperiences() {

    if (!sortFilter) {
        return;
    }


    const sortValue =
        sortFilter.value;


    let sortedExperiences =
        [...allExperiences];


    if (
        sortValue ===
        "price-low"
    ) {

        sortedExperiences.sort(
            function (a, b) {

                return (
                    Number(a.price || 0) -
                    Number(b.price || 0)
                );

            }
        );

    }


    else if (
        sortValue ===
        "price-high"
    ) {

        sortedExperiences.sort(
            function (a, b) {

                return (
                    Number(b.price || 0) -
                    Number(a.price || 0)
                );

            }
        );

    }


    else if (
        sortValue ===
        "duration-low"
    ) {

        sortedExperiences.sort(
            function (a, b) {

                return (
                    Number(a.duration || 0) -
                    Number(b.duration || 0)
                );

            }
        );

    }


    else if (
        sortValue ===
        "duration-high"
    ) {

        sortedExperiences.sort(
            function (a, b) {

                return (
                    Number(b.duration || 0) -
                    Number(a.duration || 0)
                );

            }
        );

    }


    renderExperiences(
        sortedExperiences
    );

}


// =========================================================
// SORT EVENT
// =========================================================

if (sortFilter) {

    sortFilter.addEventListener(
        "change",
        sortExperiences
    );

}


// =========================================================
// PAGE LOAD
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadExperiences();

    }
);