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

## 🧱 Stack Tecnológica Sugerida

| Camada | Tecnologia |
|---|---|
| Frontend | React + TypeScript + Tailwind CSS |
| Backend | Node.js (NestJS) ou Python (FastAPI) |
| Banco de Dados | PostgreSQL |
| Cálculos Financeiros | numpy-financial / mathjs |
| Gráficos | Chart.js / Recharts |
| Exportação | Puppeteer (PDF) / docx (Word) |
| Autenticação | Auth0 / Firebase Auth |
| Infraestrutura | Docker + AWS / GCP |

---

## 🚀 Jornada do Usuário

1. **Cadastro/Login**
2. **Criação de novo plano** (template ou em branco)
3. **Preenchimento guiado** por etapas (wizard)
4. **Inserção de dados financeiros** → cálculos automáticos
5. **Revisão** com checklist de consistência
6. **Exportação/Compartilhamento**

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

| Fase | Prazo | Entregas |
|---|---|---|
| **MVP** | 3 meses | Módulos 1, 3, 4 e 6 |
| **v1.0** | 6 meses | + Módulos 2, 5 e 7 |
| **v2.0** | 12 meses | + IA, colaboração, mobile |

---

## ⚠️ Riscos e Mitigações

| Risco | Mitigação |
|---|---|
| Baixa adesão de iniciantes | Onboarding guiado, tutoriais interativos |
| Erros nos cálculos financeiros | Testes unitários rigorosos, revisão por especialista |
| Concorrência (Sebrae, Canva) | Foco em profundidade financeira + guiamento |

---

## 🧪 Testes e Qualidade

- **Testes unitários:** cobertura mínima de 80%
- **Testes de integração:** fluxos críticos (cadastro, cálculo, exportação)
- **Testes de usabilidade:** sessões com 10 usuários por release
- **CI/CD:** GitHub Actions + deploy automatizado

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
