document.addEventListener("scroll", function() {
    var scrollPosition = window.scrollY;
    var button = document.getElementById('scrollToTopBtn');
    if (scrollPosition > 100) {
        button.style.display = 'block';
    } else {
        button.style.display = 'none';
    }
});

document.getElementById('scrollToTopBtn').addEventListener('click', function() {
    anime({
        targets: document.documentElement,
        scrollTop: 0,
        duration: 200,
        easing: 'easeInOutQuad'
    });
});

document.addEventListener('DOMContentLoaded', function() {
    fetch('./files/uqunscramble.c')
        .then(response => response.text())
        .then(text => {
            document.querySelector('.c_code').textContent = text;
            hljs.highlightElement(document.querySelector('.c_code'))
        })
        .catch(err => console.error('Failed to load file:', err));
    fetch('./files/rcvt.py')
        .then(response => response.text())
        .then(text => {
            document.querySelector('.python_code').textContent = text;
            hljs.highlightElement(document.querySelector('.python_code'))
        })
        .catch(err => console.error('Failed to load file:', err));
});
