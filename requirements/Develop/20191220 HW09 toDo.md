# Unit 09 Node.js and ES6+ Homework: Developer Profile Generator

## Homework Startup

## Main tasks:

1. Set up application (initial .js File and npm modules)
2. Get Git Hub API information to get JSON Data from Git Hub for a users and repos
3. Design HTML page to display user profile information (Included in Developer folder).
4. Write code to ask questions to user (Inquirer)
5. Make API calls to get User info and Repo info. Pass that info into the "GenerateHtml" file (provided).
6. Generate PDF from the "HTML" information.


## Set up application (initial .js File and npm modules)
- Create the "package.json" file: npm init
- Install npm packages: npm install (to instal packages)
- Packages you need to get the app working:
    - axios
    - inquirer
    - electron **(version: electron@5.0.3)**
    - electron-html-to
    

- Require all packages at the top of your main js file.
- Import "generateHTML" file to have access to the function that creates the HTML content.

## Get Git Hub API information to get JSON Data from Git Hub for a users and repos

- Go to: https://developer.github.com/v3/guides/getting-started/
- Read documentation.
- Find out end point for getting "User" information and "Repos" information.

## Design HTML page to display user profile information (Included in Developer folder)

 If you like to change the design of the HTML file provided that will produce the PDF file:
- Use the "generateHtml.js file on the "Developer" folder as starting point.
- Make any changes.
- Edit code (if necessary) to display the information from the data that is coming as the argument (this might change depending on the information coming from the API).

## Write code to ask questions to user (Inquirer)

- Use inquirer to ask the user two questions:
    - Github Username (input)
    - Favorite Color (List with four colors - red, blue, green, pink)
- Get results and use for API call and generateHtml function.

## Make API calls to get User info and Repo info. Pass that info into the "GenerateHtml" file (provided).

- Use "axios" to make the API calls and get the data for the User and Repos.
- **The API for the USER will get you the user information.**
- **The API for the REPOS will get you the "stars" information.**
- Call the function generateHTML().
- Pass the User data into the generateHtml() function.
- Store the return of the generateHTML function into a variable.

## Generate PDF from the "HTML" information.

- Go to: https://www.npmjs.com/package/electron-html-to
- Read Documentation.
- Use their starting code and customize to your application to genererate a PDF from the "generateHTML" return.

## Issues that you may encounter:

- electron-html-to won't create PDF.

    ### Posible solutions:
    - change the version of the package to an earlier release.
    - try starting code on a separate file to make sure it works before copying into your app.

- How to link to google maps to show location..?
    - Just create a link to google maps places and pass the user's location like this:
        - https://www.google.com/maps/place/Orlando, Florida
        - https://www.google.com/maps/place/*${git Hub User Location}*