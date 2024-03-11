document.addEventListener('DOMContentLoaded', async () => {
    
    const subscribeDiv = document.getElementById("subscribeDiv");
    const createAccountLink = document.getElementById("createAccountLink");
    const loginLink = document.getElementById("loginLink");
    const contentDiv = document.getElementById("contentDiv");

    const publicKey = await fetch("http://localhost:8080/api/customer/stripe/get-public-key")
    .then(res => res.text());
    if (!publicKey) {
        console.error("Invalid or missing public key");
        return;
    }
    const stripe = Stripe(publicKey);
    console.log(publicKey);


    subscribeDiv.addEventListener("mouseenter", () => {
        createAccountLink.style.textDecoration = "underline";
        loginLink.style.textDecoration = "underline";
    })

    subscribeDiv.addEventListener("mouseleave", () => {
        createAccountLink.style.textDecoration = "";
        loginLink.style.textDecoration = "";
    })

    await loadHomePage();

    async function loadHomePage() {
        contentDiv.innerHTML = "";
        contentDiv.style.display = "flex";
        contentDiv.style.flexDirection = "row";
        //contentDiv.style.justifyContent = "space-between";
        await showFreePodcasts();
        await showMiddlecolumn();

    }

    async function showFreePodcasts() {
        const freePodcastsDiv = document.createElement("div");
        const freePodcastsHeaderDiv = document.createElement("div");
        freePodcastsHeaderDiv.style.backgroundColor = "rgba(211, 211, 211, 0.3)";
        freePodcastsHeaderDiv.style.margin = "0 5px 0 5px";
        freePodcastsHeaderDiv.style.textAlign = "center";
        const freePodcastsHeaderText = document.createElement("h2");
        freePodcastsHeaderText.innerText = "Free Podcasts";
        freePodcastsHeaderDiv.appendChild(freePodcastsHeaderText);
        freePodcastsDiv.appendChild(freePodcastsHeaderDiv);
        freePodcastsDiv.style.maxWidth = "25%";
        contentDiv.appendChild(freePodcastsDiv);

        for (let i = 1; i < 6; i++) {
            await fetch("http://localhost:8080/api/podcasts/get-free-podcasts", {
                method: "GET",
                headers: {
                    episodeNumber : i
                }
            })
            .then(res => res.blob())
            .then(blob => {
                const audio = new Audio();
                audio.src = URL.createObjectURL(blob);
                audio.style.maxWidth = "100%";
                audio.controls = true;

                const names = ["Origins", "Hip Hop", "Black Sabbath", "Reggae", "Elvis"];

                const episodeDiv = document.createElement("div");
                episodeDiv.style.maxWidth = "100%";
                episodeDiv.style.backgroundColor = "rgba(211, 211, 211, 0.3)";
                episodeDiv.style.padding = "3px";
                episodeDiv.style.margin = "0 5px 5px 5px";

                const episodeDivHeader = document.createElement("div");
                const episodeDivHeaderText = document.createElement("h3");
                episodeDivHeaderText.innerText = "Podcast #" + i + " - " + names[i - 1];
                episodeDivHeader.appendChild(episodeDivHeaderText);
                episodeDiv.appendChild(episodeDivHeader);

                const episodeImage = document.createElement("img");
                episodeImage.src = "/resources/images/episode" + i + "Free.jpg";
                episodeImage.style.maxWidth = "100%";

                episodeDiv.append(episodeImage, audio);
                
                freePodcastsDiv.appendChild(episodeDiv);

            })
        }

    }

    async function showMiddlecolumn() {
        const middleColumnDiv = document.createElement("div");
        middleColumnDiv.style.margin = "0 1% 0 1%";
        const middleColumnHeaderDiv = document.createElement("div");
        middleColumnHeaderDiv.style.backgroundColor = "rgba(211, 211, 211, 0.3)";
        middleColumnHeaderDiv.style.textAlign = "center";
        const middleColumnHeaderText = document.createElement("h2");
        middleColumnHeaderText.innerText = "Latest Podcast";
        middleColumnHeaderDiv.appendChild(middleColumnHeaderText);
        middleColumnDiv.appendChild(middleColumnHeaderDiv);
        middleColumnDiv.style.width = "50%";
        contentDiv.appendChild(middleColumnDiv);

        fetch ("http://localhost:8080/api/customer/stripe/get-single-product", {
            method: "GET",
            headers: {
                productId: "prod_PgRBbMLHkVFAbt"
            }
        }).then(res => res.json())
        .then(product => {
            console.log(product);

            const latestEpisodeDiv = document.createElement("div");
            const latestEpisodeDivHeader = document.createElement("div");
            const latestEpisodeDivHeaderText = document.createElement("h3");
            latestEpisodeDivHeaderText.style.paddingTop = "14px";
            latestEpisodeDiv.style.backgroundColor = "rgba(211, 211, 211, 0.3)"
            latestEpisodeDivHeaderText.innerText = product.name;
            latestEpisodeDivHeader.appendChild(latestEpisodeDivHeaderText);
            latestEpisodeDiv.appendChild(latestEpisodeDivHeader);

            latestEpisodeDiv.style.width = "100%";
            latestEpisodeDiv.style.textAlign = "center";
            const latestEpisodeImage = document.createElement("img");
            latestEpisodeImage.src = product.images[0];
            latestEpisodeImage.style.width = "95%";
            latestEpisodeDiv.appendChild(latestEpisodeImage);

            const buyButton = document.createElement("button");
            buyButton.type = "button";
            buyButton.addEventListener("click", () => createBuyButton(product.id)); 
            buyButton.style.borderRadius = "15px";
            buyButton.innerText = "Buy Episode";
            buyButton.style.border = "none";
            buyButton.style.marginBottom = "5px";
            buyButton.style.fontSize = "Large"; 
            buyButton.style.padding = "10px";
            buyButton.style.cursor = "pointer";

            buyButton.addEventListener("mouseenter", () => {
                buyButton.style.backgroundColor = "grey";
            })
        
            buyButton.addEventListener("mouseleave", () => {
                buyButton.style.backgroundColor = "";
            })

            latestEpisodeDiv.appendChild(buyButton);

            middleColumnDiv.appendChild(latestEpisodeDiv);
        })
    }

    function createBuyButton(productId) {

            console.log("YEY!");
        
    }



})