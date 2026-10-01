# 📊 Business Plan Builder

> Aplicação web para criação, análise e gestão de planos de negócios — do guiamento inicial à análise de viabilidade financeira.

---

## 📖 Sobre o Projeto

O **Business Plan Builder** é uma aplicação web que orienta empreendedores, estudantes e consultores na elaboração de um plano de negócios, passando pela identificação da oportunidade, análise de ambientes, estruturação do plano, viabilidade financeira, planos complementares, exportação e revisão de gestão.

O projeto foi concebido para começar com uma arquitetura web simples e leve e evoluir gradualmente para persistência centralizada, autenticação, colaboração e recursos avançados.

### 🎯 Problema

Empreendedores, especialmente iniciantes, podem ter dificuldade para:

- Estruturar um plano de negócios de forma organizada
- Aplicar metodologias de análise como SWOT, PESTEL, Canvas e Porter
- Realizar cálculos de viabilidade como VPL, TIR, Payback e ROI
- Transformar uma ideia em um plano estruturado
- Revisar inconsistências antes de apresentar ou executar o projeto

### 💡 Solução

Uma ferramenta **guiada**, com formulários estruturados, cálculos automáticos, indicadores, validações, salvamento local, autenticação e integração progressiva com banco de dados.

### 👥 Público-Alvo

- Empreendedores iniciantes e experientes
- Estudantes de administração e gestão
- Consultores e incubadoras
- Instituições de ensino

---

## 🟢 Estado Atual do Projeto

O projeto já possui uma base funcional completa no frontend e iniciou a transição para uma arquitetura com autenticação e persistência centralizada.

### Implementado

- Frontend em **HTML5, CSS3 e JavaScript Vanilla**
- Módulos 1 a 7 implementados no frontend
- Navegação sequencial entre módulos
- Salvamento automático em LocalStorage
- Recuperação de rascunhos
- Validações e indicadores de progresso
- Neon Auth integrado ao Módulo 1
- PostgreSQL/Neon configurado
- Neon Data API integrada ao frontend
- Persistência centralizada dos Módulos 1 a 7 através da camada de sincronização
- Gerenciamento de múltiplos planos com seleção, criação e arquivamento
- Preservação do rascunho local durante a autenticação e sincronização
- RLS habilitado em todo o schema funcional, com autorização por usuário/espaço/plano
- Exportação para PDF via impressão do navegador
- Exportação compatível com Word em `.doc`
- Exportação tabular em CSV compatível com Excel
- Compartilhamento por link contendo uma cópia dos dados no próprio link
- Versionamento local de planos
- Painel de gestão do Módulo 7
- Deploy na Vercel configurado e utilizado para hospedagem
- CI com validação de sintaxe JavaScript e smoke test

### Em evolução

- Compartilhamento persistente com regras adicionais de acesso/expiração
- Colaboração entre usuários com permissões de membro mais granulares
- Testes de integração reais no navegador e cenários completos de RLS
- Evolução da experiência de gestão de múltiplos planos

### Planejado

- Assistência por IA integrada ao produto
- Templates por segmento
- Colaboração multiusuário com permissões
- Mobile/PWA
- Evolução da arquitetura caso a complexidade exija um backend ou framework adicional

---

## 🧩 Módulos Funcionais

### Módulo 1 — Identificação da Oportunidade

Inclui:

- Nome do negócio, problema, solução, público-alvo, localização e diferenciais
- Canvas de Proposta de Valor: trabalhos dos clientes, dores, ganhos, produtos/serviços, aliviadores de dores e criadores de ganhos
- Score de atratividade de 0 a 20
- Validação dos campos essenciais
- Contadores de caracteres
- Barra de conclusão e stepper
- Salvamento automático local e recuperação de rascunho
- Cadastro/login pelo Neon Auth
- Persistência no PostgreSQL/Neon através da Neon Data API

### Módulo 2 — Análise de Ambientes

Inclui:

- SWOT: forças, fraquezas, oportunidades e ameaças
- Inclusão, remoção e reorganização de itens SWOT
- PESTEL: político, econômico, social, tecnológico, ambiental e legal
- Cinco Forças de Porter, com intensidade e observações
- Salvamento local
- Recursos de navegação e interação acessíveis por teclado

> A interface e a persistência centralizada no Neon estão integradas pela camada de sincronização.

### Módulo 3 — Estrutura do Plano de Negócios

Possui 10 seções:

1. Sumário Executivo
2. Descrição da Empresa
3. Produtos e Serviços
4. Mercado e Concorrência
5. Marketing e Vendas
6. Plano Operacional
7. Gestão de Pessoas
8. Plano Financeiro
9. Análise Estratégica
10. Anexos

Inclui templates orientados, progresso por seção, navegação lateral, salvamento automático e assistência baseada em informações dos módulos anteriores sem sobrescrever conteúdo existente.

 > A persistência centralizada está integrada; o navegador mantém LocalStorage como camada de recuperação offline.

### Módulo 4 — Viabilidade Financeira

Entradas principais:

- Investimento inicial
- Custos fixos
- Custo variável unitário
- Preço unitário
- Demanda inicial
- Taxa de crescimento
- Horizonte de 12, 24, 36, 48 ou 60 meses
- Taxa de desconto

Calcula e apresenta receita, custos, lucro operacional, margem, ponto de equilíbrio, VPL, TIR, Payback, ROI, fluxo de caixa, gráficos e cenários pessimista, realista e otimista.

> Os cálculos continuam sendo executados no frontend e também têm suas entradas, cenários e projeções persistidos no Neon. A validação financeira profissional ainda depende de revisão e testes específicos.

### Módulo 5 — Planos Complementares

Possui cinco áreas:

- Marketing
- Operações
- Pessoas/RH
- Jurídico
- Tecnologia da Informação

Inclui campos estruturados, progresso por área, progresso geral, abas acessíveis por teclado, reaproveitamento de dados de módulos anteriores e salvamento local.

 > A persistência centralizada está integrada; o navegador mantém LocalStorage como camada de recuperação offline.

### Módulo 6 — Exportação e Compartilhamento

Atualmente permite:

- **PDF:** através da impressão do navegador e opção “Salvar como PDF”
- **Word:** arquivo HTML compatível com Word, salvo como `.doc`
- **Excel:** CSV compatível com Excel, não um arquivo `.xlsx` nativo
- **Compartilhamento:** link contendo uma cópia dos dados do plano codificada na URL
- **Versionamento:** até 10 versões armazenadas localmente no navegador
- Preview consolidado

> O compartilhamento atual não utiliza ainda a tabela `links_compartilhamento` do banco. A persistência de links e versões no servidor faz parte da evolução do projeto.

### Módulo 7 — Painel e Gestão

O painel atual apresenta:

- Progresso geral
- Módulos concluídos e iniciados
- Pendências
- Checklist de conclusão
- Alertas de inconsistências
- Próxima ação pelo fluxo
- Revisão dos principais dados

O Módulo 7 já é persistido no banco junto com progresso e alertas. A gestão de múltiplos planos agora possui seleção, criação e arquivamento; permissões avançadas de colaboração continuam em evolução.

---

## 🗄️ Banco de Dados — PostgreSQL / Neon

A estrutura de dados já foi preparada para suportar os módulos atuais e a evolução para colaboração e gestão.

### Usuários e espaços

- `usuarios_perfis`
- `espacos_trabalho`
- `membros_espaco_trabalho`

### Planos e Módulo 1

- `planos_negocio`
- `analises_oportunidade`
- `propostas_valor`

### Módulo 2

- `analises_ambientais`
- `itens_swot`
- `itens_pestel`
- `forcas_porter`

### Módulo 3

- `secoes_plano`

### Módulo 4

- `planos_financeiros`
- `cenarios_financeiros`
- `projecoes_financeiras`

### Módulo 5

- `planos_complementares`

### Módulo 6

- `versoes_plano`
- `links_compartilhamento`
- `exportacoes`

### Módulo 7

- `painel_gestao`
- `alertas_plano`
- `registros_atividade`

Existe também uma tabela de teste previamente existente chamada `playing_with_neon`, que não faz parte da arquitetura funcional do produto.

### Estado da persistência

A persistência centralizada já cobre os dados dos Módulos 1 a 7 por meio de `js/server-sync.js`. O LocalStorage continua sendo usado como camada de rascunho/recuperação local. A tabela `playing_with_neon` permanece isolada da arquitetura funcional.

---

## 🔐 Segurança e Controle de Acesso

A autenticação utiliza **Neon Auth**.

O banco utiliza **Row-Level Security (RLS)** para controlar o acesso aos dados atualmente integrados.

As políticas RLS estão habilitadas nas 21 tabelas funcionais públicas. A autorização considera identidade autenticada e relacionamento com espaço de trabalho/plano, usando funções `SECURITY DEFINER` para evitar recursão entre políticas.

A tabela de teste `playing_with_neon` permanece fora da arquitetura funcional e não recebe acesso da aplicação.

### Segredos

Nenhuma senha, chave privada ou string de conexão com credenciais deve ser armazenada no README ou no código público.

---

## 🏗️ Arquitetura Atual

A arquitetura atual é deliberadamente simples:

```text
Usuário
   ↓
Frontend HTML5 + CSS3 + JavaScript Vanilla
   ├── Neon Auth
   └── Neon Data API + RLS
              ↓
       PostgreSQL / Neon
```

A camada `js/server-sync.js` coordena persistência, recuperação, múltiplos planos, versões, compartilhamento, exportações e painel de gestão sem introduzir credenciais administrativas no navegador.

O frontend é hospedado na Vercel.

### O que ainda não existe

O projeto **não possui atualmente um backend tradicional próprio em Node.js, NestJS, FastAPI ou equivalente**. A Neon Data API é utilizada diretamente pelo frontend para a integração inicial.

Uma camada de backend poderá ser introduzida quando houver necessidade real de regras server-side mais complexas, processamento protegido, integrações externas, operações administrativas, colaboração avançada, jobs ou recursos de IA que exijam proteção de credenciais.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia atual |
|---|---|
| Estrutura | HTML5 |
| Estilos | CSS3 |
| Lógica | JavaScript Vanilla |
| Persistência local | LocalStorage |
| Autenticação | Neon Auth |
| Banco | PostgreSQL / Neon |
| API de dados | Neon Data API |
| Hospedagem | Vercel |
| Versionamento | Git / GitHub |

A integração do Neon é carregada pelo navegador através do pacote `@neondatabase/neon-js`.

---

## 🚀 Jornada do Usuário

O fluxo planejado e parcialmente implementado é:

1. Cadastro/login
2. Criação do plano
3. Identificação da oportunidade
4. Análise de ambientes
5. Estruturação do plano
6. Viabilidade financeira
7. Planos complementares
8. Exportação/compartilhamento
9. Revisão e gestão

Atualmente, a autenticação e a persistência centralizada estão integradas ao **Módulo 1**. Os módulos seguintes continuam funcionando principalmente com persistência local enquanto são integrados ao banco.

---

## 📋 Requisitos Funcionais

| ID | Requisito | Estado atual |
|---|---|---|
| RF01 | Criar e gerenciar múltiplos planos | 🟡 Estrutura preparada; interface completa em evolução |
| RF02 | Salvamento automático | 🟢 Implementado localmente |
| RF03 | Cálculos de VPL, TIR e Payback | 🟢 Implementado no frontend |
| RF04 | Gráficos de fluxo de caixa | 🟢 Implementado |
| RF05 | Exportação em PDF | 🟢 Implementado via navegador |
| RF06 | Templates por segmento | 🔵 Planejado |
| RF07 | Colaboração multiusuário | 🔵 Planejado |
| RF08 | Análise comparativa de cenários | 🟢 Implementado no Módulo 4 |
| RF09 | Geração assistida por IA | 🔵 Planejado |

---

## ⚙️ Requisitos Não Funcionais

- **Performance:** objetivo de evolução para carregamento rápido e experiência fluida
- **Segurança:** Neon Auth + RLS nas tabelas atualmente integradas
- **Privacidade:** arquitetura em evolução considerando requisitos aplicáveis da LGPD
- **Disponibilidade:** meta de produto, não resultado já medido
- **Usabilidade:** interface responsiva e com recursos de acessibilidade
- **Escalabilidade:** evolução gradual conforme necessidade real

> Métricas como 99,5% de disponibilidade, cobertura de testes e WCAG 2.1 AA devem ser tratadas como metas até que sejam formalmente medidas e validadas.

---

## 🖥️ Interface e Responsividade

A aplicação foi construída para funcionar em desktop, tablet e dispositivos móveis.

A interface possui menu responsivo, navegação por módulos, formulários adaptáveis, estados de progresso, feedback visual e elementos de foco para teclado.

A validação completa de responsividade e acessibilidade ainda faz parte do plano de testes.

---

## 🖼️ Wireframes e Estado das Telas

| Tela | Estado |
|---|---|
| Dashboard | 🟢 Painel M7 implementado; gerenciamento completo de múltiplos planos ainda em evolução |
| Wizard/Módulos | 🟢 Implementado |
| Financeiro | 🟢 Implementado |
| SWOT | 🟢 Implementado |
| Exportação | 🟢 Implementado |
| Autenticação | 🟢 Integrada ao Neon Auth |
| Gestão multiusuário | 🔵 Planejada |

---

## 📦 Execução Local

O projeto é um frontend web sem framework obrigatório de build.

```bash
git clone https://github.com/alair-code/plano-de-negocio.git
cd plano-de-negocio
```

Como o projeto utiliza módulos JavaScript ES e serviços externos, recomenda-se servir os arquivos por um servidor HTTP local em vez de abrir o `index.html` diretamente via `file://`.

Exemplo:

```bash
python3 -m http.server 8080
```

Depois, acesse `http://localhost:8080`.

> Configurações de autenticação e Data API usadas pelo frontend não devem conter credenciais administrativas.

---

## ☁️ Deploy

O projeto utiliza **Vercel** para hospedagem.

Fluxo recomendado:

```text
GitHub
  ↓
Branch de desenvolvimento/manutenção
  ↓
Validação
  ↓
main
  ↓
Vercel
```

As branches `main` e `manutencao` fazem parte do fluxo de trabalho. `manutencao` é usada para desenvolvimento e correções antes da promoção para `main`.

---

## 🗺️ Roadmap

| Fase | Status | Entregas |
|---|---|---|
| Frontend base | 🟢 Concluída | Estrutura da aplicação |
| Módulos 1–7 | 🟢 Implementados | Formulários, análises, cálculos, exportação e gestão |
| Neon Auth | 🟢 Inicialmente integrado | Autenticação no Módulo 1 |
| Persistência M1 | 🟢 Integrada | Neon Data API + RLS inicial |
| Persistência M2–M7 | 🟡 Em evolução | Integração progressiva |
| Segurança completa do schema | 🟡 Em evolução | Ampliação das políticas RLS |
| Múltiplos planos | 🟡 Em evolução | Gestão completa pela interface |
| Compartilhamento persistente | 🟡 Em evolução | Uso da estrutura de links do banco |
| Colaboração multiusuário | 🔵 Planejada | Espaços, membros e permissões |
| IA | 🔵 Planejada | Assistência inteligente integrada |
| Mobile/PWA | 🔵 Planejada | Evolução para dispositivos móveis |

---

## ⚠️ Limitações Conhecidas

- O frontend continua sendo uma aplicação client-side; não há backend tradicional próprio.
- Compartilhamento persistente atualmente é autenticado e precisa de uma camada pública controlada para compartilhamento externo sem login.
- Permissões de colaboração existem no schema, mas a interface de convite e gestão de membros ainda está em evolução.
- IA ainda não está integrada como serviço do produto.
- Cálculos financeiros estão implementados e persistidos, mas ainda precisam de uma suíte específica de testes e revisão para uso profissional.
- Validação completa de acessibilidade, responsividade, autenticação, persistência e isolamento entre usuários ainda precisa ser automatizada no navegador.

---

## 🧪 Testes e Qualidade

### Automação adicionada

- `.github/workflows/quality.yml` valida a sintaxe dos arquivos JavaScript
- Smoke test verifica estrutura essencial do HTML e presença das integrações de persistência
- A qualidade é executada em pushes para `manutencao`/`main` e Pull Requests para `main`

### Já realizado

- Validação de sintaxe do JavaScript principal
- Verificação do build/deploy na Vercel
- Validação da integração inicial do Neon no Módulo 1
- Persistência centralizada dos módulos por camada de sincronização
- Preservação do rascunho local durante a conexão com o banco
- RLS validado em branch temporária antes da aplicação no branch principal do Neon
- Revisão estrutural da integração entre frontend, Neon Auth e Neon Data API

### Próximos testes

- Testes automatizados dos cálculos financeiros
- Testes de integração dos fluxos críticos
- Testes completos de cadastro, login e logout
- Testes de persistência e recuperação de todos os módulos no navegador
- Testes de segurança das políticas RLS com usuários distintos
- Testes de múltiplos planos e isolamento de dados
- Testes de responsividade
- Testes de acessibilidade
- Testes de compartilhamento e restauração de versões
- Testes de regressão dos módulos 1–7
- CI/CD e validações automatizadas

> Metas de cobertura, desempenho, disponibilidade e testes com usuários não devem ser tratadas como resultados até que sejam medidos.

---

## ⚠️ Riscos e Mitigações

| Risco | Mitigação |
|---|---|
| Baixa adesão de iniciantes | Onboarding guiado e evolução da experiência |
| Erros nos cálculos financeiros | Testes automatizados e revisão dos algoritmos |
| Crescimento prematuro da arquitetura | Evolução gradual baseada em necessidade real |
| Acesso indevido aos dados | Neon Auth + RLS + políticas de autorização |
| Dependência de persistência local | Migração gradual dos módulos para persistência centralizada |
| Compartilhamento inadequado de dados | Evolução para links persistentes, permissões e expiração |
| Complexidade da colaboração | Espaços de trabalho, membros e funções planejados no schema |

---

## 📚 Referências Conceituais

- Dornelas, J. C. A. — *Empreendedorismo: transformando ideias em negócios*
- SEBRAE — *Como elaborar um plano de negócios*
- Osterwalder, A. — *Business Model Generation*
- Porter, M. — *Competitive Strategy*

---

## 🤝 Contribuição

Contribuições são bem-vindas.

Fluxo sugerido:

1. Faça um fork ou crie uma branch de trabalho.
2. Crie uma branch de feature/correção.
3. Faça as alterações.
4. Valide o comportamento.
5. Faça um commit com mensagem descritiva.
6. Envie a branch.
7. Abra um Pull Request.

Exemplo:

```bash
git checkout -b feature/minha-feature
git add .
git commit -m "feat: descreve claramente a alteração"
git push origin feature/minha-feature
```

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para os termos completos.

---

## 📬 Contato

- **Autor:** Alair Apolinário Soares
- **Email:** alairapolinariosoares@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/alair-soares-364261403/?isSelfProfile=true

---

## 📌 Convenções de Estado

- 🟢 **Implementado** — funcionalidade já existente no projeto
- 🟡 **Em evolução** — existe estrutura ou implementação parcial, mas ainda não está concluída
- 🔵 **Planejado** — ainda não implementado

> Este README descreve o estado conhecido do projeto e separa deliberadamente funcionalidades atuais, integrações em evolução e objetivos futuros. Deve ser atualizado sempre que a arquitetura ou o nível de integração dos módulos mudar.
