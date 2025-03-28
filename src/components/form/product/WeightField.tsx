import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UseFormReturn } from "react-hook-form"
import { FormValues } from "@/types/form"

interface WeightFieldProps {
  form: UseFormReturn<FormValues>
  selectedWeight: string
  setSelectedWeight: (weight: string) => void
  customWeight: boolean
  setCustomWeight: (custom: boolean) => void
}

export function WeightField({
  form,
  selectedWeight,
  setSelectedWeight,
  customWeight,
  setCustomWeight
}: WeightFieldProps) {
  return (
    <FormField
      control={form.control}
      name="weight"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 text-slate-700">
            载重（千克）
          </FormLabel>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {["630", "1000", "1250"].map((weight) => (
                <Button
                  key={weight}
                  type="button"
                  variant={field.value === weight ? "default" : "outline"}
                  className="min-w-[80px]"
                  onClick={() => {
                    setCustomWeight(false)
                    field.onChange(weight)
                    setSelectedWeight(weight)
                    form.setValue("width", "")
                    form.setValue("depth", "")
                  }}
                >
                  {weight}
                </Button>
              ))}
              <Button
                type="button"
                variant={customWeight ? "default" : "outline"}
                className="min-w-[80px]"
                onClick={() => {
                  setCustomWeight(true)
                  field.onChange("")
                  setSelectedWeight("")
                  form.setValue("width", "")
                  form.setValue("depth", "")
                }}
              >
                自定义
              </Button>
            </div>

            {customWeight && (
              <div className="space-y-2">
                <FormControl>
                  <Input
                    type="number"
                    placeholder="请输入载重 (200-10000)"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                      setSelectedWeight(e.target.value)
                      form.setValue("width", "")
                      form.setValue("depth", "")
                    }}
                    className="max-w-[200px]"
                  />
                </FormControl>
                <p className="text-sm text-slate-500">
                  可输入 200-10000 之间的数值
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