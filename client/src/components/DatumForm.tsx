import { useForm } from "react-hook-form";
import type { InsertDatum, Datum } from "@db/schema";
import { parseImperialMeasurement, formatImperialMeasurement, splitImperialMeasurement } from "../lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface DatumFormProps {
  datum?: Datum;
  datums: Datum[];
  onSubmit: (datum: InsertDatum) => void;
  onCancel: () => void;
}

type FormData = {
  name: string;
  isAbsolute: boolean;
  parentId: number | null;
  feet: number;
  inches: number;
  isNegative: boolean;
};

export function DatumForm({ datum, datums, onSubmit, onCancel }: DatumFormProps) {
  const initialValue = datum ? splitImperialMeasurement(Number(datum.zOffset)) : { feet: 0, inches: 0 };
  const form = useForm<FormData>({
    defaultValues: {
      name: datum?.name ?? "",
      isAbsolute: datum?.isAbsolute ?? true,
      feet: Math.abs(initialValue.feet),
      inches: Math.abs(initialValue.inches),
      parentId: datum?.parentId ?? null,
      isNegative: datum ? Number(datum.zOffset) < 0 : false,
    },
  });

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit((data) => {
          const feet = Number(data.feet || 0);
          const inches = Number(data.inches || 0);
          const totalInches = ((feet * 12) + inches) * (data.isNegative ? -1 : 1);
          
          onSubmit({
            name: data.name,
            isAbsolute: data.isAbsolute,
            parentId: data.parentId,
            zOffset: totalInches
          });
        })} 
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isAbsolute"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Absolute Position</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-[auto,1fr,1fr] gap-4 items-end">
          <FormField
            control={form.control}
            name="isNegative"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Negative</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="feet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feet</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value || 0}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="inches"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inches</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value || 0}
                    min={0}
                    max={11}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {!form.watch("isAbsolute") && (
          <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference Datum</FormLabel>
                <Select
                  value={field.value?.toString()}
                  onValueChange={(value) =>
                    field.onChange(value ? parseInt(value) : null)
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a datum" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {datums
                      .filter((d) => d.id !== datum?.id)
                      .map((d) => (
                        <SelectItem key={d.id?.toString()} value={d.id?.toString() ?? ''}>
                          {d.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
