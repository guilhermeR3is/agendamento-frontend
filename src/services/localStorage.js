// Serviço para gerenciar dados no localStorage
// Substitui as chamadas para o backend

const STORAGE_KEYS = {
  USERS: 'saude_connect_users',
  APPOINTMENTS: 'saude_connect_appointments',
  ADMIN_CREDENTIALS: 'saude_connect_admin'
}

// Função para gerar ID único
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Função para validar CPF
const validateCPF = (cpf) => {
  cpf = cpf.replace(/\D/g, '')
  
  if (cpf.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cpf)) return false
  
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cpf.charAt(9))) return false
  
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cpf.charAt(10))) return false
  
  return true
}

// Serviços de usuário
export const userService = {
  // Login do usuário
  login: async (cpf, dataNascimento) => {
    try {
      // Validar CPF
      if (!validateCPF(cpf)) {
        return { success: false, error: 'CPF inválido' }
      }

      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
      const appointments = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || '[]')
      
      // Buscar usuário existente
      let user = users.find(u => u.cpf === cpf && u.data_nascimento === dataNascimento)
      
      if (user) {
        // Verificar se tem agendamentos
        const userAppointments = appointments.filter(a => a.user_id === user.id)
        
        return {
          success: true,
          user_exists: true,
          has_appointments: userAppointments.length > 0,
          user: user,
          appointments: userAppointments
        }
      } else {
        // Usuário não existe, criar novo
        const newUser = {
          id: generateId(),
          cpf: cpf,
          data_nascimento: dataNascimento,
          nome: '',
          telefone: '',
          email: '',
          created_at: new Date().toISOString()
        }
        
        users.push(newUser)
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
        
        return {
          success: true,
          user_exists: false,
          has_appointments: false,
          user: newUser,
          appointments: []
        }
      }
    } catch (error) {
      return { success: false, error: 'Erro interno do sistema' }
    }
  },

  // Atualizar dados do usuário
  updateUser: async (userId, userData) => {
    try {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
      const userIndex = users.findIndex(u => u.id === userId)
      
      if (userIndex === -1) {
        return { success: false, error: 'Usuário não encontrado' }
      }
      
      users[userIndex] = { ...users[userIndex], ...userData }
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
      
      return { success: true, user: users[userIndex] }
    } catch (error) {
      return { success: false, error: 'Erro ao atualizar usuário' }
    }
  },

  // Buscar usuário por ID
  getUserById: async (userId) => {
    try {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
      const user = users.find(u => u.id === userId)
      
      if (!user) {
        return { success: false, error: 'Usuário não encontrado' }
      }
      
      return { success: true, user }
    } catch (error) {
      return { success: false, error: 'Erro ao buscar usuário' }
    }
  }
}

// Dados de cidades, UBS e especialidades
const CITIES_DATA = [
  {
    id: 1,
    nome: 'São Paulo',
    ubs: [
      {
        id: 1,
        nome: 'UBS Vila Madalena',
        endereco: 'Rua Harmonia, 123 - Vila Madalena',
        especialidades: [
          { id: 1, nome: 'Clínica Geral', medicos: ['Dr. João Silva', 'Dra. Maria Santos'] },
          { id: 2, nome: 'Cardiologia', medicos: ['Dr. Carlos Oliveira', 'Dra. Ana Rodrigues'] },
          { id: 3, nome: 'Pediatria', medicos: ['Dra. Isabela Ramos', 'Dr. Daniel Correia'] }
        ]
      },
      {
        id: 2,
        nome: 'UBS Jardins',
        endereco: 'Av. Paulista, 456 - Jardins',
        especialidades: [
          { id: 1, nome: 'Clínica Geral', medicos: ['Dr. Pedro Costa', 'Dra. Fernanda Alves'] },
          { id: 4, nome: 'Dermatologia', medicos: ['Dra. Fernanda Alves', 'Dr. Marcos Pereira'] },
          { id: 5, nome: 'Ginecologia', medicos: ['Dra. Luciana Martins', 'Dra. Patrícia Gomes'] }
        ]
      },
      {
        id: 3,
        nome: 'UBS Mooca',
        endereco: 'Rua da Mooca, 789 - Mooca',
        especialidades: [
          { id: 1, nome: 'Clínica Geral', medicos: ['Dr. Roberto Lima', 'Dra. Carla Ferreira'] },
          { id: 6, nome: 'Ortopedia', medicos: ['Dr. Thiago Moreira', 'Dr. Leonardo Cardoso'] },
          { id: 7, nome: 'Neurologia', medicos: ['Dr. Eduardo Santos', 'Dra. Beatriz Costa'] }
        ]
      }
    ]
  },
  {
    id: 2,
    nome: 'Rio de Janeiro',
    ubs: [
      {
        id: 4,
        nome: 'UBS Copacabana',
        endereco: 'Av. Atlântica, 321 - Copacabana',
        especialidades: [
          { id: 1, nome: 'Clínica Geral', medicos: ['Dr. André Barbosa', 'Dra. Renata Silva'] },
          { id: 2, nome: 'Cardiologia', medicos: ['Dr. Felipe Rocha', 'Dra. Camila Dias'] },
          { id: 8, nome: 'Oftalmologia', medicos: ['Dr. Ricardo Almeida', 'Dr. Gustavo Nunes'] }
        ]
      },
      {
        id: 5,
        nome: 'UBS Ipanema',
        endereco: 'Rua Visconde de Pirajá, 654 - Ipanema',
        especialidades: [
          { id: 1, nome: 'Clínica Geral', medicos: ['Dra. Priscila Lopes', 'Dra. Larissa Teixeira'] },
          { id: 9, nome: 'Psiquiatria', medicos: ['Dr. Rodrigo Pinto', 'Dra. Vanessa Araújo'] },
          { id: 10, nome: 'Urologia', medicos: ['Dr. Fábio Nascimento', 'Dr. Henrique Vieira'] }
        ]
      }
    ]
  },
  {
    id: 3,
    nome: 'Belo Horizonte',
    ubs: [
      {
        id: 6,
        nome: 'UBS Savassi',
        endereco: 'Rua Pernambuco, 987 - Savassi',
        especialidades: [
          { id: 1, nome: 'Clínica Geral', medicos: ['Dr. Bruno Machado', 'Dra. Cristina Melo'] },
          { id: 3, nome: 'Pediatria', medicos: ['Dr. Paulo Mendes', 'Dra. Juliana Souza'] },
          { id: 4, nome: 'Dermatologia', medicos: ['Dr. Marcos Pereira', 'Dra. Fernanda Alves'] }
        ]
      }
    ]
  }
]

// Horários disponíveis por turno
const HORARIOS_DISPONIVEIS = {
  manha: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'],
  tarde: ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30']
}

// Serviços de agendamento
export const appointmentService = {
  // Buscar cidades
  getCities: async () => {
    try {
      return { 
        success: true, 
        cities: CITIES_DATA.map(city => ({ id: city.id, nome: city.nome }))
      }
    } catch (error) {
      return { success: false, error: 'Erro ao buscar cidades' }
    }
  },

  // Buscar UBS por cidade
  getUBSByCity: async (cityId) => {
    try {
      const city = CITIES_DATA.find(c => c.id === parseInt(cityId))
      if (!city) {
        return { success: false, error: 'Cidade não encontrada' }
      }
      
      return { 
        success: true, 
        ubs: city.ubs.map(ubs => ({ 
          id: ubs.id, 
          nome: ubs.nome, 
          endereco: ubs.endereco 
        }))
      }
    } catch (error) {
      return { success: false, error: 'Erro ao buscar UBS' }
    }
  },

  // Buscar especialidades por UBS
  getSpecialtiesByUBS: async (ubsId) => {
    try {
      let targetUBS = null
      
      for (const city of CITIES_DATA) {
        const ubs = city.ubs.find(u => u.id === parseInt(ubsId))
        if (ubs) {
          targetUBS = ubs
          break
        }
      }
      
      if (!targetUBS) {
        return { success: false, error: 'UBS não encontrada' }
      }
      
      return { 
        success: true, 
        especialidades: targetUBS.especialidades.map(esp => ({
          id: esp.id,
          nome: esp.nome
        }))
      }
    } catch (error) {
      return { success: false, error: 'Erro ao buscar especialidades' }
    }
  },

  // Buscar médicos por UBS e especialidade
  getDoctorsByUBSAndSpecialty: async (ubsId, especialidadeId) => {
    try {
      let targetEspecialidade = null
      
      for (const city of CITIES_DATA) {
        const ubs = city.ubs.find(u => u.id === parseInt(ubsId))
        if (ubs) {
          const especialidade = ubs.especialidades.find(e => e.id === parseInt(especialidadeId))
          if (especialidade) {
            targetEspecialidade = especialidade
            break
          }
        }
      }
      
      if (!targetEspecialidade) {
        return { success: false, error: 'Especialidade não encontrada nesta UBS' }
      }
      
      return { 
        success: true, 
        medicos: targetEspecialidade.medicos
      }
    } catch (error) {
      return { success: false, error: 'Erro ao buscar médicos' }
    }
  },

  // Buscar datas e horários disponíveis
  getAvailableDates: async (ubsId, especialidadeId) => {
    try {
      // Gerar datas disponíveis para os próximos 30 dias (exceto fins de semana)
      const availableDates = []
      const today = new Date()
      
      for (let i = 1; i <= 30; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        
        // Pular fins de semana (sábado = 6, domingo = 0)
        if (date.getDay() !== 0 && date.getDay() !== 6) {
          const dateString = date.toISOString().split('T')[0]
          
          availableDates.push({
            data: dateString,
            turnos: {
              manha: {
                disponivel: true,
                horarios: HORARIOS_DISPONIVEIS.manha
              },
              tarde: {
                disponivel: true,
                horarios: HORARIOS_DISPONIVEIS.tarde
              }
            }
          })
        }
      }
      
      return { success: true, available_dates: availableDates }
    } catch (error) {
      return { success: false, error: 'Erro ao buscar datas disponíveis' }
    }
  },

  // Criar novo agendamento
  create: async (appointmentData) => {
    try {
      const appointments = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || '[]')
      
      const newAppointment = {
        id: generateId(),
        ...appointmentData,
        status: 'agendado',
        created_at: new Date().toISOString()
      }
      
      appointments.push(newAppointment)
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments))
      
      return { success: true, appointment: newAppointment }
    } catch (error) {
      return { success: false, error: 'Erro ao criar agendamento' }
    }
  },

  // Buscar agendamentos por usuário
  getByUserId: async (userId) => {
    try {
      const appointments = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || '[]')
      const userAppointments = appointments.filter(a => a.user_id === userId)
      
      return { success: true, appointments: userAppointments }
    } catch (error) {
      return { success: false, error: 'Erro ao buscar agendamentos' }
    }
  },

  // Buscar todos os agendamentos (admin)
  getAll: async () => {
    try {
      const appointments = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || '[]')
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
      
      // Enriquecer agendamentos com dados do usuário
      const enrichedAppointments = appointments.map(appointment => {
        const user = users.find(u => u.id === appointment.user_id)
        return {
          ...appointment,
          user_name: user?.nome || 'Nome não informado',
          user_cpf: user?.cpf || '',
          user_telefone: user?.telefone || ''
        }
      })
      
      return { success: true, appointments: enrichedAppointments }
    } catch (error) {
      return { success: false, error: 'Erro ao buscar agendamentos' }
    }
  },

  // Atualizar status do agendamento
  updateStatus: async (appointmentId, status) => {
    try {
      const appointments = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || '[]')
      const appointmentIndex = appointments.findIndex(a => a.id === appointmentId)
      
      if (appointmentIndex === -1) {
        return { success: false, error: 'Agendamento não encontrado' }
      }
      
      appointments[appointmentIndex].status = status
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments))
      
      return { success: true, appointment: appointments[appointmentIndex] }
    } catch (error) {
      return { success: false, error: 'Erro ao atualizar agendamento' }
    }
  },

  // Cancelar agendamento
  cancel: async (appointmentId) => {
    try {
      return await appointmentService.updateStatus(appointmentId, 'cancelado')
    } catch (error) {
      return { success: false, error: 'Erro ao cancelar agendamento' }
    }
  }
}

// Serviços de administração
export const adminService = {
  // Login do admin
  login: async (username, password) => {
    try {
      // Credenciais padrão do admin (em produção, isso deveria ser mais seguro)
      const defaultAdmin = {
        username: 'admin',
        password: 'admin123',
        name: 'Administrador do Sistema'
      }
      
      if (username === defaultAdmin.username && password === defaultAdmin.password) {
        return {
          success: true,
          admin: {
            id: 'admin',
            username: defaultAdmin.username,
            name: defaultAdmin.name
          }
        }
      } else {
        return { success: false, error: 'Credenciais inválidas' }
      }
    } catch (error) {
      return { success: false, error: 'Erro interno do sistema' }
    }
  },

  // Buscar estatísticas
  getStats: async () => {
    try {
      const appointments = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || '[]')
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
      
      const stats = {
        total_appointments: appointments.length,
        total_users: users.length,
        appointments_today: appointments.filter(a => {
          const today = new Date().toISOString().split('T')[0]
          return a.data === today
        }).length,
        appointments_by_status: {
          agendado: appointments.filter(a => a.status === 'agendado').length,
          confirmado: appointments.filter(a => a.status === 'confirmado').length,
          cancelado: appointments.filter(a => a.status === 'cancelado').length,
          concluido: appointments.filter(a => a.status === 'concluido').length
        }
      }
      
      return { success: true, stats }
    } catch (error) {
      return { success: false, error: 'Erro ao buscar estatísticas' }
    }
  }
}

// Função para inicializar dados de exemplo (opcional)
export const initializeExampleData = () => {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
  const appointments = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || '[]')
  
  // Se não há dados, criar alguns exemplos
  if (users.length === 0 && appointments.length === 0) {
    const exampleUser = {
      id: generateId(),
      cpf: '12345678901',
      data_nascimento: '1990-01-01',
      nome: 'João da Silva',
      telefone: '(11) 99999-9999',
      email: 'joao@email.com',
      created_at: new Date().toISOString()
    }
    
    const exampleAppointment = {
      id: generateId(),
      user_id: exampleUser.id,
      especialidade: 'Cardiologia',
      medico: 'Dr. Carlos Santos',
      data: '2024-01-15',
      horario: '14:00',
      observacoes: 'Consulta de rotina',
      status: 'agendado',
      created_at: new Date().toISOString()
    }
    
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([exampleUser]))
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify([exampleAppointment]))
  }
}

