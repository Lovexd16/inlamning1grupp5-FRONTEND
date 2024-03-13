document.addEventListener("DOMContentLoaded", () => {
    
    const homeLink = document.getElementById("homeLink");
    const contentDiv = document.getElementById("contentDiv");
    const greyBackground = "rgba(211, 211, 211, 0.3)";
    
    homeLink.addEventListener("click", () => {
        window.location.href = "http://localhost:5501/index.html"
    })

    const url = new URLSearchParams(window.location.search);
    const success = url.get('success');
    const productId = url.get('productId');
    
    if (success == 'true') {
        console.log('Product ID:', productId);
        
        fetch("http://localhost:8080/api/podcasts/get-podcast", {
            method: "GET",
            headers: {
                "productId" : productId
            }
        }).then(res => res.blob())
        .then(blob => {
            const congratsHeader = document.createElement("h1");
            congratsHeader.innerText = "Congratulations!";
            congratsHeader.style.backgroundColor = greyBackground;
            congratsHeader.style.width = "100%";
            congratsHeader.style.textAlign = "center";
            congratsHeader.style.padding = "10px 0 10px 0";
            contentDiv.appendChild(congratsHeader);
            console.log(blob);
            const audio = new Audio();
            audio.src = URL.createObjectURL(blob);
            audio.style.maxWidth = "100%";
            audio.controls = true;
            audio.style.width = "50%";

            fetch("http://localhost:8080/api/customer/stripe/get-single-product", {
                method: "GET",
                headers: {
                    "productId" : productId
                }
            }).then(res => res.json())
            .then(product => {
                console.log(product);

                let productName = product.name.substring(0, 9);
                
                if (productName == "Podcast #") {
                    
                    const boughtPodcastDiv = document.createElement("div");
                    boughtPodcastDiv.style.textAlign = "center";
                    boughtPodcastDiv.width = "100%";
                    const boughtPodcastDivHeader = document.createElement("h2");
                    boughtPodcastDivHeader.innerText = "You now have access to " + product.name;
                    boughtPodcastDivHeader.style.width = "100%";
                    boughtPodcastDivHeader.style.textAlign = "center";
                    boughtPodcastDivHeader.style.backgroundColor = greyBackground;
                    boughtPodcastDivHeader.style.padding = "10px";
                    boughtPodcastDiv.appendChild(boughtPodcastDivHeader);
    
                    const boughtPodcastImageDiv = document.createElement("div");
                    boughtPodcastImageDiv.style.width = "100%";
                    boughtPodcastImageDiv.style.display = "flex";
                    boughtPodcastImageDiv.style.flexDirection = "column";
                    boughtPodcastImageDiv.style.flexWrap = "wrap";
                    boughtPodcastImageDiv.style.justifyContent = "space-around";
                    boughtPodcastImageDiv.style.backgroundColor = greyBackground;
                    boughtPodcastImageDiv.style.padding = "1% 0 1% 25%";
                    const boughtPodcastImage = document.createElement("img");
                    boughtPodcastImage.style.width = "51%";
                    boughtPodcastImage.style.paddingBottom = "10px";
                    boughtPodcastImage.src = product.images[0];
                    boughtPodcastImageDiv.append(boughtPodcastImage, audio);
                    boughtPodcastDiv.appendChild(boughtPodcastImageDiv);
    
                    const downloadWarningDiv = document.createElement("h3");
                    downloadWarningDiv.style.width = "100%";
                    downloadWarningDiv.style.padding = "10px";
                    downloadWarningDiv.style.textAlign = "center";
                    downloadWarningDiv.style.backgroundColor = greyBackground;
                    downloadWarningDiv.innerText = "**If you bought a podcast as a guest and want to keep it, please download the podcast here! If you bought a podcast as a member, it will now be available on your account page!**";
                    boughtPodcastDiv.appendChild(downloadWarningDiv);
    
                    const returnHome = document.createElement("button");
                    returnHome.innerText = "Return Home";
                    returnHome.style.display = "block";
                    returnHome.addEventListener("click", () => {
                        window.location.href = "http://localhost:5501";
                    })
    
                    downloadWarningDiv.appendChild(returnHome);
                    contentDiv.appendChild(boughtPodcastDiv);
                } else {
                    const boughtPodcastDiv = document.createElement("div");
                    boughtPodcastDiv.width = "100%";
                    const boughtPodcastDivHeader = document.createElement("h2");
                    boughtPodcastDivHeader.innerText = "You now have purchased  " + product.name;
                    boughtPodcastDivHeader.style.width = "100%";
                    boughtPodcastDivHeader.style.textAlign = "center";
                    boughtPodcastDivHeader.style.backgroundColor = greyBackground;
                    boughtPodcastDivHeader.style.padding = "10px";
                    boughtPodcastDiv.appendChild(boughtPodcastDivHeader);
    
                    const boughtPodcastImageDiv = document.createElement("div");
                    boughtPodcastImageDiv.style.width = "100%";
                    boughtPodcastImageDiv.style.backgroundColor = greyBackground;
                    boughtPodcastImageDiv.style.padding = "20px";
                    boughtPodcastImageDiv.style.textAlign = "center";
                    const boughtPodcastImage = document.createElement("img");
                    boughtPodcastImage.src = product.images[0];
                    boughtPodcastImageDiv.append(boughtPodcastImage);
                    boughtPodcastDiv.appendChild(boughtPodcastImageDiv);
    
                    const downloadWarningDiv = document.createElement("h3");
                    downloadWarningDiv.style.width = "100%";
                    downloadWarningDiv.style.padding = "10px";
                    downloadWarningDiv.style.textAlign = "center";
                    downloadWarningDiv.style.backgroundColor = greyBackground;
                    downloadWarningDiv.innerText = "Check your email for purchase confirmation and we will let you know as soon as your merch is on its way to you!";
                    boughtPodcastDiv.appendChild(downloadWarningDiv);
    
                    const returnHome = document.createElement("button");
                    returnHome.innerText = "Return Home";
                    returnHome.style.display = "block";
                    returnHome.addEventListener("click", () => {
                        window.location.href = "http://localhost:5501";
                    })
    
                    downloadWarningDiv.appendChild(returnHome);
                    contentDiv.appendChild(boughtPodcastDiv);
                }
            }) 
        })
    } else {
        console.log("Something went wrong");
    }
    

})