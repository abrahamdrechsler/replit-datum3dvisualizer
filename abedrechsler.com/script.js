document.addEventListener("DOMContentLoaded", () => {
    const passwordPrompt = document.getElementById("passwordPrompt");
    const mainContent = document.getElementById("mainContent");
    const submitButton = document.getElementById("submitPassword");

    const validPassword = "abe"; // Replace with your desired password

    // Check session storage for authentication
    if (sessionStorage.getItem("authenticated") === "true") {
        passwordPrompt.style.display = "none";
        mainContent.style.display = "block";
    } else {
        passwordPrompt.style.display = "flex";
        mainContent.style.display = "none";
    }

    // Handle password submission
    submitButton.addEventListener("click", () => {
        const passwordInput = document.getElementById("passwordInput").value;
        if (passwordInput === validPassword) {
            sessionStorage.setItem("authenticated", "true");
            passwordPrompt.style.display = "none";
            mainContent.style.display = "block";
        } else {
            alert("Incorrect password. Please try again.");
        }
    });
});