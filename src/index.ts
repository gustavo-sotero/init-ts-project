#!/usr/bin/env node

import { spawn } from 'child_process';

import fs from 'fs';
import inquirer from 'inquirer';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function getProjectDetails() {
  const projectName =
    process.argv[2] ||
    (await inquirer
      .prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'Qual é o nome do projeto?',
          default: 'typescript-project'
        }
      ])
      .then((answers) => answers.projectName));

  return projectName;
}

function executeCommand(
  command: string,
  directory?: string,
  print: boolean = true,
  args: string[] = []
): Promise<void> {
  return new Promise((resolve, reject) => {
    const options = {
      cwd: directory,
      stdio: print
        ? (['inherit', 'inherit', 'inherit'] as [
            'inherit',
            'inherit',
            'inherit'
          ])
        : (['ignore', 'ignore', 'ignore'] as ['ignore', 'ignore', 'ignore']),
      shell: true
    };

    const child = spawn(command, args, options);

    child.on('error', (error) => {
      console.error(`exec error: ${error}`);
      reject(error);
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

async function createProjectStructure(projectName: string) {
  try {
    const projectPath = path.join(process.cwd(), projectName);
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }

    await executeCommand('npm init -y', projectPath, false);

    await executeCommand(
      'npm install typescript @commitlint/cli @commitlint/config-conventional @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier eslint-plugin-prettier husky prettier tsx typescript jest ts-jest @jest/globals eslint-plugin-jest @types/jest @types/node',
      projectPath
    );

    await executeCommand('npm install commitizen -g', projectPath);

    await executeCommand(
      'commitizen init cz-conventional-changelog --save-dev --save-exact',
      projectPath
    );

    await executeCommand('npx husky init', projectPath);

    const templatesDir = path.join(__dirname, '..', 'templates');
    const templatesHuskyDir = path.join(__dirname, '..', 'husky-templates');
    const filesToCopy = fs.readdirSync(templatesDir);
    const filesHuskyToCopy = fs.readdirSync(templatesHuskyDir);

    filesToCopy.forEach((file) => {
      const srcFile = path.join(templatesDir, file);
      const destFile = path.join(projectPath, file);
      fs.copyFileSync(srcFile, destFile);
    });

    if (fs.existsSync(path.join(projectPath, '.gitignore'))) {
      fs.writeFileSync(
        path.join(projectPath, '.gitignore'),
        'node_modules/\nout/'
      );
    }

    filesHuskyToCopy.forEach((file) => {
      const srcFile = path.join(templatesHuskyDir, file);
      const destFile = path.join(projectPath, '.husky', file);
      fs.copyFileSync(srcFile, destFile);
    });

    await executeCommand('git init', projectPath);

    const scriptsFile = fs.readFileSync(
      path.join(projectPath, 'package.json'),
      {
        encoding: 'utf8'
      }
    );

    const jsonScriptsFile = JSON.parse(scriptsFile);
    jsonScriptsFile.scripts['dev'] = 'tsx --watch ./src/index.ts';
    jsonScriptsFile.scripts['test'] = 'jest';
    jsonScriptsFile.scripts['build'] = 'tsc';
    jsonScriptsFile.scripts['start'] = 'node ./out/index.js';

    fs.writeFileSync(
      path.join(projectPath, 'package.json'),
      JSON.stringify(jsonScriptsFile, null, 2)
    );

    const srcPath = path.join(projectPath, 'src');
    if (!fs.existsSync(srcPath)) {
      fs.mkdirSync(srcPath, { recursive: true });
    }
    fs.writeFileSync(
      path.join(srcPath, 'index.ts'),
      "console.log('Hello, TypeScript!');\n"
    );
  } catch (error) {
    console.error('Error executing command:', error);
  }
}

async function init() {
  const projectName = await getProjectDetails();
  await createProjectStructure(projectName);
  console.log(`\nProjeto ${projectName} configurado com sucesso!`);
  console.log(`cd ${projectName}`);
  console.log(`code .`);
}

init();
