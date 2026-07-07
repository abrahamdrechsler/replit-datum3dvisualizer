import { Button } from "@/components/ui/button";
import { formatImperialMeasurement } from "../lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function calculateAbsoluteOffset(datum: Datum, datums: Datum[]): number {
  if (datum.isAbsolute) {
    return Number(datum.zOffset);
  }
  
  const parent = datums.find(d => d.id === datum.parentId);
  if (!parent) return Number(datum.zOffset);
  
  return calculateAbsoluteOffset(parent, datums) + Number(datum.zOffset);
}
import type { Datum } from "@db/schema";
import { Edit2, Trash2 } from "lucide-react";

interface DatumListProps {
  datums: Datum[];
  onEdit: (datum: Datum) => void;
  onDelete: (datum: Datum) => void;
}

export function DatumList({ datums, onEdit, onDelete }: DatumListProps) {
  const getAllRelativeDatums = (parentId: number | null): Datum[] => {
    const children = datums.filter(d => d.parentId === parentId);
    return children.reduce<Datum[]>((acc, child) => {
      const childDatums = getAllRelativeDatums(child.id);
      return [...acc, child, ...childDatums];
    }, []);
  };

  const sortDatums = (datums: Datum[]): Datum[] => {
    const absoluteDatums = datums.filter(d => d.isAbsolute);
    const result: Datum[] = [];
    
    absoluteDatums.forEach(parent => {
      const allChildren = getAllRelativeDatums(parent.id);
      const parentPos = calculateAbsoluteOffset(parent, datums);
      
      // Add higher children
      allChildren
        .filter(child => calculateAbsoluteOffset(child, datums) > parentPos)
        .sort((a, b) => calculateAbsoluteOffset(b, datums) - calculateAbsoluteOffset(a, datums))
        .forEach(child => result.push(child));
      
      // Add parent
      result.push(parent);
      
      // Add lower children
      allChildren
        .filter(child => calculateAbsoluteOffset(child, datums) <= parentPos)
        .sort((a, b) => calculateAbsoluteOffset(b, datums) - calculateAbsoluteOffset(a, datums))
        .forEach(child => result.push(child));
    });
    
    return result;
  };

  // Use sorted datums in the table
  const sortedDatums = sortDatums(datums);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Z-Offset</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDatums.map((datum) => (
            <TableRow key={datum.id}>
              <TableCell className="font-medium">
                <div style={{ 
                  paddingLeft: datum.isAbsolute ? 0 : '1.5rem',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {datum.name}
                </div>
              </TableCell>
              <TableCell>{datum.isAbsolute === true ? "Absolute" : "Relative"}</TableCell>
              <TableCell>{formatImperialMeasurement(Number(datum.zOffset))}</TableCell>
              <TableCell>
                {datum.parentId != null
                  ? datums.find((d) => d.id === datum.parentId)?.name ?? "-"
                  : "-"}
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(datum)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(datum)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
