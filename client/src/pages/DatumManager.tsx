import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Datum, InsertDatum } from "@db/schema";
import { calculateAbsoluteOffset } from "../lib/utils";

import { Button } from "@/components/ui/button";
import { DatumList } from "../components/DatumList";
import { ElevationView } from "../components/ElevationView";

import { DatumForm } from "../components/DatumForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import * as api from "../lib/api";

export function DatumManager() {
  const [editDatum, setEditDatum] = useState<Datum | null>(null);
  const [deleteDatum, setDeleteDatum] = useState<Datum | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: datums = [] } = useQuery({
    queryKey: ["datums"],
    queryFn: api.fetchDatums,
  });

  const createMutation = useMutation({
    mutationFn: api.createDatum,
    onSuccess: (newDatum) => {
      console.log('Datum created successfully:', newDatum);
      queryClient.invalidateQueries({ queryKey: ["datums"] });
      toast({ title: "Datum created successfully" });
      setEditDatum(null);
    },
    onError: (error) => {
      console.error('Failed to create datum:', error);
      toast({ 
        title: "Failed to create datum", 
        description: "Please try again", 
        variant: "destructive" 
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, datum }: { id: number; datum: Partial<InsertDatum> }) =>
      api.updateDatum(id, datum),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["datums"] });
      toast({ title: "Datum updated successfully" });
      setEditDatum(null);
    },
    onError: (error) => {
      console.error('Failed to update datum:', error);
      toast({ 
        title: "Failed to update datum", 
        description: "Please try again",
        variant: "destructive" 
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteDatum,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["datums"] });
      toast({ title: "Datum deleted successfully" });
      setDeleteDatum(null);
    },
  });

  const handleSubmit = (datum: InsertDatum) => {
    console.log('handleSubmit called with datum:', datum);
    console.log('editDatum state:', editDatum);

    if (editDatum?.id) {
      console.log('Updating existing datum:', editDatum.id);
      updateMutation.mutate({ id: editDatum.id, datum });
    } else {
      console.log('Creating new datum:', datum);
      createMutation.mutate(datum);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Datum Manager</h1>
        <Button onClick={() => setEditDatum({ 
          id: 0,
          name: "", 
          isAbsolute: true, 
          zOffset: "0", 
          parentId: null 
        })}>
          <Plus className="mr-2 h-4 w-4" /> Add Datum
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Datums</h2>
          <DatumList
            datums={datums}
            onEdit={setEditDatum}
            onDelete={setDeleteDatum}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Elevation View</h2>
          <div className="border rounded-lg p-4 bg-white">
            <ElevationView datums={datums} />
          </div>
        </div>
      </div>

      <Dialog open={!!editDatum} onOpenChange={() => setEditDatum(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editDatum?.id ? "Edit Datum" : "Create Datum"}
            </DialogTitle>
            <DialogDescription>
              Enter datum details below
            </DialogDescription>
          </DialogHeader>
          {editDatum && (
            <DatumForm
              datum={editDatum}
              datums={datums}
              onSubmit={handleSubmit}
              onCancel={() => setEditDatum(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteDatum}
        onOpenChange={() => setDeleteDatum(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Datum</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this datum? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDatum?.id ? deleteMutation.mutate(deleteDatum.id) : undefined}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}