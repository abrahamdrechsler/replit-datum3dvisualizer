import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertObjectSchema, type InsertObject, type Datum } from "@db/schema";
import { parseImperialMeasurement } from "../lib/utils";
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

const COLORS = [
  { label: "Red", value: "#ef4444" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Green", value: "#22c55e" },
  { label: "Purple", value: "#a855f7" },
  { label: "Orange", value: "#f97316" },
];

interface ObjectFormProps {
  object?: InsertObject;
  datums: Datum[];
  onSubmit: (object: InsertObject) => void;
  onCancel: () => void;
}

export function ObjectForm({ object, datums, onSubmit, onCancel }: ObjectFormProps) {
  const form = useForm<Omit<InsertObject, 'bottomOffset' | 'topOffset'> & { bottomOffset: string, topOffset: string }>({
    resolver: zodResolver(insertObjectSchema),
    defaultValues: object ? {
      ...object,
      bottomOffset: `${object.bottomOffset}"`,
      topOffset: `${object.topOffset}"`,
    } : {
      name: "",
      color: COLORS[0].value,
      bottomDatumId: null,
      bottomOffset: "0\"",
      topDatumId: null,
      topOffset: "0\"",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => {
        const bottomOffset = parseImperialMeasurement(data.bottomOffset);
        const topOffset = parseImperialMeasurement(data.topOffset);
        
        if (bottomOffset.error) {
          form.setError("bottomOffset", { message: bottomOffset.error });
          return;
        }
        if (topOffset.error) {
          form.setError("topOffset", { message: topOffset.error });
          return;
        }
        
        onSubmit({
          ...data,
          bottomOffset: bottomOffset.value!,
          topOffset: topOffset.value!,
        });
      })} className="space-y-4">
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
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {COLORS.map((color) => (
                    <SelectItem
                      key={color.value}
                      value={color.value}
                      className="flex items-center gap-2"
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: color.value }}
                      />
                      {color.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bottomDatumId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bottom Datum</FormLabel>
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
                  {datums.map((d) => (
                    <SelectItem key={d.id} value={d.id.toString()}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bottomOffset"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bottom Offset</FormLabel>
              <FormControl>
                <Input {...field} placeholder='0"' />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topDatumId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Top Datum</FormLabel>
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
                  {datums.map((d) => (
                    <SelectItem key={d.id} value={d.id.toString()}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topOffset"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Top Offset</FormLabel>
              <FormControl>
                <Input {...field} placeholder='0"' />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
