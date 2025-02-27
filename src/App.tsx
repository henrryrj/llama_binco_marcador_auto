import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Pencil, Star, Plus, Trash, RefreshCw } from "lucide-react"
import { format } from 'date-fns'

export default function Bingo() {
  const [gridData, setGridData] = useState<Array<Array<{ value: number | string; marked: boolean }>>>(initializeGridData())
  const [plays, setPlays] = useState<Array<{ name: string; points: number; completed: boolean }>>(initializePlays())
  const [isEditing, setIsEditing] = useState(false)
  const [bingoTitle, setBingoTitle] = useState("BINGO")
  const [cartonNumber, setCartonNumber] = useState("")
  const [resetCount, setResetCount] = useState(1)
  const [cartonCost, setCartonCost] = useState(20) // Default cost
  const [cartonGain, setCartonGain] = useState(0) // Default gain
  const [currentDate, setCurrentDate] = useState(format(new Date(), 'yyyy-MM-dd'))

  useEffect(() => {
    const savedGridData = localStorage.getItem('bingoGridData')
    const savedPlays = localStorage.getItem('bingoPlays')
    const savedTitle = localStorage.getItem('bingoTitle')
    const savedCarton = localStorage.getItem('bingoCarton')
    const savedResetCount = localStorage.getItem('bingoResetCount')
    const savedCartonCost = localStorage.getItem('bingoCartonCost')
    const savedCartonGain = localStorage.getItem('bingoCartonGain')
    const savedCurrentDate = localStorage.getItem('bingoCurrentDate')

    if (savedGridData) setGridData(JSON.parse(savedGridData))
    if (savedPlays) setPlays(JSON.parse(savedPlays))
    if (savedTitle) setBingoTitle(savedTitle)
    if (savedCarton) setCartonNumber(savedCarton)
    if (savedResetCount) setResetCount(parseInt(savedResetCount, 10))
    if (savedCartonCost) setCartonCost(parseInt(savedCartonCost, 10))
    if (savedCartonGain) setCartonGain(parseInt(savedCartonGain, 10))
    if (savedCurrentDate) setCurrentDate(savedCurrentDate)
  }, [])

  useEffect(() => {
    localStorage.setItem('bingoGridData', JSON.stringify(gridData))
  }, [gridData])

  useEffect(() => {
    localStorage.setItem('bingoPlays', JSON.stringify(plays))
  }, [plays])

  useEffect(() => {
    localStorage.setItem('bingoTitle', bingoTitle)
  }, [bingoTitle])

  useEffect(() => {
    localStorage.setItem('bingoCarton', cartonNumber)
  }, [cartonNumber])

  useEffect(() => {
    localStorage.setItem('bingoResetCount', resetCount.toString())
  }, [resetCount])

  useEffect(() => {
    localStorage.setItem('bingoCartonCost', cartonCost.toString())
  }, [cartonCost])

  useEffect(() => {
    localStorage.setItem('bingoCartonGain', cartonGain.toString())
  }, [cartonGain])

  useEffect(() => {
    localStorage.setItem('bingoCurrentDate', currentDate)
  }, [currentDate])

  function initializeGridData() {
    const letters = ['B', 'I', 'N', 'G', 'O']
    const rows = 6
    const cols = 5
    const gridData = Array.from({ length: rows }, (_, rowIndex) =>
      Array.from({ length: cols }, (_, colIndex) => ({
        value: rowIndex === 0 ? letters[colIndex] : (colIndex * 15) + (rowIndex - 1) * 5 + 1,
        marked: rowIndex === 0, // Mark the first row as already marked (for labels)
      }))
    )
    // Set the center cell to a star and make it selectable
    gridData[3][2] = { value: 'STAR', marked: false }
    return gridData
  }

  function initializePlays() {
    return [
      { name: "EXPLOSION", points: 800, completed: false },
      { name: "COMODÍN", points: 800, completed: false },
      { name: "BINGO LOCO", points: 800, completed: false },
      { name: "LINEA", points: 800, completed: false },
      { name: "DOBLE LINEA", points: 800, completed: false },
      { name: "TRIPLE LINEA V", points: 800, completed: false },
      { name: "FIGURA", points: 800, completed: false },
      { name: "LLENA", points: 1000, completed: false },
      { name: "CONSUELO", points: 1000, completed: false },

    ]
  }

  function toggleCell(rowIndex: number, colIndex: number) {
    if (rowIndex === 0) return // Do not allow marking the header row
    const newGridData = gridData.map((row, rIndex) =>
      row.map((cell, cIndex) =>
        rIndex === rowIndex && cIndex === colIndex ? { ...cell, marked: !cell.marked } : cell
      )
    )
    setGridData(newGridData)
  }

  function resetGrid() {
    setGridData(initializeGridData())
    setPlays(initializePlays())
    setBingoTitle("BINGO")
    setCartonNumber("")
    setResetCount(resetCount + 1)
  }

  function togglePlayCompletion(index: number) {
    const newPlays = plays.map((play, i) =>
      i === index ? { ...play, completed: !play.completed } : play
    )
    setPlays(newPlays)
  }

  function handlePlayChange(index: number, field: 'name' | 'points', value: string | number) {
    const newPlays = plays.map((play, i) =>
      i === index ? { ...play, [field]: field === 'points' ? parseInt(value as string, 10) || 0 : value } : play
    )
    setPlays(newPlays)
  }

  function handleGridValueChange(rowIndex: number, colIndex: number, value: string) {
    if (rowIndex === 0) return // Do not allow editing the header row
    const newGridData = gridData.map((row, rIndex) =>
      row.map((cell, cIndex) =>
        rIndex === rowIndex && cIndex === colIndex ? { ...cell, value: parseInt(value, 10) || cell.value } : cell
      )
    )
    setGridData(newGridData)
  }

  function addPlay() {
    if (plays.length >= 15) return // Limit to 15 plays
    setPlays([...plays, { name: "", points: 0, completed: false }])
  }

  function removePlay(index: number) {
    const newPlays = plays.filter((_, i) => i !== index)
    setPlays(newPlays)
  }

  function resetResetCount() {
    setResetCount(0)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white p-4">
      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <Input
                  value={bingoTitle}
                  onChange={(e) => setBingoTitle(e.target.value.toUpperCase())}
                  className="w-full text-2xl font-bold"
                />
              ) : (
                <CardTitle className="text-2xl font-bold">{bingoTitle}</CardTitle>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold">#CARTON:</span>
              <Input
                value={cartonNumber}
                onChange={(e) => setCartonNumber(e.target.value.toUpperCase())}
                className="w-20"
                placeholder="001"
              />
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold">Fecha:</span>
              <Input
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="w-40"
                type="date"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold">Costo:</span>
              <Input
                value={cartonCost.toString()}
                onChange={(e) => setCartonCost(parseInt(e.target.value) || 0)}
                className="w-20"
                type="number"
              />
              <span className="text-lg font-semibold">Ganancia:</span>
              <Input
                value={cartonGain.toString()}
                onChange={(e) => setCartonGain(parseInt(e.target.value) || 0)}
                className="w-20"
                type="number"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {gridData.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`p-4 text-center border-2 border-gray-300 rounded h-16 ${
                    cell.marked && rowIndex !== 0 ? 'bg-red-100' : 'bg-white'
                  }`}
                  onClick={() => toggleCell(rowIndex, colIndex)}
                >
                  {rowIndex === 0 ? (
                    <span className="text-lg font-bold">{cell.value}</span>
                  ) : cell.value === 'STAR' ? (
                    <div className="flex items-center justify-center h-full w-full">
                      <Star className="h-10 w-10 text-yellow-500" />
                    </div>
                  ) : (
                    isEditing ? (
                      <Input
                        value={cell.value.toString()}
                        onChange={(e) => handleGridValueChange(rowIndex, colIndex, e.target.value)}
                        className="w-full"
                      />
                    ) : (
                      <span>{cell.value}</span>
                    )
                  )}
                </div>
              ))
            )}
          </div>
          <div className="mt-4 flex justify-center">
            <Button onClick={resetGrid} variant="outline">
              Limpiar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              JUGADA #{resetCount}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                <Pencil className="mr-2 h-4 w-4" /> {isEditing ? 'Guardar' : 'Editar'}
              </Button>
              <Button variant="outline" onClick={addPlay} disabled={plays.length >= 15}>
                <Plus className="mr-2 h-4 w-4" /> Add Jugada
              </Button>
              <Button variant="outline" onClick={resetResetCount}>
                <RefreshCw className="mr-2 h-4 w-4" /> Limpiar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {plays.map((play, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`play-${index}`}
                  checked={play.completed}
                  onCheckedChange={() => togglePlayCompletion(index)}
                />
                {isEditing ? (
                  <>
                    <Input
                      value={play.name}
                      onChange={(e) => handlePlayChange(index, 'name', e.target.value.toUpperCase())}
                      className="w-32"
                    />
                    <Input
                      type="number"
                      value={play.points.toString()}
                      onChange={(e) => handlePlayChange(index, 'points', parseInt(e.target.value) || 0)}
                      className="w-20"
                    />
                    <Button variant="outline" onClick={() => removePlay(index)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Label htmlFor={`play-${index}`}>
                      {play.completed ? '✅' : ''}
                    </Label>
                    <span>{play.name} ({play.points} BS)</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}