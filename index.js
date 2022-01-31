#!/usr/bin/env node

import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import gradient from 'gradient-string';
import figlet from 'figlet';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';

let projectName;
const sleep = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));

async function initializeProject(){
    const projectTitle = chalkAnimation.karaoke('Initializing your Datoms Project...');

    await sleep(3000);
    projectTitle.stop();
}

async function getProjectName(){
    const inputName = await inquirer.prompt({
        type: 'input',
        name: 'project_name',
        message: 'Provide a name for your project?',
        default(){
            return 'datoms-webapp';
        },
    })
    
    projectName = inputName.project_name;


}

async function getProjectType(){
    const inputName = await inquirer.prompt({
        type: 'list',
        name: 'project_type',
        message: 'Select a project type: ',
        choices: [
            'Web App',
            'Storybook Library',
            'Backend Library',
            'Utility Library',
        ],
    })
    
    return setProjectType(inputName.project_type);
}

async function setProjectType(type){
    const loading = createSpinner('Creating project...').start();
    await sleep();

    loading.success({text : 'Project created successfully!'});
}

await initializeProject();
await getProjectName();
await setProjectType();