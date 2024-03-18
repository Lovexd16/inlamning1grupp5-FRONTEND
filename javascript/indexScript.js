document.addEventListener('DOMContentLoaded', async () => {
    
    const subscribeDiv = document.getElementById("subscribeDiv");
    const contentDiv = document.getElementById("contentDiv");
    const homeLink = document.getElementById("homeLink");
    const podcastLink = document.getElementById("podcastsLink");
    const merchandiseLink = document.getElementById("merchandiseLink");
    const contactLink = document.getElementById("contactLink");
    const greyBackground = "rgba(211, 211, 211, 0.3)";
    const navList = document.getElementById("navigationList");
    
    await loadHomePage();

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

    
    if (localStorage.getItem("purchase") == "") {
        console.log("here: " + purchaseSuccessful);
    } else {
        console.log("start");
    }


    const publicKey = await fetch("http://localhost:8080/api/customer/stripe/get-public-key")
    .then(res => res.text());
    if (!publicKey) {
        console.error("Invalid or missing public key");
        return;
    }
    const stripe = Stripe(publicKey);

    subscribeDiv.addEventListener("mouseenter", () => {
        createAccountLink.style.textDecoration = "underline";
        memberPage.style.textDecoration = "underline";
        loginLink.style.textDecoration = "underline";
    })

    subscribeDiv.addEventListener("mouseleave", () => {
        createAccountLink.style.textDecoration = "";
        memberPage.style.textDecoration = "";
        loginLink.style.textDecoration = "";
    })
    
    
    async function loadHomePage() {
        contentDiv.innerHTML = "";
        contentDiv.style.display = "flex";
        contentDiv.style.flexDirection = "row";
        await checkLoggedIn();
        await showFreePodcasts();
        await showMiddlecolumn();
        await showRightColumn();
        
    }
    
    async function checkLoggedIn() {
        let userId = sessionStorage.getItem("userID");
        console.log(userId);
                
        if (userId && userId.trim().length > 0) {
            console.log("logged in");
            if(navList.querySelector("#loginLink")) {
                navList.removeChild(navList.querySelector("#loginLink"));
                console.log("here: 1");
            }
            if(navList.querySelector("#createAccountLink")) {
                navList.removeChild(navList.querySelector("#createAccountLink"));
                console.log("here: 2");
            }
            if(!navList.querySelector("#memberPage") && !navList.querySelector("#logOutLink")) {
                const memberPage = document.createElement("li");
                memberPage.innerText = "Member Page";
                memberPage.id = "memberPage";
                const logOutLink = document.createElement("li");
                logOutLink.innerText = "Log out";
                logOutLink.id = "logOutLink";
                navList.append(memberPage, logOutLink);
                if (isUUID(sessionStorage.getItem("userID"))) {
                    userId = sessionStorage.getItem("userID");
                }
                memberPage.addEventListener("click", async () => {
                    await fetch("http://localhost:8080/api/user/get-user-by-id", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "userId": userId 
                        }
                    }).then(res => res.json())
                    .then(user => {
                        loadAccountPage(user);
                    })
                })
                logOutLink.addEventListener("click", () => {
                    console.log("clickL");
                    sessionStorage.removeItem("userID");
                    loadHomePage();
                })
            }
            console.log("here: 2.5");
        } else {
            console.log("not logged");
            if(navList.querySelector("#memberPage")) {
                navList.removeChild(navList.querySelector("#memberPage"));
                console.log("here: 3");
            }
            if(navList.querySelector("#logOutLink")) {
                navList.removeChild(navList.querySelector("#logOutLink"));
                console.log("here: 4");
            }
            if(!navList.querySelector("#createAccountLink") && !navList.querySelector("#loginLink")) {
                const createAccountLink = document.createElement("li");
                createAccountLink.innerText = "Create Account";
                createAccountLink.id = "createAccountLink"
                const loginLink = document.createElement("li");
                loginLink.innerText = "Log in";
                loginLink.id = "loginLink";
                navList.append(createAccountLink, loginLink);
                loginLink.addEventListener("click", () => {
                    loadLoginForm();
                })
            
                createAccountLink.addEventListener("click", () => {
                    loadCreateAccountForm();
                })
            }
            console.log("here: 4.5");
        }
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
                episodeDiv.style.margin = "0 5px 35px 5px";

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
        thirdLeftColumn.addEventListener("click", () => {
            loadMerchandisePage();
        })

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
        thirdRightColumn.addEventListener("click", () => {
            loadMerchandisePage();
        })
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
        newsDiv.style.marginTop = "30px";
        newsDiv.style.bottom = "0%";
        newsDiv.style.paddingBottom = "30px";
        newsDiv.style.display = "block";
        newsDiv.style.backgroundColor = "rgba(211, 211, 211, 0.3)";
        const newsDivHeader = document.createElement("h1");
        newsDivHeader.innerText = "Latest News";
        newsDivHeader.marginTop = "20px";
        newsDivHeader.style.textAlign = "center";
        const newsDivContent = document.createElement("h3");
        newsDivContent.style.margin = "10px";
        newsDivContent.innerText = "Attention festival enthusiasts! Musing Music has secured exclusive behind-the-scenes access to the upcoming Harmony Haven Music Festival. Our team will be on-site, bringing you live interviews, sneak peeks, and all the insider details on the festival's most anticipated performances. Stay tuned for an immersive experience like never before.\n\nOur spotlight this week shines on Luna Serenade, a rising indie star with a genre-bending sound that seamlessly merges folk and electronic elements. Join us for an intimate conversation with Luna as she unveils the inspiration behind her latest album, 'Whispers in the Wind.' \n\nHip-hop meets electronica in the dynamic collaboration between Mic Dropper and Synthwave Wizard. 'Rhythm Revolution' promises to be a genre-defying masterpiece, and we've got the inside scoop on this fusion of rap verses and synth-driven beats that will leave you craving more. \n\nIn vinyl news, the resurgence of classic albums continues to break records. Discover the allure of analog sound as we explore the vinyl revival, speaking with enthusiasts who are spearheading the return of this timeless format. Join us for an in-depth analysis of the ever-evolving landscape of music streaming platforms. \n\nWith new contenders entering the scene, we'll unravel the latest features, exclusive releases, and the ongoing battle for supremacy in the highly competitive streaming wars. Gear up for a musical journey that transcends boundaries and genres. Musing Music is your passport to the freshest updates, groundbreaking developments, and a sneak peek into the future of sound. Stay tuned for upcoming podcasts, interviews, and a symphony of revelations that will keep your ears glued to the beat!\n\nBreaking news on Musing Music: Our upcoming episode will feature an exclusive interview with Melody Maestro, a renowned music producer and visionary in the industry. Tune in as we delve into the secrets behind his latest project, a groundbreaking album that promises to redefine the boundaries of contemporary music. Get ready for behind-the-scenes anecdotes, insights into his creative process, and a sneak peek into the mesmerizing soundscape he has crafted. Melody Maestro's innovative approach to composition is set to inspire aspiring musicians and captivate seasoned music enthusiasts alike."
        newsDiv.append(newsDivHeader, newsDivContent);
        middleColumnDiv.appendChild(newsDiv);
        contentDiv.appendChild(middleColumnDiv);

    }

    async function createBuyButton(product) {

        const paymentWindow = document.createElement("dialog");
        paymentWindow.style.background = "url('" + product.images[0] + "')";
        paymentWindow.style.backgroundSize = "cover";
        paymentWindow.style.backgroundRepeat = "no-repeat";
        paymentWindow.style.backgroundPosition = "center";
        console.log(product);
        paymentWindow.style.color = "white";
        const paymentWindowHeader = document.createElement("h2");
        paymentWindowHeader.innerText = "You are about to purchase " + product.name + "!";
        paymentWindow.appendChild(paymentWindowHeader);
        paymentWindow.setAttribute("open", true);
        window.scrollTo(top);
        const loginChoice = document.createElement("div");
        loginChoice.style.width = "100%";
        loginChoice.style.textAlign = "center";
        const loginChoiceHeader = document.createElement("h3");
        
        let userIdcheck = sessionStorage.getItem("userID");
        if (userIdcheck && userIdcheck.trim().length > 0) {
            await fetch("http://localhost:8080/api/user/get-user-by-id", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "userId": userIdcheck
                        }
                    }).then(res => res.json())
                    .then(user => {
                        loadAccountPage(user);
                        loginChoiceHeader.innerText = "You are logged in as " + user.username + "\nEnter your password to continue to purchase.";
                        loginChoiceHeader.style.width = "100%";
                        const password = document.createElement("input");
                        password.type = "password";
                        password.style.display = "block";
                        const loginBtn = document.createElement("button");
                        loginBtn.innerText = "Confirm";
                        loginBtn.style.marginRight = "30px"
                        loginChoice.append(loginChoiceHeader, password, loginBtn);
                        paymentWindow.appendChild(loginChoice);
                        loginBtn.addEventListener("click", () => loginBtnEventListener(product, paymentWindow, loginChoice, password.value, user));
                    })
                        
        } else {
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
        }
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
                episodeDiv.style.textAlign = "center";
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
        paidContentDivHeader.innerText = "Podcasts for Purchase\n(If you have a subscription, all podcasts are available from the member page)";
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
            
            products.data.forEach(async element => {
                
                let productName = element.name.substring(0, 9);

                if (productName == "Podcast #") {
                    const paidEpisodeDiv = document.createElement("div");
                    paidEpisodeDiv.style.width = "20%";
                    const paidEpisodeDivHeader = document.createElement("div");
                    const paidEpisodeDivHeaderText = document.createElement("h3");
                    const paidEpisodeDivHeaderPrice = document.createElement("h2");

                    await fetch("http://localhost:8080/api/customer/stripe/get-product-price", {
                        method: "GET",
                        headers: {
                            "priceId": element.defaultPrice
                        }
                    }).then(res => res.json())
                    .then(price => {
                        console.log(price);
                        paidEpisodeDivHeaderPrice.innerText = (price.unitAmount / 100) + " " + price.currency;
                    })

                    paidEpisodeDivHeaderText.style.paddingTop = "14px";
                    paidEpisodeDiv.style.backgroundColor = "rgba(211, 211, 211, 0.3)";
                    paidEpisodeDivHeaderText.innerText = element.name;
                    paidEpisodeDivHeader.append(paidEpisodeDivHeaderText, paidEpisodeDivHeaderPrice);
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

    async function loginBtnEventListener(product, paymentWindow, loginChoice, password, user) {
        loginChoice.innerHTML = "";
        const memberHeader = document.createElement("h3");
        memberHeader.innerText = "Member";
        const memberForm = document.createElement("form");
        memberForm.style.textAlign = "center";
        memberForm.style.display = "inline";
        const memberFormFirstName = document.createElement("h3");
        memberFormFirstName.innerText = user.firstName;
        memberFormFirstName.style.display = "block";
        const memberFormLastName = document.createElement("h3");
        memberFormLastName.innerText = user.lastName;
        memberFormLastName.style.display = "block";
        const memberFormEmail = document.createElement("h3");
        memberFormEmail.innerText = user.email;
        memberFormEmail.type = "email";
        memberFormEmail.style.display = "block";
        const memberFormAddress1 = document.createElement("input");
        memberFormAddress1.placeholder = "Address 1";
        memberFormAddress1.style.display = "block";
        memberFormAddress1.setAttribute("required", true);
        const memberFormAddress2 = document.createElement("input");
        memberFormAddress2.placeholder = "Address 2";
        memberFormAddress2.style.display = "block";
        const memberFormPostNumber = document.createElement("input");
        memberFormPostNumber.placeholder = "Post Number";
        memberFormPostNumber.style.display = "block";
        memberFormPostNumber.setAttribute("required", true);
        const memberFormCity = document.createElement("input");
        memberFormCity.placeholder = "City";
        memberFormCity.style.display = "block";
        memberFormCity.setAttribute("required", true);
        const submitBtn = document.createElement("button");
        submitBtn.type = "button";
        submitBtn.innerText = "Submit";
        
        memberForm.append(memberFormFirstName, memberFormLastName, memberFormEmail, memberFormAddress1, memberFormAddress2, memberFormPostNumber, memberFormCity, submitBtn);
        loginChoice.appendChild(memberForm);
        
        submitBtn.addEventListener("click", async (e) => {

            if(memberFormAddress1.value.trim() != "" && memberFormPostNumber.value.trim() != "" && memberFormCity.value.trim() != "") {

                e.preventDefault();
                loginChoice.innerHTML = "";
                let paymentElement = document.createElement("div");
                paymentElement.id = "paymentElement";
                loginChoice.appendChild(paymentElement);
    
                console.log(product.id);
                const {clientSecret} = await fetch("http://localhost:8080/api/customer/stripe/one-time-purchase", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    "productId": product.id,
                    "username": user.username,
                    "password": password
                },
                body : JSON.stringify ({
                    "firstName": memberFormFirstName.innerText,
                    "lastName": memberFormLastName.innerText,
                    "email": memberFormEmail.innerText,
                    "address1" : memberFormAddress1.value,
                    "address2": memberFormAddress2.value,
                    "postnumber": memberFormPostNumber.value,
                    "city": memberFormCity.value
                })
            }).then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return res.json();
            })
            .catch(error => {
                const errorMessage = document.createElement("h2");
                errorMessage.innerText = "All fields except 'Address 2' are required, including a valid email address.";
                loginChoice.appendChild(errorMessage);
            });
            
            console.log({clientSecret});
        
            const elements = stripe.elements({clientSecret});
            paymentElement = elements.create('payment');
            paymentElement.mount('#paymentElement');
        
            const paidEpisodeDivHeaderPrice = document.createElement("h2");

                    await fetch("http://localhost:8080/api/customer/stripe/get-product-price", {
                        method: "GET",
                        headers: {
                            "priceId": product.defaultPrice
                        }
                    }).then(res => res.json())
                    .then(price => {
                        console.log(price);
                        paidEpisodeDivHeaderPrice.innerText = (price.unitAmount / 100) + " " + price.currency;
                    })
            const payBtn = document.createElement("button");
            payBtn.innerText = "Confirm Payment";
            loginChoice.append(paidEpisodeDivHeaderPrice, payBtn);
    
            payBtn.addEventListener("click", async () => {
                
                console.log("click");
                const {error} = await stripe.confirmPayment({
                    elements,
                    confirmParams: {
                        return_url: `${window.location.origin}/successfulPurchase.html?success=true&productId=${product.id}`
                    }
                })
                if (error) {
                    const errorMessage = document.createElement("h2");
                errorMessage.innerText = "Something went wrong, please try again.";
                loginChoice.appendChild(errorMessage);
                } 
            })
            } else {
                const errorMessage = document.createElement("h2");
                alert("All fields except 'Address 2' are required, including a valid email address.");
                loginChoice.appendChild(errorMessage);
            }
        })
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

            if(guestFormFirstName.value.trim() != "" && guestFormLastName.value.trim() != "" && guestFormEmail.value.trim() != "" && guestFormAddress1.value.trim() != "" && guestFormPostNumber.value.trim() != "" && guestFormCity.value.trim() != "") {

                e.preventDefault();
                loginChoice.innerHTML = "";
                let paymentElement = document.createElement("div");
                paymentElement.id = "paymentElement";
                loginChoice.appendChild(paymentElement);
    
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
            }).then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return res.json();
            })
            .catch(error => {
                const errorMessage = document.createElement("h2");
                errorMessage.innerText = "All fields except 'Address 2' are required, including a valid email address.";
                loginChoice.appendChild(errorMessage);
            });
            
            console.log({clientSecret});
        
            const elements = stripe.elements({clientSecret});
            paymentElement = elements.create('payment');
            paymentElement.mount('#paymentElement');
        
            const paidEpisodeDivHeaderPrice = document.createElement("h2");

                    await fetch("http://localhost:8080/api/customer/stripe/get-product-price", {
                        method: "GET",
                        headers: {
                            "priceId": product.defaultPrice
                        }
                    }).then(res => res.json())
                    .then(price => {
                        console.log(price);
                        paidEpisodeDivHeaderPrice.innerText = (price.unitAmount / 100) + " " + price.currency;
                    })
            const payBtn = document.createElement("button");
            payBtn.innerText = "Confirm Payment";
            loginChoice.append(paidEpisodeDivHeaderPrice, payBtn);
    
            payBtn.addEventListener("click", async () => {
                
                console.log("click");
                const {error} = await stripe.confirmPayment({
                    elements,
                    confirmParams: {
                        return_url: `${window.location.origin}/successfulPurchase.html?success=true&productId=${product.id}`
                    }
                })
                if (error) {
                    const errorMessage = document.createElement("h2");
                errorMessage.innerText = "Something went wrong, please try again.";
                loginChoice.appendChild(errorMessage);
                } 
            })
            } else {
                const errorMessage = document.createElement("h2");
                alert("All fields except 'Address 2' are required, including a valid email address.");
                loginChoice.appendChild(errorMessage);
            }
        })
    }

    async function loadMerchandisePage() {

        contentDiv.innerHTML = "";
        contentDiv.style.display = "flex";
        contentDiv.style.flexDirection = "column";

        const paidContentDiv = document.createElement("div");
        paidContentDiv.style.width = "100vw";
        paidContentDiv.style.marginBottom = "10px";

        const paidContentDivHeader = document.createElement("h1");
        paidContentDivHeader.innerText = "Merchandise";
        paidContentDivHeader.style.width = "100%";
        paidContentDivHeader.style.backgroundColor = greyBackground;
        paidContentDivHeader.style.padding = "10px 0 10px 0";
        paidContentDivHeader.style.textAlign = "center";
        paidContentDiv.appendChild(paidContentDivHeader);

        const paidContentDivPodcasts = document.createElement("div");
        paidContentDivPodcasts.style.display = "flex";
        paidContentDivPodcasts.style.textAlign = "left";
        paidContentDivPodcasts.style.flexDirection = "row";
        paidContentDivPodcasts.style.flexWrap = "wrap";
        paidContentDivPodcasts.style.justifyContent = "left";

        await fetch ("http://localhost:8080/api/customer/stripe/get-all-products") 
        .then(res => res.json())
        .then(products => {
            
            products.data.forEach(async element => {
                
                let productName = element.name.substring(0, 7);

                if (productName != "Podcast") {
                    const paidEpisodeDiv = document.createElement("div");
                    paidEpisodeDiv.style.width = "20%";
                    paidEpisodeDiv.style.marginBottom = "10px";
                    const paidEpisodeDivHeader = document.createElement("div");
                    const paidEpisodeDivHeaderText = document.createElement("h3");
                    const paidEpisodeDivHeaderPrice = document.createElement("h2");

                    await fetch("http://localhost:8080/api/customer/stripe/get-product-price", {
                        method: "GET",
                        headers: {
                            "priceId": element.defaultPrice
                        }
                    }).then(res => res.json())
                    .then(price => {
                        console.log(price);
                        paidEpisodeDivHeaderPrice.innerText = (price.unitAmount / 100) + " " + price.currency;
                    })

                    paidEpisodeDivHeaderText.style.paddingTop = "14px";
                    paidEpisodeDiv.style.backgroundColor = "rgba(211, 211, 211, 0.3)";
                    paidEpisodeDivHeaderText.innerText = element.name;
                    paidEpisodeDivHeader.append(paidEpisodeDivHeaderText, paidEpisodeDivHeaderPrice);
                    paidEpisodeDiv.appendChild(paidEpisodeDivHeader);
        
                    paidEpisodeDiv.style.textAlign = "center";
                    const paidEpisodeImage = document.createElement("img");
                    paidEpisodeImage.src = element.images[0];
                    paidEpisodeImage.style.width = "95%";
                    paidEpisodeImage.style.height = "400px";
                    paidEpisodeDiv.appendChild(paidEpisodeImage);
        
                    const buyButton = document.createElement("button");
                    buyButton.type = "button";
                    buyButton.addEventListener("click", () => createBuyButton(element)); 
                    buyButton.style.borderRadius = "15px";
                    buyButton.innerText = "Buy";
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

    async function loadCreateAccountForm() {
        const createAccountDialog = document.createElement("dialog");
        createAccountDialog.style.textAlign = "center";

        const createAccountHeader = document.createElement("h2");
        createAccountHeader.innerText = "Create Account";
        createAccountDialog.appendChild(createAccountHeader);

        createAccountDialog.setAttribute("open", true);

        const createForm = document.createElement("form");
        createForm.style.display = "inline";

        const firstNameInput = document.createElement("input");
        firstNameInput.placeholder = "First Name";
        firstNameInput.setAttribute("Reqiured", true);
        firstNameInput.style.display = "block";

        const lastNameInput = document.createElement("input");
        lastNameInput.placeholder = "Last Name";
        lastNameInput.setAttribute("Reqiured", true);
        lastNameInput.style.display = "block";

        const emailInput = document.createElement("input");
        emailInput.placeholder = "@email";
        emailInput.setAttribute("Reqiured", true);
        emailInput.type = "email";
        emailInput.style.display = "block";

        const usernameInput = document.createElement("input");
        usernameInput.placeholder = "Username (5 - 15 char)";
        usernameInput.setAttribute("Reqiured", true);
        usernameInput.setAttribute("Min", 5);
        usernameInput.setAttribute("Max", 15);
        usernameInput.style.display = "block";

        const passwordInput = document.createElement("input");
        passwordInput.placeholder = "password (8 - 20 char)";
        passwordInput.setAttribute("Min", 8);
        passwordInput.setAttribute("Max", 20);
        passwordInput.type = "password";
        passwordInput.style.display = "block";

        const createButton = document.createElement("button");
        createButton.type = "submit";
        createButton.innerText = "Create Account";

        createForm.append(firstNameInput, lastNameInput, emailInput, usernameInput, passwordInput, createButton);
        createAccountDialog.appendChild(createForm);

        const cancelButton = document.createElement("button");
        cancelButton.innerText = "Cancel";
        cancelButton.style.borderRadius = "15px";
        cancelButton.style.border = "none";
        cancelButton.style.marginBottom = "5px";
        cancelButton.style.fontSize = "Large"; 
        cancelButton.style.padding = "10px";
        cancelButton.style.cursor = "pointer";

        cancelButton.addEventListener("click", () => {
            createAccountDialog.removeAttribute("open");
        })
        cancelButton.addEventListener("mouseenter", () => {
            cancelButton.style.backgroundColor = "grey";
        })
        
        cancelButton.addEventListener("mouseleave", () => {
            cancelButton.style.backgroundColor = "";
        })
        
        createAccountDialog.appendChild(cancelButton);
        contentDiv.appendChild(createAccountDialog);
        createButton.addEventListener("click", (e) => createButtonEventListener(createAccountDialog, e, firstNameInput.value, lastNameInput.value, emailInput.value, usernameInput.value, passwordInput.value))
    }

    async function createButtonEventListener(createAccountDialog, e, firstNameInput, lastNameInput, emailInput, usernameInput, passwordInput) {

        e.preventDefault();
        console.log(firstNameInput + lastNameInput, emailInput, usernameInput, passwordInput)

        if(firstNameInput.trim() != "" && lastNameInput.trim() != "" && emailInput.trim() != "" && usernameInput.trim() != "" && passwordInput.trim() != "" && passwordInput.length > 7 && usernameInput.length > 5 && passwordInput.length < 20 && usernameInput.length < 15) {
            await fetch("http://localhost:8080/api/user/create-user-account", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "firstName": firstNameInput,
                    "lastName": lastNameInput,
                    "email": emailInput,
                    "username": usernameInput,
                    "password": passwordInput
                })
            }).then(res => res.json())
            .then(user => {
                console.log(user);
                createAccountDialog.removeAttribute("open");
                sessionStorage.setItem("userID", user.userId);
                loadHomePage();
            })
        } else {
            alert("You must fill in all the fields");
        }
    }

    async function loadAccountPage(user) {
        await checkLoggedIn();
        contentDiv.innerHTML = "";
        contentDiv.style.display = "flex";
        contentDiv.style.flexDirection = "row";
        contentDiv.style.flexWrap = "wrap";
        contentDiv.style.justifyContent = "space-between";

        const accountPageHeader = document.createElement("h2");
        accountPageHeader.innerText = "Welcome " + user.firstName + " " + user.lastName;
        accountPageHeader.style.width = "100%";
        accountPageHeader.style.backgroundColor = greyBackground;
        accountPageHeader.style.textAlign = "center";
        accountPageHeader.style.padding = "10px";
        accountPageHeader.style.marginBottom = "20px";
        contentDiv.appendChild(accountPageHeader);

        let userId = sessionStorage.getItem("userID");
        console.log(userId);
                
        if (userId && userId.trim().length > 0) {
            
            await fetch("http://localhost:8080/api/user/get-user-by-id", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "userId": userId 
                }
            }).then(res => res.json())
            .then(user => {
                if (user.subscribed == "Not subscribed") {
                    const subscribeBtnDiv = document.createElement("div");
                    const subscribeBtn = document.createElement("button");
                    subscribeBtnDiv.style.width = "100%";
                    subscribeBtnDiv.style.backgroundColor = greyBackground;
                    subscribeBtnDiv.style.textAlign = "center";
                    subscribeBtnDiv.style.padding = "10px";
                    subscribeBtnDiv.style.marginBottom = "20px";
                
                    subscribeBtn.innerText = "Subscribe!";
                    subscribeBtn.style.fontSize = "200%";

                    subscribeBtn.addEventListener("click", () => subscribeBtnEventListener(user));
                
                    subscribeBtnDiv.appendChild(subscribeBtn);
                    contentDiv.appendChild(subscribeBtnDiv);
                } else {
                    const subscribeBtnDiv = document.createElement("div");
                    const subscribedText = document.createElement("h2");
                    subscribeBtnDiv.style.width = "100%";
                    subscribeBtnDiv.style.backgroundColor = greyBackground;
                    subscribeBtnDiv.style.textAlign = "center";
                    subscribeBtnDiv.style.padding = "10px";
                    subscribeBtnDiv.style.marginBottom = "20px";
                
                    subscribedText.innerText = "You are subscribed!";
                    subscribedText.style.fontSize = "200%";
                
                    subscribeBtnDiv.appendChild(subscribedText);
                    contentDiv.appendChild(subscribeBtnDiv);
                }
            })
        }
        logOutLink.addEventListener("click", () => {
            console.log("clickL");
            sessionStorage.removeItem("userID");
            loadHomePage();
        
    })
        
        
        const leftColumn = document.createElement("div");
        leftColumn.style.width = "50%";
        leftColumn.style.display = "flex";
        leftColumn.style.flexDirection = "column";
        leftColumn.style.flexWrap = "wrap";
        leftColumn.style.textAlign = "center";
        leftColumn.style.margin = "0 10px 20px 20px";
        
        const leftColumnHeader = document.createElement("h2");
        leftColumnHeader.innerText = "Account Details";
        leftColumnHeader.style.backgroundColor = greyBackground;
        leftColumnHeader.style.width = "100%";
        leftColumnHeader.style.padding = "10px 0 10px 0";
        leftColumn.appendChild(leftColumnHeader);
        
        const accountDetails = document.createElement("table");
        accountDetails.style.width = "100%";
        accountDetails.style.fontSize = "150%";

        const usernameRow = document.createElement("tr");
        usernameRow.style.marginBottom = "40px";
        const usernameRowLeft = document.createElement("td");
        usernameRow.style.backgroundColor = greyBackground;
        usernameRowLeft.innerText = "Username : ";
        const usernameRowRight = document.createElement("td");
        usernameRowRight.innerText = user.username;
        usernameRow.append(usernameRowLeft, usernameRowRight);
        accountDetails.appendChild(usernameRow);

        const nameRow = document.createElement("tr");
        nameRow.style.backgroundColor = greyBackground;
        nameRow.style.marginBottom = "20px";
        const nameRowLeft = document.createElement("td");
        nameRowLeft.innerText = "Name : ";
        const nameRowRight = document.createElement("td");
        nameRowRight.innerText = user.firstName + " " + user.lastName;
        nameRow.append(nameRowLeft, nameRowRight);
        accountDetails.appendChild(nameRow);

        const emailRow = document.createElement("tr");
        emailRow.style.marginBottom = "20px";
        emailRow.style.backgroundColor = greyBackground;
        const emailRowLeft = document.createElement("td");
        emailRowLeft.innerText = "Email : ";
        const emailRowRight = document.createElement("td");
        emailRowRight.innerText = user.email;
        emailRow.append(emailRowLeft, emailRowRight);
        accountDetails.appendChild(emailRow);

        const passwordRow = document.createElement("tr");
        passwordRow.style.marginBottom = "20px";
        passwordRow.style.backgroundColor = greyBackground;
        const passwordRowLeft = document.createElement("td");
        passwordRowLeft.innerText = "Password : ";
        const passwordRowRight = document.createElement("td");
        passwordRowRight.innerText = "***********";
        passwordRow.append(passwordRowLeft, passwordRowRight);
        accountDetails.appendChild(passwordRow);

        const editBtnDiv = document.createElement("div");
        editBtnDiv.style.width = "100%";
        editBtnDiv.style.textAlign = "center";
        editBtnDiv.style.padding = "10px 0 10px 0";
        editBtnDiv.style.backgroundColor = greyBackground;
        
        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.innerText = "Edit Details";
        editBtnDiv.appendChild(editBtn);
        
        const purchaseHistory = document.createElement("h2");
        purchaseHistory.style.width = "100%";
        purchaseHistory.style.backgroundColor = greyBackground;
        purchaseHistory.style.textAlign = "center";
        purchaseHistory.style.padding = "10px 0 10px 0";
        purchaseHistory.style.margin = "10px 10px 10px 0";
        purchaseHistory.innerText = "Purchase History";

        if (user.userPurchaseHistory[0] == null) {
            const noPurchasesText = document.createElement("h4");
            noPurchasesText.innerText = "You haven't made any purchases";
            noPurchasesText.style.width = "100%";
            noPurchasesText.style.backgroundColor = greyBackground;
            noPurchasesText.style.textAlign = "center";
            noPurchasesText.style.padding = "10px 0 10px 0";
            noPurchasesText.style.margin = "10px 10px 10px 0";
            purchaseHistory.appendChild(noPurchasesText);
        } else {
            user.userPurchaseHistory.forEach(async purchase => {
                const purchaseDiv = document.createElement("div");
                purchaseDiv.style.width = "100%";
                purchaseDiv.style.padding = "10px";
                purchaseDiv.style.margin = "10px;"
                purchaseDiv.style.textAlign = "center";
                const purchaseHeader = document.createElement("h2");
                const purchaseimg = document.createElement("img");
                const purchasePrice = document.createElement("h4");

                await fetch("http://localhost:8080/api/customer/stripe/get-single-product", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "productId": purchase
                    }
                }).then(res => res.json())
                .then(async item => {
                    console.log(item);
                    purchaseHeader.innerText = item.name;
                    purchaseimg.src = item.images[0];
                    await fetch("http://localhost:8080/api/customer/stripe/get-product-price", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "priceId": item.defaultPrice
                        }
                    }).then(res => res.json())
                    .then(price => {
                        purchasePrice.innerText = (price.unitAmount / 100) + " " + price.currency;
                    })
                    
                })
                purchaseHistory.append(purchaseHeader, purchaseimg, purchasePrice);
            });
        }

        leftColumn.append(accountDetails, editBtnDiv, purchaseHistory);

        const rightColumnDiv = document.createElement("div");
        rightColumnDiv.style.width = "45%";
        rightColumnDiv.style.padding = "0 20px 0 0";
        const subscribedHeader = document.createElement("h2");
        subscribedHeader.innerText = "Subscription";
        subscribedHeader.style.width = "100%";
        subscribedHeader.style.textAlign = "center";
        subscribedHeader.style.padding = "10px 0 10px 0";
        subscribedHeader.style.backgroundColor = greyBackground;
        rightColumnDiv.appendChild(subscribedHeader);

        const subscribedPodcastsDiv = document.createElement("div");
        if (user.subscribed != "Not subscribed") {
            await fetch ("http://localhost:8080/api/customer/stripe/get-all-products") 
        .then(res => res.json())
        .then(products => {

            products.data.reverse();
            
            products.data.forEach(async element => {
                
                let productName = element.name.substring(0, 9);

                if (productName == "Podcast #") {
                    const paidEpisodeDiv = document.createElement("div");
                    paidEpisodeDiv.style.width = "100%";
                    paidEpisodeDiv.style.textAlign = "center";
                    paidEpisodeDiv.style.padding = "10px 0 10px 0";
                    paidEpisodeDiv.style.margin = "10px 30px 10px 0";
                    const paidEpisodeDivHeader = document.createElement("div");
                    paidEpisodeDivHeader.style.backgroundColor = greyBackground;
                    const paidEpisodeDivHeaderText = document.createElement("h3");
                    paidEpisodeDivHeaderText.innerText = element.name;
                    paidEpisodeDivHeaderText.style.padding = "10px 0 0 10px";
                    paidEpisodeDivHeader.appendChild(paidEpisodeDivHeaderText);
                    await fetch("http://localhost:8080/api/podcasts/get-podcast", {

                        method: "GET",
                        headers: {
                            "productId": element.id                   
                        }
                    }) 
                    .then(res => res.blob())
                    .then(podcasts => {
                        console.log(podcasts);
                        const audio = new Audio();
                        audio.src = URL.createObjectURL(podcasts);
                        audio.style.maxWidth = "100%";
                        audio.controls = true;
                        audio.style.width = "98%";
                        const episodeImg = document.createElement("img");
                        episodeImg.style.width = "98%";
                        episodeImg.style.marginLeft = "10px";
                        episodeImg.src = element.images[0];
                        paidEpisodeDivHeader.append(episodeImg, audio);
                    })
                    rightColumnDiv.appendChild(paidEpisodeDivHeader);
                }
            })
        })
        } else {
            const subscribedPodcastsDivHeader = document.createElement("h2");
            subscribedPodcastsDivHeader.innerText = "You are not subscribed";
            subscribedPodcastsDivHeader.style.backgroundColor = greyBackground;
            subscribedPodcastsDivHeader.style.textAlign = "center";
            subscribedPodcastsDiv.appendChild(subscribedPodcastsDivHeader);
            rightColumnDiv.appendChild(subscribedPodcastsDiv);
        }
        contentDiv.append(leftColumn, rightColumnDiv);

        editBtn.addEventListener("click", () => {

            emailRowRight.innerHTML = "";
            const email = document.createElement("input");
            email.value = user.email;
            emailRowRight.appendChild(email);

            passwordRowRight.innerHTML = "";
            const oldPassword = document.createElement("input");
            oldPassword.placeholder = "Current Password";
            oldPassword.type = "password";
            oldPassword.style.display = "block";
            oldPassword.style.marginBottom = "5px";
            
            const newPassword = document.createElement("input");
            newPassword.placeholder = "New Password";
            newPassword.type = "password";
            newPassword.style.display = "block";
            newPassword.style.marginBottom = "5px";

            const repeatPassword = document.createElement("input");
            repeatPassword.placeholder = "Repeat New Password";
            repeatPassword.type = "password";
            repeatPassword.style.display = "block";
            repeatPassword.style.marginBottom = "5px";
            passwordRowRight.append(oldPassword, newPassword, repeatPassword);

            editBtnDiv.innerHTML = "";
            const confirmEditBtn = document.createElement("button");
            confirmEditBtn.type = "button";
            confirmEditBtn.innerText = "Confirm Changes";
            editBtnDiv.appendChild(confirmEditBtn);
            confirmEditBtn.addEventListener("click", () => confirmEditBtnEventListener(user, user.firstName, user.lastName, user.username, email.value, oldPassword.value, newPassword.value, repeatPassword.value));
        })

        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete Account";
        deleteBtn.style.marginLeft = "15px";
        editBtnDiv.appendChild(deleteBtn);

        deleteBtn.addEventListener("click", async () => {

            const confirmationDialog = document.createElement("dialog");
            confirmationDialog.style.textAlign = "center";

            const confirmationDialogHeader = document.createElement("h2");
            confirmationDialogHeader.innerText = "Enter Your Password";

            const confirmationDialogInput = document.createElement("input");
            confirmationDialogInput.type = "password";
            confirmationDialogInput.style.display = "block";
            confirmationDialogInput.style.marginBottom = "10px";
            
            const confirmButton = document.createElement("button");
            confirmButton.innerText = "Confirm";
            confirmButton.style.borderRadius = "15px";
            confirmButton.style.border = "none";
            confirmButton.style.marginBottom = "5px";
            confirmButton.style.marginRight = "5px";
            confirmButton.style.fontSize = "Large"; 
            confirmButton.style.padding = "10px";
            confirmButton.style.cursor = "pointer";
            confirmButton.addEventListener("click", async () => {
                
                const userConfirmation = window.confirm("Are you sure? You will lose all your purchased episodes!!");

                if(userConfirmation) {
                    await fetch("http://localhost:8080/api/user/delete-user-account", {
                        method: "DELETE",
                        headers: {
                            "Content-type": "application/json",
                            "username": user.username,
                            "password": confirmationDialogInput.value
                        }
                    }).then(res => res.text())
                    .then(data => {
                        console.log(data);
                        confirmationDialog.removeAttribute("open");
                        loadHomePage();
                    })
                } 
                
            })
            confirmButton.addEventListener("mouseenter", () => {
                confirmButton.style.backgroundColor = "grey";
            })
            
            confirmButton.addEventListener("mouseleave", () => {
                confirmButton.style.backgroundColor = "";
            })
            
            const cancelButton = document.createElement("button");
            cancelButton.innerText = "Cancel";
            cancelButton.style.borderRadius = "15px";
            cancelButton.style.border = "none";
            cancelButton.style.marginBottom = "5px";
            cancelButton.style.fontSize = "Large"; 
            cancelButton.style.padding = "10px";
            cancelButton.style.cursor = "pointer";
            cancelButton.addEventListener("click", () => {
                confirmationDialog.removeAttribute("open");
            })
            cancelButton.addEventListener("mouseenter", () => {
                cancelButton.style.backgroundColor = "grey";
            })
            
            cancelButton.addEventListener("mouseleave", () => {
                cancelButton.style.backgroundColor = "";
            })
            

            confirmationDialog.append(confirmationDialogHeader, confirmationDialogInput, confirmButton, cancelButton);
            confirmationDialog.setAttribute("open", true);
            contentDiv.appendChild(confirmationDialog);

        })
    }

    async function confirmEditBtnEventListener(user, firstName, lastName, username, email, oldPassword, newPassword, repeatPassword) {

        if(newPassword == repeatPassword) {
            await fetch("http://localhost:8080/api/user/edit-user-account", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "username": username,
                    "password": oldPassword
                },
                body: JSON.stringify({
                    "username": username,
                    "firstName": firstName,
                    "lastName": lastName,
                    "email": email,
                    "password": newPassword
                })
            }).then(res => res.json())
            .then(user => {
                console.log(user);
                loadAccountPage(user);
            })
        } else {
            alert("Your new passwords didn't match!");
            loadAccountPage(user);
        }
    }

    async function loadLoginForm() {
        const loginDialog = document.createElement("dialog");
        loginDialog.style.textAlign = "center";

        const loginDialogHeader = document.createElement("h2");
        loginDialogHeader.innerText = "Log in to your account";
        loginDialogHeader.style.padding = "10px 0 10px 0";

        loginDialog.appendChild(loginDialogHeader);

        const usernameInput = document.createElement("input");
        usernameInput.placeholder = "Username";
        usernameInput.style.marginBottom = "10px";
        usernameInput.style.display = "block";

        const passwordInput = document.createElement("input");
        passwordInput.placeholder = "Password";
        passwordInput.style.marginBottom = "10px";
        passwordInput.style.display = "block";
        passwordInput.type = "password";

        const loginButton = document.createElement("button");
        loginButton.innerText = "Login";
        loginButton.style.borderRadius = "15px";
        loginButton.style.border = "none";
        loginButton.style.marginBottom = "5px";
        loginButton.style.marginRight = "5px";
        loginButton.style.fontSize = "Large"; 
        loginButton.style.padding = "10px";
        loginButton.style.cursor = "pointer";
        loginButton.addEventListener("click", async () => {

            await fetch("http://localhost:8080/api/user/login", {
                method: "GET",
                headers: {
                    "ContentType": "application/json",
                    "username": usernameInput.value,
                    "password": passwordInput.value
                }
            }).then(res => res.json())
            .then(user => {
                sessionStorage.setItem("userID", user.userId);
                loadAccountPage(user);
            })
        })
        loginButton.addEventListener("mouseenter", () => {
            loginButton.style.backgroundColor = "grey";
        })
        
        loginButton.addEventListener("mouseleave", () => {
            loginButton.style.backgroundColor = "";
        })
        
        const cancelButton = document.createElement("button");
        cancelButton.innerText = "Cancel";
        cancelButton.style.borderRadius = "15px";
        cancelButton.style.border = "none";
        cancelButton.style.marginBottom = "5px";
        cancelButton.style.fontSize = "Large"; 
        cancelButton.style.padding = "10px";
        cancelButton.style.cursor = "pointer";
        cancelButton.addEventListener("click", () => {
            loginDialog.removeAttribute("open");
        })
        cancelButton.addEventListener("mouseenter", () => {
            cancelButton.style.backgroundColor = "grey";
        })
        
        cancelButton.addEventListener("mouseleave", () => {
            cancelButton.style.backgroundColor = "";
        })
        
        loginDialog.append(usernameInput, passwordInput, loginButton, cancelButton);
        contentDiv.appendChild(loginDialog);
        loginDialog.setAttribute("open", true);


    }

    function isUUID(userId) {
        const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        return uuidPattern.test(userId);
    }

    async function subscribeBtnEventListener(user) {
        const paymentWindow = document.createElement("dialog");
        paymentWindow.style.color = "black";
        const paymentWindowHeader = document.createElement("h2");
        paymentWindowHeader.innerText = "You are about to purchase a subscription!";
        paymentWindow.appendChild(paymentWindowHeader);
        paymentWindow.setAttribute("open", true);
        window.scrollTo(top);
        const loginChoice = document.createElement("div");
        loginChoice.style.width = "100%";
        loginChoice.style.textAlign = "center";
        const loginChoiceHeader = document.createElement("h3");

        loginChoiceHeader.innerText = "You are logged in as " + user.username + "\nEnter your password to continue to purchase.";
        loginChoiceHeader.style.width = "100%";
        const password = document.createElement("input");
        password.type = "password";
        password.style.display = "block";
        const loginBtn = document.createElement("button");
        loginBtn.innerText = "Confirm";
        loginBtn.style.marginRight = "30px"
        loginChoice.append(loginChoiceHeader, password, loginBtn);
        paymentWindow.appendChild(loginChoice);

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
        paymentWindow.appendChild(cancelButton);
        loginBtn.addEventListener("click", () => subscribeEventListener(paymentWindow, loginChoice, password.value, user));

        contentDiv.appendChild(paymentWindow);
    }
    async function subscribeEventListener(paymentWindow, loginChoice, password, user) {
        loginChoice.innerHTML = "";
        const memberHeader = document.createElement("h3");
        memberHeader.innerText = "Member";
        const memberForm = document.createElement("form");
        memberForm.style.textAlign = "center";
        memberForm.style.display = "inline";
        const memberFormFirstName = document.createElement("h3");
        memberFormFirstName.innerText = user.firstName;
        memberFormFirstName.style.display = "block";
        const memberFormLastName = document.createElement("h3");
        memberFormLastName.innerText = user.lastName;
        memberFormLastName.style.display = "block";
        const memberFormEmail = document.createElement("h3");
        memberFormEmail.innerText = user.email;
        memberFormEmail.type = "email";
        memberFormEmail.style.display = "block";
        const memberFormAddress1 = document.createElement("input");
        memberFormAddress1.placeholder = "Address 1";
        memberFormAddress1.style.display = "block";
        memberFormAddress1.setAttribute("required", true);
        const memberFormAddress2 = document.createElement("input");
        memberFormAddress2.placeholder = "Address 2";
        memberFormAddress2.style.display = "block";
        const memberFormPostNumber = document.createElement("input");
        memberFormPostNumber.placeholder = "Post Number";
        memberFormPostNumber.style.display = "block";
        memberFormPostNumber.setAttribute("required", true);
        const memberFormCity = document.createElement("input");
        memberFormCity.placeholder = "City";
        memberFormCity.style.display = "block";
        memberFormCity.setAttribute("required", true);
        const submitBtn = document.createElement("button");
        submitBtn.type = "button";
        submitBtn.innerText = "Submit";
        
        memberForm.append(memberFormFirstName, memberFormLastName, memberFormEmail, memberFormAddress1, memberFormAddress2, memberFormPostNumber, memberFormCity, submitBtn);
        loginChoice.appendChild(memberForm);
        
        submitBtn.addEventListener("click", async (e) => {

            if(memberFormAddress1.value.trim() != "" && memberFormPostNumber.value.trim() != "" && memberFormCity.value.trim() != "") {

                e.preventDefault();
                loginChoice.innerHTML = "";
                let paymentElement = document.createElement("div");
                paymentElement.id = "paymentElement";
                loginChoice.appendChild(paymentElement);
                
                console.log(user.username, password, memberFormFirstName.innerText, memberFormLastName.innerText, memberFormEmail.innerText, 
                    memberFormAddress1.value, memberFormAddress2.value, memberFormPostNumber.value, memberFormCity.value);

                const {clientSecret} = await fetch("http://localhost:8080/api/customer/stripe/activate-subscription", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    "productId": "prod_PgRCdpWdFlXZyw",
                    "username": user.username,
                    "password": password
                },
                body : JSON.stringify ({
                    "firstName": memberFormFirstName.innerText,
                    "lastName": memberFormLastName.innerText,
                    "email": memberFormEmail.innerText,
                    "address1" : memberFormAddress1.value,
                    "address2": memberFormAddress2.value,
                    "postnumber": memberFormPostNumber.value,
                    "city": memberFormCity.value
                })
            }).then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return res.json();
            })
            .catch(error => {
                const errorMessage = document.createElement("h2");
                errorMessage.innerText = "All fields except 'Address 2' are required, including a valid email address.";
                loginChoice.appendChild(errorMessage);
            });
            
            console.log({clientSecret});
        
            const elements = stripe.elements({clientSecret});
            paymentElement = elements.create('payment');
            paymentElement.mount('#paymentElement');
        
            const paidEpisodeDivHeaderPrice = document.createElement("h2");

                    await fetch("http://localhost:8080/api/customer/stripe/get-product-price", {
                        method: "GET",
                        headers: {
                            "priceId": "price_1Or4KYG7YXGZMv5OBkzsK5KY"
                        }
                    }).then(res => res.json())
                    .then(price => {
                        console.log(price);
                        paidEpisodeDivHeaderPrice.innerText = (price.unitAmount / 100) + " " + price.currency;
                    })
            const payBtn = document.createElement("button");
            payBtn.innerText = "Confirm Payment";
            loginChoice.append(paidEpisodeDivHeaderPrice, payBtn);
    
            payBtn.addEventListener("click", async () => {
                
                console.log("click");
                const {error} = await stripe.confirmPayment({
                    elements,
                    confirmParams: {
                        return_url: `${window.location.origin}/successfulPurchase.html?success=true&productId=prod_PgRCdpWdFlXZyw`
                    }
                })
                if (error) {
                    const errorMessage = document.createElement("h2");
                errorMessage.innerText = "Something went wrong, please try again.";
                loginChoice.appendChild(errorMessage);
                } 
            })
            } else {
                const errorMessage = document.createElement("h2");
                alert("All fields except 'Address 2' are required, including a valid email address.");
                loginChoice.appendChild(errorMessage);
            }
        })
    }

    async function loadContactPage() {
        contentDiv.innerHTML = "";
        contentDiv.style.display = "flex";
        contentDiv.style.flexDirection = "row";
        contentDiv.style.flexWrap = "wrap";

        const contactPageHeader = document.createElement("h2");
        contactPageHeader.innerText = "Get In Touch";
        contactPageHeader.style.backgroundColor = greyBackground;
        contactPageHeader.style.padding = "10px 0 10px 0";
        contactPageHeader.style.textAlign = "center";
        contactPageHeader.style.width = "100%";
        contentDiv.appendChild(contactPageHeader);

        const emailsDiv = document.createElement("div");
        emailsDiv.style.width = "100%";
        emailsDiv.style.display = "flex";
        emailsDiv.style.flexDirection = "row";
        emailsDiv.style.flexWrap = "wrap";

        const emailLeft = document.createElement("div");
        emailLeft.style.width = "48%";
        emailLeft.style.margin = "10px 20px 10px 20px";
        emailLeft.style.textAlign = "center";
        emailLeft.style.backgroundColor = greyBackground;
        const emailLeftText = document.createElement("h2");
        emailLeftText.innerText = "Contact the Podcast: musingmusic@podcast.com";
        emailLeft.appendChild(emailLeftText);

        const emailRight = document.createElement("div");
        emailRight.style.width = "48%";
        emailRight.style.margin = "10px";
        emailRight.style.textAlign = "center";
        emailRight.style.backgroundColor = greyBackground;
        const emailRightText = document.createElement("h2");
        emailRightText.innerText = "Contact tech support: devteam@techsupport.com";
        emailRight.appendChild(emailRightText);

        emailsDiv.append(emailLeft, emailRight);
        contentDiv.appendChild(emailsDiv);

        const imgDiv = document.createElement("div");
        imgDiv.style.width = "100%";
        imgDiv.style.textAlign = "center";
        imgDiv.style.backgroundColor = greyBackground;
        imgDiv.style.padding = "20px";
        imgDiv.style.margin = "20px";
        const img = document.createElement("img");
        img.style.height = "400px";
        img.src = "resources/images/podcastLogo.png";
        imgDiv.appendChild(img);
        contentDiv.appendChild(imgDiv)

    }
})