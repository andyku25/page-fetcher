const request = require("request");
const fs = require("fs");
const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

const getArg = () => {
  const args = process.argv.slice(2);
  if (args.length !== 2) {
    console.log("Please enter 2 command line arguments of 1) String: HTTP_URL, 2) String: local file path './'");
    process.exit();
  }
  return args;
};

const fetcher = (args) => {
  // determine the url and localpath based on CLI arguments
  const url = args[0];
  const localPath = args[1];

  // DOWNLOAD BODY TO THE PATH
  request(url, (error, response, body) => {
    // BAD URL REQUEST
    if (error) {
      console.log("Not a valid URL input");
      process.exit(1);
    }

    // CHECK NON-200 RESULTS
    const statusCode = response.statusCode;
    if (statusCode !== 200) {
      console.log("request URL does not return status code 200");
      process.exit(1);
    }

    // Check if file already exists
    fs.readFile(localPath, (err) => {
      if (!err) {
        rl.question("Overwrite existing file in path? [yes]/[no]", (answer) => {
          if (answer.toLowerCase() === "yes") {
            // Write the file to as the 2nd CLI arg with the body of the request
            fs.writeFile(localPath, body, (err) => {
              // CHECK IF SAVE PATH IS VALID
              if (err) {
                console.log("Incorrect path");
                process.exit(1);
              } else {
                // Get file size
                const fileSize = response.headers["content-length"];
                console.log(`Downloaded and saved ${fileSize} bytes to ${localPath}`);
                process.exit(0);
              }
            });
          } else if (answer.toLowerCase() === "no") {
            console.log("File was not downloaded to the path");
            process.exit(1);
          }
        });
      } else {
        // Write the file to as the 2nd CLI arg with the body of the request
        fs.writeFile(localPath, body, (err) => {
          // CHECK IF SAVE PATH IS VALID
          if (err) {
            console.log("Incorrect path");
            process.exit(1);
          } else {
            // Get file size
            const fileSize = response.headers["content-length"];
            console.log(`Downloaded and saved ${fileSize} bytes to ${localPath}`);
            process.exit(0);
          }
        });
      }
    });
  });
};

fetcher(getArg());