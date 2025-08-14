import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Loader2, User, Calendar, Clock, Stethoscope, CheckCircle } from 'lucide-react'

const NewAppointmentSimple = ({ userData, onBack, onComplete, onUserDataUpdate }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  // Dados do usuário
  const [userInfo, setUserInfo] = useState({
    nome: userData.user?.nome || '',
    telefone: userData.user?.telefone || '',
    email: userData.user?.email || ''
  })
  
  // Dados do agendamento
  const [appointmentData, setAppointmentData] = useState({
    especialidade: '',
    medico: '',
    data: '',
    horario: '',
    observacoes: ''
  })

  // Opções de especialidades médicas
  const especialidades = [
    'Clínica Geral',
    'Cardiologia',
    'Dermatologia',
    'Endocrinologia',
    'Ginecologia',
    'Neurologia',
    'Oftalmologia',
    'Ortopedia',
    'Pediatria',
    'Psiquiatria',
    'Urologia'
  ]

  // Opções de médicos por especialidade
  const medicosPorEspecialidade = {
    'Clínica Geral': ['Dr. João Silva', 'Dra. Maria Santos', 'Dr. Pedro Costa'],
    'Cardiologia': ['Dr. Carlos Oliveira', 'Dra. Ana Rodrigues', 'Dr. Roberto Lima'],
    'Dermatologia': ['Dra. Fernanda Alves', 'Dr. Marcos Pereira', 'Dra. Juliana Souza'],
    'Endocrinologia': ['Dr. Paulo Mendes', 'Dra. Carla Ferreira', 'Dr. André Barbosa'],
    'Ginecologia': ['Dra. Luciana Martins', 'Dra. Patrícia Gomes', 'Dra. Renata Silva'],
    'Neurologia': ['Dr. Eduardo Santos', 'Dra. Beatriz Costa', 'Dr. Felipe Rocha'],
    'Oftalmologia': ['Dr. Ricardo Almeida', 'Dra. Camila Dias', 'Dr. Gustavo Nunes'],
    'Ortopedia': ['Dr. Thiago Moreira', 'Dr. Leonardo Cardoso', 'Dra. Priscila Lopes'],
    'Pediatria': ['Dra. Isabela Ramos', 'Dr. Daniel Correia', 'Dra. Larissa Teixeira'],
    'Psiquiatria': ['Dr. Rodrigo Pinto', 'Dra. Vanessa Araújo', 'Dr. Bruno Machado'],
    'Urologia': ['Dr. Fábio Nascimento', 'Dr. Henrique Vieira', 'Dra. Cristina Melo']
  }

  // Opções de horários
  const horarios = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ]

  const handleUserInfoChange = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAppointmentChange = (field, value) => {
    setAppointmentData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpar médico quando especialidade mudar
    if (field === 'especialidade') {
      setAppointmentData(prev => ({
        ...prev,
        medico: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Importar serviços do localStorage
      const { userService, appointmentService } = await import('../services/localStorage')
      
      // Atualizar dados do usuário
      const userUpdateResult = await userService.updateUser(userData.user.id, userInfo)
      
      if (!userUpdateResult.success) {
        setError('Erro ao atualizar dados do usuário')
        return
      }

      // Criar agendamento
      const appointmentResult = await appointmentService.create({
        user_id: userData.user.id,
        ...appointmentData
      })

      if (appointmentResult.success) {
        setSuccess(true)
        
        // Atualizar dados do usuário no componente pai
        if (onUserDataUpdate) {
          onUserDataUpdate({
            ...userData,
            user: userUpdateResult.user
          })
        }

        // Aguardar um pouco antes de redirecionar
        setTimeout(() => {
          onComplete()
        }, 2000)
      } else {
        setError(appointmentResult.error || 'Erro ao criar agendamento')
      }
    } catch (err) {
      setError('Erro interno. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // Obter data mínima (hoje)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  // Obter data máxima (3 meses a partir de hoje)
  const getMaxDate = () => {
    const today = new Date()
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate())
    return maxDate.toISOString().split('T')[0]
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-teal-100 shadow-2xl">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-teal-700 mb-2">
                Agendamento Realizado!
              </h2>
              <p className="text-gray-600 mb-4">
                Sua consulta foi agendada com sucesso.
              </p>
              <div className="bg-teal-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-teal-700">
                  <strong>Especialidade:</strong> {appointmentData.especialidade}
                </p>
                <p className="text-sm text-teal-700">
                  <strong>Médico:</strong> {appointmentData.medico}
                </p>
                <p className="text-sm text-teal-700">
                  <strong>Data:</strong> {new Date(appointmentData.data).toLocaleDateString('pt-BR')}
                </p>
                <p className="text-sm text-teal-700">
                  <strong>Horário:</strong> {appointmentData.horario}
                </p>
              </div>
              <p className="text-xs text-gray-500">
                Redirecionando para o painel...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mr-4 text-teal-600 hover:text-teal-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-teal-700">
            Novo Agendamento
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <Card className="bg-white/80 backdrop-blur-sm border-teal-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-teal-700">
                <User className="h-5 w-5 mr-2" />
                Dados Pessoais
              </CardTitle>
              <CardDescription>
                Complete suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-teal-700">Nome Completo *</Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={userInfo.nome}
                    onChange={(e) => handleUserInfoChange('nome', e.target.value)}
                    required
                    className="border-teal-200 focus:border-teal-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone" className="text-teal-700">Telefone *</Label>
                  <Input
                    id="telefone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={userInfo.telefone}
                    onChange={(e) => handleUserInfoChange('telefone', e.target.value)}
                    required
                    className="border-teal-200 focus:border-teal-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-teal-700">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={userInfo.email}
                  onChange={(e) => handleUserInfoChange('email', e.target.value)}
                  className="border-teal-200 focus:border-teal-400"
                />
              </div>
            </CardContent>
          </Card>

          {/* Dados do Agendamento */}
          <Card className="bg-white/80 backdrop-blur-sm border-teal-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-teal-700">
                <Stethoscope className="h-5 w-5 mr-2" />
                Dados da Consulta
              </CardTitle>
              <CardDescription>
                Selecione a especialidade, médico e horário
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="especialidade" className="text-teal-700">Especialidade *</Label>
                  <Select
                    value={appointmentData.especialidade}
                    onValueChange={(value) => handleAppointmentChange('especialidade', value)}
                    required
                  >
                    <SelectTrigger className="border-teal-200 focus:border-teal-400">
                      <SelectValue placeholder="Selecione a especialidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {especialidades.map((esp) => (
                        <SelectItem key={esp} value={esp}>
                          {esp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medico" className="text-teal-700">Médico *</Label>
                  <Select
                    value={appointmentData.medico}
                    onValueChange={(value) => handleAppointmentChange('medico', value)}
                    disabled={!appointmentData.especialidade}
                    required
                  >
                    <SelectTrigger className="border-teal-200 focus:border-teal-400">
                      <SelectValue placeholder="Selecione o médico" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentData.especialidade && 
                        medicosPorEspecialidade[appointmentData.especialidade]?.map((medico) => (
                          <SelectItem key={medico} value={medico}>
                            {medico}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data" className="text-teal-700">Data *</Label>
                  <Input
                    id="data"
                    type="date"
                    min={getMinDate()}
                    max={getMaxDate()}
                    value={appointmentData.data}
                    onChange={(e) => handleAppointmentChange('data', e.target.value)}
                    required
                    className="border-teal-200 focus:border-teal-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horario" className="text-teal-700">Horário *</Label>
                  <Select
                    value={appointmentData.horario}
                    onValueChange={(value) => handleAppointmentChange('horario', value)}
                    required
                  >
                    <SelectTrigger className="border-teal-200 focus:border-teal-400">
                      <SelectValue placeholder="Selecione o horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {horarios.map((horario) => (
                        <SelectItem key={horario} value={horario}>
                          {horario}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacoes" className="text-teal-700">Observações</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Observações adicionais sobre a consulta..."
                  value={appointmentData.observacoes}
                  onChange={(e) => handleAppointmentChange('observacoes', e.target.value)}
                  className="border-teal-200 focus:border-teal-400"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {/* Botão de Submit */}
          <Card className="bg-white/80 backdrop-blur-sm border-teal-100 shadow-lg">
            <CardContent className="pt-6">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Agendando...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-5 w-5" />
                    Confirmar Agendamento
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}

export default NewAppointmentSimple

