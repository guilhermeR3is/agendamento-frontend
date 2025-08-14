import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, ArrowRight, Loader2, User, MapPin, CalendarIcon, Clock, CheckCircle } from 'lucide-react'
import Calendar from './Calendar'

const NewAppointment = ({ userData, onBack, onComplete, onUserDataUpdate }) => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Dados do usuário
  const [userInfo, setUserInfo] = useState({
    nome_completo: userData.user_data?.nome_completo || '',
    celular: userData.user_data?.celular || '',
    carteira_sus: userData.user_data?.carteira_sus || ''
  })
  
  // Dados do agendamento
  const [appointmentData, setAppointmentData] = useState({
    cidade_id: '',
    ubs_id: '',
    service_id: '',
    data_agendamento: '',
    turno: ''
  })
  
  // Listas de opções
  const [cities, setCities] = useState([])
  const [ubsList, setUbsList] = useState([])
  const [services, setServices] = useState([])
  const [availableDates, setAvailableDates] = useState([])

  useEffect(() => {
    fetchCities()
  }, [])

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/appointments/cities')
      const data = await response.json()
      if (data.success) {
        setCities(data.cities)
      }
    } catch (err) {
      setError('Erro ao carregar cidades')
    }
  }

  const fetchUBS = async (cityId) => {
    try {
      const response = await fetch(`/api/appointments/ubs/${cityId}`)
      const data = await response.json()
      if (data.success) {
        setUbsList(data.ubs)
      }
    } catch (err) {
      setError('Erro ao carregar UBS')
    }
  }

  const fetchServices = async (ubsId) => {
    try {
      const response = await fetch(`/api/appointments/services/${ubsId}`)
      const data = await response.json()
      if (data.success) {
        setServices(data.services)
      }
    } catch (err) {
      setError('Erro ao carregar serviços')
    }
  }

  const fetchAvailableDates = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/appointments/available-dates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ubs_id: appointmentData.ubs_id,
          service_id: appointmentData.service_id,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setAvailableDates(data.available_dates)
      }
    } catch (err) {
      setError('Erro ao carregar datas disponíveis')
    } finally {
      setLoading(false)
    }
  }

  const updateUserInfo = async () => {
    try {
      const response = await fetch('/api/auth/update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.user_id,
          ...userInfo,
        }),
      })
      const data = await response.json()
      
      if (data.success && onUserDataUpdate) {
        // Notificar o componente pai sobre a atualização dos dados
        onUserDataUpdate({
          ...userData,
          user_data: {
            ...userData.user_data,
            ...userInfo
          }
        })
      }
      
      return data.success
    } catch (err) {
      return false
    }
  }

  const createAppointment = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/appointments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.user_id,
          ...appointmentData,
        }),
      })
      const data = await response.json()
      if (data.success) {
        onComplete()
      } else {
        setError(data.error || 'Erro ao criar agendamento')
      }
    } catch (err) {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const handleNext = async () => {
    setError('')
    
    if (step === 1) {
      if (!userInfo.nome_completo || !userInfo.celular) {
        setError('Nome completo e celular são obrigatórios')
        return
      }
      await updateUserInfo()
      setStep(2)
    } else if (step === 2) {
      if (!appointmentData.cidade_id || !appointmentData.ubs_id || !appointmentData.service_id) {
        setError('Todos os campos são obrigatórios')
        return
      }
      await fetchAvailableDates()
      setStep(3)
    } else if (step === 3) {
      if (!appointmentData.data_agendamento || !appointmentData.turno) {
        setError('Selecione uma data e turno')
        return
      }
      setStep(4)
    } else if (step === 4) {
      await createAppointment()
    }
  }

  const handleCityChange = (cityId) => {
    setAppointmentData(prev => ({ ...prev, cidade_id: cityId, ubs_id: '', service_id: '' }))
    setUbsList([])
    setServices([])
    fetchUBS(cityId)
  }

  const handleUBSChange = (ubsId) => {
    setAppointmentData(prev => ({ ...prev, ubs_id: ubsId, service_id: '' }))
    setServices([])
    fetchServices(ubsId)
  }

  const renderStep1 = () => (
    <Card className="bg-white/80 backdrop-blur-sm border-teal-100 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-teal-700">
          <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
            <User className="h-6 w-6 text-teal-600" />
          </div>
          Dados Pessoais
        </CardTitle>
        <CardDescription className="text-gray-600">
          Confirme ou atualize seus dados pessoais
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="nome" className="text-teal-700 font-medium">Nome Completo *</Label>
          <Input
            id="nome"
            value={userInfo.nome_completo}
            onChange={(e) => setUserInfo(prev => ({ ...prev, nome_completo: e.target.value }))}
            placeholder="Digite seu nome completo"
            className="border-teal-200 focus:border-teal-400 focus:ring-teal-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="celular" className="text-teal-700 font-medium">Celular *</Label>
          <Input
            id="celular"
            value={userInfo.celular}
            onChange={(e) => setUserInfo(prev => ({ ...prev, celular: e.target.value }))}
            placeholder="(11) 99999-9999"
            className="border-teal-200 focus:border-teal-400 focus:ring-teal-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="carteiraSus" className="text-teal-700 font-medium">Carteira do SUS (opcional)</Label>
          <Input
            id="carteiraSus"
            value={userInfo.carteira_sus}
            onChange={(e) => setUserInfo(prev => ({ ...prev, carteira_sus: e.target.value }))}
            placeholder="Digite o número da carteira do SUS"
            className="border-teal-200 focus:border-teal-400 focus:ring-teal-400"
          />
        </div>
      </CardContent>
    </Card>
  )

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Local e Serviço</CardTitle>
        <CardDescription>
          Selecione a cidade, UBS e tipo de serviço
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Cidade</Label>
          <Select value={appointmentData.cidade_id} onValueChange={handleCityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma cidade" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.id}>
                  {city.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {ubsList.length > 0 && (
          <div className="space-y-2">
            <Label>UBS</Label>
            <Select value={appointmentData.ubs_id} onValueChange={handleUBSChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma UBS" />
              </SelectTrigger>
              <SelectContent>
                {ubsList.map((ubs) => (
                  <SelectItem key={ubs.id} value={ubs.id}>
                    {ubs.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {services.length > 0 && (
          <div className="space-y-2">
            <Label>Serviço</Label>
            <Select 
              value={appointmentData.service_id} 
              onValueChange={(value) => setAppointmentData(prev => ({ ...prev, service_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Data e Horário</CardTitle>
        <CardDescription>
          Selecione uma data e turno disponível
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Carregando datas disponíveis...</span>
          </div>
        ) : availableDates.length === 0 ? (
          <p className="text-gray-500">Nenhuma data disponível para este serviço.</p>
        ) : (
          <div className="space-y-4">
            {availableDates.map((dateInfo) => (
              <div key={dateInfo.data} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">
                  {new Date(dateInfo.data).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(dateInfo.turnos).map(([turno, info]) => (
                    <Button
                      key={turno}
                      variant={
                        appointmentData.data_agendamento === dateInfo.data && 
                        appointmentData.turno === turno ? "default" : "outline"
                      }
                      onClick={() => setAppointmentData(prev => ({
                        ...prev,
                        data_agendamento: dateInfo.data,
                        turno: turno
                      }))}
                      className="text-left"
                    >
                      <div>
                        <div className="font-semibold">{turno}</div>
                        <div className="text-sm">
                          {info.disponivel} de {info.total} vagas
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderStep4 = () => {
    const selectedCity = cities.find(c => c.id === appointmentData.cidade_id)
    const selectedUBS = ubsList.find(u => u.id === appointmentData.ubs_id)
    const selectedService = services.find(s => s.id === appointmentData.service_id)
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Confirmação do Agendamento</CardTitle>
          <CardDescription>
            Verifique os dados antes de confirmar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <h3 className="font-semibold">Dados Pessoais</h3>
              <p>Nome: {userInfo.nome_completo}</p>
              <p>Celular: {userInfo.celular}</p>
              {userInfo.carteira_sus && <p>Carteira SUS: {userInfo.carteira_sus}</p>}
            </div>
            
            <div>
              <h3 className="font-semibold">Agendamento</h3>
              <p>Cidade: {selectedCity?.nome}</p>
              <p>UBS: {selectedUBS?.nome}</p>
              <p>Serviço: {selectedService?.nome}</p>
              <p>Data: {new Date(appointmentData.data_agendamento).toLocaleDateString('pt-BR')}</p>
              <p>Turno: {appointmentData.turno}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header melhorado */}
        <div className="flex items-center gap-4 mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-teal-100">
          <Button onClick={onBack} variant="outline" size="sm" className="border-teal-200 text-teal-700 hover:bg-teal-50">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Novo Agendamento
            </h1>
            <p className="text-teal-600 font-medium">Etapa {step} de 4</p>
          </div>
        </div>

        {/* Indicador de progresso melhorado */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-teal-100">
          <div className="flex justify-between items-center">
            {[
              { num: 1, icon: User, label: 'Dados' },
              { num: 2, icon: MapPin, label: 'Local' },
              { num: 3, icon: CalendarIcon, label: 'Data' },
              { num: 4, icon: CheckCircle, label: 'Confirmar' }
            ].map(({ num, icon: Icon, label }) => (
              <div key={num} className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
                    num <= step
                      ? 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <span className={`mt-2 text-sm font-medium ${
                  num <= step ? 'text-teal-600' : 'text-gray-500'
                }`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Conteúdo dos steps */}
        <div className="mb-8">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* Botões de navegação melhorados */}
        <div className="flex justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-teal-100">
          <Button
            onClick={() => setStep(step - 1)}
            variant="outline"
            disabled={step === 1}
            className="border-teal-200 text-teal-700 hover:bg-teal-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <Button 
            onClick={handleNext} 
            disabled={loading}
            className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {step === 4 ? 'Confirmando...' : 'Processando...'}
              </>
            ) : (
              <>
                {step === 4 ? 'Confirmar Agendamento' : 'Próximo'}
                {step < 4 && <ArrowRight className="h-4 w-4 ml-2" />}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NewAppointment

