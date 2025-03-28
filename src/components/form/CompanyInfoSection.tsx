import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { UseFormReturn } from "react-hook-form"
import { FormValues } from "@/types/form"

interface CompanyInfoSectionProps {
  form: UseFormReturn<FormValues>
  showBillingAddress: boolean
  setShowBillingAddress: (show: boolean) => void
}

export function CompanyInfoSection({
  form,
  showBillingAddress,
  setShowBillingAddress
}: CompanyInfoSectionProps) {
  return (
    <div className="space-y-6 p-6 bg-slate-50/50 rounded-lg border border-slate-100">
      <FormField
        control={form.control}
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>公司姓名</FormLabel>
            <FormControl>
              <Input placeholder="请输入公司名称" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex gap-4">
        <FormField
          control={form.control}
          name="phoneAreaCode"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>电话区号</FormLabel>
              <FormControl>
                <Input placeholder="+86" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>电话号码</FormLabel>
              <FormControl>
                <Input placeholder="请输入电话号码" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="companyAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>公司地址</FormLabel>
            <FormControl>
              <Input placeholder="请输入公司地址" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sameAsBilling"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked)
                  setShowBillingAddress(!checked)
                }}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>账单地址与公司地址相同</FormLabel>
            </div>
          </FormItem>
        )}
      />

      {showBillingAddress && (
        <FormField
          control={form.control}
          name="billingAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>账单地址</FormLabel>
              <FormControl>
                <Input placeholder="请输入账单地址" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  )
} 