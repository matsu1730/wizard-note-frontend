# Wizard Note Frontend

Frontend em **React + TypeScript** para o projeto **Wizard Note**, construído com **Vite** e configurado para desenvolvimento rápido com HMR e ESLint. [web:0]

## Tecnologias

- React 18 + Hooks [web:0]
- TypeScript [web:0]
- Vite (dev server, bundler e HMR) [web:0]
- ESLint configurado para TypeScript e React [web:0]

## Pré-requisitos

- Node.js LTS (ex.: 20.x)
- npm, pnpm ou yarn instalado globalmente

## Como rodar o projeto

instalar dependências
```
npm install
```
ambiente de desenvolvimento
```
npm run dev
```

build de produção
```
npm run build
```

preview do build de produção
```
npm run preview
```

lint
```
npm run lint
```

## Scripts disponíveis

| Script           | Descrição                                      |
|------------------|-----------------------------------------------|
| `npm run dev`    | Sobe o dev server do Vite com HMR. [web:0]    |
| `npm run build`  | Gera o bundle otimizado para produção. [web:0]|
| `npm run preview`| Serve localmente o build gerado. [web:0]      |
| `npm run lint`   | Executa verificação de código com ESLint. [web:0] |

## Estrutura do projeto

Alguns arquivos/pastas principais: [web:0]

- `src/` – código fonte React/TypeScript
- `public/` – assets públicos estáticos
- `index.html` – HTML raiz usado pelo Vite
- `vite.config.ts` – configuração do Vite
- `tsconfig*.json` – configurações do TypeScript
- `eslint.config.js` – configuração do ESLint

## Funcionalidades (em construção)

- Interface de anotações do projeto Wizard Note
- Melhorias de UI/UX e novas features planejadas

## TODO / Próximos passos

- Documentar variáveis de ambiente (se o frontend consumir APIs externas)
- Adicionar prints/screenshots da interface
- Especificar melhor o fluxo de uso do Wizard Note