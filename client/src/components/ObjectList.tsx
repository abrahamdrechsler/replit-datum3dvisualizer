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
import type { Object, Datum } from "@db/schema";
import { Edit2, Trash2 } from "lucide-react";

interface ObjectListProps {
  objects: Object[];
  datums: Datum[];
  onEdit: (object: Object) => void;
  onDelete: (object: Object) => void;
}

export function ObjectList({ objects, datums, onEdit, onDelete }: ObjectListProps) {
  const getDatumName = (id: number | null) => {
    if (!id) return "-";
    const datum = datums.find((d) => d.id === id);
    return datum ? datum.name : "-";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Bottom Datum</TableHead>
            <TableHead>Bottom Offset</TableHead>
            <TableHead>Top Datum</TableHead>
            <TableHead>Top Offset</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {objects.map((object) => (
            <TableRow key={object.id}>
              <TableCell className="font-medium">{object.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: object.color }}
                  />
                  {object.color}
                </div>
              </TableCell>
              <TableCell>{getDatumName(object.bottomDatumId)}</TableCell>
              <TableCell>{formatImperialMeasurement(object.bottomOffset)}</TableCell>
              <TableCell>{getDatumName(object.topDatumId)}</TableCell>
              <TableCell>{formatImperialMeasurement(object.topOffset)}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(object)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(object)}
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
