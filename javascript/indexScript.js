document.addEventListener('DOMContentLoaded', async () => {
    
    const subscribeDiv = document.getElementById("subscribeDiv");
    const createAccountLink = document.getElementById("createAccountLink");
    const loginLink = document.getElementById("loginLink");
    const contentDiv = document.getElementById("contentDiv");
    const homeLink = document.getElementById("homeLink");
    const podcastLink = document.getElementById("podcastsLink");
    const merchandiseLink = document.getElementById("merchandiseLink");
    const contactLink = document.getElementById("contactLink");

    const greyBackground = "rgba(211, 211, 211, 0.3)";

    homeLink.addEventListener("click", () => {
        loadHomePage();
    })

    podcastLink.addEventListener("click", () => {
        loadPodcastsPage();
    })

    merchandiseLink.addEventListener("click", () => {
        loadMerchandisePage();
    })

    contactLink.addEventListener("click", () => {
        loadContactPage();
    })

    loginLink.addEventListener("click", () => {
        loadLoginForm();
    })

    createAccountLink.addEventListener("click", () => {
        loadCreateAccountForm();
    })




    const publicKey = await fetch("http://localhost:8080/api/customer/stripe/get-public-key")
    .then(res => res.text());
    if (!publicKey) {
        console.error("Invalid or missing public key");
        return;
    }
    const stripe = Stripe(publicKey);

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
        await showFreePodcasts();
        await showMiddlecolumn();
        await showRightColumn();

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
                audio.style.width = "98%";

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
        middleColumnDiv.style.width = "48%";
        const middleColumnHeaderDiv = document.createElement("div");
        middleColumnHeaderDiv.style.backgroundColor = "rgba(211, 211, 211, 0.3)";
        middleColumnHeaderDiv.style.textAlign = "center";
        const middleColumnHeaderText = document.createElement("h2");
        middleColumnHeaderText.innerText = "Latest Podcast";
        middleColumnHeaderDiv.appendChild(middleColumnHeaderText);
        middleColumnDiv.appendChild(middleColumnHeaderDiv);
        middleColumnDiv.style.width = "50%";

        await fetch ("http://localhost:8080/api/customer/stripe/get-single-product", {
            method: "GET",
            headers: {
                productId: "prod_PgRBbMLHkVFAbt"
            }
        }).then(res => res.json())
        .then(product => {

            const latestEpisodeDiv = document.createElement("div");
            latestEpisodeDiv.style.width = "100%";
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
            buyButton.addEventListener("click", () => createBuyButton(product)); 
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

        const reviewsDiv = document.createElement("div");
        reviewsDiv.style.width = "100%";
        reviewsDiv.style.display = "flex";
        reviewsDiv.style.flex = "column";

        const leftColumn = document.createElement("div");
        leftColumn.style.width = "48%";
        leftColumn.style.marginRight = "20px";
        leftColumn.style.justifyContent = "space-between";

        const firstLeftColumn = document.createElement("div");
        firstLeftColumn.style.height = "23%";
        firstLeftColumn.style.marginBottom = "20px";
        firstLeftColumn.style.backgroundColor = "rgba(211, 211, 211, 0.3)";

        const secondLeftColumn = document.createElement("div");
        secondLeftColumn.style.height = "23%";
        secondLeftColumn.style.marginBottom = "20px";
        secondLeftColumn.style.backgroundColor = "rgba(211, 211, 211, 0.3)";
        secondLeftColumn.style.textAlign = "right";

        const thirdLeftColumn = document.createElement("div");
        thirdLeftColumn.style.height = "fit-content";
        thirdLeftColumn.style.backgroundColor = "rgba(211, 211, 211, 0.3)";
        thirdLeftColumn.style.textAlign = "center";

        let reviewHeader = document.createElement("h2");
        reviewHeader.innerText = "Rolling Stone - ";
        reviewHeader.style.width = "100%";
        reviewHeader.style.padding = "10px 0 10px 5px";

        let reviewText = document.createElement("h4");
        reviewText.style.padding = "6px";
        reviewText.innerText = "'Melodic joy, insightful beats, podcast perfection.'";
        firstLeftColumn.append(reviewHeader, reviewText);

        let secondReviewHeader = document.createElement("h2");
        secondReviewHeader.style.padding = "10px 5px 10px 0";

        let secondReviewText = document.createElement("h4");
        secondReviewText.style.padding = "6px";
        secondReviewHeader.innerText = "Q Magazine - ";
        secondReviewText.innerText = "'Dynamic fusion, pure brilliance! A must-listen podcast for music lovers.'";

        secondLeftColumn.append(secondReviewHeader, secondReviewText);
        leftColumn.append(firstLeftColumn, secondLeftColumn);

        let thirdLeftColumnHeader = document.createElement("h2");
        thirdLeftColumnHeader.innerText = "Latest Merch";
        thirdLeftColumnHeader.style.width = "100%";

        let thirdLeftColumnImage = document.createElement("img");

        await fetch ("http://localhost:8080/api/customer/stripe/get-single-product", {
            method: "GET",
            headers: {
                productId: "prod_PgQg334IZiZpxh"
            }
        }).then(res => res.json())
        .then(product => {
            thirdLeftColumnImage.src = product.images[0];
            thirdLeftColumnImage.addEventListener("click", () => goToMerch());
            thirdLeftColumnImage.style.cursor = "pointer";
        })

        thirdLeftColumnImage.style.width = "95%";
        thirdLeftColumn.append(thirdLeftColumnHeader, thirdLeftColumnImage);
        leftColumn.appendChild(thirdLeftColumn);
        
        const rightColumn = document.createElement("div");
        rightColumn.style.width = "48%";

        const firstRightColumn = document.createElement("div");
        firstRightColumn.style.height = "22%";
        firstRightColumn.style.backgroundColor = "rgba(211, 211, 211, 0.3)";

        const secondRightColumn = document.createElement("div");
        secondRightColumn.style.height = "18%";
        secondRightColumn.style.backgroundColor = "rgba(211, 211, 211, 0.3)";
        secondRightColumn.style.textAlign = "right";

        const thirdRightColumn = document.createElement("div");
        thirdRightColumn.style.height = "fit-content";
        thirdRightColumn.style.backgroundColor = "rgba(211, 211, 211, 0.3)";
        thirdRightColumn.style.textAlign = "center";

        let reviewHeaderRight = document.createElement("h2");
        reviewHeaderRight.innerText = "User MusicMum88 - ";
        reviewHeaderRight.style.width = "100%";
        reviewHeaderRight.style.padding = "10px 0 3px 5px";

        let reviewTextRight = document.createElement("h4");
        reviewTextRight.style.padding = "6px";
        reviewTextRight.innerText = "'Musing Music podcast captivates with its diverse musical exploration and genuine passion.'";
        firstRightColumn.append(reviewHeaderRight, reviewTextRight);

        let secondReviewHeaderRight = document.createElement("h2");
        secondReviewHeaderRight.style.padding = "10px 5px 10px 0";

        let secondReviewTextRight = document.createElement("h4");
        secondReviewTextRight.style.padding = "6px";
        secondReviewHeaderRight.innerText = "User iLovePop - ";
        secondReviewTextRight.innerText = "'Epic beats, pure vibes and insightful commentary!'";

        secondRightColumn.append(secondReviewHeaderRight, secondReviewTextRight);

        let thirdRightColumnHeader = document.createElement("h2");
        thirdRightColumnHeader.innerText = "Latest Merch";
        thirdRightColumnHeader.style.width = "100%";

        let thirdRightColumnImage = document.createElement("img");

        await fetch ("http://localhost:8080/api/customer/stripe/get-single-product", {
            method: "GET",
            headers: {
                productId: "prod_PgQjUTmE0vehg2"
            }
        }).then(res => res.json())
        .then(product => {
            thirdRightColumnImage.src = product.images[0];
            thirdRightColumnImage.addEventListener("click", () => goToMerch());
            thirdRightColumnImage.style.cursor = "pointer";
        })

        thirdRightColumnImage.style.width = "95%";
        thirdRightColumn.append(thirdRightColumnHeader, thirdRightColumnImage);
        rightColumn.append(thirdRightColumn, firstRightColumn, secondRightColumn);
        reviewsDiv.append(leftColumn, rightColumn);
        middleColumnDiv.appendChild(reviewsDiv);

        const newsDiv = document.createElement("div");
        newsDiv.style.backgroundColor = "rgba(211, 211, 211, 0.3)";
        const newsDivHeader = document.createElement("h1");
        newsDivHeader.innerText = "Latest News";
        newsDivHeader.marginTop = "10px";
        newsDivHeader.style.textAlign = "center";
        const newsDivContent = document.createElement("h3");
        newsDivContent.style.margin = "10px";
        newsDivContent.innerText = "Attention festival enthusiasts! Musing Music has secured exclusive behind-the-scenes access to the upcoming Harmony Haven Music Festival. Our team will be on-site, bringing you live interviews, sneak peeks, and all the insider details on the festival's most anticipated performances. Stay tuned for an immersive experience like never before.\n\nOur spotlight this week shines on Luna Serenade, a rising indie star with a genre-bending sound that seamlessly merges folk and electronic elements. Join us for an intimate conversation with Luna as she unveils the inspiration behind her latest album, 'Whispers in the Wind.' \n\nHip-hop meets electronica in the dynamic collaboration between Mic Dropper and Synthwave Wizard. 'Rhythm Revolution' promises to be a genre-defying masterpiece, and we've got the inside scoop on this fusion of rap verses and synth-driven beats that will leave you craving more. \n\nIn vinyl news, the resurgence of classic albums continues to break records. Discover the allure of analog sound as we explore the vinyl revival, speaking with enthusiasts who are spearheading the return of this timeless format. Join us for an in-depth analysis of the ever-evolving landscape of music streaming platforms. \n\nWith new contenders entering the scene, we'll unravel the latest features, exclusive releases, and the ongoing battle for supremacy in the highly competitive streaming wars. Gear up for a musical journey that transcends boundaries and genres. Musing Music is your passport to the freshest updates, groundbreaking developments, and a sneak peek into the future of sound. Stay tuned for upcoming podcasts, interviews, and a symphony of revelations that will keep your ears glued to the beat!\n\nBreaking news on Musing Music: Our upcoming episode will feature an exclusive interview with Melody Maestro, a renowned music producer and visionary in the industry. Tune in as we delve into the secrets behind his latest project, a groundbreaking album that promises to redefine the boundaries of contemporary music. Get ready for behind-the-scenes anecdotes, insights into his creative process, and a sneak peek into the mesmerizing soundscape he has crafted. Melody Maestro's innovative approach to composition is set to inspire aspiring musicians and captivate seasoned music enthusiasts alike."
        newsDiv.append(newsDivHeader, newsDivContent);
        middleColumnDiv.appendChild(newsDiv);
        contentDiv.appendChild(middleColumnDiv);

    }

    function createBuyButton(product) {

        const paymentWindow = document.createElement("dialog");
        paymentWindow.style.background = "url('" + product.images[0] + "')";
        paymentWindow.style.backgroundSize = "cover";
        paymentWindow.style.backgroundRepeat = "no-repeat";
        paymentWindow.style.backgroundPosition = "center";
        console.log(product.images[0]);
        paymentWindow.style.color = "white";
        const paymentWindowHeader = document.createElement("h2");
        paymentWindowHeader.innerText = "You are seconds away from listening to " + product.name + "!"
        paymentWindow.appendChild(paymentWindowHeader);
        paymentWindow.setAttribute("open", true);
        window.scrollTo(top);
        
        const loginChoice = document.createElement("div");
        loginChoice.style.width = "100%";
        loginChoice.style.textAlign = "center";
        const loginChoiceHeader = document.createElement("h3");
        loginChoiceHeader.innerText = "Would you like to log in or buy as guest?";
        loginChoiceHeader.style.width = "100%";
        const loginBtn = document.createElement("button");
        loginBtn.innerText = "Log in";
        loginBtn.style.marginRight = "30px"
        const guestBtn = document.createElement("button");
        guestBtn.innerText = "Guest";
        loginChoice.append(loginChoiceHeader, loginBtn, guestBtn);
        paymentWindow.appendChild(loginChoice);
        loginBtn.addEventListener("click", () => loginBtnEventListener(product, paymentWindow, loginChoice));
        guestBtn.addEventListener("click", () => guestgBtnEventListener(product, paymentWindow, loginChoice));

        const cancelButton = document.createElement("button");
        cancelButton.innerText = "Cancel";
        cancelButton.style.borderRadius = "15px";
        cancelButton.style.border = "none";
        cancelButton.style.marginBottom = "5px";
        cancelButton.style.fontSize = "Large"; 
        cancelButton.style.padding = "10px";
        cancelButton.style.cursor = "pointer";
        cancelButton.addEventListener("click", () => {
            paymentWindow.removeAttribute("open");
        })
        cancelButton.addEventListener("mouseenter", () => {
            cancelButton.style.backgroundColor = "grey";
        })
    
        cancelButton.addEventListener("mouseleave", () => {
            cancelButton.style.backgroundColor = "";
        })

        paymentWindow.appendChild(cancelButton);
        contentDiv.appendChild(paymentWindow);
    }

    async function showRightColumn() {
        const merchcolumnDiv = document.createElement("div");
        const merchColumnDivHeader = document.createElement("div");
        merchColumnDivHeader.style.backgroundColor = "rgba(211, 211, 211, 0.3)";
        merchColumnDivHeader.style.margin = "0 5px 0 5px";
        merchColumnDivHeader.style.textAlign = "center";
        const merchColumnDivHeaderText = document.createElement("h2");
        merchColumnDivHeaderText.innerText = "Merchandise";
        merchColumnDivHeader.appendChild(merchColumnDivHeaderText);
        merchcolumnDiv.appendChild(merchColumnDivHeader);
        merchcolumnDiv.style.maxWidth = "25%";
        contentDiv.appendChild(merchcolumnDiv);

        let merchImgUrls = [];
        let merchImageDiv = document.createElement("div");
        merchImageDiv.style.textAlign = "center";

        await fetch ("http://localhost:8080/api/customer/stripe/get-all-products") 
        .then(res => res.json())
        .then(products => {

            products.data.forEach(element => {
                
                let productName = element.name.substring(0, 7);

                if (productName != "Podcast") {
                    merchImgUrls.push(element.images[0]);
                }

            });

            for (let i = 6; i < 11; i++) {

                let imageDiv = document.createElement("div");
                imageDiv.style.textAlign = "center";
                imageDiv.style.backgroundColor = "rgba(211, 211, 211, 0.3)";
                imageDiv.style.marginBottom = "10px";
                let merchImage = document.createElement("img");
                merchImage.src = merchImgUrls[i];
                merchImage.style.width = "95%";
                merchImage.style.height = "11%";
                merchImage.style.margin = "8px 0 8px 0";
                imageDiv.appendChild(merchImage);
                merchImageDiv.appendChild(imageDiv);
                merchImage.addEventListener("click", () => loadMerchandisePage());
                merchImage.style.cursor = "pointer";
            }
            merchcolumnDiv.append(merchImageDiv);

        })
    }

    async function loadPodcastsPage() {
        contentDiv.innerHTML = "";
        contentDiv.style.display = "flex";
        contentDiv.style.flexDirection = "column";

        const freeContentDiv = document.createElement("div");
        freeContentDiv.style.width = "100vw";

        const freeContentDivHeader = document.createElement("h1");
        freeContentDivHeader.innerText = "Free Podcasts";
        freeContentDivHeader.style.width = "100%";
        freeContentDivHeader.style.backgroundColor = greyBackground;
        freeContentDivHeader.style.padding = "10px 0 10px 0";
        freeContentDivHeader.style.textAlign = "center";
        freeContentDiv.appendChild(freeContentDivHeader);

        const freeContentDivPodcasts = document.createElement("div");
        freeContentDivPodcasts.style.display = "flex";
        freeContentDivPodcasts.style.flexDirection = "row";
        freeContentDivPodcasts.style.justifyContent = "space-between";

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
                audio.style.width = "98%";

                const names = ["Origins", "Hip Hop", "Black Sabbath", "Reggae", "Elvis"];

                const episodeDiv = document.createElement("div");
                episodeDiv.style.width = "20%";
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
                episodeImage.style.width = "300px";
                episodeImage.style.height = "200px";
                episodeImage.style.overflowY = "hidden";

                episodeDiv.append(episodeImage, audio);
                freeContentDivPodcasts.appendChild(episodeDiv)
            })
        }
        freeContentDiv.appendChild(freeContentDivPodcasts);
        contentDiv.appendChild(freeContentDiv);
        
        const paidContentDiv = document.createElement("div");
        paidContentDiv.style.width = "100vw";
        paidContentDiv.style.marginBottom = "10px";

        const paidContentDivHeader = document.createElement("h1");
        paidContentDivHeader.innerText = "Podcasts for Purchase";
        paidContentDivHeader.style.width = "100%";
        paidContentDivHeader.style.backgroundColor = greyBackground;
        paidContentDivHeader.style.padding = "10px 0 10px 0";
        paidContentDivHeader.style.textAlign = "center";
        paidContentDiv.appendChild(paidContentDivHeader);

        const paidContentDivPodcasts = document.createElement("div");
        paidContentDivPodcasts.style.display = "flex";
        paidContentDivPodcasts.style.flexDirection = "row";
        paidContentDivPodcasts.style.flexWrap = "wrap";
        paidContentDivPodcasts.style.justifyContent = "space-between";

        await fetch ("http://localhost:8080/api/customer/stripe/get-all-products") 
        .then(res => res.json())
        .then(products => {

            products.data.reverse();
            
            products.data.forEach(element => {
                
                let productName = element.name.substring(0, 9);

                if (productName == "Podcast #") {
                    const paidEpisodeDiv = document.createElement("div");
                    paidEpisodeDiv.style.width = "20%";
                    const paidEpisodeDivHeader = document.createElement("div");
                    const paidEpisodeDivHeaderText = document.createElement("h3");
                    paidEpisodeDivHeaderText.style.paddingTop = "14px";
                    paidEpisodeDiv.style.backgroundColor = "rgba(211, 211, 211, 0.3)";
                    paidEpisodeDivHeaderText.innerText = element.name;
                    paidEpisodeDivHeader.appendChild(paidEpisodeDivHeaderText);
                    paidEpisodeDiv.appendChild(paidEpisodeDivHeader);
        
                    paidEpisodeDiv.style.textAlign = "center";
                    const paidEpisodeImage = document.createElement("img");
                    paidEpisodeImage.src = element.images[0];
                    paidEpisodeImage.style.width = "95%";
                    paidEpisodeDiv.appendChild(paidEpisodeImage);
        
                    const buyButton = document.createElement("button");
                    buyButton.type = "button";
                    buyButton.addEventListener("click", () => createBuyButton(element)); 
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
        
                    paidEpisodeDiv.appendChild(buyButton);
        
                    paidContentDivPodcasts.appendChild(paidEpisodeDiv);  
                }
        
            });
            paidContentDiv.appendChild(paidContentDivPodcasts);
            contentDiv.appendChild(paidContentDiv);
        })
    }

    async function loginBtnEventListener(paymentWindow) {

    }

    async function guestgBtnEventListener(product, paymentWindow, loginChoice) {
        loginChoice.innerHTML = "";
        const guestHeader = document.createElement("h3");
        guestHeader.innerText = "Guest";
        const guestForm = document.createElement("form");
        guestForm.style.textAlign = "center";
        guestForm.style.display = "inline";
        const guestFormFirstName = document.createElement("input");
        guestFormFirstName.placeholder = "First Name";
        guestFormFirstName.style.display = "block";
        guestFormFirstName.setAttribute("required", true);
        const guestFormLastName = document.createElement("input");
        guestFormLastName.placeholder = "Last Name";
        guestFormLastName.style.display = "block";
        guestFormLastName.setAttribute("required", true);
        const guestFormEmail = document.createElement("input");
        guestFormEmail.placeholder = "@email";
        guestFormEmail.type = "email";
        guestFormEmail.style.display = "block";
        guestFormEmail.setAttribute("required", true);
        const guestFormAddress1 = document.createElement("input");
        guestFormAddress1.placeholder = "Address 1";
        guestFormAddress1.style.display = "block";
        guestFormAddress1.setAttribute("required", true);
        const guestFormAddress2 = document.createElement("input");
        guestFormAddress2.placeholder = "Address 2";
        guestFormAddress2.style.display = "block";
        const guestFormPostNumber = document.createElement("input");
        guestFormPostNumber.placeholder = "Post Number";
        guestFormPostNumber.style.display = "block";
        guestFormPostNumber.setAttribute("required", true);
        const guestFormCity = document.createElement("input");
        guestFormCity.placeholder = "City";
        guestFormCity.style.display = "block";
        guestFormCity.setAttribute("required", true);
        const submitBtn = document.createElement("button");
        submitBtn.type = "button";
        submitBtn.innerText = "Submit";
        
        guestForm.append(guestFormFirstName, guestFormLastName, guestFormEmail, guestFormAddress1, guestFormAddress2, guestFormPostNumber, guestFormCity, submitBtn);
        loginChoice.appendChild(guestForm);
        
        submitBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            loginChoice.innerHTML = "";
            console.log(product.id);
            const {clientSecret} = await fetch("http://localhost:8080/api/customer/stripe/one-time-purchase", {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "productId": product.id
            },
            body : JSON.stringify ({
                "firstName": guestFormFirstName.value,
                "lastName": guestFormLastName.value,
                "email": guestFormEmail.value,
                "address1" : guestFormAddress1.value,
                "address2": guestFormAddress2.value,
                "postnumber": guestFormPostNumber.value,
                "city": guestFormCity.value
            })
        }).then(res => res.json())
        .then(res => {
            console.log({clientSecret});
        
            const elements = stripe.elements({clientSecret});
            const paymentElement = elements.create('payment');
            paymentElement.mount('#paymentElement');
            loginChoice.appendChild(paymentElement);
        
            const form = document.getElementById("paymentForm");
            form.addEventListener("submit", async(e) => {
                e.preventDefault();
        
                const {error} = await stripe.confirmPayment({
                    elements,
                    confirmParams: {
                        return_url: window.location.origin + "/complete.html"
                    }
                })
                if (error) {
                    const messages = document.getElementById("errors");
                    messages.innerText = error.message;
                }
                })
        })
    })
    }

    async function loadMerchandisePage() {
        
    }

})