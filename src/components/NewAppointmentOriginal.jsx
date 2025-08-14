import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, ArrowRight, Loader2, User, MapPin, CalendarIcon, Clock, CheckCircle, Building2 } from 'lucide-react'
import Calendar from './Calendar'

const NewAppointmentOriginal = ({ userData, onBack, onComplete, onUserDataUpdate }) => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  // Dados do usuário
  const [userInfo, setUserInfo] = useState({
    nome_completo: userData.user?.nome || '',
    celular: userData.user?.telefone || '',
    carteira_sus: userData.user?.carteira_sus || ''
  })
  
  // Dados do agendamento
  const [appointmentData, setAppointmentData] = useState({
    cidade_id: '',
    ubs_id: '',
    especialidade_id: '',
    medico: '',
    data_agendamento: '',
    turno: '',
    horario: '',
    observacoes: ''
  })
  
  // Listas de opções
  const [cities, setCities] = useState([])
  const [ubsList, setUbsList] = useState([])
  const [especialidades, setEspecialidades] = useState([])
  const [medicos, setMedicos] = useState([])
  const [availableDates, setAvailableDates] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [availableHours, setAvailableHours] = useState([])

  useEffect(() => {
    fetchCities()
  }, [])

  const fetchCities = async () => {
    try {
      const { appointmentService } = await import('../services/localStorage')
      const result = await appointmentService.getCities()
      if (result.success) {
        setCities(result.cities)
      } else {
        setError('Erro ao carregar cidades')
      }
    } catch (err) {
      setError('Erro ao carregar cidades')
    }
  }

  const fetchUBS = async (cityId) => {
    try {
      setLoading(true)
      const { appointmentService } = await import('../services/localStorage')
      const result = await appointmentService.getUBSByCity(cityId)
      if (result.success) {
        setUbsList(result.ubs)
        // Limpar seleções dependentes
        setAppointmentData(prev => ({
          ...prev,
          ubs_id: '',
          especialidade_id: '',
          medico: '',
          data_agendamento: '',
          turno: '',
          horario: ''
        }))
        setEspecialidades([])
        setMedicos([])
        setAvailableDates([])
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Erro ao carregar UBS')
    } finally {
      setLoading(false)
    }
  }

  const fetchEspecialidades = async (ubsId) => {
    try {
      setLoading(true)
      const { appointmentService } = await import('../services/localStorage')
      const result = await appointmentService.getSpecialtiesByUBS(ubsId)
      if (result.success) {
        setEspecialidades(result.especialidades)
        // Limpar seleções dependentes
        setAppointmentData(prev => ({
          ...prev,
          especialidade_id: '',
          medico: '',
          data_agendamento: '',
          turno: '',
          horario: ''
        }))
        setMedicos([])
        setAvailableDates([])
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Erro ao carregar especialidades')
    } finally {
      setLoading(false)
    }
  }

  const fetchMedicos = async (ubsId, especialidadeId) => {
    try {
      setLoading(true)
      const { appointmentService } = await import('../services/localStorage')
      const result = await appointmentService.getDoctorsByUBSAndSpecialty(ubsId, especialidadeId)
      if (result.success) {
        setMedicos(result.medicos)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Erro ao carregar médicos')
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableDates = async () => {
    try {
      setLoading(true)
      const { appointmentService } = await import('../services/localStorage')
      const result = await appointmentService.getAvailableDates(
        appointmentData.ubs_id,
        appointmentData.especialidade_id
      )
      if (result.success) {
        setAvailableDates(result.available_dates)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Erro ao carregar datas disponíveis')
    } finally {
      setLoading(false)
    }
  }

  const handleCityChange = (cityId) => {
    setAppointmentData(prev => ({ ...prev, cidade_id: cityId }))
    fetchUBS(cityId)
  }

  const handleUBSChange = (ubsId) => {
    setAppointmentData(prev => ({ ...prev, ubs_id: ubsId }))
    fetchEspecialidades(ubsId)
  }

  const handleEspecialidadeChange = (especialidadeId) => {
    setAppointmentData(prev => ({ ...prev, especialidade_id: especialidadeId }))
    fetchMedicos(appointmentData.ubs_id, especialidadeId)
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setAppointmentData(prev => ({ ...prev, data_agendamento: date.data }))
    
    // Definir horários disponíveis baseado no turno
    const dateInfo = availableDates.find(d => d.data === date.data)
    if (dateInfo) {
      const allHours = [
        ...dateInfo.turnos.manha.horarios.map(h => ({ horario: h, turno: 'manha' })),
        ...dateInfo.turnos.tarde.horarios.map(h => ({ horario: h, turno: 'tarde' }))
      ]
      setAvailableHours(allHours)
    }
  }

  const handleHourSelect = (hourData) => {
    setAppointmentData(prev => ({
      ...prev,
      horario: hourData.horario,
      turno: hourData.turno
    }))
  }

  const updateUserInfo = async () => {
    try {
      const { userService } = await import('../services/localStorage')
      const result = await userService.updateUser(userData.user.id, userInfo)
      
      if (result.success && onUserDataUpdate) {
        onUserDataUpdate({
          ...userData,
          user: result.user
        })
      }
      
      return result.success
    } catch (err) {
      return false
    }
  }

  const createAppointment = async () => {
    try {
      setLoading(true)
      
      // Buscar nomes para salvar no agendamento
      const city = cities.find(c => c.id === parseInt(appointmentData.cidade_id))
      const ubs = ubsList.find(u => u.id === parseInt(appointmentData.ubs_id))
      const especialidade = especialidades.find(e => e.id === parseInt(appointmentData.especialidade_id))
      
      const { appointmentService } = await import('../services/localStorage')
      const result = await appointmentService.create({
        user_id: userData.user.id,
        cidade_nome: city?.nome || '',
        ubs_nome: ubs?.nome || '',
        ubs_endereco: ubs?.endereco || '',
        especialidade_nome: especialidade?.nome || '',
        medico: appointmentData.medico,
        data: appointmentData.data_agendamento,
        horario: appointmentData.horario,
        turno: appointmentData.turno,
        observacoes: appointmentData.observacoes
      })

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          onComplete()
        }, 2000)
      } else {
        setError(result.error || 'Erro ao criar agendamento')
      }
    } catch (err) {
      setError('Erro interno. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleNextStep = async () => {
    if (step === 1) {
      // Validar dados pessoais
      if (!userInfo.nome_completo || !userInfo.celular) {
        setError('Preencha todos os campos obrigatórios')
        return
      }
      
      const success = await updateUserInfo()
      if (!success) {
        setError('Erro ao atualizar dados pessoais')
        return
      }
    } else if (step === 2) {
      // Validar seleção de local e especialidade
      if (!appointmentData.cidade_id || !appointmentData.ubs_id || !appointmentData.especialidade_id || !appointmentData.medico) {
        setError('Selecione cidade, UBS, especialidade e médico')
        return
      }
      
      await fetchAvailableDates()
    } else if (step === 3) {
      // Validar data e horário
      if (!appointmentData.data_agendamento || !appointmentData.horario) {
        setError('Selecione data e horário')
        return
      }
      
      await createAppointment()
      return
    }
    
    setError('')
    setStep(step + 1)
  }

  const handlePrevStep = () => {
    setError('')
    setStep(step - 1)
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
              <div className="bg-teal-50 p-4 rounded-lg mb-4 text-left">
                <p className="text-sm text-teal-700">
                  <strong>Local:</strong> {ubsList.find(u => u.id === parseInt(appointmentData.ubs_id))?.nome}
                </p>
                <p className="text-sm text-teal-700">
                  <strong>Especialidade:</strong> {especialidades.find(e => e.id === parseInt(appointmentData.especialidade_id))?.nome}
                </p>
                <p className="text-sm text-teal-700">
                  <strong>Médico:</strong> {appointmentData.medico}
                </p>
                <p className="text-sm text-teal-700">
                  <strong>Data:</strong> {new Date(appointmentData.data_agendamento).toLocaleDateString('pt-BR')}
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

        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step > stepNumber ? 'bg-teal-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Dados Pessoais */}
        {step === 1 && (
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
                  <Label htmlFor="nome_completo" className="text-teal-700">Nome Completo *</Label>
                  <Input
                    id="nome_completo"
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={userInfo.nome_completo}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, nome_completo: e.target.value }))}
                    required
                    className="border-teal-200 focus:border-teal-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="celular" className="text-teal-700">Celular *</Label>
                  <Input
                    id="celular"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={userInfo.celular}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, celular: e.target.value }))}
                    required
                    className="border-teal-200 focus:border-teal-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="carteira_sus" className="text-teal-700">Carteira do SUS</Label>
                <Input
                  id="carteira_sus"
                  type="text"
                  placeholder="Número da carteira do SUS"
                  value={userInfo.carteira_sus}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, carteira_sus: e.target.value }))}
                  className="border-teal-200 focus:border-teal-400"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Local e Especialidade */}
        {step === 2 && (
          <Card className="bg-white/80 backdrop-blur-sm border-teal-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-teal-700">
                <Building2 className="h-5 w-5 mr-2" />
                Local e Especialidade
              </CardTitle>
              <CardDescription>
                Selecione a cidade, UBS e especialidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cidade" className="text-teal-700">Cidade *</Label>
                  <Select
                    value={appointmentData.cidade_id}
                    onValueChange={handleCityChange}
                    required
                  >
                    <SelectTrigger className="border-teal-200 focus:border-teal-400">
                      <SelectValue placeholder="Selecione a cidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id.toString()}>
                          {city.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ubs" className="text-teal-700">UBS *</Label>
                  <Select
                    value={appointmentData.ubs_id}
                    onValueChange={handleUBSChange}
                    disabled={!appointmentData.cidade_id}
                    required
                  >
                    <SelectTrigger className="border-teal-200 focus:border-teal-400">
                      <SelectValue placeholder="Selecione a UBS" />
                    </SelectTrigger>
                    <SelectContent>
                      {ubsList.map((ubs) => (
                        <SelectItem key={ubs.id} value={ubs.id.toString()}>
                          <div>
                            <div className="font-medium">{ubs.nome}</div>
                            <div className="text-xs text-gray-500">{ubs.endereco}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="especialidade" className="text-teal-700">Especialidade *</Label>
                  <Select
                    value={appointmentData.especialidade_id}
                    onValueChange={handleEspecialidadeChange}
                    disabled={!appointmentData.ubs_id}
                    required
                  >
                    <SelectTrigger className="border-teal-200 focus:border-teal-400">
                      <SelectValue placeholder="Selecione a especialidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {especialidades.map((esp) => (
                        <SelectItem key={esp.id} value={esp.id.toString()}>
                          {esp.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medico" className="text-teal-700">Médico *</Label>
                  <Select
                    value={appointmentData.medico}
                    onValueChange={(value) => setAppointmentData(prev => ({ ...prev, medico: value }))}
                    disabled={!appointmentData.especialidade_id}
                    required
                  >
                    <SelectTrigger className="border-teal-200 focus:border-teal-400">
                      <SelectValue placeholder="Selecione o médico" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicos.map((medico) => (
                        <SelectItem key={medico} value={medico}>
                          {medico}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Data e Horário */}
        {step === 3 && (
          <Card className="bg-white/80 backdrop-blur-sm border-teal-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-teal-700">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Data e Horário
              </CardTitle>
              <CardDescription>
                Selecione a data e horário da consulta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {availableDates.length > 0 && (
                <div>
                  <Label className="text-teal-700 mb-3 block">Datas Disponíveis</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableDates.slice(0, 12).map((date) => (
                      <Button
                        key={date.data}
                        variant={selectedDate?.data === date.data ? "default" : "outline"}
                        className={`p-3 h-auto ${
                          selectedDate?.data === date.data 
                            ? 'bg-teal-600 hover:bg-teal-700' 
                            : 'border-teal-200 hover:bg-teal-50'
                        }`}
                        onClick={() => handleDateSelect(date)}
                      >
                        <div className="text-center">
                          <div className="text-sm font-medium">
                            {new Date(date.data).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: '2-digit' 
                            })}
                          </div>
                          <div className="text-xs">
                            {new Date(date.data).toLocaleDateString('pt-BR', { 
                              weekday: 'short' 
                            })}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {selectedDate && availableHours.length > 0 && (
                <div>
                  <Label className="text-teal-700 mb-3 block">Horários Disponíveis</Label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {availableHours.map((hourData) => (
                      <Button
                        key={`${hourData.horario}-${hourData.turno}`}
                        variant={appointmentData.horario === hourData.horario ? "default" : "outline"}
                        className={`${
                          appointmentData.horario === hourData.horario 
                            ? 'bg-teal-600 hover:bg-teal-700' 
                            : 'border-teal-200 hover:bg-teal-50'
                        }`}
                        onClick={() => handleHourSelect(hourData)}
                      >
                        {hourData.horario}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="observacoes" className="text-teal-700">Observações</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Observações adicionais sobre a consulta..."
                  value={appointmentData.observacoes}
                  onChange={(e) => setAppointmentData(prev => ({ ...prev, observacoes: e.target.value }))}
                  className="border-teal-200 focus:border-teal-400"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={step === 1}
            className="border-teal-200 text-teal-700 hover:bg-teal-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          <Button
            onClick={handleNextStep}
            disabled={loading}
            className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : step === 3 ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirmar Agendamento
              </>
            ) : (
              <>
                Próximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NewAppointmentOriginal

