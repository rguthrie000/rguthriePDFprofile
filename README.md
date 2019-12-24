# rguthriePDFprofile - rguthrie's Team Member Profile Summary - v1, 20200102

This application generates a resume as a PDF document.  The user is asked
to provide their GitHub username and to select one of 4 colors for the 
PDF background. 

     * The application uses the GitHub API for two separate queries to satisfy 
       the full set of desired information.  This information is written to the 
       file <username>.pdf, and includes:

       - User name
       - Profile image
       - Links to the following:
           - User location via Google Maps
           - User GitHub profile (link)
           - User blog
       - User bio
       - Number of public repositories
       - Number of followers
       - Number of GitHub stars
       - Number of following users
   
     * This application and the associated README are located in GitHub repository 
       rguthrie000/rguthriePDFprofile.

Design:
 
Package electron-html-to is used to render an HTML page in PDF format.  The
webpage layout and style therefore determine the look of the PDF Profile 
Summary.

# Getting Started

This project is hosted on GitHub at https://rguthrie000.github.io/rguthriePDFprofile/
The JS file is located at repo rguthrie000/rguthriePDFprofile.  

### Prerequisites

Node.js is required to interpret/run this program.

### Installing

See file package.JSON for node.js package dependencies; these must be installed 
from npm in a location with visibility from the execution directory.

## Running the tests

The pdf Team Member Profile Summary is easily tested by comparing its output to
the information provided for a user on GitHub.

## Deployment

See Installing, above.

## This page was built with:
VS Code - Smart Editor for HTML and CSS
node.js - JavaScript command-line interpreter
Google Chrome - browser for display and test of the webpage template

## Versioning
GitHub is used for version control and hosts the website.

## Author
rguthrie000 (Richard Guthrie)

## Acknowledgments
rguthrie000 is grateful to the UCF Coding Bootcamp - we rock!

