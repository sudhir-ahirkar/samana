// =========================================================
// BACKEND URL CONFIGURATION
// =========================================================

const HOST_API_URL = getBackendUrl() + "/api";


// =========================================================
// CHECK CURRENT HOST STATUS
// =========================================================

async function checkHostStatus() {

    const token =
        localStorage.getItem("token");


    // -----------------------------------------------------
    // NOT LOGGED IN
    // -----------------------------------------------------

    if (!token) {

        return {
            loggedIn: false,
            isHost: false,
            hasProfile: false
        };
    }


    // -----------------------------------------------------
    // CHECK FRONTEND ROLE
    // -----------------------------------------------------

    const role =
        localStorage.getItem("userRole");


    // -----------------------------------------------------
    // NORMAL USER
    // -----------------------------------------------------

    if (
        !role ||
        role.toUpperCase() !== "HOST"
    ) {

        return {
            loggedIn: true,
            isHost: false,
            hasProfile: false
        };
    }


    // -----------------------------------------------------
    // USER IS HOST
    // CHECK HOST PROFILE
    // -----------------------------------------------------

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


        // -------------------------------------------------
        // HOST PROFILE EXISTS
        // -------------------------------------------------

        if (response.ok) {

            const profile =
                await response.json();


            return {

                loggedIn: true,

                isHost: true,

                hasProfile: true,

                profile: profile

            };
        }


        // -------------------------------------------------
        // HOST BUT PROFILE DOES NOT EXIST
        // -------------------------------------------------

        return {

            loggedIn: true,

            isHost: true,

            hasProfile: false

        };


    } catch (error) {

        console.error(
            "Host status check error:",
            error
        );


        return {

            loggedIn: true,

            isHost: true,

            hasProfile: false

        };
    }
}


// =========================================================
// UPDATE HOST PAGE BUTTONS
// =========================================================

async function updateHostButtons() {

    const becomeHostButton =
        document.getElementById(
            "becomeHostButton"
        );


    const becomeHostButtonBottom =
        document.getElementById(
            "becomeHostButtonBottom"
        );


    const createHostProfileButton =
        document.getElementById(
            "createHostProfileButton"
        );


    const createHostProfileButtonBottom =
        document.getElementById(
            "createHostProfileButtonBottom"
        );


    const viewHostProfileButton =
        document.getElementById(
            "viewHostProfileButton"
        );


    const viewHostProfileButtonBottom =
        document.getElementById(
            "viewHostProfileButtonBottom"
        );


    const createExperienceButton =
        document.getElementById(
            "createExperienceButton"
        );


    const createExperienceButtonBottom =
        document.getElementById(
            "createExperienceButtonBottom"
        );


    // =====================================================
    // HIDE ALL STATE BUTTONS FIRST
    // =====================================================

    if (becomeHostButton) {

        becomeHostButton.style.display =
            "none";
    }


    if (becomeHostButtonBottom) {

        becomeHostButtonBottom.style.display =
            "none";
    }


    if (createHostProfileButton) {

        createHostProfileButton.style.display =
            "none";
    }


    if (createHostProfileButtonBottom) {

        createHostProfileButtonBottom.style.display =
            "none";
    }


    if (viewHostProfileButton) {

        viewHostProfileButton.style.display =
            "none";
    }


    if (viewHostProfileButtonBottom) {

        viewHostProfileButtonBottom.style.display =
            "none";
    }


    if (createExperienceButton) {

        createExperienceButton.style.display =
            "none";
    }


    if (createExperienceButtonBottom) {

        createExperienceButtonBottom.style.display =
            "none";
    }


    // =====================================================
    // GET CURRENT STATUS
    // =====================================================

    const status =
        await checkHostStatus();


    // =====================================================
    // NOT LOGGED IN
    // =====================================================

    if (!status.loggedIn) {

        if (becomeHostButton) {

            becomeHostButton.style.display =
                "inline-block";
        }


        if (becomeHostButtonBottom) {

            becomeHostButtonBottom.style.display =
                "inline-block";
        }


        return;
    }


    // =====================================================
    // NORMAL USER
    // =====================================================

    if (!status.isHost) {

        if (becomeHostButton) {

            becomeHostButton.style.display =
                "inline-block";
        }


        if (becomeHostButtonBottom) {

            becomeHostButtonBottom.style.display =
                "inline-block";
        }


        return;
    }


    // =====================================================
    // HOST WITHOUT PROFILE
    // =====================================================

    if (
        status.isHost &&
        !status.hasProfile
    ) {

        if (createHostProfileButton) {

            createHostProfileButton.style.display =
                "inline-block";
        }


        if (createHostProfileButtonBottom) {

            createHostProfileButtonBottom.style.display =
                "inline-block";
        }


        return;
    }


    // =====================================================
    // HOST WITH PROFILE
    // =====================================================

    if (
        status.isHost &&
        status.hasProfile
    ) {

        if (viewHostProfileButton) {

            viewHostProfileButton.style.display =
                "inline-block";
        }


        if (viewHostProfileButtonBottom) {

            viewHostProfileButtonBottom.style.display =
                "inline-block";
        }


        if (createExperienceButton) {

            createExperienceButton.style.display =
                "inline-block";
        }


        if (createExperienceButtonBottom) {

            createExperienceButtonBottom.style.display =
                "inline-block";
        }


        return;
    }
}


// =========================================================
// BECOME A HOST
// =========================================================

async function becomeHost() {

    const token =
        localStorage.getItem("token");


    // -----------------------------------------------------
    // CHECK LOGIN
    // -----------------------------------------------------

    if (!token) {

        toast.error(
            "Please login before becoming a host."
        );

        window.location.href =
            "login.html";

        return;
    }


    const topButton =
        document.getElementById(
            "becomeHostButton"
        );


    const bottomButton =
        document.getElementById(
            "becomeHostButtonBottom"
        );


    // -----------------------------------------------------
    // DISABLE BUTTONS
    // -----------------------------------------------------

    if (topButton) {

        topButton.disabled = true;

        topButton.innerHTML =
            "Becoming a Host...";
    }


    if (bottomButton) {

        bottomButton.disabled = true;

        bottomButton.innerHTML =
            "Becoming a Host...";
    }


    try {

        const response =
            await fetch(
                `${HOST_API_URL}/hosts/become`,
                {
                    method: "POST",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }
                }
            );


        // -------------------------------------------------
        // CHECK RESPONSE
        // -------------------------------------------------

        if (!response.ok) {

            const errorText =
                await response.text();


            console.error(
                "Become Host Error:",
                errorText
            );


            throw new Error(
                "Unable to become a host."
            );
        }


        // =================================================
        // IMPORTANT
        // =================================================
        //
        // DO NOT LOGOUT
        //
        // The JWT contains the user's email.
        // Spring loads the current user from the database.
        //
        // After the database role changes from USER to HOST,
        // the same JWT can continue to authenticate the user
        // as ROLE_HOST.
        //
        // =================================================


        // -------------------------------------------------
        // UPDATE FRONTEND ROLE
        // -------------------------------------------------

        localStorage.setItem(
            "userRole",
            "HOST"
        );


        // -------------------------------------------------
        // GO DIRECTLY TO HOST PROFILE
        // -------------------------------------------------
        //
        // The user does NOT need to login again.
        //
        // The host profile page can now be completed.
        //
        // -------------------------------------------------

        window.location.href =
            "host-profile.html";


    } catch (error) {

        console.error(
            "Become Host Error:",
            error
        );


        toast.error(
            error.message ||
            "Something went wrong."
        );


        // -------------------------------------------------
        // ENABLE BUTTONS AGAIN
        // -------------------------------------------------

        if (topButton) {

            topButton.disabled = false;

            topButton.innerHTML =
                '<i class="fa-solid fa-plus me-2"></i> Become a Host';
        }


        if (bottomButton) {

            bottomButton.disabled = false;

            bottomButton.innerHTML =
                '<i class="fa-solid fa-user-plus me-2"></i> Become a Host';
        }
    }
}


// =========================================================
// CREATE HOST PROFILE
// =========================================================

function createHostProfile() {

    const token =
        localStorage.getItem("token");


    if (!token) {

        toast.error(
            "Please login before creating your host profile."
        );

        window.location.href =
            "login.html";

        return;
    }


    const role =
        localStorage.getItem("userRole");


    if (
        !role ||
        role.toUpperCase() !== "HOST"
    ) {

        toast.error(
            "Please become a host first."
        );

        return;
    }


    window.location.href =
        "host-profile.html";
}


// =========================================================
// VIEW MY HOST PROFILE
// =========================================================

function viewMyHostProfile() {

    const token =
        localStorage.getItem("token");


    if (!token) {

        toast.error(
            "Please login first."
        );

        window.location.href =
            "login.html";

        return;
    }


    window.location.href =
        "host-profile.html";
}


// =========================================================
// CREATE EXPERIENCE
// =========================================================

function createExperience() {

    const token =
        localStorage.getItem("token");


    if (!token) {

        toast.error(
            "Please login first."
        );

        window.location.href =
            "login.html";

        return;
    }


    const role =
        localStorage.getItem("userRole");


    if (
        !role ||
        role.toUpperCase() !== "HOST"
    ) {

        toast.error(
            "Only hosts can create experiences."
        );

        return;
    }


    window.location.href =
        "host-dashboard.html";
}


// =========================================================
// PAGE LOAD
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateHostButtons();

    }
);