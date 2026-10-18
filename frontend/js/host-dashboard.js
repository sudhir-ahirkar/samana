const API_BASE_URL = getBackendUrl() + "/api";


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");

    // User must be logged in
    if (!token) {

        window.location.href = "login.html";

        return;
    }


    // =================================================
    // CHECK HOST PROFILE BEFORE OPENING DASHBOARD
    // =================================================

    const profileExists =
        await checkHostProfile(token);


    // If host profile does not exist,
    // checkHostProfile() will redirect the user.
    if (!profileExists) {

        return;
    }


    // =================================================
    // LOAD CATEGORIES
    // =================================================

    loadCategories();


    // =================================================
    // EXPERIENCE FORM
    // =================================================

    const form =
        document.getElementById("experienceForm");

    if (form) {

        form.addEventListener(
            "submit",
            createExperience
        );

    }


    // =================================================
    // LOGOUT
    // =================================================

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            logout
        );

    }


    // =================================================
    // CLEAR FORM
    // =================================================

    const clearButton =
        document.getElementById("clearButton");

    if (clearButton) {

        clearButton.addEventListener(
            "click",
            clearPreviews
        );

    }

});



// =====================================================
// CHECK HOST PROFILE
// =====================================================

async function checkHostProfile(token) {

    try {

        console.log(
            "Checking host profile..."
        );


        const response =
            await fetch(
                `${API_BASE_URL}/hosts/me`,
                {
                    method: "GET",
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        console.log(
            "Host profile status:",
            response.status
        );


        // =================================================
        // USER NOT AUTHENTICATED
        // =================================================

        if (
            response.status === 401
        ) {

            console.log(
                "Token expired or invalid."
            );


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


            return false;
        }



        // =================================================
        // FORBIDDEN
        // =================================================

        if (
            response.status === 403
        ) {

            console.log(
                "User does not have HOST permission."
            );


            alert(
                "You need to become a host before accessing the Host Dashboard."
            );


            window.location.href =
                "host.html";


            return false;
        }



        // =================================================
        // HOST PROFILE DOES NOT EXIST
        // =================================================

        if (
            !response.ok
        ) {

            console.log(
                "Host profile not found or incomplete."
            );


            alert(
                "Please complete your host profile before creating an experience."
            );


            window.location.href =
                "host-profile.html";


            return false;
        }



        // =================================================
        // HOST PROFILE EXISTS
        // =================================================

        const profile =
            await response.json();


        console.log(
            "Host profile verified:",
            profile
        );


        return true;


    } catch (error) {

        console.error(
            "Host profile check failed:",
            error
        );


        alert(
            "Please complete your host profile before accessing the Host Dashboard."
        );


        window.location.href =
            "host-profile.html";


        return false;
    }

}



// =====================================================
// LOAD CATEGORIES
// =====================================================

async function loadCategories() {

    const categorySelect =
        document.getElementById("categoryId");


    if (!categorySelect) {

        console.error(
            "Category dropdown not found."
        );

        return;
    }


    try {

        categorySelect.innerHTML =
            '<option value="">Loading categories...</option>';


        const response =
            await fetch(
                `${API_BASE_URL}/categories`
            );


        console.log(
            "Category API status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                `Could not load categories. Status: ${response.status}`
            );

        }


        const categories =
            await response.json();


        console.log(
            "Categories received:",
            categories
        );


        categorySelect.innerHTML =
            '<option value="">Select a category</option>';


        if (
            !Array.isArray(categories) ||
            categories.length === 0
        ) {

            categorySelect.innerHTML =
                '<option value="">No categories available</option>';

            return;
        }


        categories.forEach(category => {

            const option =
                document.createElement("option");


            option.value =
                category.id;


            option.textContent =
                category.name;


            categorySelect.appendChild(
                option
            );

        });


    } catch (error) {

        console.error(
            "Category loading error:",
            error
        );


        categorySelect.innerHTML =
            '<option value="">Unable to load categories</option>';

    }

}



// =====================================================
// CREATE EXPERIENCE
// =====================================================

async function createExperience(event) {

    event.preventDefault();


    const token =
        localStorage.getItem("token");


    if (!token) {

        window.location.href =
            "login.html";

        return;
    }


    // =================================================
    // FORM ELEMENTS
    // =================================================

    const form =
        document.getElementById(
            "experienceForm"
        );


    const submitButton =
        document.getElementById(
            "createExperienceBtn"
        );


    if (!form) {

        console.error(
            "Experience form not found."
        );

        return;
    }


    // =================================================
    // HIDE OLD MESSAGE
    // =================================================

    hideMessage();



    // =================================================
    // BASIC DETAILS
    // =================================================

    const title =
        document
            .getElementById("title")
            .value
            .trim();


    const description =
        document
            .getElementById("description")
            .value
            .trim();


    const price =
        document
            .getElementById("price")
            .value;


    const duration =
        document
            .getElementById("duration")
            .value;


    const categoryId =
        document
            .getElementById("categoryId")
            .value;



    // =================================================
    // LOCATION & CAPACITY
    // =================================================

    const location =
        document
            .getElementById("location")
            .value
            .trim();


    const maxGuests =
        document
            .getElementById("maxGuests")
            .value;


    const meetingPoint =
        document
            .getElementById("meetingPoint")
            .value
            .trim();



    // =================================================
    // EXPERIENCE DETAILS
    // =================================================

    const whatYouWillDo =
        document
            .getElementById("whatYouWillDo")
            .value
            .trim();


    const included =
        document
            .getElementById("included")
            .value
            .trim();


    const notIncluded =
        document
            .getElementById("notIncluded")
            .value
            .trim();


    const cancellationPolicy =
        document
            .getElementById("cancellationPolicy")
            .value
            .trim();



    // =================================================
    // MEDIA FILES
    // =================================================

    const coverImageInput =
        document.getElementById(
            "coverImage"
        );


    const imagesInput =
        document.getElementById(
            "images"
        );


    const videoInput =
        document.getElementById(
            "video"
        );



    // =================================================
    // REQUIRED FIELD VALIDATION
    // =================================================

    if (
        !title ||
        !description ||
        !price ||
        !duration ||
        !categoryId ||
        !location ||
        !maxGuests
    ) {

        showMessage(
            "Please fill in all required fields.",
            "error"
        );

        return;
    }



    // =================================================
    // COVER IMAGE VALIDATION
    // =================================================

    if (
        !coverImageInput ||
        coverImageInput.files.length === 0
    ) {

        showMessage(
            "Please select a cover image.",
            "error"
        );

        return;
    }


    const coverImage =
        coverImageInput.files[0];


    if (
        !coverImage.type.startsWith(
            "image/"
        )
    ) {

        showMessage(
            "Cover image must be an image file.",
            "error"
        );

        return;
    }



    // =================================================
    // ADDITIONAL IMAGE VALIDATION
    // =================================================

    if (
        imagesInput &&
        imagesInput.files.length > 0
    ) {

        for (
            let i = 0;
            i < imagesInput.files.length;
            i++
        ) {

            const image =
                imagesInput.files[i];


            if (
                !image.type.startsWith(
                    "image/"
                )
            ) {

                showMessage(
                    "All additional files must be images.",
                    "error"
                );

                return;
            }

        }

    }



    // =================================================
    // VIDEO VALIDATION
    // =================================================

    if (
        videoInput &&
        videoInput.files.length > 0
    ) {

        const video =
            videoInput.files[0];


        if (
            !video.type.startsWith(
                "video/"
            )
        ) {

            showMessage(
                "The selected video file is not a valid video.",
                "error"
            );

            return;
        }

    }



    // =================================================
    // DISABLE SUBMIT BUTTON
    // =================================================

    if (submitButton) {

        submitButton.disabled =
            true;


        submitButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin me-2"></i> Creating...';

    }



    try {


        // =================================================
        // CREATE FORMDATA
        // =================================================

        const formData =
            new FormData();



        // =================================================
        // BASIC DETAILS
        // =================================================

        formData.append(
            "title",
            title
        );


        formData.append(
            "description",
            description
        );


        formData.append(
            "price",
            price
        );


        formData.append(
            "duration",
            duration
        );


        formData.append(
            "categoryId",
            categoryId
        );



        // =================================================
        // LOCATION & CAPACITY
        // =================================================

        formData.append(
            "location",
            location
        );


        formData.append(
            "maxGuests",
            maxGuests
        );


        if (meetingPoint) {

            formData.append(
                "meetingPoint",
                meetingPoint
            );

        }



        // =================================================
        // EXPERIENCE DETAILS
        // =================================================

        if (whatYouWillDo) {

            formData.append(
                "whatYouWillDo",
                whatYouWillDo
            );

        }


        if (included) {

            formData.append(
                "included",
                included
            );

        }


        if (notIncluded) {

            formData.append(
                "notIncluded",
                notIncluded
            );

        }


        if (cancellationPolicy) {

            formData.append(
                "cancellationPolicy",
                cancellationPolicy
            );

        }



        // =================================================
        // COVER IMAGE
        // =================================================

        formData.append(
            "coverImage",
            coverImage
        );



        // =================================================
        // ADDITIONAL IMAGES
        // =================================================

        if (
            imagesInput &&
            imagesInput.files.length > 0
        ) {

            for (
                let i = 0;
                i < imagesInput.files.length;
                i++
            ) {

                formData.append(
                    "images",
                    imagesInput.files[i]
                );

            }

        }



        // =================================================
        // VIDEO
        // =================================================

        if (
            videoInput &&
            videoInput.files.length > 0
        ) {

            formData.append(
                "video",
                videoInput.files[0]
            );

        }



        // =================================================
        // DEBUG
        // =================================================

        console.log(
            "================================="
        );

        console.log(
            "Creating experience..."
        );

        console.log(
            "Title:",
            title
        );

        console.log(
            "Category:",
            categoryId
        );

        console.log(
            "Location:",
            location
        );

        console.log(
            "Cover image:",
            coverImage
        );

        console.log(
            "Additional images:",
            imagesInput
                ? imagesInput.files
                : []
        );

        console.log(
            "Video:",
            videoInput &&
            videoInput.files.length > 0
                ? videoInput.files[0]
                : null
        );

        console.log(
            "================================="
        );



        // =================================================
        // SEND MULTIPART REQUEST
        // =================================================

        const response =
            await fetch(
                `${API_BASE_URL}/experiences`,
                {

                    method: "POST",

                    headers: {

                        /*
                         * IMPORTANT:
                         *
                         * DO NOT add:
                         *
                         * Content-Type:
                         * multipart/form-data
                         *
                         * The browser automatically
                         * creates the correct boundary.
                         */

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body: formData

                }
            );



        // =================================================
        // RESPONSE STATUS
        // =================================================

        console.log(
            "Create experience status:",
            response.status
        );



        // =================================================
        // UNAUTHORIZED
        // =================================================

        if (
            response.status === 401
        ) {

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


            return;
        }



        // =================================================
        // FORBIDDEN
        // =================================================

        if (
            response.status === 403
        ) {

            throw new Error(
                "You do not have HOST permission. Please login again with a HOST account."
            );

        }



        // =================================================
        // OTHER BACKEND ERRORS
        // =================================================

        if (!response.ok) {

            const errorText =
                await response.text();


            console.error(
                "Backend error:",
                errorText
            );


            throw new Error(
                errorText ||
                "Failed to create experience."
            );

        }



        // =================================================
        // SUCCESS RESPONSE
        // =================================================

        const result =
            await response.json();


        console.log(
            "Experience created successfully:",
            result
        );



        // =================================================
        // SUCCESS MESSAGE
        // =================================================

        showMessage(
            "Experience created successfully!",
            "success"
        );



        // =================================================
        // RESET FORM
        // =================================================

        form.reset();


        clearPreviews();



        // =================================================
        // RELOAD CATEGORIES
        // =================================================

        loadCategories();



    } catch (error) {

        console.error(
            "Create experience error:",
            error
        );


        showMessage(
            error.message ||
            "Something went wrong while creating the experience.",
            "error"
        );



    } finally {


        // =================================================
        // ENABLE BUTTON
        // =================================================

        if (submitButton) {

            submitButton.disabled =
                false;


            submitButton.innerHTML =
                '<i class="fa-solid fa-plus me-2"></i> Create Experience';

        }

    }

}



// =====================================================
// SHOW MESSAGE
// =====================================================

function showMessage(
    message,
    type
) {

    const formMessage =
        document.getElementById(
            "formMessage"
        );


    if (!formMessage) {

        return;
    }


    formMessage.textContent =
        message;


    formMessage.className =
        "alert";


    if (type === "success") {

        formMessage.classList.add(
            "alert-success"
        );

    } else {

        formMessage.classList.add(
            "alert-danger"
        );

    }


    formMessage.style.display =
        "block";

}



// =====================================================
// HIDE MESSAGE
// =====================================================

function hideMessage() {

    const formMessage =
        document.getElementById(
            "formMessage"
        );


    if (!formMessage) {

        return;
    }


    formMessage.style.display =
        "none";


    formMessage.textContent =
        "";

}



// =====================================================
// CLEAR MEDIA PREVIEWS
// =====================================================

function clearPreviews() {

    const coverPreview =
        document.getElementById(
            "coverPreview"
        );


    const imagesPreview =
        document.getElementById(
            "imagesPreview"
        );


    const videoPreview =
        document.getElementById(
            "videoPreview"
        );


    if (coverPreview) {

        coverPreview.innerHTML =
            "";

    }


    if (imagesPreview) {

        imagesPreview.innerHTML =
            "";

    }


    if (videoPreview) {

        videoPreview.innerHTML =
            "";

    }

}



// =====================================================
// LOGOUT
// =====================================================

function logout() {

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