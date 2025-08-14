import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, User, Plus, X, Heart, Activity } from 'lucide-react'

const Dashboard = ({ userData, onNewAppointment, onLogout }) => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`/api/appointments/user/${userData.user_id}`)
      const data = await response.json()
      
      if (data.success) {
        setAppointments(data.appointments)
      }
    } catch (err) {
      console.error('Erro ao buscar agendamentos:', err)
    } finally {
      setLoading(false)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) {
      return
    }

    try {
      const response = await fetch(`/api/appointments/cancel/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('Agendamento cancelado com sucesso!')
        fetchAppointments() // Recarregar a lista de agendamentos
      } else {
        alert(data.error || 'Erro ao cancelar agendamento')
      }
    } catch (err) {
      console.error('Erro ao cancelar agendamento:', err)
      alert('Erro ao cancelar agendamento')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmado':
        return 'bg-green-100 text-green-800'
      case 'Cancelado':
        return 'bg-red-100 text-red-800'
      case 'Realizado':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header com design melhorado */}
        <div className="flex justify-between items-center mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-teal-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Olá, {userData.user_data?.nome_completo?.split(' ')[0] || 'Usuário'}!
              </h1>
              <p className="text-teal-600 font-medium">Sua saúde em primeiro lugar</p>
            </div>
          </div>
          <Button onClick={onLogout} variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
            Sair
          </Button>
        </div>

        {/* Cards principais com design melhorado */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Plus className="h-6 w-6" />
                </div>
                Novo Agendamento
              </CardTitle>
              <CardDescription className="text-teal-100">
                Agende uma nova consulta ou exame
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={onNewAppointment} 
                className="w-full bg-white text-teal-600 hover:bg-teal-50 font-semibold shadow-lg"
                size="lg"
              >
                Agendar Consulta
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-teal-100 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-teal-700">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                  <User className="h-6 w-6 text-teal-600" />
                </div>
                Meus Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium text-teal-600">CPF:</span> 
                <span>{userData.user_data?.cpf}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium text-teal-600">Nome:</span> 
                <span>{userData.user_data?.nome_completo || 'Não informado'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium text-teal-600">Celular:</span> 
                <span>{userData.user_data?.celular || 'Não informado'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium text-teal-600">Carteira SUS:</span> 
                <span>{userData.user_data?.carteira_sus || 'Não informado'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de agendamentos com design melhorado */}
        <Card className="bg-white/80 backdrop-blur-sm border-teal-100 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-teal-700 text-xl">
              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-teal-600" />
              </div>
              Meus Agendamentos
            </CardTitle>
            <CardDescription className="text-gray-600">
              Histórico de consultas e exames
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                <span className="ml-3 text-teal-600">Carregando agendamentos...</span>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-10 w-10 text-teal-500" />
                </div>
                <p className="text-gray-500 text-lg">Nenhum agendamento encontrado</p>
                <p className="text-gray-400">Faça seu primeiro agendamento!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-gradient-to-r from-white to-teal-50 border border-teal-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg text-gray-800">
                        {appointment.service_nome}
                      </h3>
                      <div className="flex items-center gap-3">
                        <Badge className={`${getStatusColor(appointment.status)} font-medium px-3 py-1`}>
                          {appointment.status}
                        </Badge>
                        {appointment.status === 'Confirmado' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => cancelAppointment(appointment.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 font-medium"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="grid gap-3 text-gray-600">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-teal-600" />
                        </div>
                        <span className="font-medium">{formatDate(appointment.data_agendamento)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                          <Clock className="h-4 w-4 text-cyan-600" />
                        </div>
                        <span className="font-medium">{appointment.turno}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium">{appointment.ubs_nome} - {appointment.cidade_nome}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard

