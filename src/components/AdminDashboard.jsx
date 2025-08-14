import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Building, 
  MapPin, 
  Stethoscope, 
  Calendar, 
  Users, 
  LogOut,
  Plus,
  Settings
} from 'lucide-react'

const AdminDashboard = ({ adminData, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [cities, setCities] = useState([])
  const [ubsList, setUbsList] = useState([])
  const [services, setServices] = useState([])
  const [appointments, setAppointments] = useState([])
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Formulários
  const [newCity, setNewCity] = useState('')
  const [newUBS, setNewUBS] = useState({ nome: '', endereco: '', cidade_id: '' })
  const [newService, setNewService] = useState({ nome: '', descricao: '' })
  const [newSlot, setNewSlot] = useState({
    ubs_id: '',
    service_id: '',
    data: '',
    turno: '',
    quantidade_total: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchCities(),
        fetchUBS(),
        fetchServices(),
        fetchAppointments(),
        fetchSlots()
      ])
    } catch (err) {
      setError('Erro ao carregar dados')
    }
  }

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/admin/cities')
      const data = await response.json()
      if (data.success) setCities(data.cities)
    } catch (err) {
      console.error('Erro ao buscar cidades:', err)
    }
  }

  const fetchUBS = async () => {
    try {
      const response = await fetch('/api/admin/ubs')
      const data = await response.json()
      if (data.success) setUbsList(data.ubs)
    } catch (err) {
      console.error('Erro ao buscar UBS:', err)
    }
  }

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/services')
      const data = await response.json()
      if (data.success) setServices(data.services)
    } catch (err) {
      console.error('Erro ao buscar serviços:', err)
    }
  }

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/admin/appointments')
      const data = await response.json()
      if (data.success) setAppointments(data.appointments)
    } catch (err) {
      console.error('Erro ao buscar agendamentos:', err)
    }
  }

  const fetchSlots = async () => {
    try {
      const response = await fetch('/api/admin/slots')
      const data = await response.json()
      if (data.success) setSlots(data.slots)
    } catch (err) {
      console.error('Erro ao buscar slots:', err)
    }
  }

  const createCity = async () => {
    if (!newCity.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/admin/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: newCity })
      })
      
      const data = await response.json()
      if (data.success) {
        setSuccess('Cidade criada com sucesso!')
        setNewCity('')
        fetchCities()
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Erro ao criar cidade')
    } finally {
      setLoading(false)
    }
  }

  const createUBS = async () => {
    if (!newUBS.nome || !newUBS.cidade_id) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/admin/ubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUBS)
      })
      
      const data = await response.json()
      if (data.success) {
        setSuccess('UBS criada com sucesso!')
        setNewUBS({ nome: '', endereco: '', cidade_id: '' })
        fetchUBS()
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Erro ao criar UBS')
    } finally {
      setLoading(false)
    }
  }

  const createService = async () => {
    if (!newService.nome) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService)
      })
      
      const data = await response.json()
      if (data.success) {
        setSuccess('Serviço criado com sucesso!')
        setNewService({ nome: '', descricao: '' })
        fetchServices()
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Erro ao criar serviço')
    } finally {
      setLoading(false)
    }
  }

  const createSlot = async () => {
    if (!newSlot.ubs_id || !newSlot.service_id || !newSlot.data || !newSlot.turno || !newSlot.quantidade_total) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/admin/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSlot)
      })
      
      const data = await response.json()
      if (data.success) {
        setSuccess('Slot criado com sucesso!')
        setNewSlot({ ubs_id: '', service_id: '', data: '', turno: '', quantidade_total: '' })
        fetchSlots()
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Erro ao criar slot')
    } finally {
      setLoading(false)
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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="text-gray-600">
              {adminData.role === 'SuperAdmin' ? 'Super Administrador' : 'Gerente de UBS'}
            </p>
          </div>
          <Button onClick={onLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="cities">Cidades</TabsTrigger>
            <TabsTrigger value="ubs">UBS</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="slots">Vagas</TabsTrigger>
            <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Cidades</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{cities.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de UBS</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{ubsList.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Serviços</CardTitle>
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{services.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{appointments.length}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Cidades</CardTitle>
                <CardDescription>Adicione e gerencie cidades do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nome da cidade"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                  />
                  <Button onClick={createCity} disabled={loading}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {cities.map((city) => (
                    <div key={city.id} className="flex items-center justify-between p-2 border rounded">
                      <span>{city.nome}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ubs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar UBS</CardTitle>
                <CardDescription>Adicione e gerencie unidades básicas de saúde</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Input
                    placeholder="Nome da UBS"
                    value={newUBS.nome}
                    onChange={(e) => setNewUBS(prev => ({ ...prev, nome: e.target.value }))}
                  />
                  <Input
                    placeholder="Endereço"
                    value={newUBS.endereco}
                    onChange={(e) => setNewUBS(prev => ({ ...prev, endereco: e.target.value }))}
                  />
                  <Select value={newUBS.cidade_id} onValueChange={(value) => setNewUBS(prev => ({ ...prev, cidade_id: value }))}>
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
                <Button onClick={createUBS} disabled={loading}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar UBS
                </Button>
                
                <div className="space-y-2">
                  {ubsList.map((ubs) => (
                    <div key={ubs.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{ubs.nome}</span>
                        <p className="text-sm text-gray-500">{ubs.endereco} - {ubs.cidade_nome}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Serviços</CardTitle>
                <CardDescription>Adicione e gerencie tipos de serviços médicos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    placeholder="Nome do serviço"
                    value={newService.nome}
                    onChange={(e) => setNewService(prev => ({ ...prev, nome: e.target.value }))}
                  />
                  <Input
                    placeholder="Descrição (opcional)"
                    value={newService.descricao}
                    onChange={(e) => setNewService(prev => ({ ...prev, descricao: e.target.value }))}
                  />
                </div>
                <Button onClick={createService} disabled={loading}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Serviço
                </Button>
                
                <div className="space-y-2">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{service.nome}</span>
                        {service.descricao && (
                          <p className="text-sm text-gray-500">{service.descricao}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="slots" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Vagas</CardTitle>
                <CardDescription>Crie e gerencie vagas de atendimento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-5">
                  <Select value={newSlot.ubs_id} onValueChange={(value) => setNewSlot(prev => ({ ...prev, ubs_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="UBS" />
                    </SelectTrigger>
                    <SelectContent>
                      {ubsList.map((ubs) => (
                        <SelectItem key={ubs.id} value={ubs.id}>
                          {ubs.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={newSlot.service_id} onValueChange={(value) => setNewSlot(prev => ({ ...prev, service_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    type="date"
                    value={newSlot.data}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, data: e.target.value }))}
                  />
                  
                  <Select value={newSlot.turno} onValueChange={(value) => setNewSlot(prev => ({ ...prev, turno: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Turno" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manhã">Manhã</SelectItem>
                      <SelectItem value="Tarde">Tarde</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    type="number"
                    placeholder="Quantidade"
                    value={newSlot.quantidade_total}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, quantidade_total: e.target.value }))}
                  />
                </div>
                <Button onClick={createSlot} disabled={loading}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Vaga
                </Button>
                
                <div className="space-y-2">
                  {slots.map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{slot.ubs_nome} - {slot.service_nome}</span>
                        <p className="text-sm text-gray-500">
                          {new Date(slot.data).toLocaleDateString('pt-BR')} - {slot.turno}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {slot.quantidade_disponivel}/{slot.quantidade_total}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agendamentos</CardTitle>
                <CardDescription>Visualize todos os agendamentos do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{appointment.user_nome}</h3>
                          <p className="text-sm text-gray-500">CPF: {appointment.user_cpf}</p>
                          <p className="text-sm text-gray-500">Celular: {appointment.user_celular}</p>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="grid gap-2 text-sm">
                        <p><strong>Serviço:</strong> {appointment.service_nome}</p>
                        <p><strong>UBS:</strong> {appointment.ubs_nome}</p>
                        <p><strong>Data:</strong> {new Date(appointment.data_agendamento).toLocaleDateString('pt-BR')}</p>
                        <p><strong>Turno:</strong> {appointment.turno}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminDashboard

