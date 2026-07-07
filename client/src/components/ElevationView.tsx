import type { Datum, Object } from "@db/schema";
import { useMemo } from "react";
import { formatImperialMeasurement } from "../lib/utils";
function calculateAbsoluteOffset(datum: Datum, datums: Datum[]): number {
  if (datum.isAbsolute) {
    return Number(datum.zOffset);
  }
  
  const parent = datums.find(d => d.id === datum.parentId);
  if (!parent) return Number(datum.zOffset);
  
  return calculateAbsoluteOffset(parent, datums) + Number(datum.zOffset);
}


interface ElevationViewProps {
  datums: Datum[];
  objects?: Object[];
  width?: number;
  height?: number;
}

export function ElevationView({ datums, objects = [], width = 800, height = 600 }: ElevationViewProps) {
  const { minZ, maxZ, scale } = useMemo(() => {
    const zValues = datums.map((d) => calculateAbsoluteOffset(d, datums));
    const min = Math.min(...zValues, 0);
    const max = Math.max(...zValues);
    const padding = Math.max((max - min) * 0.2, 24); // Increase minimum padding
    return {
      minZ: min - padding,
      maxZ: max + padding,
      scale: (height - 80) / (max - min + 2 * padding), // Increase vertical padding
    };
  }, [datums, height]);

  const getY = (z: number) => height - ((z - minZ) * scale + 20);

  return (
    <svg width={width} height={height} className="bg-white">
      {/* Grid lines */}
      {Array.from({ length: 10 }, (_, i) => (
        <line
          key={`grid-${i}`}
          x1={0}
          y1={i * (height / 10)}
          x2={width}
          y2={i * (height / 10)}
          stroke="#f0f0f0"
          strokeWidth={1}
        />
      ))}

      {/* Objects */}
      {objects.map((object, index) => {
        const bottomY = getY(Number(object.bottomOffset));
        const topY = getY(Number(object.topOffset));
        return (
          <rect
            key={object.id}
            x={100 + (index * 50)}
            y={topY}
            width={40}
            height={bottomY - topY}
            fill={object.color}
            opacity={0.7}
          />
        );
      })}

      {/* Datum lines */}
      {datums.map((datum, index) => {
          const parentDatum = datum.parentId ? datums.find((d) => d.id === datum.parentId) : null;
          return (
            <g key={datum.id?.toString() ?? ''}>
              <line
                x1={40}
                y1={getY(calculateAbsoluteOffset(datum, datums))}
                x2={width - 40}
                y2={getY(calculateAbsoluteOffset(datum, datums))}
                stroke={datum.isAbsolute ? "hsl(270, 100%, 50%)" : "hsl(210, 100%, 50%)"}
                strokeWidth={2}
              />
              <text
                x={50}
                y={getY(calculateAbsoluteOffset(datum, datums)) - 5}
                className="fill-current text-sm"
              >
                {datum.name} ({formatImperialMeasurement(calculateAbsoluteOffset(datum, datums))})
              </text>
              {datum.parentId && parentDatum && (
                <g key={`dim-${datum.id}`}>
                  <line
                    x1={width - 120 - (index * 20)}
                    y1={getY(calculateAbsoluteOffset(datum, datums))}
                    x2={width - 120 - (index * 20)}
                    y2={getY(calculateAbsoluteOffset(parentDatum, datums))}
                    stroke="#666"
                    strokeWidth={1}
                  />
                  <text
                    x={width - 140 - (index * 20)}
                    y={(getY(calculateAbsoluteOffset(datum, datums)) + getY(calculateAbsoluteOffset(parentDatum, datums))) / 2}
                    className="fill-current text-sm"
                    textAnchor="end"
                  >
                    {formatImperialMeasurement(Math.abs(Number(datum.zOffset)))}
                  </text>
                </g>
              )}
            </g>
          );
        })}
    </svg>
  );
}
