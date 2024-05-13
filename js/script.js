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
