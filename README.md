# Init TS Project

Este projeto é uma ferramenta de linha de comando para inicializar rapidamente projetos TypeScript, configurando automaticamente ESLint, Prettier, e um arquivo `tsconfig.json`.

## Características

- Criação rápida de um projeto TypeScript.
- Configurações padrão para ESLint e Prettier.
- Arquivo `tsconfig.json` pronto para uso.

## Requisitos

- Node.js (versão 12.x ou superior).

## Como Usar

Para criar um novo projeto TypeScript, execute o seguinte comando:

```sh
npx init-ts-project <nome-do-projeto>
```

Substitua `<nome-do-projeto>` pelo nome que você deseja para o seu projeto.

## Estrutura do Projeto

A estrutura inicial do projeto inclui:

- Pasta `src/` com um arquivo `index.ts`.
- Arquivo `.eslintrc.json` para configurações do ESLint.
- Arquivo `.prettierrc` para configurações do Prettier.
- Arquivo `tsconfig.json` para configurações do TypeScript.
- Arquivo `package.json` com scripts básicos de projeto.

## Personalização

Você pode personalizar as configurações de ESLint, Prettier e TypeScript editando os respectivos arquivos de configuração.

## Contribuições

Contribuições são bem-vindas. Para contribuir, crie uma issue ou envie um pull request.

## Licença

Este projeto é distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
