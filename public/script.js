const responseBox =
    document.getElementById("responseBox");

const responseStatus =
    document.getElementById("responseStatus");


// =====================================
// Display API response
// =====================================

function displayResponse(data, status = "SUCCESS") {

    responseBox.textContent =
        JSON.stringify(data, null, 2);

    responseStatus.textContent = status;
}


// =====================================
// Check application health
// =====================================

async function checkHealth() {

    responseStatus.textContent = "LOADING";

    try {

        const response =
            await fetch("/api/health");

        const data =
            await response.json();

        if (response.ok) {

            document.getElementById("statusText")
                .textContent =
                "Application is ONLINE";

            document.getElementById("statusDot")
                .style.background =
                "#22c55e";

            document.getElementById("appStatus")
                .textContent =
                "ONLINE";

        }

        displayResponse(
            data,
            `${response.status} OK`
        );

    }

    catch (error) {

        document.getElementById("statusText")
            .textContent =
            "Application is OFFLINE";

        document.getElementById("statusDot")
            .style.background =
            "#ef4444";

        responseBox.textContent =
            `Error: ${error.message}`;

        responseStatus.textContent =
            "ERROR";
    }
}


// =====================================
// Get server information
// =====================================

async function getServerInfo() {

    responseStatus.textContent =
        "LOADING";

    try {

        const response =
            await fetch("/api/info");

        const data =
            await response.json();


        document.getElementById("nodeVersion")
            .textContent =
            data.nodeVersion;

        document.getElementById("environment")
            .textContent =
            data.environment;

        document.getElementById("hostname")
            .textContent =
            data.hostname;


        displayResponse(
            data,
            `${response.status} OK`
        );

    }

    catch (error) {

        responseBox.textContent =
            `Error: ${error.message}`;

        responseStatus.textContent =
            "ERROR";
    }
}


// =====================================
// Test API
// =====================================

async function testAPI() {

    responseStatus.textContent =
        "LOADING";

    try {

        const response =
            await fetch("/api/message");

        const data =
            await response.json();

        displayResponse(
            data,
            `${response.status} OK`
        );

    }

    catch (error) {

        responseBox.textContent =
            `Error: ${error.message}`;

        responseStatus.textContent =
            "ERROR";
    }
}


// =====================================
// Refresh dashboard
// =====================================

async function refreshDashboard() {

    responseStatus.textContent =
        "REFRESHING";

    await checkHealth();

    await getServerInfo();

}


// =====================================
// Initial dashboard load
// =====================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        checkHealth();

        getServerInfo();

    }
);
