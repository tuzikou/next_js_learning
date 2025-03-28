import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UseFormReturn } from "react-hook-form"
import { FormValues } from "@/types/form"

interface DimensionFieldProps {
  form: UseFormReturn<FormValues>
  name: "width" | "depth"
  label: string
  options: string[]
  placeholder: string
  range: string
  min: number
  max: number
}

export function DimensionField({
  form,
  name,
  label,
  options,
  placeholder,
  range,
  min,
  max
}: DimensionFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 text-slate-700">
            {label}
          </FormLabel>
          <div className="space-y-4">
            {options.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {options.map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant={field.value === value ? "default" : "outline"}
                    className="min-w-[80px]"
                    onClick={() => field.onChange(value)}
                  >
                    {value}
                  </Button>
                ))}
                <Button
                  type="button"
                  variant={!options.includes(field.value) ? "default" : "outline"}
                  className="min-w-[80px]"
                  onClick={() => field.onChange("")}
                >
                  自定义
                </Button>
              </div>
            )}

            {(options.length === 0 || !options.includes(field.value)) && (
              <div className="space-y-2">
                <FormControl>
                  <Input
                    type="number"
                    placeholder={placeholder}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="max-w-[200px]"
                  />
                </FormControl>
                <p className="text-sm text-slate-500">
                  可输入 {range} 之间的数值
                </p>
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
} 