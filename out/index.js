#!/usr/bin/env node
import fs from 'fs';
import inquirer from 'inquirer';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
async function getProjectDetails() {
    const projectName = process.argv[2] ||
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
function createProjectStructure(projectName) {
    const projectPath = path.join(process.cwd(), projectName);
    if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath, { recursive: true });
    }
    const templatesDir = path.join(__dirname, '..', 'templates');
    const filesToCopy = fs.readdirSync(templatesDir);
    filesToCopy.forEach((file) => {
        const content = fs
            .readFileSync(path.join(templatesDir, file), 'utf8')
            .replace('{{projectName}}', projectName);
        fs.writeFileSync(path.join(projectPath, file), content);
    });
    const srcPath = path.join(projectPath, 'src');
    if (!fs.existsSync(srcPath)) {
        fs.mkdirSync(srcPath, { recursive: true });
    }
    fs.writeFileSync(path.join(srcPath, 'index.ts'), "console.log('Hello, TypeScript!');\n");
}
async function init() {
    const projectName = await getProjectDetails();
    createProjectStructure(projectName);
    console.log(`Projeto ${projectName} configurado com sucesso!`);
    console.log(` cd ${projectName}`);
    console.log(` npm install`);
}
init();
