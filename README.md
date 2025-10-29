# Dashboard Financeiro

Uma aplicação completa de dashboard financeiro construída com React, TypeScript e Material-UI, projetada para ajudar usuários a acompanhar e gerenciar suas transações e metas financeiras.

## 🚀 Funcionalidades

- 📊 Gráficos financeiros interativos
- 💰 Gerenciamento e acompanhamento de transações
- 🎯 Visão geral das metas financeiras
- 📱 Design responsivo para todos os dispositivos
- 🔒 Autenticação de usuários
- 📋 Monitoramento de atividades recentes
- 🔍 Filtro e busca de transações
- 📄 Paginação para lista de transações

## 🛠️ Tecnologias Utilizadas

- **React** - Biblioteca frontend
- **TypeScript** - Tipagem e melhor experiência de desenvolvimento
- **Material-UI (MUI)** - Biblioteca de componentes
- **Recharts** - Biblioteca para visualização de dados
- **Vite** - Ferramenta de build e servidor de desenvolvimento
- **Tailwind CSS** - Framework CSS utilitário

## 📦 Instalação e Configuração

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js (versão 16 ou superior)
- npm (geralmente vem com Node.js)
- Git

### Passos para Instalação

1. Clone o repositório:

```bash
git clone [url-do-repositório]
cd Dashboard-financeiro
```

2. Instale as dependências:

```bash
npm install
```

3. Instale as dependências do Material-UI:

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### ⚠️ Observações Importantes

1. **Configuração do Ambiente**:

   - Certifique-se de que todas as dependências foram instaladas corretamente
   - Verifique se não há conflitos de versão entre pacotes

2. **Dados de Exemplo**:

   - A aplicação usa dados mockados do arquivo `transactions.json`
   - Para usar dados reais, será necessário configurar uma API

3. **Estilos e Temas**:

   - O projeto utiliza uma combinação de Material-UI e Tailwind CSS
   - Componentes com sufixo "Mui" são baseados no Material-UI
   - É possível alternar entre tema claro e escuro

4. **Performance**:
   - Os gráficos são renderizados usando Recharts
   - Paginação implementada para melhor performance com grandes volumes de dados

## 🏗️ Estrutura do Projeto

```
src/
├── assets/         # Arquivos estáticos
├── components/     # Componentes React
│   ├── DashboardContent.tsx
│   ├── GoalsOverview.tsx
│   ├── TransactionCharts.tsx
│   └── ...
├── entities/       # Definições de tipos
├── hooks/         # Hooks customizados
│   ├── useAuth.tsx
│   └── useFilters.tsx
├── utils/         # Funções utilitárias
└── App.tsx        # Componente principal
```

## 🎨 Componentes Principais

### Componentes Material-UI

- `HeaderMui` - Cabeçalho da aplicação com navegação
- `SummaryCardMui` - Cards de resumo financeiro
- `AddTransactionModalMui` - Modal para adicionar novas transações

### Componentes do Dashboard

- `DashboardPage` - Página principal do dashboard
- `TransactionsPage` - Gerenciamento de transações
- `TransactionCharts` - Visualização de dados financeiros
- `GoalsOverview` - Acompanhamento de metas financeiras
- `RecentActivity` - Lista de transações recentes

## 🔧 Arquivos de Configuração

O projeto utiliza vários arquivos de configuração:

- `vite.config.ts` - Configuração do Vite
- `tsconfig.json` - Configuração do TypeScript
- `postcss.config.js` - Configuração do PostCSS para Tailwind
- `eslint.config.js` - Configuração do ESLint

## 🚨 Solução de Problemas Comuns

1. **Erro de Instalação de Dependências**:

   ```bash
   npm cache clean --force
   npm install
   ```

2. **Conflitos de Versão**:

   - Verifique a compatibilidade das versões no `package.json`
   - Use `npm audit fix` se necessário

3. **Problemas com TypeScript**:
   - Execute `npm run type-check` para verificar erros de tipagem
   - Verifique se os arquivos `.d.ts` estão configurados corretamente

## 🔜 Melhorias Futuras para continuar o projeto

- [ ] Implementar integração com backend
- [ ] Adicionar opções avançadas de filtros
- [ ] Melhorar opções de visualização de dados
- [ ] Adicionar funcionalidade de exportação
- [ ] Implementar suporte a múltiplas moedas
- [ ] Adicionar recursos de planejamento orçamentário
- [ ] Melhorar acessibilidade da aplicação
- [ ] Realizar uma versão mobile mais responsiva e atrativa
