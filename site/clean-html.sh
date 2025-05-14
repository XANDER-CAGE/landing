#!/bin/bash
# Make a backup of the original file
cp index.html index.html.orig
# Remove the style block from the file
sed -i '' '/<\!-- Base Styles -->/,/<\/style>/d' index.html 