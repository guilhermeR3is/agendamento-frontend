import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Heart, Shield, Calendar } from 'lucide-react'

const Login = ({ onLogin }) => {
  const [cpf, setCpf] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const handleCpfChange = (e) => {
    const formatted = formatCPF(e.target.value)
    if (formatted.length <= 14) {
      setCpf(formatted)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Importar o serviço de localStorage dinamicamente
      const { userService } = await import('../services/localStorage')
      
      const result = await userService.login(
        cpf.replace(/\D/g, ''),
        dataNascimento
      )

      if (result.success) {
        onLogin(result)
      } else {
        setError(result.error || 'Erro ao fazer login')
      }
    } catch (err) {
      setError('Erro interno. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        {/* Header com logo e título */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            SaúdeConnect
          </h1>
          <p className="text-gray-600">Agendamento de consultas médicas</p>
        </div>

        {/* Card de login */}
        <Card className="bg-white/80 backdrop-blur-sm border-teal-100 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl font-bold text-teal-700">
              Acesse sua conta
            </CardTitle>
            <CardDescription className="text-gray-600">
              Digite seu CPF e data de nascimento para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-teal-700 font-medium">CPF</Label>
                <div className="relative">
                  <Input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={handleCpfChange}
                    required
                    className="pl-10 border-teal-200 focus:border-teal-400 focus:ring-teal-400"
                  />
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataNascimento" className="text-teal-700 font-medium">Data de Nascimento</Label>
                <div className="relative">
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                    required
                    className="pl-10 border-teal-200 focus:border-teal-400 focus:ring-teal-400"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
                </div>
              </div>
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300" 
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar no Sistema'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer informativo */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>Sistema seguro e confiável para agendamento de consultas</p>
        </div>
      </div>
    </div>
  )
}

export default Login

