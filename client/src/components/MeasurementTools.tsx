import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Datum } from "@db/schema";

interface DatumManagerProps {
  datums: Datum[];
  calculateAbsoluteOffset: (datum: Datum, datums: Datum[]) => number;
}

export function DatumManager({ datums, calculateAbsoluteOffset }: DatumManagerProps) {
  const [selectedDatums, setSelectedDatums] = useState<Datum[]>([]);
  const [showMeasurements, setShowMeasurements] = useState(false);

  const toggleDatum = (datum: Datum) => {
    if (selectedDatums.find(d => d.id === datum.id)) {
      setSelectedDatums(selectedDatums.filter(d => d.id !== datum.id));
    } else if (selectedDatums.length < 2) {
      setSelectedDatums([...selectedDatums, datum]);
    }
  };

  const getMeasurement = () => {
    if (selectedDatums.length !== 2) return null;
    const offset1 = calculateAbsoluteOffset(selectedDatums[0], datums);
    const offset2 = calculateAbsoluteOffset(selectedDatums[1], datums);
    return Math.abs(offset1 - offset2);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant={showMeasurements ? "default" : "outline"}
          onClick={() => setShowMeasurements(!showMeasurements)}
          className="gap-2"
        >
          Measure
        </Button>
        {showMeasurements && selectedDatums.length === 2 && (
          <span className="text-sm font-medium">
            Distance: {getMeasurement() !== null ? getMeasurement() : 0}
          </span>
        )}
      </div>

      {showMeasurements && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Select two datums to measure the distance between them
          </p>
          <div className="grid gap-2">
            {datums.map((datum) => (
              <Button
                key={datum.id}
                variant={selectedDatums.find(d => d.id === datum.id) ? "default" : "outline"}
                onClick={() => toggleDatum(datum)}
                className="justify-start"
                size="sm"
              >
                {datum.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}