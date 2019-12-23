//******************************************************************************
// rguthrie Team Member Profile Summary - v1, 20200102
//******************************************************************************
//
// Requirements:
//
// * This application generates a resume as a PDF document.  The user is asked
//   to provide their GitHub username and to select one of 16 colors for the 
//   PDF background. 
//
// * The application uses the GitHub username to scrape relevant information.
//   This information is written to the file <username>.pdf, and includes:
//
//   - Profile image
//   - User name
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
// * This application and associated README are located in GitHub repository 
//   rguthrie000/rguthriePDFprofile.
//
//******************************************************************************

const inquirer = require('inquirer');
const axios = require('axios');
const electron = require('electron');
const electronHTMLto = require('electron-html-to');
const generateHtml = require('./generateHtml');

inquirer.prompt
(
  [
    {
      type:    'input',
      message: 'What is your GitHub user name?',
      name:    'user'
    },
    {
      type:    'list',
      message: 'Which theme color for your Profile Summary?',
      name:    'themeColor',
      choices: 
      [
        "Green",
        "Blue",
        "Red",
        "Pink"
      ]
    }
  ]
)
.then
(
    response => 
    {
        // illegal characters (covers FAT32, NTFS MacOS-HFS)
        //0x00-0x1F 0x7F " * / : < > ? \ | + , . ; = [ ] 

        // query GitHub

        // format 

        // write
        axios(`https://api.github.com/users/${response.username}`)
        .then(function(data)
        {
          console.log(data);

          const objInfo = { color:response.themeColor, stars: stargazers_count } = data;

          const htmlForPDF = generateHtml(objInfo);
    
          const fs = require('fs');

          fs.readFile('index.html', 'utf8', (err, htmlForPDF) => {
          // add local path in case your HTML has relative paths
          htmlForPDF = htmlForPDF.replace(/href="|src="/g, match => {
            return match + 'file://path/to/you/base/public/directory';
          });
          const conversion = electronHTMLto({
            converterPath: electronHTMLto.converters.PDF,
            allowLocalFilesAccess: true
          });
          conversion({ html: htmlForPDF }, (err, result) => {
            if (err) return console.error(err);
            result.stream.pipe(fs.createWriteStream(`${}.pdf`));
            conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
          });
});
    }
);


