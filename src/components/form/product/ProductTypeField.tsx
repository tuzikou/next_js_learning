import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { UseFormReturn } from "react-hook-form"
import { FormValues } from "@/types/form"

interface ProductTypeFieldProps {
  form: UseFormReturn<FormValues>
}

export function ProductTypeField({ form }: ProductTypeFieldProps) {
  return (
    <FormField
      control={form.control}
      name="productType"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 text-slate-700">
            产品类型
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="客梯" />
                </FormControl>
                <FormLabel className="font-normal">客梯</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="自动扶梯" />
                </FormControl>
                <FormLabel className="font-normal">自动扶梯</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="自动人行道" />
                </FormControl>
                <FormLabel className="font-normal">自动人行道</FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
} 