document.addEventListener('DOMContentLoaded', async () => {

    const publicKey = await fetch("http://localhost:8080/api/customer/stripe/get-public-key")
    .then(res => res.text());
    if (!publicKey) {
        console.error("Invalid or missing public key");
        return;
    }
    const stripe = Stripe(publicKey);
    console.log(publicKey);

    const subscribeDiv = document.getElementById("subscribeDiv");
    const createAccountLink = document.getElementById("createAccountLink");
    const loginLink = document.getElementById("loginLink");

    subscribeDiv.addEventListener("mouseenter", () => {
        createAccountLink.style.textDecoration = "underline";
        loginLink.style.textDecoration = "underline";
    })

    subscribeDiv.addEventListener("mouseleave", () => {
        createAccountLink.style.textDecoration = "";
        loginLink.style.textDecoration = "";
    })





})