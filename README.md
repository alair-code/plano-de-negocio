# 📊 Business Plan Builder

> Software para criação, análise e gestão de planos de negócios — do guiamento inicial à viabilidade financeira.

---

## 📖 Sobre o Projeto

O **Business Plan Builder** é uma aplicação web que guia empreendedores, estudantes e consultores na elaboração completa de um plano de negócios, desde a identificação da oportunidade até a análise de viabilidade financeira.

### 🎯 Problema

Empreendedores, especialmente iniciantes, enfrentam dificuldades para:

- Estruturar um plano de negócios de forma organizada
- Aplicar metodologias de análise (SWOT, Porter, Canvas)
- Realizar cálculos de viabilidade (VPL, TIR, Payback)
- Transformar ideias em projetos estruturados

### 💡 Solução

Uma ferramenta **guiada**, com **templates prontos**, **cálculos automáticos** e **exportação profissional**, que reduz o tempo de elaboração de um plano de negócios em até 70%.

### 👥 Público-Alvo

- Empreendedores iniciantes e experientes
- Estudantes de administração e gestão
- Consultores e incubadoras
- Instituições de ensino

---

## 🎯 Objetivos e Métricas

### Objetivos de Negócio

- Reduzir em **70%** o tempo de elaboração de um plano de negócios
- Padronizar a qualidade técnica dos planos gerados
- Tornar acessível a análise de viabilidade financeira para não-especialistas

### KPIs de Sucesso

| Métrica | Meta |
|---|---|
| Planos criados/mês | > 500 |
| Taxa de conclusão de planos iniciados | > 60% |
| NPS | > 50 |
| Tempo médio de elaboração | < 4h |

---

## 🧩 Arquitetura Funcional

### Módulo 1 — Identificação da Oportunidade
- Formulário guiado: problema, solução, público, diferenciais
- Canvas de Proposta de Valor
- Score de atratividade da oportunidade

### Módulo 2 — Análise de Ambientes
- **Ambiente interno:** recursos, capacidades, SWOT (Forças/Fraquezas)
- **Ambiente externo:** PESTEL, 5 Forças de Porter, SWOT (Oportunidades/Ameaças)
- Matriz SWOT visual (arrastar e soltar)

### Módulo 3 — Estrutura do Plano de Negócios
Seções guiadas com templates e exemplos:

1. Sumário Executivo
2. Descrição da Empresa
3. Produtos e Serviços
4. Mercado e Concorrência
5. Marketing e Vendas
6. Plano Operacional
7. Plano de Gestão de Pessoas
8. Plano Financeiro
9. Análise Estratégica
10. Anexos

### Módulo 4 — Viabilidade Financeira
- **Entradas:** investimento inicial, custos fixos/variáveis, preço, demanda
- **Cálculos automáticos:**
  - Fluxo de caixa projetado (12–60 meses)
  - Ponto de equilíbrio
  - VPL (Valor Presente Líquido)
  - TIR (Taxa Interna de Retorno)
  - Payback simples e descontado
  - ROI e margem de lucro
- Gráficos interativos
- Análise de cenários (pessimista, realista, otimista)

### Módulo 5 — Planos Complementares
- Plano de marketing
- Plano operacional
- Plano de RH
- Plano jurídico/legal
- Plano de TI (quando aplicável)

### Módulo 6 — Exportação e Compartilhamento
- Exportação em PDF, Word e Excel
- Link público para compartilhamento
- Versionamento de planos

### Módulo 7 — Painel e Gestão
- Dashboard com status de cada seção
- Checklist de conclusão
- Alertas de inconsistências

---

## 🛠️ Requisitos Funcionais

| ID | Requisito | Prioridade |
|---|---|---|
| RF01 | Usuário pode criar múltiplos planos | Must |
| RF02 | Sistema salva automaticamente | Must |
| RF03 | Cálculo automático de VPL, TIR e payback | Must |
| RF04 | Geração de gráficos de fluxo de caixa | Must |
| RF05 | Exportação em PDF | Must |
| RF06 | Templates por segmento (varejo, serviços, indústria) | Should |
| RF07 | Colaboração multiusuário | Should |
| RF08 | Análise de cenários comparativa | Could |
| RF09 | Geração assistida por IA | Could |

---

## ⚙️ Requisitos Não Funcionais

- **Performance:** carregar dashboard em < 2s
- **Segurança:** autenticação JWT, criptografia em repouso (LGPD)
- **Disponibilidade:** 99,5%
- **Usabilidade:** responsivo, acessível (WCAG 2.1 AA)
- **Escalabilidade:** arquitetura em nuvem (AWS/GCP/Azure)

---

## 🧱 Stack Tecnológica

### Versão atual — Frontend

A primeira versão do projeto será desenvolvida **exclusivamente com tecnologias web nativas**, mantendo a implementação simples, leve e fácil de hospedar:

| Camada | Tecnologia |
|---|---|
| Estrutura | HTML5 |
| Estilos | CSS3 |
| Lógica e interações | JavaScript (Vanilla JS) |
| Persistência local | LocalStorage |
| Gráficos | JavaScript + APIs/recursos compatíveis com o navegador |
| Exportação | APIs do navegador + geração de arquivos no frontend |
| Autenticação | Neon Auth |
| Banco de dados | PostgreSQL / Neon |
| API de dados | Neon Data API |
| Hospedagem | Vercel / hospedagem web |

> **Estado atual:** o frontend continua em HTML, CSS e JavaScript puro, mas o projeto já iniciou a integração com **Neon Auth + PostgreSQL/Neon + Neon Data API**. A integração começou pelo Módulo 1 e será expandida gradualmente para os demais módulos.

### Evolução da aplicação

A aplicação já iniciou a transição para persistência centralizada e autenticação. O Módulo 1 está integrado ao Neon; os demais módulos serão integrados progressivamente.

| Próxima necessidade | Tecnologia possível |
|---|---|
| Frontend escalável | React/TypeScript ou evolução do frontend atual |
| Backend/API | Node.js (NestJS) ou Python (FastAPI) |
| Banco de Dados | PostgreSQL |
| Autenticação | Serviço de autenticação ou autenticação própria |
| Colaboração multiusuário | Backend + banco de dados + controle de acesso |
| Infraestrutura | Docker + AWS / GCP / Azure ou serviço equivalente |

A adoção dessas tecnologias será avaliada **somente quando houver necessidade real**, sem obrigar a migração prematura do frontend atual.

## 🚀 Jornada do Usuário

1. **Cadastro/Login**
2. **Criação de novo plano**
3. **Preenchimento guiado** por módulos
4. **Inserção de dados financeiros** → cálculos automáticos
5. **Revisão** com checklist de consistência
6. **Exportação/Compartilhamento**

> A autenticação e a persistência no Neon estão atualmente integradas ao Módulo 1. Os módulos 2–7 continuam em integração progressiva.

---

## 🖼️ Wireframes (descrição)

| Tela | Descrição |
|---|---|
| **Dashboard** | Lista de planos, status, % de conclusão |
| **Wizard** | Barra lateral com seções, formulário central, dicas contextuais |
| **Financeiro** | Tabelas editáveis + gráficos + cards de indicadores (VPL, TIR, Payback) |
| **SWOT** | Matriz 2x2 interativa |
| **Exportação** | Preview + botões de download |

---

## 🗺️ Roadmap

| Fase | Status | Entregas |
|---|---|---|
| Frontend base | ✅ Concluída | Estrutura e módulos principais |
| Módulos 1–7 | ✅ Implementados no frontend | Formulários, cálculos, exportação e painel |
| Autenticação | ✅ Inicialmente integrada | Neon Auth no Módulo 1 |
| Persistência M1 | ✅ Integrada | Neon Data API + RLS inicial |
| Persistência M2–M7 | 🔄 Em evolução | Integração módulo por módulo |
| Segurança completa do schema | 🔄 Em evolução | Ampliação das políticas RLS |
| Colaboração multiusuário | 📋 Planejada | Espaços, membros e permissões |
| IA | 📋 Planejada | Assistência inteligente |
| Mobile/PWA | 📋 Planejada | Evolução para dispositivos móveis |

---

## ⚠️ Riscos e Mitigações

| Risco | Mitigação |
|---|---|
| Baixa adesão de iniciantes | Onboarding guiado, tutoriais interativos |
| Erros nos cálculos financeiros | Testes unitários rigorosos, revisão por especialista |
| Concorrência (Sebrae, Canva) | Foco em profundidade financeira + guiamento |

---

## 🧪 Testes e Qualidade

### Já realizado
- Validação de sintaxe do JavaScript principal
- Verificação de build/deploy na Vercel
- Validação da integração inicial do Neon no Módulo 1
- Preservação do rascunho local durante a conexão com o banco

### Planejado
- Testes automatizados dos cálculos financeiros
- Testes de integração dos fluxos críticos
- Testes completos de autenticação e persistência
- Testes de responsividade e acessibilidade
- CI/CD e validações automatizadas

> Metas de cobertura e testes com usuários são objetivos de qualidade, não resultados já atingidos.

---

## 📚 Referências Conceituais

- Dornelas, J. C. A. — *Empreendedorismo: transformando ideias em negócios*
- SEBRAE — *Como elaborar um plano de negócios*
- Osterwalder, A. — *Business Model Generation*
- Porter, M. — *Competitive Strategy*

---

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Commit suas mudanças: `git commit -m 'feat: minha feature'`
4. Push: `git push origin feature/minha-feature`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📬 Contato

- **Autor:** Alair Apolinário Soares
- **Email:** alairapolinariosoares@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/alair-soares-364261403/?isSelfProfile=true
