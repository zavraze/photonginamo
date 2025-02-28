document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const captureButton = document.getElementById("capture");
    const downloadButton = document.getElementById("download");
    const countdownDisplay = document.getElementById("timer");
    const photoCounter = document.getElementById("counter");
    const pics = document.getElementById("pics");
    const bgColorPicker = document.getElementById("bgColor");
    const addate = document.getElementById("addate");
    // const blue = document.getElementById("blueButton");

    const capturedImage = document.getElementById("capturedImage");
    const capturedImage2 = document.getElementById("capturedImage2");
    const capturedImage3 = document.getElementById("capturedImage3");

    let capturedImages = JSON.parse(localStorage.getItem("capturedImages")) || [];

    // ✅ Save background color choice
    function getLuminance(hex) {
        const r = parseInt(hex.substr(1, 2), 16) / 255;
        const g = parseInt(hex.substr(3, 2), 16) / 255;
        const b = parseInt(hex.substr(5, 2), 16) / 255;
        return 0.299 * r + 0.587 * g + 0.114 * b;
    }

    function updateTextColor(bgColor) {
        const textColor = getLuminance(bgColor) < 0.5 ? "white" : "black";
        console.log("Text color set to:", textColor);
        document.getElementById("current-date").style.color = textColor;
        const previewCaption = document.getElementById("preview-caption");
        if (previewCaption) {
            previewCaption.style.color = textColor;
            previewCaption.innerText = "Photonginamo";
        }
        localStorage.setItem("textColor", textColor);
        return textColor;
    }


    if (bgColorPicker) {
        const storedBgColor = localStorage.getItem("bgColor");
        if (storedBgColor) {
            bgColorPicker.value = storedBgColor;
            document.getElementById("preview-container").style.backgroundColor = storedBgColor;
            updateTextColor(storedBgColor);
        }

        bgColorPicker.addEventListener("input", (event) => {
            const newColor = event.target.value;
            localStorage.setItem("bgColor", newColor);
            document.getElementById("preview-container").style.backgroundColor = newColor;
            updateTextColor(newColor);

            // const textColor = newColor === "#000000" ? "white" : "black";
            // document.getElementById("current-date").style.color = textColor;
            // document.getElementById("prevoew-caption").style.color = textColor;
        });
    }


    // blue theme button
    // if (blue) {
    //     blue.addEventListener("click", () => {
    //         const blueColor = "#00008B";
    //         const previewContainer = document.getElementById("preview-container");
    //         previewContainer.style.backgroundColor = blueColor;
    //         bgColorPicker.value = blueColor;
    //         localStorage.setItem("bgColor", blueColor);
    //     })
    // }
    
    // ✅ CAMERA SETUP (Only on Capture Page)
    if (document.getElementById("video")) {
        navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((error) => {
                console.error("Error accessing camera: ", error);
            });
            
            async function captureImage(targetImage, index) {
                await countdown(3); // Countdown before capturing
                
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const context = canvas.getContext("2d");
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        
                    // Mirror image effect
                    context.translate(canvas.width, 0);
                    context.scale(-1, 1);
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    
                    // Convert to image and display
                    const imageData = canvas.toDataURL("image/png");
                    targetImage.src = imageData;
                    capturedImages.push(imageData);
                    
                    localStorage.setItem("capturedImages", JSON.stringify(capturedImages)); // ✅ Save images to LocalStorage
                    
                    pics.style.display = "flex";
                    photoCounter.style.display = "block";
                    photoCounter.innerText = `${index}/3`;
                    
                    resolve();
                }, 1000);
            });
        }
        
        function countdown(seconds) {
            return new Promise((resolve) => {
                let count = seconds;
                countdownDisplay.style.display = "block"; // Show countdown
                countdownDisplay.innerText = count;
                
                const interval = setInterval(() => {
                    count--;
                    if (count > 0) {
                        countdownDisplay.innerText = count;
                    } else {
                        clearInterval(interval);
                        
                        setTimeout(() => {
                            countdownDisplay.style.display = "none"; // Hide after capture
                            countdownDisplay.innerText = ""; // Reset for next capture
                        }, 500);
                        
                        resolve();
                    }
                }, 1000);
            });
        }
        
        // ✅ Capture Image Button
        captureButton.addEventListener("click", async () => {
            capturedImages = []; // Reset stored images
            capturedImage.src = "";
            capturedImage2.src = "";
            capturedImage3.src = "";
            
            await captureImage(capturedImage, 1);
            await captureImage(capturedImage2, 2);
            await captureImage(capturedImage3, 3);
        });
    }
    
    // ✅ DOWNLOAD FUNCTION (Only on Download Page)
    if (document.getElementById("canvas")) {

        // ✅ Get stored background color
        const capturedImages = JSON.parse(localStorage.getItem("capturedImages")) || [];
        const selectedColor = localStorage.getItem("bgColor") || "#ffffff";
        // const bgColorPicker = document.getElementById("bgColor");
        
        
        // Set the preview container background color
        const previewContainer = document.getElementById("preview-container");
        previewContainer.style.backgroundColor = selectedColor;
        // bgColorPicker.value = selectedColor;
        updateTextColor(selectedColor);
        
        // function updatedTextColor(color) {
        //     // const isDark = getLuminance(color) < 0.5;
        //     // const textColor = isDark ? "white" : "black";
        //     // const dateDisplay = document.getElementById("current-date");
        //     // dateDisplay.style.color = textColor;
            
            
        //     const previewCaption = document.getElementById("preview-caption");
        //     if (previewCaption) {
        //         previewCaption.style.color = textColor;
        //         previewCaption.innerText = "Photonginamo";
        //     }
        // }
        
        // function getLuminance(hex) {
        //     const r = parseInt(hex.substr(1, 2), 16) / 255;
        //     const g = parseInt(hex.substr(3, 2), 16) / 255;
        //     const b = parseInt(hex.substr(5, 2), 16) / 255;
        //     return 0.299 * r + 0.587 * g + 0.114 * b;
        // }
        
        
        // bgColorPicker.addEventListener("input", (event) => {
        //     const newColor = event.target.value;
        //     previewContainer.style.backgroundColor = newColor;
        //     localStorage.setItem("bgColor", newColor);
            
        //     updateTextColor(newColor);
        // });

        const colorButtons = [
            { id: "blueButton", color: "#00008B"},
            { id: "pinkButton", color: "#FAE6FA" },
            { id: "blackButton", color: "#000000" },
            { id: "whiteButton", color: "#FFFFFF" },
            { id: "peachButton", color: "#FFCCCC" },
            { id: "purpleButton", color: "#B66CE3" }
        ];

        colorButtons.forEach(({ id, color}) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener("click", () => {
                    previewContainer.style.backgroundColor = color;
                    bgColorPicker.value = color;
                    localStorage.setItem("bgColor", color);

                    updateTextColor(color);
                });
            }
        });
        
        let today = new Date();
        
        let fortmattedDate = today.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric"
        });
        
        const dateDisplay = document.getElementById("current-date");
        dateDisplay.textContent = fortmattedDate;
        // document.getElementById("current-date").textContent = fortmattedDate;

        if (capturedImages.length === 3) {
            document.getElementById("preview1").src = capturedImages[0];
            document.getElementById("preview2").src = capturedImages[1];
            document.getElementById("preview3").src = capturedImages[2];
        } else {
            alert("No images found!");
        }

        //save checkbox state in localstorage
        addate.addEventListener("change", () => {
            localStorage.setItem("showDate", addate.checked);
            dateDisplay.style.display = addate.checked ? "block" : "none";
        });
    
        // ✅ Load checkbox state from localStorage
        const showDate = localStorage.getItem("showDate") === "true";
        addate.checked = showDate;
        dateDisplay.style.display = showDate ? "block" : "none";

        downloadButton.addEventListener("click", async () => {
            if (capturedImages.length < 3) {
                alert("Please take 3 pictures before downloading!");
                return;
            }

            const context = canvas.getContext("2d");
            const imgWidth = 640;
            const imgHeight = 480;
            const spacing = 30;
            const border = 60;
            const extraBottomSpace = 150;

            // get latest background color
            const selectedColor = localStorage.getItem("bgColor") || "#ffffff";
            const textColor = updateTextColor(selectedColor);

            console.log("Using text color:", textColor);


            // ✅ Get current date
            const currentDate = new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric"
            });

            // ✅ Set canvas size
            canvas.width = imgWidth + border * 2;
            canvas.height = imgHeight * 3 + spacing * 2 + border * 2 + extraBottomSpace;

            // ✅ Fill background with stored color
            context.fillStyle = selectedColor;
            context.fillRect(0, 0, canvas.width, canvas.height);

            // ✅ Draw images with black borders
            async function drawImage(imageSrc, i) {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = imageSrc;
                    img.onload = () => {
                        let yPos = border + i * (imgHeight + spacing);

                        // context.fillStyle = "black";
                        context.fillRect(border - 5, yPos - 5, imgWidth + 10, imgHeight + 10);

                        context.drawImage(img, border, yPos, imgWidth, imgHeight);
                        resolve();
                    };
                });
            }

            // ✅ Load and draw all images
            for (let i = 0; i < 3; i++) {
                await drawImage(capturedImages[i], i);
            }

            // ✅ Add caption and date
            const captionY = canvas.height - extraBottomSpace + 40;
            const dateY = captionY + 60;

            // const textColor = localStorage.getItem("textColor") || "black";
            context.fillStyle = textColor;
            context.font = "bold 45px Arial";
            context.textAlign = "center";
            context.fillText("Photonginamo", canvas.width / 2, captionY);

            if (addate.checked) {
                context.font = "40px Arial";
                context.fillText(currentDate, canvas.width / 2, dateY);
            }

            // ✅ Convert to image and download
            setTimeout(() => {
                const finalImage = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = finalImage;
                link.download = "Photobooth.png";
                link.click();
            }, 500);
        });
    }
});
