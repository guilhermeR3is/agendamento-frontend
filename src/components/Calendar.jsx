import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Calendar = ({ availableSlots, onSelectSlot, selectedSlot }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Adicionar dias vazios do início
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Adicionar dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }
  
  const formatDate = (date) => {
    return date.toISOString().split('T')[0]
  }
  
  const getSlotForDate = (date) => {
    if (!date) return null
    const dateStr = formatDate(date)
    return availableSlots.find(slot => slot.data === dateStr)
  }
  
  const isDateAvailable = (date) => {
    if (!date) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (date < today) return false
    if (date.getDay() === 0 || date.getDay() === 6) return false // Fins de semana
    
    const slot = getSlotForDate(date)
    return slot && (slot.manha_disponivel > 0 || slot.tarde_disponivel > 0)
  }
  
  const handleDateClick = (date) => {
    if (!isDateAvailable(date)) return
    
    const slot = getSlotForDate(date)
    if (slot) {
      onSelectSlot(slot)
    }
  }
  
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }
  
  const days = getDaysInMonth(currentDate)
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <CardTitle className="text-lg">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="p-2"></div>
            }
            
            const isAvailable = isDateAvailable(date)
            const isSelected = selectedSlot && selectedSlot.data === formatDate(date)
            const slot = getSlotForDate(date)
            
            return (
              <Button
                key={index}
                variant={isSelected ? "default" : isAvailable ? "outline" : "ghost"}
                size="sm"
                className={`
                  p-2 h-10 text-sm
                  ${!isAvailable ? 'text-gray-400 cursor-not-allowed' : ''}
                  ${isSelected ? 'bg-blue-600 text-white' : ''}
                  ${isAvailable && !isSelected ? 'hover:bg-blue-50 border-blue-200' : ''}
                `}
                onClick={() => handleDateClick(date)}
                disabled={!isAvailable}
              >
                <div className="flex flex-col items-center">
                  <span>{date.getDate()}</span>
                  {isAvailable && slot && (
                    <div className="text-xs text-green-600">
                      {slot.manha_disponivel + slot.tarde_disponivel}
                    </div>
                  )}
                </div>
              </Button>
            )
          })}
        </div>
        
        {selectedSlot && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              {new Date(selectedSlot.data + 'T00:00:00').toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h4>
            
            <div className="space-y-2">
              {selectedSlot.manha_disponivel > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between"
                  onClick={() => onSelectSlot({ ...selectedSlot, turno: 'Manhã' })}
                >
                  <span>Manhã</span>
                  <span className="text-green-600">
                    {selectedSlot.manha_disponivel} de {selectedSlot.manha_total} vagas
                  </span>
                </Button>
              )}
              
              {selectedSlot.tarde_disponivel > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between"
                  onClick={() => onSelectSlot({ ...selectedSlot, turno: 'Tarde' })}
                >
                  <span>Tarde</span>
                  <span className="text-green-600">
                    {selectedSlot.tarde_disponivel} de {selectedSlot.tarde_total} vagas
                  </span>
                </Button>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
            <span>Dias disponíveis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-100 rounded"></div>
            <span>Dias indisponíveis</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Calendar

