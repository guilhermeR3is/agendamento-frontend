import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calendar, Clock, User, Plus, X, Heart, Activity, Stethoscope, LogOut, MapPin } from 'lucide-react'

const DashboardSimple = ({ userData, onNewAppointment, onLogout }) => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      // Importar serviço do localStorage
      const { appointmentService } = await import('../services/localStorage')
      
      const result = await appointmentService.getByUserId(userData.user.id)
      
      if (result.success) {
        setAppointments(result.appointments)
      } else {
        setError('Erro ao carregar agendamentos')
      }
    } catch (err) {
      setError('Erro interno ao carregar agendamentos')
    } finally {
      setLoading(false)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) {
      return
    }

    try {
      // Importar serviço do localStorage
      const { appointmentService } = await import('../services/localStorage')
      
      const result = await appointmentService.cancel(appointmentId)
      
      if (result.success) {
        alert('Agendamento cancelado com sucesso!')
        fetchAppointments() // Recarregar a lista de agendamentos
      } else {
        alert(result.error || 'Erro ao cancelar agendamento')
      }
    } catch (err) {
      alert('Erro interno ao cancelar agendamento')
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      agendado: { variant: 'default', label: 'Agendado', className: 'bg-blue-100 text-blue-800' },
      confirmado: { variant: 'default', label: 'Confirmado', className: 'bg-green-100 text-green-800' },
      cancelado: { variant: 'destructive', label: 'Cancelado', className: 'bg-red-100 text-red-800' },
      concluido: { variant: 'default', label: 'Concluído', className: 'bg-gray-100 text-gray-800' }
    }
    
    const config = statusConfig[status] || statusConfig.agendado
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isUpcoming = (dateString, timeString) => {
    const appointmentDateTime = new Date(`${dateString}T${timeString}`)
    return appointmentDateTime > new Date()
  }

  const upcomingAppointments = appointments.filter(apt => 
    apt.status !== 'cancelado' && isUpcoming(apt.data, apt.horario)
  )
  
  const pastAppointments = appointments.filter(apt => 
    apt.status === 'cancelado' || !isUpcoming(apt.data, apt.horario)
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-teal-600">Carregando seus agendamentos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <div className="flex items-center mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center mr-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-teal-700">
                  Olá, {userData.user?.nome || 'Usuário'}!
                </h1>
                <p className="text-gray-600">Bem-vindo ao SaúdeConnect</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={onNewAppointment}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Consulta
            </Button>
            <Button
              variant="outline"
              onClick={onLogout}
              className="border-teal-200 text-teal-700 hover:bg-teal-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-teal-100 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
                  <p className="text-gray-600">Próximas Consultas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-teal-100 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Stethoscope className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
                  <p className="text-gray-600">Total de Consultas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-teal-100 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {appointments.filter(a => a.status === 'concluido').length}
                  </p>
                  <p className="text-gray-600">Consultas Realizadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Próximas Consultas */}
        {upcomingAppointments.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-teal-100 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-teal-700">
                <Calendar className="h-5 w-5 mr-2" />
                Próximas Consultas
              </CardTitle>
              <CardDescription>
                Suas consultas agendadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-100"
                  >
                    <div className="flex-1 mb-3 sm:mb-0">
                      <div className="flex items-center mb-2">
                        <Stethoscope className="h-4 w-4 text-teal-600 mr-2" />
                        <h3 className="font-semibold text-gray-900">
                          {appointment.especialidade_nome || appointment.especialidade}
                        </h3>
                        <div className="ml-2">
                          {getStatusBadge(appointment.status)}
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-2" />
                          <span>{appointment.medico}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-2" />
                          <span>{appointment.ubs_nome || appointment.cidade_nome}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-2" />
                          <span>{formatDate(appointment.data)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-2" />
                          <span>{appointment.horario}</span>
                        </div>
                        {appointment.observacoes && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500">
                              <strong>Observações:</strong> {appointment.observacoes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {appointment.status === 'agendado' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => cancelAppointment(appointment.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Histórico de Consultas */}
        {pastAppointments.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-teal-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-teal-700">
                <Activity className="h-5 w-5 mr-2" />
                Histórico de Consultas
              </CardTitle>
              <CardDescription>
                Suas consultas anteriores e canceladas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pastAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <Stethoscope className="h-4 w-4 text-gray-600 mr-2" />
                        <h3 className="font-semibold text-gray-900">
                          {appointment.especialidade}
                        </h3>
                        <div className="ml-2">
                          {getStatusBadge(appointment.status)}
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-2" />
                          <span>{appointment.medico}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-2" />
                          <span>{appointment.ubs_nome || appointment.cidade_nome}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-2" />
                          <span>{formatDate(appointment.data)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-2" />
                          <span>{appointment.horario}</span>
                        </div>
                        {appointment.observacoes && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500">
                              <strong>Observações:</strong> {appointment.observacoes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estado vazio */}
        {appointments.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-teal-100 shadow-lg">
            <CardContent className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhuma consulta agendada
              </h3>
              <p className="text-gray-600 mb-6">
                Você ainda não possui consultas agendadas. Que tal agendar sua primeira consulta?
              </p>
              <Button
                onClick={onNewAppointment}
                className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agendar Primeira Consulta
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default DashboardSimple

