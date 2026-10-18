// =====================================================
// HOST PROFILE JAVASCRIPT
// =====================================================

// =====================================================
// BACKEND URL CONFIGURATION
// =====================================================

const HOST_API_URL = getBackendUrl() + "/api";


// =====================================================
// TOKEN
// =====================================================

function getToken() {
    return localStorage.getItem("token");
}


// =====================================================
// IMAGE URL
// =====================================================

function getImageUrl(url) {

    if (!url) {
        return "https://via.placeholder.com/180?text=Host";
    }

    if (
        url.startsWith("http://") ||
        url.startsWith("https://")
    ) {
        return url;
    }

    return `https://samana-backend-82716904797.asia-south1.run.app${url}`;
}


// =====================================================
// SHOW / HIDE ELEMENT
// =====================================================

function showElement(id) {

    const element = document.getElementById(id);

    if (element) {
        element.classList.remove("hidden");
    }
}


function hideElement(id) {

    const element = document.getElementById(id);

    if (element) {
        element.classList.add("hidden");
    }
}


// =====================================================
// SAFE OPTIONAL URL
// =====================================================

function normalizeOptionalUrl(value) {

    const trimmed = String(value || "").trim();

    if (!trimmed) {
        return "";
    }

    if (
        trimmed.startsWith("http://") ||
        trimmed.startsWith("https://")
    ) {
        return trimmed;
    }

    return `https://${trimmed}`;
}


function getSafeSocialUrl(url) {

    const normalized = normalizeOptionalUrl(url);

    if (!normalized) {
        return null;
    }

    try {

        const parsed = new URL(normalized);

        if (
            parsed.protocol !== "http:" &&
            parsed.protocol !== "https:"
        ) {
            return null;
        }

        return parsed.href;

    } catch (error) {

        return null;
    }
}


// =====================================================
// LOAD HOST PROFILE
// =====================================================

async function loadHostProfile() {

    const token = getToken();

    if (!token) {

        toast.error("Please login first.");

        window.location.href = "login.html";

        return;
    }


    hideElement("loadingBox");


    try {

        const response = await fetch(
            `${HOST_API_URL}/hosts/me`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        // =============================================
        // SESSION EXPIRED
        // =============================================

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            toast.error(
                "Your session has expired. Please login again."
            );

            localStorage.removeItem("token");

            window.location.href = "login.html";

            return;
        }


        // =============================================
        // PROFILE DOES NOT EXIST
        // =============================================

        if (!response.ok) {

            console.log(
                "Host profile does not exist yet."
            );

            showCreateProfileMode();

            return;
        }


        // =============================================
        // PROFILE EXISTS
        // =============================================

        const profile = await response.json();

        displayHostProfile(profile);


    } catch (error) {

        console.error(
            "Load Host Profile Error:",
            error
        );

        showCreateProfileMode();
    }
}


// =====================================================
// CREATE PROFILE MODE
// =====================================================

function showCreateProfileMode() {

    hideElement("loadingBox");

    hideElement("profileSummarySection");
    hideElement("aboutSection");
    hideElement("personalInfoSection");
    hideElement("familySection");
    hideElement("previousExperienceSection");
    hideElement("socialSection");
    hideElement("mediaSection");
    hideElement("mediaUploadSection");
    hideElement("createExperienceSection");

    showElement("createProfileIntro");
    showElement("profileRequiredMessage");
    showElement("profileFormSection");


    const pageTitle =
        document.getElementById("pageTitle");

    const pageSubtitle =
        document.getElementById("pageSubtitle");

    const profileFormTitle =
        document.getElementById("profileFormTitle");

    const profileFormSubtitle =
        document.getElementById("profileFormSubtitle");


    if (pageTitle) {

        pageTitle.textContent =
            "Create Your Host Profile";
    }


    if (pageSubtitle) {

        pageSubtitle.textContent =
            "Complete your profile before creating your first experience.";
    }


    if (profileFormTitle) {

        profileFormTitle.textContent =
            "Create Your Host Profile";
    }


    if (profileFormSubtitle) {

        profileFormSubtitle.textContent =
            "Tell travelers a little about yourself.";
    }


    const form =
        document.getElementById("hostProfileForm");

    if (form) {

        form.reset();
    }


    const yearsInput =
        document.getElementById(
            "yearsOfHostingInput"
        );

    if (yearsInput) {

        yearsInput.value = 0;
    }


    const cancelButton =
        document.getElementById(
            "cancelEditButton"
        );

    if (cancelButton) {

        cancelButton.classList.add("hidden");
    }


    const saveButton =
        document.getElementById(
            "saveProfileButton"
        );

    if (saveButton) {

        saveButton.disabled = false;

        saveButton.innerHTML =
            '<i class="fa-solid fa-floppy-disk me-2"></i>' +
            'Save Host Profile';
    }
}


// =====================================================
// DISPLAY EXISTING HOST PROFILE
// =====================================================

function displayHostProfile(profile) {

    hideElement("loadingBox");

    hideElement("createProfileIntro");
    hideElement("profileRequiredMessage");
    hideElement("profileFormSection");

    showElement("profileSummarySection");
    showElement("aboutSection");
    showElement("personalInfoSection");
    showElement("familySection");
    showElement("previousExperienceSection");
    showElement("mediaSection");
    showElement("mediaUploadSection");
    showElement("createExperienceSection");


    // =============================================
    // PAGE TITLE
    // =============================================

    const pageTitle =
        document.getElementById("pageTitle");

    const pageSubtitle =
        document.getElementById("pageSubtitle");


    if (pageTitle) {

        pageTitle.textContent =
            "My Host Profile";
    }


    if (pageSubtitle) {

        pageSubtitle.textContent =
            "Manage your profile and information shown to travelers.";
    }


    // =============================================
    // HOST NAME
    // =============================================

    const hostName =
        document.getElementById("hostName");

    if (hostName) {

        hostName.textContent =
            profile.hostName || "Host";
    }


    // =============================================
    // EMAIL
    // =============================================

    const hostEmail =
        document.getElementById("hostEmail");

    if (hostEmail) {

        hostEmail.textContent =
            profile.email || "";
    }


    // =============================================
    // LOCATION
    // =============================================

    const hostLocation =
        document.getElementById("hostLocation");

    if (hostLocation) {

        hostLocation.textContent =
            profile.location ||
            "Location not added";
    }


    // =============================================
    // PROFILE PHOTO
    // =============================================

    const profilePhotoContainer =
        document.getElementById(
            "profilePhotoContainer"
        );


    if (profilePhotoContainer) {

        if (profile.profilePhotoUrl) {

            profilePhotoContainer.innerHTML = `

                <img
                    src="${getImageUrl(profile.profilePhotoUrl)}"
                    alt="Host Profile Photo"
                    class="profile-photo">

            `;

        } else {

            profilePhotoContainer.innerHTML = `

                <div class="placeholder-photo">

                    <i class="fa-solid fa-user"></i>

                </div>

            `;
        }
    }


    // =============================================
    // STATISTICS
    // =============================================

    const experiencesHosted =
        document.getElementById(
            "experiencesHosted"
        );

    const averageRating =
        document.getElementById(
            "averageRating"
        );

    const reviewCount =
        document.getElementById(
            "reviewCount"
        );


    if (experiencesHosted) {

        experiencesHosted.textContent =
            profile.experiencesHosted ?? 0;
    }


    if (averageRating) {

        averageRating.textContent =
            Number(
                profile.averageRating || 0
            ).toFixed(1);
    }


    if (reviewCount) {

        reviewCount.textContent =
            profile.reviewCount ?? 0;
    }


    // =============================================
    // ABOUT HOST
    // =============================================

    const aboutHost =
        document.getElementById(
            "aboutHost"
        );

    if (aboutHost) {

        aboutHost.textContent =
            profile.aboutHost ||
            "No information added yet.";
    }


    // =============================================
    // PERSONAL INFORMATION
    // =============================================

    const personalLocation =
        document.getElementById(
            "personalLocation"
        );

    const education =
        document.getElementById(
            "education"
        );

    const profession =
        document.getElementById(
            "profession"
        );

    const yearsOfHosting =
        document.getElementById(
            "yearsOfHosting"
        );


    if (personalLocation) {

        personalLocation.textContent =
            profile.location ||
            "Not added";
    }


    if (education) {

        education.textContent =
            profile.education ||
            "Not added";
    }


    if (profession) {

        profession.textContent =
            profile.profession ||
            "Not added";
    }


    if (yearsOfHosting) {

        yearsOfHosting.textContent =
            profile.yearsOfHosting ?? 0;
    }


    // =============================================
    // FAMILY
    // =============================================

    const familyDescription =
        document.getElementById(
            "familyDescription"
        );

    if (familyDescription) {

        familyDescription.textContent =
            profile.familyDescription ||
            "No family information added yet.";
    }


    // =============================================
    // PREVIOUS HOSTING EXPERIENCE
    // =============================================

    const previousHostingExperience =
        document.getElementById(
            "previousHostingExperience"
        );

    if (previousHostingExperience) {

        previousHostingExperience.textContent =
            profile.previousHostingExperience ||
            "No previous hosting experience added yet.";
    }


    // =============================================
    // DISPLAY SOCIAL LINKS
    // =============================================

    displaySocialLinks(profile);


    // =============================================
    // DISPLAY PHOTOS
    // =============================================

    displayHostPhotos(profile);


    // =============================================
    // FILL EDIT FORM
    // =============================================

    fillEditForm(profile);


    // =============================================
    // ADD / SHOW EDIT BUTTON
    // =============================================

    addEditButton();
}


// =====================================================
// DISPLAY SOCIAL LINKS
// =====================================================

function displaySocialLinks(profile) {

    const section =
        document.getElementById(
            "socialSection"
        );

    const container =
        document.getElementById(
            "socialLinksContainer"
        );


    if (!section || !container) {

        return;
    }


    container.innerHTML = "";


    const socialLinks = [

        {
            name: "Instagram",
            url: profile.instagramUrl,
            icon: "fa-brands fa-instagram",
            iconClass: "instagram"
        },

        {
            name: "Facebook",
            url: profile.facebookUrl,
            icon: "fa-brands fa-facebook",
            iconClass: "facebook"
        },

        {
            name: "LinkedIn",
            url: profile.linkedinUrl,
            icon: "fa-brands fa-linkedin",
            iconClass: "linkedin"
        },

        {
            name: "X / Twitter",
            url: profile.twitterUrl,
            icon: "fa-brands fa-x-twitter",
            iconClass: "twitter"
        },

        {
            name: "YouTube",
            url: profile.youtubeUrl,
            icon: "fa-brands fa-youtube",
            iconClass: "youtube"
        },

        {
            name: "Personal Website",
            url: profile.websiteUrl,
            icon: "fa-solid fa-globe",
            iconClass: "website"
        }

    ];


    let validLinks = 0;


    socialLinks.forEach(link => {

        const safeUrl =
            getSafeSocialUrl(link.url);


        if (!safeUrl) {

            return;
        }


        validLinks++;


        const card =
            document.createElement("a");


        card.href = safeUrl;

        card.target = "_blank";

        card.rel =
            "noopener noreferrer";

        card.className =
            "social-link-card";


        const icon =
            document.createElement("div");

        icon.className =
            `social-icon ${link.iconClass}`;


        const iconElement =
            document.createElement("i");

        iconElement.className =
            link.icon;


        icon.appendChild(
            iconElement
        );


        const content =
            document.createElement("div");


        const title =
            document.createElement("div");

        title.className =
            "social-link-title";

        title.textContent =
            link.name;


        const urlText =
            document.createElement("div");

        urlText.className =
            "social-link-url";

        urlText.textContent =
            safeUrl;


        content.appendChild(title);

        content.appendChild(urlText);


        card.appendChild(icon);

        card.appendChild(content);


        container.appendChild(card);

    });


    // =============================================
    // HIDE SECTION IF NO SOCIAL LINKS
    // =============================================

    if (validLinks === 0) {

        hideElement("socialSection");

    } else {

        showElement("socialSection");
    }
}


// =====================================================
// DISPLAY HOST PHOTOS
// =====================================================

function displayHostPhotos(profile) {


    const profilePhotoDisplay =
        document.getElementById(
            "profilePhotoDisplay"
        );

    const familyPhotoDisplay =
        document.getElementById(
            "familyPhotoDisplay"
        );

    const housePhotoDisplay =
        document.getElementById(
            "housePhotoDisplay"
        );


    // =============================================
    // PROFILE PHOTO
    // =============================================

    if (profilePhotoDisplay) {

        if (profile.profilePhotoUrl) {

            profilePhotoDisplay.innerHTML = `

                <img
                    src="${getImageUrl(profile.profilePhotoUrl)}"
                    alt="Profile Photo"
                    class="host-photo">

            `;

        } else {

            profilePhotoDisplay.innerHTML = `

                <div class="alert alert-secondary">
                    No profile photo uploaded.
                </div>

            `;
        }
    }


    // =============================================
    // FAMILY PHOTO
    // =============================================

    if (familyPhotoDisplay) {

        if (profile.familyPhotoUrl) {

            familyPhotoDisplay.innerHTML = `

                <img
                    src="${getImageUrl(profile.familyPhotoUrl)}"
                    alt="Family Photo"
                    class="host-photo">

            `;

        } else {

            familyPhotoDisplay.innerHTML = `

                <div class="alert alert-secondary">
                    No family photo uploaded.
                </div>

            `;
        }
    }


    // =============================================
    // HOUSE PHOTO
    // =============================================

    if (housePhotoDisplay) {

        if (profile.housePhotoUrl) {

            housePhotoDisplay.innerHTML = `

                <img
                    src="${getImageUrl(profile.housePhotoUrl)}"
                    alt="House Photo"
                    class="host-photo">

            `;

        } else {

            housePhotoDisplay.innerHTML = `

                <div class="alert alert-secondary">
                    No house photo uploaded.
                </div>

            `;
        }
    }
}


// =====================================================
// FILL EDIT FORM
// =====================================================

function fillEditForm(profile) {


    const locationInput =
        document.getElementById(
            "locationInput"
        );

    const educationInput =
        document.getElementById(
            "educationInput"
        );

    const professionInput =
        document.getElementById(
            "professionInput"
        );

    const yearsOfHostingInput =
        document.getElementById(
            "yearsOfHostingInput"
        );

    const aboutHostInput =
        document.getElementById(
            "aboutHostInput"
        );

    const familyDescriptionInput =
        document.getElementById(
            "familyDescriptionInput"
        );

    const previousHostingExperienceInput =
        document.getElementById(
            "previousHostingExperienceInput"
        );


    // =============================================
    // SOCIAL INPUTS
    // =============================================

    const instagramUrlInput =
        document.getElementById(
            "instagramUrlInput"
        );

    const facebookUrlInput =
        document.getElementById(
            "facebookUrlInput"
        );

    const linkedinUrlInput =
        document.getElementById(
            "linkedinUrlInput"
        );

    const twitterUrlInput =
        document.getElementById(
            "twitterUrlInput"
        );

    const youtubeUrlInput =
        document.getElementById(
            "youtubeUrlInput"
        );

    const websiteUrlInput =
        document.getElementById(
            "websiteUrlInput"
        );


    // =============================================
    // BASIC FIELDS
    // =============================================

    if (locationInput) {

        locationInput.value =
            profile.location || "";
    }


    if (educationInput) {

        educationInput.value =
            profile.education || "";
    }


    if (professionInput) {

        professionInput.value =
            profile.profession || "";
    }


    if (yearsOfHostingInput) {

        yearsOfHostingInput.value =
            profile.yearsOfHosting ?? 0;
    }


    if (aboutHostInput) {

        aboutHostInput.value =
            profile.aboutHost || "";
    }


    if (familyDescriptionInput) {

        familyDescriptionInput.value =
            profile.familyDescription || "";
    }


    if (previousHostingExperienceInput) {

        previousHostingExperienceInput.value =
            profile.previousHostingExperience || "";
    }


    // =============================================
    // SOCIAL FIELDS
    // =============================================

    if (instagramUrlInput) {

        instagramUrlInput.value =
            profile.instagramUrl || "";
    }


    if (facebookUrlInput) {

        facebookUrlInput.value =
            profile.facebookUrl || "";
    }


    if (linkedinUrlInput) {

        linkedinUrlInput.value =
            profile.linkedinUrl || "";
    }


    if (twitterUrlInput) {

        twitterUrlInput.value =
            profile.twitterUrl || "";
    }


    if (youtubeUrlInput) {

        youtubeUrlInput.value =
            profile.youtubeUrl || "";
    }


    if (websiteUrlInput) {

        websiteUrlInput.value =
            profile.websiteUrl || "";
    }
}


// =====================================================
// ADD EDIT BUTTON
// =====================================================

function addEditButton() {

    const summarySection =
        document.getElementById(
            "profileSummarySection"
        );


    if (!summarySection) {

        return;
    }


    // Don't add duplicate button

    const existingButton =
        document.getElementById(
            "editProfileButton"
        );


    if (existingButton) {

        return;
    }


    const buttonContainer =
        document.createElement("div");


    buttonContainer.className =
        "text-center mt-3";


    const button =
        document.createElement("button");


    button.type = "button";

    button.id =
        "editProfileButton";

    button.className =
        "btn btn-outline-success";


    button.innerHTML =
        '<i class="fa-solid fa-pen me-2"></i>' +
        'Edit Profile';


    button.addEventListener(
        "click",
        openEditProfile
    );


    buttonContainer.appendChild(
        button
    );


    const cardBody =
        summarySection.querySelector(
            ".card-body"
        );


    if (cardBody) {

        cardBody.appendChild(
            buttonContainer
        );
    }
}


// =====================================================
// OPEN EDIT PROFILE
// =====================================================

function openEditProfile() {

    showElement(
        "profileFormSection"
    );


    const profileFormTitle =
        document.getElementById(
            "profileFormTitle"
        );

    const profileFormSubtitle =
        document.getElementById(
            "profileFormSubtitle"
        );


    if (profileFormTitle) {

        profileFormTitle.textContent =
            "Edit Host Profile";
    }


    if (profileFormSubtitle) {

        profileFormSubtitle.textContent =
            "Update the information travelers see on your profile.";
    }


    const cancelButton =
        document.getElementById(
            "cancelEditButton"
        );


    if (cancelButton) {

        cancelButton.classList.remove(
            "hidden"
        );
    }


    const formSection =
        document.getElementById(
            "profileFormSection"
        );


    if (formSection) {

        formSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


// =====================================================
// CLOSE EDIT PROFILE
// =====================================================

function closeEditProfile() {

    hideElement(
        "profileFormSection"
    );


    const cancelButton =
        document.getElementById(
            "cancelEditButton"
        );


    if (cancelButton) {

        cancelButton.classList.add(
            "hidden"
        );
    }
}


// =====================================================
// VALIDATE PROFILE FORM
// =====================================================

function validateHostProfileForm() {

    const location =
        document.getElementById(
            "locationInput"
        )?.value.trim();


    const education =
        document.getElementById(
            "educationInput"
        )?.value.trim();


    const profession =
        document.getElementById(
            "professionInput"
        )?.value.trim();


    const aboutHost =
        document.getElementById(
            "aboutHostInput"
        )?.value.trim();


    const familyDescription =
        document.getElementById(
            "familyDescriptionInput"
        )?.value.trim();


    const yearsOfHosting =
        Number(
            document.getElementById(
                "yearsOfHostingInput"
            )?.value || 0
        );


    if (!location) {

        toast.error(
            "Please enter your location."
        );

        return false;
    }


    if (!education) {

        toast.error(
            "Please enter your education."
        );

        return false;
    }


    if (!profession) {

        toast.error(
            "Please enter your profession."
        );

        return false;
    }


    if (!aboutHost) {

        toast.error(
            "Please tell travelers about yourself."
        );

        return false;
    }


    if (!familyDescription) {

        toast.error(
            "Please add your family description."
        );

        return false;
    }


    if (yearsOfHosting < 0) {

        toast.error(
            "Years of hosting cannot be negative."
        );

        return false;
    }


    return true;
}


// =====================================================
// SAVE HOST PROFILE
// =====================================================

async function saveHostProfile(event) {

    event.preventDefault();


    const token = getToken();


    if (!token) {

        toast.error(
            "Please login first."
        );

        window.location.href =
            "login.html";

        return;
    }


    // =============================================
    // VALIDATE
    // =============================================

    if (!validateHostProfileForm()) {

        return;
    }


    // =============================================
    // OPTIONAL SOCIAL URLs
    // =============================================

    const instagramUrl =
        normalizeOptionalUrl(
            document.getElementById(
                "instagramUrlInput"
            )?.value
        );


    const facebookUrl =
        normalizeOptionalUrl(
            document.getElementById(
                "facebookUrlInput"
            )?.value
        );


    const linkedinUrl =
        normalizeOptionalUrl(
            document.getElementById(
                "linkedinUrlInput"
            )?.value
        );


    const twitterUrl =
        normalizeOptionalUrl(
            document.getElementById(
                "twitterUrlInput"
            )?.value
        );


    const youtubeUrl =
        normalizeOptionalUrl(
            document.getElementById(
                "youtubeUrlInput"
            )?.value
        );


    const websiteUrl =
        normalizeOptionalUrl(
            document.getElementById(
                "websiteUrlInput"
            )?.value
        );


    // =============================================
    // REQUEST DATA
    // =============================================

    const data = {

        location:
            document.getElementById(
                "locationInput"
            )?.value.trim() || "",


        education:
            document.getElementById(
                "educationInput"
            )?.value.trim() || "",


        profession:
            document.getElementById(
                "professionInput"
            )?.value.trim() || "",


        aboutHost:
            document.getElementById(
                "aboutHostInput"
            )?.value.trim() || "",


        familyDescription:
            document.getElementById(
                "familyDescriptionInput"
            )?.value.trim() || "",


        previousHostingExperience:
            document.getElementById(
                "previousHostingExperienceInput"
            )?.value.trim() || "",


        yearsOfHosting:
            Number(
                document.getElementById(
                    "yearsOfHostingInput"
                )?.value || 0
            ),


        // =========================================
        // SOCIAL MEDIA
        // =========================================

        instagramUrl:
            instagramUrl,


        facebookUrl:
            facebookUrl,


        linkedinUrl:
            linkedinUrl,


        twitterUrl:
            twitterUrl,


        youtubeUrl:
            youtubeUrl,


        websiteUrl:
            websiteUrl
    };


    // =============================================
    // BUTTON
    // =============================================

    const button =
        document.getElementById(
            "saveProfileButton"
        );


    if (button) {

        button.disabled = true;

        button.innerHTML =
            '<span class="spinner-border spinner-border-sm me-2"></span>' +
            'Saving...';
    }


    try {

        const response = await fetch(
            `${HOST_API_URL}/hosts/profile`,
            {
                method: "POST",

                headers: {

                    "Authorization":
                        `Bearer ${token}`,

                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(data)
            }
        );


        const resultText =
            await response.text();


        // =========================================
        // ERROR
        // =========================================

        if (!response.ok) {

            console.error(
                "Save Host Profile Error:",
                resultText
            );


            throw new Error(
                resultText ||
                "Unable to save host profile."
            );
        }


        // =========================================
        // SUCCESS
        // =========================================

        toast.error(
            "Host profile saved successfully!"
        );


        // Reload profile so social links,
        // photos and all updated information
        // appear immediately.

        await loadHostProfile();


        // Scroll to experience section

        const experienceSection =
            document.getElementById(
                "createExperienceSection"
            );


        if (experienceSection) {

            experienceSection.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }


    } catch (error) {

        console.error(
            "Save Host Profile Error:",
            error
        );


        toast.error(
            error.message ||
            "Unable to save host profile."
        );


    } finally {

        if (button) {

            button.disabled = false;

            button.innerHTML =
                '<i class="fa-solid fa-floppy-disk me-2"></i>' +
                'Save Host Profile';
        }
    }
}


// =====================================================
// IMAGE PREVIEW
// =====================================================

function setupImagePreview(
    inputId,
    previewId
) {

    const input =
        document.getElementById(
            inputId
        );

    const preview =
        document.getElementById(
            previewId
        );


    if (!input || !preview) {

        return;
    }


    input.addEventListener(
        "change",
        function () {

            const file =
                input.files?.[0];


            if (!file) {

                preview.src = "";

                preview.classList.add(
                    "hidden"
                );

                return;
            }


            if (!file.type.startsWith("image/")) {

                toast.error(
                    "Please select an image file."
                );

                input.value = "";

                preview.src = "";

                preview.classList.add(
                    "hidden"
                );

                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    preview.src =
                        event.target.result;

                    preview.classList.remove(
                        "hidden"
                    );
                };


            reader.readAsDataURL(file);
        }
    );
}


// =====================================================
// UPLOAD HOST MEDIA
// =====================================================

async function uploadHostMedia(event) {

    event.preventDefault();


    const token = getToken();


    if (!token) {

        toast.error(
            "Please login first."
        );

        window.location.href =
            "login.html";

        return;
    }


    const form =
        document.getElementById(
            "hostMediaForm"
        );


    if (!form) {

        return;
    }


    // =============================================
    // CHECK IF AT LEAST ONE FILE IS SELECTED
    // =============================================

    const profilePhoto =
        document.getElementById(
            "profilePhoto"
        )?.files?.length || 0;


    const familyPhoto =
        document.getElementById(
            "familyPhoto"
        )?.files?.length || 0;


    const housePhoto =
        document.getElementById(
            "housePhoto"
        )?.files?.length || 0;


    if (
        !profilePhoto &&
        !familyPhoto &&
        !housePhoto
    ) {

        toast.error(
            "Please select at least one photo to upload."
        );

        return;
    }


    // =============================================
    // FORM DATA
    // =============================================

    const formData =
        new FormData(form);


    const button =
        document.getElementById(
            "uploadMediaButton"
        );


    if (button) {

        button.disabled = true;

        button.innerHTML =
            '<span class="spinner-border spinner-border-sm me-2"></span>' +
            'Uploading...';
    }


    try {

        const response = await fetch(
            `${HOST_API_URL}/hosts/profile/media`,
            {
                method: "POST",

                headers: {

                    "Authorization":
                        `Bearer ${token}`
                },

                body:
                    formData
            }
        );


        const resultText =
            await response.text();


        if (!response.ok) {

            console.error(
                "Upload Host Media Error:",
                resultText
            );


            throw new Error(
                resultText ||
                "Unable to upload photos."
            );
        }


        toast.error(
            "Host photos uploaded successfully!"
        );


        // Clear file inputs

        form.reset();


        // Clear previews

        [
            "profilePhotoPreview",
            "familyPhotoPreview",
            "housePhotoPreview"
        ].forEach(id => {

            const preview =
                document.getElementById(id);

            if (preview) {

                preview.src = "";

                preview.classList.add(
                    "hidden"
                );
            }
        });


        // Reload profile

        await loadHostProfile();


    } catch (error) {

        console.error(
            "Upload Host Media Error:",
            error
        );


        toast.error(
            error.message ||
            "Unable to upload photos."
        );


    } finally {

        if (button) {

            button.disabled = false;

            button.innerHTML =
                '<i class="fa-solid fa-upload me-2"></i>' +
                'Upload Photos';
        }
    }
}


// =====================================================
// CREATE EXPERIENCE
// =====================================================

async function createExperience() {

    const token = getToken();


    if (!token) {

        toast.error(
            "Please login first."
        );

        window.location.href =
            "login.html";

        return;
    }


    // =============================================
    // CHECK ROLE
    // =============================================

    const role =
        localStorage.getItem(
            "userRole"
        );


    if (
        !role ||
        role.toUpperCase() !== "HOST"
    ) {

        toast.error(
            "You need to become a host first."
        );

        window.location.href =
            "host.html";

        return;
    }


    // =============================================
    // VERIFY HOST PROFILE
    // =============================================

    try {

        const response =
            await fetch(
                `${HOST_API_URL}/hosts/me`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        // =========================================
        // SESSION EXPIRED
        // =========================================

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            toast.error(
                "Your session has expired. Please login again."
            );

            localStorage.removeItem(
                "token"
            );

            window.location.href =
                "login.html";

            return;
        }


        // =========================================
        // PROFILE NOT FOUND
        // =========================================

        if (!response.ok) {

            toast.error(
                "Please complete your host profile before creating an experience."
            );

            return;
        }


        const profile =
            await response.json();


        if (
            !profile ||
            !profile.id
        ) {

            toast.error(
                "Please complete your host profile before creating an experience."
            );

            return;
        }


        // =========================================
        // PROFILE EXISTS
        // =========================================

        window.location.href =
            "host-dashboard.html";


    } catch (error) {

        console.error(
            "Host profile verification failed:",
            error
        );


        toast.error(
            "Please complete your host profile before creating an experience."
        );
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


// =====================================================
// DOM CONTENT LOADED
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // =============================================
        // LOAD PROFILE
        // =============================================

        loadHostProfile();


        // =============================================
        // PROFILE FORM
        // =============================================

        const profileForm =
            document.getElementById(
                "hostProfileForm"
            );


        if (profileForm) {

            profileForm.addEventListener(
                "submit",
                saveHostProfile
            );
        }


        // =============================================
        // MEDIA FORM
        // =============================================

        const mediaForm =
            document.getElementById(
                "hostMediaForm"
            );


        if (mediaForm) {

            mediaForm.addEventListener(
                "submit",
                uploadHostMedia
            );
        }


        // =============================================
        // LOGOUT BUTTON
        // =============================================

        const logoutButton =
            document.getElementById(
                "logoutBtn"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                logout
            );
        }


        // =============================================
        // CANCEL EDIT
        // =============================================

        const cancelButton =
            document.getElementById(
                "cancelEditButton"
            );


        if (cancelButton) {

            cancelButton.addEventListener(
                "click",
                closeEditProfile
            );
        }


        // =============================================
        // CREATE EXPERIENCE
        // =============================================

        const createExperienceButton =
            document.getElementById(
                "createExperienceButton"
            );


        if (createExperienceButton) {

            createExperienceButton.addEventListener(
                "click",
                createExperience
            );
        }


        // =============================================
        // IMAGE PREVIEWS
        // =============================================

        setupImagePreview(
            "profilePhoto",
            "profilePhotoPreview"
        );


        setupImagePreview(
            "familyPhoto",
            "familyPhotoPreview"
        );


        setupImagePreview(
            "housePhoto",
            "housePhotoPreview"
        );

    }
);