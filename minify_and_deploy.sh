#!/bin/bash

# Check if necessary tools are installed
if ! command -v uglifyjs &> /dev/null; then
    echo "uglify-js could not be found. Please install it using npm."
    exit 1
fi

if ! command -v html-minifier-terser &> /dev/null; then
    echo "html-minifier-terser could not be found. Please install it using npm."
    exit 1
fi

if ! command -v npx &> /dev/null; then
    echo "npx could not be found. Please ensure npm is installed."
    exit 1
fi

# Stash any local changes
echo "Stashing local changes..."
git stash -u

# Create minified versions of the CSS files using postcss and cssnano
echo "Minifying CSS..."
npx postcss css/style.css -o css/style.min.css

# Create minified versions of the JS files
echo "Minifying JS..."
uglifyjs js/script.js -o js/script.min.js

# Minify the HTML file
echo "Minifying HTML..."
html-minifier-terser --collapse-whitespace --remove-comments --minify-css true --minify-js true -o index.min.html index.html

# Check if 'minified' branch exists
if git rev-parse --verify minified > /dev/null 2>&1; then
    echo "Switching to the 'minified' branch..."
    git checkout minified
else
    echo "'minified' branch does not exist. Creating and switching to 'minified' branch..."
    git checkout -b minified
fi

# Move the minified files to the correct locations
mv css/style.min.css css/style.css
mv js/script.min.js js/script.js
mv index.min.html index.html

# Commit and push changes to the 'minified' branch
echo "Committing changes..."
git add css/style.css js/script.js index.html
git commit -m "Automated minification of CSS, JS, and HTML"
git push origin minified

# Switch back to the master branch
echo "Switching back to the 'master' branch..."
git checkout master

# Apply the stash if there were changes
if git stash list | grep -q "WIP"; then
    echo "Applying stashed changes..."
    git stash pop
else
    echo "No stashed changes to apply."
fi

# Cleanup if necessary
echo "Cleaning up..."
rm -f css/style.min.css js/script.min.js index.min.html

echo "Minification and deployment to 'minified' branch complete!"

