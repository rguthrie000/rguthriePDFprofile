//******************************************************************************
// rguthrie's Team Member Profile Summary - v1, 20200102
//******************************************************************************
//
// Requirements:
//
// * This application generates a resume as a PDF document.  The user is asked
//   to provide their GitHub username and to select one of 4 colors for the 
//   PDF background. 
//
// * The application uses the GitHub API for two separate queries to satisfy 
//   the full set of desired information.  This information is written to the 
//   file <username>.pdf, and includes:
//
//   - User name
//   - Profile image
//   - Links to the following:
//       - User location via Google Maps
//       - User GitHub profile (link)
//       - User blog
//   - User bio
//   - Number of public repositories
//   - Number of followers
//   - Number of GitHub stars
//   - Number of following users
//   
// * This application and the associated README are located in GitHub repository 
//   rguthrie000/rguthriePDFprofile.
//
//******************************************************************************
// Design:
// 
// Package electron-html-to is used to render an HTML page in PDF format.  The
// webpage layout and style therefore determine the look of the PDF Profile 
// Summary.


//***************
//*   Modules   *
//***************

const fs             = require('fs');
const inquirer       = require('inquirer');
const axios          = require('axios');
const electronHTMLto = require('electron-html-to');

//***************
//*   Globals   *
//***************

const debug = false;  // log to console when true

// The user is asked for a theme color, and given the following four choices.
// The color determines CSS values for use in generating the webpage.  
//
//      THE ORDER OF COLORS IN choiceArray MUST
//      MATCH THE ORDER OF COLORS IN themeColors!
//
const choiceArray = ["blue","green","pink","red"];
const themeColors = 
[
  {
    color             : "blue",
    wrapperBackground : "#5F64D3",
    headerBackground  : "#26175A",
    headerColor       : "white",
    photoBorderColor  : "#73448C"
  },
  {
    color             : "green",
    wrapperBackground : "#E6E1C3",
    headerBackground  : "#C1C72C",
    headerColor       : "black",
    photoBorderColor  : "black"
  },
  {
    color             : "pink",
    wrapperBackground : "#879CDF",
    headerBackground  : "#FF8374",
    headerColor       : "white",
    photoBorderColor  : "#FEE24C"
  },
  {
    color             : "red",
    wrapperBackground : "#DE9967",
    headerBackground  : "#870603",
    headerColor       : "white",
    photoBorderColor  : "white"
  }
];

//****************
//*   JS Entry   *
//****************

// The code uses async functions with promises. Nested functions are
// used to force the correct sequence. The code structure is:
//
//  inquirer prompts (async)
//      first axios inquiry (async)
//          second axios inquiry (async)
//              fill in HTML/CSS page
//              stream the as-drawn page to a PDF file (async)
//          end second axios inquiry
//      end first axios inquiry
//  end inquirer prompts

// Who's the user and what's their color choice?
inquirer.prompt
(
  [
    {
      type:    'input',
      message: 'What is your GitHub user name?',
      name:    'username'
    },
    {
      type:    'list',
      message: 'Which theme color for your Profile Summary?',
      name:    'themeColor',
      choices: choiceArray
    }
  ]
)
.then
(
  userInfo => 
  {
    // Show progress
    console.log(`Asking GitHub.com about \'${userInfo.username}\'`);

    if (debug) {console.log(userInfo);}

    // Get the user's GitHub profile
    axios(`https://api.github.com/users/${userInfo.username}`)
    .then
    (
      gitHubProfile =>
      {

        if (debug) {console.log(gitHubProfile);}
        
        // Stars are tracked by the associated repo.  Get the repos.
        axios(`https://api.github.com/users/${userInfo.username}/repos`)
        .then
        (
          gitHubRepos =>
          {
            if (debug) {console.log(gitHubRepos);}

            // Sum the stars across the repos
            let starsCount = 0;
            gitHubRepos.data.forEach(element => starsCount += element.stargazers_count);

            // We now have everything we need. Gather the Profile Summary content in one object.
            const details = 
            { 
              color     : choiceArray.indexOf(userInfo.themeColor), // note this is a number
              name      : gitHubProfile.data.login,
              photoUrl  : gitHubProfile.data.avatar_url,
              company   : gitHubProfile.data.company,
              location  : gitHubProfile.data.location,
              pageUrl   : gitHubProfile.data.html_url,
              blogUrl   : gitHubProfile.data.blog,
              bio       : gitHubProfile.data.bio,
              repos     : gitHubProfile.data.public_repos,
              followers : gitHubProfile.data.followers,
              stars     : starsCount,
              following : gitHubProfile.data.following
            };

            console.log(`Writing ${userInfo.username}.pdf - please stand by.`);

            if (debug) {console.log(details);}

            // Tailor the HTML page with these user particulars
            const htmlForPDF = generateHTML(details);

            if (debug) 
              {fs.writeFile(`${userInfo.username}.html`, htmlForPDF, err => {if (err) {console.log(err);}});}

            convertHtmlToPDF
            (
              {html: htmlForPDF}, 
              (err, result) => 
              {
                if (err) {console.log(err);}
                result.stream.pipe(fs.createWriteStream(`${userInfo.username}.pdf`));
                convertHtmlToPDF.kill();
                console.log(`Completed.  Look for ${userInfo.username}.pdf in this directory.`);
              }
            );
          } 
        )  // end of second axios query  
      } 
    )  // end of first axios query
  } 
);  // end of inquirer prompts

//*****************
//*   Functions   *
//*****************

// convertHtmlToPDF() is initialized to a PDF-from-HTML conversion function located in the electron-html-to module 
const convertHtmlToPDF = electronHTMLto({converterPath: electronHTMLto.converters.PDF, allowLocalFilesAccess: true});

// generateHTML() provides a string which is a valid HTML page.  The page becomes our Profile Summary when 
// the template literals have been filled using parameter 'data'.
const generateHTML = (data) => 
 `<!DOCTYPE html>
  <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" content="ie=edge" />
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
          <link href="https://fonts.googleapis.com/css?family=BioRhyme|Cabin&display=swap" rel="stylesheet">
          <title>Document</title>
          <style>
              @page {
                margin: 0;
              }
              *,
              *::after,
              *::before {
                box-sizing: border-box;
              }
              html, body {
                padding: 0;
                margin: 0;
              }
              html, body, .wrapper {
                height: 100%;
              }
            .wrapper {
                background-color: ${themeColors[data.color].wrapperBackground};
                padding-top: 100px;
              }
              body {
                background-color: white;
                -webkit-print-color-adjust: exact !important;
                font-family: 'Cabin', sans-serif;
              }
              main {
                background-color: #E9EDEE;
                height: auto;
                padding-top: 30px;
              }
              h1, h2, h3, h4, h5, h6 {
                font-family: 'BioRhyme', serif;
                margin: 0;
              }
              h1 {
                font-size: 3em;
              }
              h2 {
                font-size: 2.5em;
              }
              h3 {
                font-size: 2em;
              }
              h4 {
                font-size: 1.5em;
              }
              h5 {
                font-size: 1.3em;
              }
              h6 {
                font-size: 1.2em;
              }
              .photo-header {
                position: relative;
                margin: 0 auto;
                margin-bottom: -50px;
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                background-color: ${themeColors[data.color].headerBackground};
                color: ${themeColors[data.color].headerColor};
                padding: 10px;
                width: 95%;
                border-radius: 6px;
              }
              .photo-header img {
                width: 250px;
                height: 250px;
                border-radius: 50%;
                object-fit: cover;
                margin-top: -75px;
                border: 6px solid ${themeColors[data.color].photoBorderColor};
                box-shadow: rgba(0, 0, 0, 0.3) 4px 1px 20px 4px;
              }
              .photo-header h1, .photo-header h2 {
                width: 100%;
                text-align: center;
              }
              .photo-header h1 {
                margin-top: 10px;
              }
              .links-nav {
                width: 100%;
              text-align: center;
              padding: 20px 0;
              font-size: 1.1em;
              }
              .nav-link {
                display: inline-block;
                margin: 5px 10px;
              }
              .workExp-date {
                font-style: italic;
                font-size: .7em;
                text-align: right;
                margin-top: 10px;
              }
              .container {
                padding: 50px;
                padding-left: 100px;
                padding-right: 100px;
              }
              .row {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                margin-top: 20px;
                margin-bottom: 20px;
              }
              .card {
                padding: 20px;
                border-radius: 6px;
                background-color: ${themeColors[data.color].headerBackground};
                color: ${themeColors[data.color].headerColor};
                margin: 20px;
              }
              .col {
                flex: 1;
                text-align: center;
              }
              a, a:hover {
                text-decoration: none;
                color: inherit;
                font-weight: bold;
              }
              @media print { 
                body { 
                  zoom: .75; 
                } 
              }
          </style>
      </head>
      <body>
          <div class="wrapper">
            <div class="photo-header">
                <img src="${data.photoUrl}" alt="Photo of ${data.name}" />
                <h1>Hi!</h1>
                <h2>
                My name is ${data.name}!</h2>
                <h5>${data.company ? `Currently @ ${data.company}` : ""}</h5>
                <nav class="links-nav">
                  ${data.location 
                      ? `<a class="nav-link" target="_blank" rel="noopener noreferrer" 
                      href="https://www.google.com/maps/place/${data.location}"><i class="fas fa-location-arrow"></i>${data.location}</a>`
                      : ""}
                  <a class="nav-link" target="_blank" rel="noopener noreferrer" 
                      href="${data.pageUrl}"><i class="fab fa-github-alt"></i> GitHub</a>
                  ${data.blogUrl
                      ? `<a class="nav-link" target="_blank" rel="noopener noreferrer" href="${data.blogUrl}"><i class="fas fa-rss"></i> Blog</a>`
                      : ""}
                </nav>
            </div>
                <main>
                    <div class="container">
                        <div class="row">
                            <div class="col">
                                <h3>${data.bio ? `${data.bio}` : ""}</h3>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <div class="card">
                                    <h3>Public Repositories</h3>
                                    <h4>${data.repos}</h4>
                                </div>
                            </div>
                            <div class="col">
                                <div class="card">
                                    <h3>Followers</h3>
                                    <h4>${data.followers}</h4>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <div class="card">
                                    <h3>GitHub Stars</h3>
                                    <h4>${data.stars}</h4>
                              </div>
                            </div>
                            <div class="col">
                                <div class="card">
                                    <h3>Following</h3>
                                    <h4>${data.following}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
      </body>
  </html>`

