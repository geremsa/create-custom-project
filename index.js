#!/usr/bin/env node

import fs from "fs";
import path from "path";
import util from "util";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import gradient from "gradient-string";
import figlet from "figlet";
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import { exec } from "child_process";

let projectName, projectPath, repo;
const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

async function runExecCommand(command) {
  try {
    const { stdout, stderr } = await util.promisify(exec)(command);
    console.log(stdout);
    console.log(stderr);
  } catch {
    (error) => {
      console.log("\x1b[31m", error, "\x1b[0m");
    };
  }
}

async function initializeProject() {
  const projectTitle = chalkAnimation.karaoke(
    "Initializing your Datoms Project..."
  );

  await sleep(3000);
  projectTitle.stop();
}

async function getProjectName() {
  const inputName = await inquirer.prompt({
    type: "input",
    name: "project_name",
    message: "Provide a name for your project?",
    default() {
      return "datoms-webapp";
    },
  });

  projectName = inputName.project_name;
  return validateProjectName(projectName);
}

async function validateProjectName(name) {
  const loading = createSpinner("Validating project name...").start();
  const currentPath = process.cwd();
  projectPath = path.join(currentPath, name);
  await sleep();
  try {
    fs.mkdirSync(projectPath);
    loading.success({ text: "Validated !!" });
  } catch (err) {
    if (err.code === "EEXIST") {
      loading.error({
        text: `The file ${chalk.redBright(
          name
        )} already exist in the current directory, please give it another name.`,
      });
    } else {
      console.log(err);
    }
    process.exit(1);
  }
}

//project type
async function getProjectType() {
  const inputName = await inquirer.prompt({
    type: "list",
    name: "project_type",
    message: "Select a project type: ",
    choices: [
      "Web App",
      "Storybook Library",
      "Backend Library",
      "Utility Library",
    ],
  });

  return validateProjectType(inputName.project_type);
}

async function validateProjectType(type) {
  const loading = createSpinner("Creating project...").start();
  if (type === "Web App") {
    repo = "https://github.com/geremsa/video-meeting-app.git";
  } else if (type === "Storybook Library") {
    repo = "https://github.com/geremsa/onetextaway-chat-app.git";
  } else {
    repo = "https://github.com/geremsa/gatsby-starter-default.git";
  }
  try {
    await cloneRemoteProject();
    console.clear();
    loading.success({ text: "Project created successfully!" });
    await finishOperation();
  } catch (err) {
    loading.error({ text: err });
    process.exit(1);
  }
}

async function cloneRemoteProject() {
  try {
    //console.log("\x1b[33m", "Downloading the project structure...", "\x1b[0m");
    await runExecCommand(`git clone --depth 1 ${repo} ${projectName}`);
    process.chdir(projectPath);

    // console.log("\x1b[34m", "Installing dependencies...", "\x1b[0m");
    //await runExecCommand("npm install");
  } catch (error) {
    console.log(error);
  }
}

async function finishOperation() {
  await figlet("DATOMS", (err, data) => {
    console.log(gradient.retro.multiline(data));
  });
  console.log(`
  ${chalk.blueBright('npm install')}
    Installs all dependencies.

  ${chalk.blueBright('npm start')}
    Starts the development server.

  ${chalk.blueBright('npm run build')}
    Builds the project for production.

  Get started by typing:

    ${chalk.blueBright('cd')} ${projectName}
    ${chalk.blueBright('npm install')}
    ${chalk.blueBright('npm start')}`);
}

await initializeProject();
await getProjectName();
await getProjectType();
