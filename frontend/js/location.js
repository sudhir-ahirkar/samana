// =========================================================
// BACKEND URL CONFIGURATION
// =========================================================

const LOCATION_API_URL =
    getBackendUrl() + "/api/locations";


// =========================================================
// CURRENT EDITING ID
// =========================================================

let editingLocationId = null;


// =========================================================
// DOM ELEMENTS
// =========================================================

const locationForm =
    document.getElementById(
        "locationForm"
    );


const countryInput =
    document.getElementById(
        "countryInput"
    );


const stateInput =
    document.getElementById(
        "stateInput"
    );


const cityInput =
    document.getElementById(
        "cityInput"
    );


const addressInput =
    document.getElementById(
        "addressInput"
    );


const latitudeInput =
    document.getElementById(
        "latitudeInput"
    );


const longitudeInput =
    document.getElementById(
        "longitudeInput"
    );


const locationList =
    document.getElementById(
        "locationList"
    );


const loadingBox =
    document.getElementById(
        "loadingBox"
    );


const emptyState =
    document.getElementById(
        "emptyState"
    );


const messageBox =
    document.getElementById(
        "messageBox"
    );


const saveLocationButton =
    document.getElementById(
        "saveLocationButton"
    );


const cancelButton =
    document.getElementById(
        "cancelButton"
    );


const formTitle =
    document.getElementById(
        "formTitle"
    );


const formSubtitle =
    document.getElementById(
        "formSubtitle"
    );


const formIcon =
    document.getElementById(
        "formIcon"
    );


// =========================================================
// SHOW MESSAGE
// =========================================================

function showMessage(
    message,
    type = "success"
) {

    if (!messageBox) {
        return;
    }


    messageBox.className =
        `alert alert-${type}`;


    messageBox.textContent =
        message;


    messageBox.style.display =
        "block";


    setTimeout(
        function () {

            messageBox.style.display =
                "none";

        },
        4000
    );
}


// =========================================================
// LOAD ALL LOCATIONS
// =========================================================

async function loadLocations() {

    if (loadingBox) {

        loadingBox.style.display =
            "block";
    }


    if (locationList) {

        locationList.innerHTML =
            "";
    }


    if (emptyState) {

        emptyState.style.display =
            "none";
    }


    try {

        const response =
            await fetch(
                LOCATION_API_URL,
                {
                    method: "GET"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load locations."
            );
        }


        const locations =
            await response.json();


        console.log(
            "Locations:",
            locations
        );


        displayLocations(
            locations
        );

    }

    catch (error) {

        console.error(
            "Load Locations Error:",
            error
        );


        showMessage(
            "Unable to load locations.",
            "danger"
        );

    }

    finally {

        if (loadingBox) {

            loadingBox.style.display =
                "none";
        }

    }
}


// =========================================================
// DISPLAY LOCATIONS
// =========================================================

function displayLocations(
    locations
) {

    if (!locationList) {
        return;
    }


    locationList.innerHTML =
        "";


    // -----------------------------------------------------
    // EMPTY
    // -----------------------------------------------------

    if (
        !locations ||
        locations.length === 0
    ) {

        if (emptyState) {

            emptyState.style.display =
                "block";
        }

        return;
    }


    if (emptyState) {

        emptyState.style.display =
            "none";
    }


    // -----------------------------------------------------
    // SORT BY ID
    // -----------------------------------------------------

    locations.sort(
        function (a, b) {

            return (
                Number(a.id || 0) -
                Number(b.id || 0)
            );

        }
    );


    // -----------------------------------------------------
    // CREATE CARDS
    // -----------------------------------------------------

    locations.forEach(
        function (location) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "location-item";


            card.innerHTML = `

                <div class="row align-items-center">

                    <div class="col-lg-8">

                        <div class="location-title">

                            <i
                                class="fa-solid fa-location-dot text-success me-2"
                            ></i>

                            ${escapeHtml(
                                location.city
                            )},
                            ${escapeHtml(
                                location.state
                            )}

                        </div>


                        <div class="text-muted mt-1">

                            <i
                                class="fa-solid fa-earth-americas me-2"
                            ></i>

                            ${escapeHtml(
                                location.country
                            )}

                        </div>


                        <div class="location-address">

                            <i
                                class="fa-solid fa-map-pin me-2"
                            ></i>

                            ${escapeHtml(
                                location.address
                            )}

                        </div>


                        <div
                            class="location-coordinates"
                        >

                            <i
                                class="fa-solid fa-compass me-1"
                            ></i>

                            Latitude:
                            ${formatCoordinate(
                                location.latitude
                            )}

                            &nbsp; | &nbsp;

                            Longitude:
                            ${formatCoordinate(
                                location.longitude
                            )}

                        </div>

                    </div>


                    <div class="col-lg-4">

                        <div class="location-actions">

                            <button
                                type="button"
                                class="btn btn-samana btn-edit"
                                onclick="editLocation(${location.id})"
                            >

                                <i
                                    class="fa-solid fa-pen me-1"
                                ></i>

                                Edit

                            </button>


                            <button
                                type="button"
                                class="btn btn-samana btn-delete"
                                onclick="deleteLocation(${location.id})"
                            >

                                <i
                                    class="fa-solid fa-trash me-1"
                                ></i>

                                Delete

                            </button>

                        </div>

                    </div>

                </div>

            `;


            locationList.appendChild(
                card
            );

        }
    );
}


// =========================================================
// FORMAT COORDINATE
// =========================================================

function formatCoordinate(
    value
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "-";
    }


    return Number(value).toFixed(6);
}


// =========================================================
// CREATE / UPDATE LOCATION
// =========================================================

async function saveLocation(
    event
) {

    event.preventDefault();


    // -----------------------------------------------------
    // VALIDATION
    // -----------------------------------------------------

    const country =
        countryInput.value.trim();


    const state =
        stateInput.value.trim();


    const city =
        cityInput.value.trim();


    const address =
        addressInput.value.trim();


    const latitude =
        latitudeInput.value;


    const longitude =
        longitudeInput.value;


    if (!country) {

        showMessage(
            "Please enter country.",
            "warning"
        );

        countryInput.focus();

        return;
    }


    if (!state) {

        showMessage(
            "Please enter state.",
            "warning"
        );

        stateInput.focus();

        return;
    }


    if (!city) {

        showMessage(
            "Please enter city.",
            "warning"
        );

        cityInput.focus();

        return;
    }


    if (!address) {

        showMessage(
            "Please enter address.",
            "warning"
        );

        addressInput.focus();

        return;
    }


    if (latitude === "") {

        showMessage(
            "Please enter latitude.",
            "warning"
        );

        latitudeInput.focus();

        return;
    }


    if (longitude === "") {

        showMessage(
            "Please enter longitude.",
            "warning"
        );

        longitudeInput.focus();

        return;
    }


    const latitudeNumber =
        Number(latitude);


    const longitudeNumber =
        Number(longitude);


    if (
        Number.isNaN(
            latitudeNumber
        )
    ) {

        showMessage(
            "Latitude must be a valid number.",
            "warning"
        );

        latitudeInput.focus();

        return;
    }


    if (
        Number.isNaN(
            longitudeNumber
        )
    ) {

        showMessage(
            "Longitude must be a valid number.",
            "warning"
        );

        longitudeInput.focus();

        return;
    }


    // -----------------------------------------------------
    // LOCATION OBJECT
    // -----------------------------------------------------

    const locationData = {

        country: country,

        state: state,

        city: city,

        address: address,

        latitude: latitudeNumber,

        longitude: longitudeNumber

    };


    // -----------------------------------------------------
    // BUTTON LOADING
    // -----------------------------------------------------

    if (saveLocationButton) {

        saveLocationButton.disabled =
            true;

        saveLocationButton.innerHTML =
            `<i class="fa-solid fa-spinner fa-spin me-2"></i>
             Saving...`;
    }


    try {

        let response;


        // =================================================
        // UPDATE
        // =================================================

        if (
            editingLocationId !== null
        ) {

            response =
                await fetch(
                    `${LOCATION_API_URL}/${editingLocationId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                locationData
                            )
                    }
                );

        }

        // =================================================
        // CREATE
        // =================================================

        else {

            response =
                await fetch(
                    LOCATION_API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                locationData
                            )
                    }
                );
        }


        // -------------------------------------------------
        // RESPONSE
        // -------------------------------------------------

        const responseText =
            await response.text();


        if (!response.ok) {

            console.error(
                "Location Save Error:",
                responseText
            );


            throw new Error(
                responseText ||
                "Unable to save location."
            );
        }


        // -------------------------------------------------
        // SUCCESS
        // -------------------------------------------------

        if (
            editingLocationId !== null
        ) {

            showMessage(
                "Location updated successfully!",
                "success"
            );

        }

        else {

            showMessage(
                "Location created successfully!",
                "success"
            );
        }


        // -------------------------------------------------
        // RESET
        // -------------------------------------------------

        resetLocationForm();


        // -------------------------------------------------
        // RELOAD
        // -------------------------------------------------

        await loadLocations();

    }

    catch (error) {

        console.error(
            "Save Location Error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to save location.",
            "danger"
        );

    }

    finally {

        restoreSaveButton();

    }
}


// =========================================================
// EDIT LOCATION
// =========================================================

async function editLocation(
    id
) {

    try {

        const response =
            await fetch(
                `${LOCATION_API_URL}/${id}`,
                {
                    method: "GET"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load location."
            );
        }


        const location =
            await response.json();


        console.log(
            "Editing Location:",
            location
        );


        // -------------------------------------------------
        // SET FORM DATA
        // -------------------------------------------------

        countryInput.value =
            location.country || "";


        stateInput.value =
            location.state || "";


        cityInput.value =
            location.city || "";


        addressInput.value =
            location.address || "";


        latitudeInput.value =
            location.latitude ?? "";


        longitudeInput.value =
            location.longitude ?? "";


        // -------------------------------------------------
        // SET EDIT ID
        // -------------------------------------------------

        editingLocationId =
            id;


        // -------------------------------------------------
        // UPDATE FORM UI
        // -------------------------------------------------

        if (formTitle) {

            formTitle.textContent =
                "Update Location";
        }


        if (formSubtitle) {

            formSubtitle.textContent =
                "Update the selected location.";
        }


        if (formIcon) {

            formIcon.className =
                "fa-solid fa-pen-to-square me-2";
        }


        if (saveLocationButton) {

            saveLocationButton.innerHTML =
                `<i class="fa-solid fa-floppy-disk me-2"></i>
                 Update Location`;
        }


        if (cancelButton) {

            cancelButton.style.display =
                "inline-block";
        }


        // -------------------------------------------------
        // SCROLL TO FORM
        // -------------------------------------------------

        document
            .querySelector(".location-card")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

    }

    catch (error) {

        console.error(
            "Edit Location Error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to load location.",
            "danger"
        );
    }
}


// =========================================================
// DELETE LOCATION
// =========================================================

async function deleteLocation(
    id
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this location?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${LOCATION_API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const responseText =
            await response.text();


        if (!response.ok) {

            console.error(
                "Delete Location Error:",
                responseText
            );


            throw new Error(
                responseText ||
                "Unable to delete location."
            );
        }


        showMessage(
            "Location deleted successfully!",
            "success"
        );


        // -------------------------------------------------
        // IF CURRENTLY EDITING SAME LOCATION
        // -------------------------------------------------

        if (
            editingLocationId === id
        ) {

            resetLocationForm();
        }


        // -------------------------------------------------
        // RELOAD
        // -------------------------------------------------

        await loadLocations();

    }

    catch (error) {

        console.error(
            "Delete Location Error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to delete location.",
            "danger"
        );
    }
}


// =========================================================
// RESET FORM
// =========================================================

function resetLocationForm() {

    if (locationForm) {

        locationForm.reset();
    }


    editingLocationId =
        null;


    // -----------------------------------------------------
    // FORM TITLE
    // -----------------------------------------------------

    if (formTitle) {

        formTitle.textContent =
            "Add New Location";
    }


    if (formSubtitle) {

        formSubtitle.textContent =
            "Add a location for your SAMANA experience.";
    }


    if (formIcon) {

        formIcon.className =
            "fa-solid fa-plus-circle me-2";
    }


    // -----------------------------------------------------
    // BUTTON
    // -----------------------------------------------------

    restoreSaveButton();


    // -----------------------------------------------------
    // CANCEL
    // -----------------------------------------------------

    if (cancelButton) {

        cancelButton.style.display =
            "none";
    }
}


// =========================================================
// RESTORE SAVE BUTTON
// =========================================================

function restoreSaveButton() {

    if (!saveLocationButton) {
        return;
    }


    saveLocationButton.disabled =
        false;


    saveLocationButton.innerHTML =
        `<i class="fa-solid fa-floppy-disk me-2"></i>
         Save Location`;
}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHtml(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


// =========================================================
// FORM SUBMIT
// =========================================================

if (locationForm) {

    locationForm.addEventListener(
        "submit",
        saveLocation
    );
}


// =========================================================
// CANCEL BUTTON
// =========================================================

if (cancelButton) {

    cancelButton.addEventListener(
        "click",
        function () {

            resetLocationForm();

        }
    );
}


// =========================================================
// PAGE LOAD
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadLocations();

    }
);