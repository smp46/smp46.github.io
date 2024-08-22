// Add a listener for the scroll event, when scroll 
// event occurrs check if screen pos is above 250 pixels, if so
// show the scroll to top button, otherwise hide it
document.addEventListener("scroll", function() {
    // Get current vertical scroll coordinate
    var scrollPosition = window.scrollY;
    // Get the button element once
    var button = document.getElementById('scrollToTopBtn');
    // If the scroll position is greater than 250, display the button, otherwise hide it
    if (scrollPosition > 250) {
        button.style.display = 'block';
    } else {
        button.style.display = 'none';
    }
});

// Add a listener to the scroll to top button, when clicked 
// use anime to scroll to the top of the page smoothly
document.getElementById('scrollToTopBtn').addEventListener('click', function() {
    // Use the anime function (from animejs) to animate scroll
    anime({
        // Scroll the entire webpage
        targets: document.documentElement,
        // Very top of the page
        scrollTop: 0,
        // Scroll over 200ms to make it look smooth
        duration: 200,
    });
});

// Add a listener that triggers after page is ready (fully loaded),
// use the fetch function to load the content of the code files
// then load the text to the code classes and call the highlight.js
// plugin for syntax highlighting.
//
// REF: Used a combination of the two sources below to put this together:
// https://byby.dev/js-fetch-get-response-body
// https://medium.com/@hizacharylee/simplify-syntax-highlighting-with-highlight-js-b65af3bdc509
document.addEventListener("readystatechange", function(event) {
    // If page is ready/loaded
    if(event.target.readyState == "interactive") {
        // Fetch the content of the code files
        fetch('./files/uqunscramble.c')
            // Use response.text to get the code as plain text
            .then(response => response.text())
            .then(text => {
                // Assign the content of the file to the code class
                document.querySelector('.c_code').textContent = text;
                // Call the highlight.js plugin to highlight the code
                hljs.highlightElement(document.querySelector('.c_code'))
            })
        // Repeat the same process for each python code file
        fetch('./files/rcvt.py')
            .then(response => response.text())
            .then(text => {
                document.querySelector('.python_code0').textContent = text;
                hljs.highlightElement(document.querySelector('.python_code0'))
            })
        fetch('./files/binaryTrainer.py')
            .then(response => response.text())
            .then(text => {
                document.querySelector('.python_code1').textContent = text;
                hljs.highlightElement(document.querySelector('.python_code1'))
            })
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const rightGif = document.getElementById('right-gif');
    const leftGif = document.getElementById('left-gif');
    const finalImage = document.getElementById('final-image');

    // Configurable variables
    const animationDuration = 2.4; // Duration in seconds (matches GIF duration)
    const centerAlignment = 25; // Adjust this value to change the final center alignment in px
    const fadeDuration = 0.5; // Duration of the fade-in effect in seconds

    // Function to force GIF reset by adding a unique query string
    function resetGif(gifElement) {
        const src = gifElement.getAttribute('src');
        gifElement.setAttribute('src', `${src}?${new Date().getTime()}`);
    }

    // Reset the GIFs on page load
    resetGif(leftGif);
    resetGif(rightGif);

    // Function to calculate and set the dynamic translation based on screen width
    function animateRightGif() {
        const screenWidth = window.innerWidth; // Get screen width
        const containerWidth = document.querySelector('.character-container').offsetWidth;

        const startX = screenWidth * 0.3; // Start 75% across the screen minus half the width of the GIF
        const endX = screenWidth / 2 - containerWidth / 2 + centerAlignment; // End at the center plus the alignment offset

        rightGif.style.transition = `transform ${animationDuration}s ease-in-out`;
        rightGif.style.transform = `translateX(-${startX - endX}px)`; // Move from startX to endX

        // Use setTimeout to wait for the animation to finish before hiding GIFs and showing the final image
        setTimeout(function() {
            leftGif.style.display = 'none';
            rightGif.style.display = 'none';

            // Display the final image and start the fade-in effect
            finalImage.style.display = 'block';
            setTimeout(function() {
                finalImage.style.opacity = 1; // Fade in the final image
            }, 200); // Small delay to ensure the display change is applied before the opacity change
        }, animationDuration * 1000); // Multiply by 1000 to convert seconds to milliseconds
    }

    // Start the animation when the page loads
    animateRightGif();
});

