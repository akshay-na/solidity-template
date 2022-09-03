#!/usr/bin/env node

const { execSync } = require("child_process");
const readline = require("readline");

const runCommand = (command) => {
  try {
    execSync(`${command}`, { stdio: "inherit" });
  } catch (e) {
    console.error(`Failed to execute command: ${command}`, e);
    return false;
  }
  return true;
};

let gitCheckoutCommand;

const repoName = process.argv[2];

async function askQuestion() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(
      "\nPlease choose the template you want to use:\n\n1. Hardhat Template\n2. Truffle Template\n\nEnter your option: ",
      (ans) => {
        try {
          rl.close();
          resolve(parseInt(ans));
        } catch (e) {
          rl.close();
          console.error("Invalid option");
          init().then(() => {
            runScript();
          });
        }
      }
    )
  );
}

const init = async () => {
  const ans = await askQuestion();

  switch (ans) {
    case 1:
      gitCheckoutCommand = `git clone --depth 1 https://github.com/akshay-na/solidity-project-hardhat-template ${repoName}`;
      break;
    case 2:
      gitCheckoutCommand = `git clone --depth 1 https://github.com/akshay-na/solidity-project-truffle-template ${repoName}`;
      break;
    default:
      console.error("Invalid option");
      init().then(() => {
        runScript();
      });
  }
};

const runScript = () => {
  const installDepsCommand = `cd ${repoName} && npm install && rm -rf .git/`;

  console.log(`\nCloning a repository with name ${repoName}`);
  const checkedOut = runCommand(gitCheckoutCommand);
  if (!checkedOut) process.exit(-1);

  console.log(`\nInstalling dependencies for ${repoName}`);
  const installDeps = runCommand(installDepsCommand);
  if (!installDeps) process.exit(-1);

  console.log("\nCongratulations! The template is ready to use");
};

init().then(() => {
  runScript();
});
