# SaúdeConnect - Sistema de Agendamento

Sistema de agendamento de consultas médicas desenvolvido em React, funcionando completamente no frontend com localStorage.

## 🚀 Funcionalidades

- ✅ **Login com CPF e Data de Nascimento** - Validação de CPF integrada
- ✅ **Cadastro Automático** - Novos usuários são criados automaticamente no primeiro acesso
- ✅ **Agendamento de Consultas** - Interface intuitiva para agendar consultas
- ✅ **Dashboard Personalizado** - Visualização de consultas agendadas e histórico
- ✅ **Gerenciamento de Consultas** - Cancelar consultas futuras
- ✅ **Dados Persistentes** - Todos os dados ficam salvos no localStorage do navegador
- ✅ **Responsivo** - Interface adaptada para desktop e mobile

## 🏥 Especialidades Disponíveis

- Clínica Geral
- Cardiologia
- Dermatologia
- Endocrinologia
- Ginecologia
- Neurologia
- Oftalmologia
- Ortopedia
- Pediatria
- Psiquiatria
- Urologia

## 🛠️ Tecnologias Utilizadas

- **React 19** - Framework principal
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **Shadcn/UI** - Componentes de interface
- **Lucide React** - Ícones
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de dados

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos para executar localmente

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd agendamento-melhorado
   ```

2. **Instale as dependências**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Execute em modo desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador**
   ```
   http://localhost:5173
   ```

### Build para produção

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `dist/`.

## 🌐 Deploy no Vercel

Este projeto está configurado para deploy automático no Vercel:

1. **Conecte seu repositório ao Vercel**
2. **Configure as variáveis de ambiente** (se necessário)
3. **Deploy automático** - O Vercel detectará automaticamente que é um projeto Vite

### Configurações do Vercel

O arquivo `vercel.json` está configurado para:
- Redirecionar todas as rotas para `index.html` (SPA routing)
- Servir arquivos estáticos otimizados

## 💾 Armazenamento de Dados

O sistema utiliza **localStorage** para persistir dados:

- **Usuários**: `saude_connect_users`
- **Consultas**: `saude_connect_appointments`
- **Admin**: `saude_connect_admin`

### Dados de Exemplo

O sistema inicializa automaticamente com dados de exemplo se não houver dados salvos.

## 🔐 Credenciais de Teste

### Usuário Padrão
- **CPF**: `123.456.789-09` (qualquer CPF válido)
- **Data de Nascimento**: `1990-01-01` (qualquer data)

### Admin (se implementado)
- **Usuário**: `admin`
- **Senha**: `admin123`

## 📱 Funcionalidades por Tela

### 1. Login
- Validação de CPF em tempo real
- Formatação automática do CPF
- Criação automática de novos usuários

### 2. Dashboard
- Estatísticas de consultas
- Lista de próximas consultas
- Histórico de consultas
- Opção de cancelar consultas futuras

### 3. Novo Agendamento
- Formulário em etapas
- Seleção de especialidade e médico
- Escolha de data e horário
- Campo para observações

## 🎨 Design System

O projeto utiliza um design system consistente:

- **Cores primárias**: Tons de teal e cyan
- **Tipografia**: Sistema de fontes responsivo
- **Componentes**: Baseados no Shadcn/UI
- **Ícones**: Lucide React

## 🔧 Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── ui/              # Componentes base (Shadcn/UI)
│   ├── Login.jsx        # Tela de login
│   ├── DashboardSimple.jsx    # Dashboard principal
│   └── NewAppointmentSimple.jsx # Formulário de agendamento
├── services/            # Serviços e utilitários
│   └── localStorage.js  # Gerenciamento do localStorage
├── lib/                 # Utilitários
└── hooks/              # Custom hooks
```

## 🚀 Próximos Passos

Para evoluir o sistema, considere:

1. **Integração com Backend** - Migrar do localStorage para API REST
2. **Autenticação Avançada** - JWT, OAuth, etc.
3. **Notificações** - Email, SMS, push notifications
4. **Relatórios** - Dashboard administrativo com métricas
5. **Integração com Calendário** - Google Calendar, Outlook
6. **Pagamentos** - Integração com gateways de pagamento

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, entre em contato através de:
- Email: suporte@saudeconnect.com
- Issues do GitHub: [Link para issues]

---

**SaúdeConnect** - Conectando você à sua saúde! 🏥💙

