import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Pencil, Star, Plus, Trash, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function Bingo() {
  const [selectedCarton, setSelectedCarton] = useState<string>(() => {
    const savedCarton = localStorage.getItem("selectedCarton");
    return savedCarton || "Cartón 1";
  });
  const [gridData, setGridData] = useState<
    Array<Array<{ value: number | string; marked: boolean }>>
  >(initializeGridData());
  const [plays, setPlays] = useState<
    Array<{ name: string; points: number; completed: boolean }>
  >(initializePlays());
  const [isEditing, setIsEditing] = useState(false);
  const [bingoTitle, setBingoTitle] = useState("BINGO");
  const [cartonNumber, setCartonNumber] = useState("");
  const [resetCount, setResetCount] = useState(1);
  const [marcadosCount, setMarcadosCount] = useState(0);
  const [cartonCost, setCartonCost] = useState(0); // Default cost
  const [cartonGain, setCartonGain] = useState(0); // Default gain
  const [currentDate, setCurrentDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  useEffect(() => {
    const savedGridData = localStorage.getItem(
      `bingoGridData_${selectedCarton}`
    );
    const savedPlays = localStorage.getItem(`bingoPlays_${selectedCarton}`);
    const savedTitle = localStorage.getItem(`bingoTitle_${selectedCarton}`);
    const savedCarton = localStorage.getItem(`bingoCarton_${selectedCarton}`);
    const savedResetCount = localStorage.getItem(
      `bingoResetCount_${selectedCarton}`
    );
    const savedCartonCost = localStorage.getItem(
      `bingoCartonCost_${selectedCarton}`
    );
    const savedCartonGain = localStorage.getItem(
      `bingoCartonGain_${selectedCarton}`
    );
    const savedCurrentDate = localStorage.getItem(
      `bingoCurrentDate_${selectedCarton}`
    );

    if (savedGridData) setGridData(JSON.parse(savedGridData));
    if (savedPlays) setPlays(JSON.parse(savedPlays));
    if (savedTitle) setBingoTitle(savedTitle);
    if (savedCarton) setCartonNumber(savedCarton);
    if (savedResetCount) setResetCount(parseInt(savedResetCount, 10));
    if (savedCartonCost) setCartonCost(parseInt(savedCartonCost, 10));
    if (savedCartonGain) setCartonGain(parseInt(savedCartonGain, 10));
    if (savedCurrentDate) setCurrentDate(savedCurrentDate);
  }, [selectedCarton]);

  useEffect(() => {
    localStorage.setItem(
      `bingoGridData_${selectedCarton}`,
      JSON.stringify(gridData)
    );
  }, [gridData, selectedCarton]);

  useEffect(() => {
    localStorage.setItem(`bingoPlays_${selectedCarton}`, JSON.stringify(plays));
  }, [plays, selectedCarton]);

  useEffect(() => {
    localStorage.setItem(`bingoTitle_${selectedCarton}`, bingoTitle);
  }, [bingoTitle, selectedCarton]);

  useEffect(() => {
    localStorage.setItem(`bingoCarton_${selectedCarton}`, cartonNumber);
  }, [cartonNumber, selectedCarton]);

  useEffect(() => {
    localStorage.setItem(
      `bingoResetCount_${selectedCarton}`,
      resetCount.toString()
    );
  }, [resetCount, selectedCarton]);

  useEffect(() => {
    localStorage.setItem(
      `bingoCartonCost_${selectedCarton}`,
      cartonCost.toString()
    );
  }, [cartonCost, selectedCarton]);

  useEffect(() => {
    localStorage.setItem(
      `bingoCartonGain_${selectedCarton}`,
      cartonGain.toString()
    );
  }, [cartonGain, selectedCarton]);

  useEffect(() => {
    localStorage.setItem(`bingoCurrentDate_${selectedCarton}`, currentDate);
  }, [currentDate, selectedCarton]);

  useEffect(() => {
    localStorage.setItem("selectedCarton", selectedCarton);
  }, [selectedCarton]);

  function initializeGridData() {
    const letters = ["B", "I", "N", "G", "O"];
    const rows = 6;
    const cols = 5;
    const gridData = Array.from({ length: rows }, (_, rowIndex) =>
      Array.from({ length: cols }, (_, colIndex) => ({
        value: rowIndex === 0 ? letters[colIndex] : "",
        marked: rowIndex === 0, // Mark the first row as already marked (for labels)
      }))
    );
    // Set the center cell to a star and make it selectable
    gridData[3][2] = { value: "STAR", marked: false };
    return gridData;
  }

  function initializePlays() {
    return [
      // { name: "EXPLOSION", points: 800, completed: false },
      // { name: "COMODÍN", points: 800, completed: false },
      // { name: "BINGO LOCO", points: 800, completed: false },
      // { name: "LINEA", points: 800, completed: false },
      // { name: "DOBLE LINEA", points: 800, completed: false },
      // { name: "TRIPLE LINEA V", points: 800, completed: false },
      // { name: "FIGURA", points: 800, completed: false },
      // { name: "LLENA", points: 1000, completed: false },
      // { name: "CONSUELO", points: 1000, completed: false },
    ];
  }

  function toggleCell(rowIndex: number, colIndex: number) {
    if (isEditing) return;
    if (rowIndex === 0) return; // Do not allow marking the header row
    const newGridData = gridData.map((row, rIndex) =>
      row.map((cell, cIndex) =>
        rIndex === rowIndex && cIndex === colIndex
          ? { ...cell, marked: !cell.marked }
          : cell
      )
    );
    setGridData(newGridData);
    const markedCount = newGridData
      .flat()
      .reduce(
        (count, cell) => count + (cell.marked && cell.value !== "STAR" ? 1 : 0),
        0
      );
    setMarcadosCount(markedCount - 5);
  }

  function resetGrid() {
    setGridData((prevGrid) =>
      prevGrid.map((row, rowIndex) =>
        row.map((cell) => ({
          ...cell,
          marked: rowIndex === 0, // Mantiene marcado solo el encabezado
        }))
      )
    );
    setPlays(plays.map((jugada) => ({ ...jugada, completed: false })));
    setResetCount(resetCount + 1);
    setMarcadosCount(0);
  }
  function resetGridValue() {
    MySwal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción limpiará el cartón de bingo.",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sí, limpiar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result: any) => {
      if (result.isConfirmed) {
        setGridData((prevGrid) =>
          prevGrid.map((row, rowIndex) =>
            row.map((cell) => ({
              ...cell,
              value: rowIndex !== 0 && cell.value !== "STAR" ? "" : cell.value,
              marked: rowIndex === 0, // Mantiene marcado solo el encabezado
            }))
          )
        );
        setCartonNumber("");

        MySwal.fire(
          "¡Cartón limpiado!",
          "El cartón ha sido reiniciado.",
          "success"
        );
      }
    });
  }

  function togglePlayCompletion(index: number) {
    const newPlays = plays.map((play, i) =>
      i === index ? { ...play, completed: !play.completed } : play
    );
    setPlays(newPlays);
  }

  function handlePlayChange(
    index: number,
    field: "name" | "points",
    value: string | number
  ) {
    const newPlays = plays.map((play, i) =>
      i === index
        ? {
            ...play,
            [field]:
              field === "points" ? parseInt(value as string, 10) || 0 : value,
          }
        : play
    );
    setPlays(newPlays);
  }

  function handleGridValueChange(
    rowIndex: number,
    colIndex: number,
    value: string
  ) {
    if (rowIndex === 0) return; // No permitir edición en la fila de encabezado

    const newGridData = gridData.map((row, rIndex) =>
      row.map((cell, cIndex) =>
        rIndex === rowIndex && cIndex === colIndex
          ? { ...cell, value: value === "" ? "" : parseInt(value, 10) || 0 }
          : cell
      )
    );

    setGridData(newGridData);
  }

  function addPlay() {
    if (plays.length >= 15) return; // Limit to 15 plays
    setPlays([...plays, { name: "", points: 0, completed: false }]);
  }

  function removePlay(index: number) {
    const newPlays = plays.filter((_, i) => i !== index);
    setPlays(newPlays);
  }

  function resetResetCount() {
    setResetCount(1);
  }

  function handleCartonChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedCarton(event.target.value);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white p-4">
      {/* Contenedor principal ajustado para diferentes tamaños de pantalla */}
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-6xl mx-auto ">
        {/* Card del Bingo */}
        <Card className="w-full">
          <CardHeader className="">
            <div className="flex flex-wrap md:flex-nowrap justify-between items-center text-center md:text-left">
              {/* Título del bingo */}
              <div className="flex items-center space-x-2 w-full md:w-auto justify-center md:justify-start mb-2 md:mb-0">
                {isEditing ? (
                  <Input
                    value={bingoTitle}
                    onChange={(e) =>
                      setBingoTitle(e.target.value.toUpperCase())
                    }
                    className="w-full text-2xl font-bold text-center"
                  />
                ) : (
                  <CardTitle className="text-2xl font-bold w-full">
                    {bingoTitle}
                  </CardTitle>
                )}
              </div>

              {/* Número de cartón */}
              <div className="flex items-center space-x-2 w-full md:w-auto md:justify-end">
                <span className="text-lg font-semibold">
                  #{selectedCarton}:
                </span>
                <Input
                  value={cartonNumber}
                  onChange={(e) =>
                    setCartonNumber(e.target.value.toUpperCase())
                  }
                  className="w-20 text-center"
                  placeholder="0001"
                />
              </div>
            </div>

            {/* Sección ajustada para responsiva */}
            <div className="flex flex-wrap md:flex-nowrap justify-between mt-2 mb-0">
              <div className="flex items-center space-x-2 w-full md:w-auto">
                <span className="text-lg font-semibold">Fecha:</span>
                <Input
                  value={currentDate}
                  onChange={(e) => setCurrentDate(e.target.value)}
                  className="sm:w-auto md:w-40"
                  type="date"
                />
              </div>
              <div className="flex items-center space-x-2 w-full md:w-auto mt-2 md:mt-0">
                <span className="text-lg font-semibold">Costo:</span>
                <Input
                  value={cartonCost.toString()}
                  onChange={(e) => setCartonCost(parseInt(e.target.value))}
                  className="w-full md:w-20"
                  type="number"
                  placeholder="$"
                />
                <span className="text-lg font-semibold">Ganancia:</span>
                <Input
                  value={cartonGain.toString()}
                  onChange={(e) => setCartonGain(parseInt(e.target.value))}
                  className="w-full md:w-20"
                  type="number"
                  placeholder="$"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Número de cartón */}
            <div className="flex items-center space-x-2 w-full md:w-auto justify-end mb-0">
              <span className="text-lg font-semibold">{`${
                cartonNumber === "" ? "" : `#${cartonNumber}`
              }`}</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {gridData.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`aspect-[3/2] text-center border-2 border-gray-300 rounded flex items-center justify-center lg:text-3xl  ${
                      cell.marked && rowIndex !== 0
                        ? "bg-green-200"
                        : "bg-white"
                    }`}
                    onClick={() => toggleCell(rowIndex, colIndex)}
                  >
                    {rowIndex === 0 ? (
                      <span className="text-lg font-bold lg:text-3xl">
                        {cell.value}
                      </span>
                    ) : cell.value === "STAR" ? (
                      <div className="flex items-center justify-center">
                        <Star className="xs:h-6 xs:w-6 sm:h-12 sm:w-12 md:h-14 md:w-14 text-yellow-500 " />
                      </div>
                    ) : isEditing ? (
                      <Input
                        value={cell.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (
                            value === "" ||
                            (Number(value) >= 0 && Number(value) <= 99)
                          ) {
                            handleGridValueChange(rowIndex, colIndex, value);
                          }
                        }}
                        type="number"
                        max={99}
                        min={0}
                        className="w-full h-full text-center m-0 p-0"
                      />
                    ) : (
                      <span>{cell.value}</span>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="mt-4 flex items-center justify-between">
                <Button
                  onClick={resetGridValue}
                  variant="outline"
                  className="flex items-center gap-2 bg-red-200"
                >
                  <Trash className="h-4 w-4" />
                  Limpiar Cartón
                </Button>
                <Button
                  onClick={resetGrid}
                  variant="outline"
                  className="flex items-center gap-2 bg-green-200 ml-2"
                >
                  <Trash className="h-4 w-4" />
                  Limpiar marcados
                </Button>
              </div>

              <span className="font-semibold">{`Bolos restantes: ${
                24 - marcadosCount
              }`}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card de Jugadas */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              JUGADA #{resetCount}
            </CardTitle>
            <div className="flex flex-wrap justify-center items-center gap-2 mt-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Pencil className="h-4 w-4" />{" "}
                {isEditing ? "Guardar" : "Editar"}
              </Button>
              <Button
                variant="outline"
                onClick={addPlay}
                disabled={plays.length >= 15}
              >
                <Plus className="h-4 w-4" /> Jugadas
              </Button>
              <Button variant="outline" onClick={resetResetCount}>
                <RefreshCw className="h-4 w-4" /> Restaurar Jugadas
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {plays.map((play, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`play-${resetCount}`}
                    checked={play.completed}
                    onCheckedChange={() => togglePlayCompletion(index)}
                  />
                  {isEditing ? (
                    <>
                      <Input
                        value={play.name}
                        onChange={(e) =>
                          handlePlayChange(
                            index,
                            "name",
                            e.target.value.toUpperCase()
                          )
                        }
                        className="w-32"
                      />
                      <Input
                        type="number"
                        value={play.points.toString()}
                        onChange={(e) =>
                          handlePlayChange(
                            index,
                            "points",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-20"
                      />
                      <Button
                        variant="outline"
                        onClick={() => removePlay(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Label htmlFor={`play-${index}`}>
                        {play.completed ? "✅" : ""}
                      </Label>
                      <span>
                        {play.name} ({play.points} BS)
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card de Selección de Cartón (Siempre Abajo) */}
      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Seleccionar Cartón
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <select
              value={selectedCarton}
              onChange={handleCartonChange}
              className="border p-2 rounded"
            >
              {Array.from({ length: 10 }, (_, index) => (
                <option key={index} value={`Cartón ${index + 1}`}>
                  Cartón {index + 1}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
