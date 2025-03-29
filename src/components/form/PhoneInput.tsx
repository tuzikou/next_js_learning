import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { FormValues } from "@/types/form"
import { useState, useEffect } from "react"

interface PhoneInputProps {
  form: UseFormReturn<FormValues>
}

export function PhoneInput({ form }: PhoneInputProps) {
  const [areaCode, setAreaCode] = useState("+86")
  const [phoneNumber, setPhoneNumber] = useState("")

  useEffect(() => {
    form.setValue("phoneAreaCode", areaCode)
  }, [areaCode, form])

  useEffect(() => {
    form.setValue("phoneNumber", phoneNumber)
  }, [phoneNumber, form])

  const handleAreaCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.startsWith("+") && /^\+?\d*$/.test(value)) {
      setAreaCode(value)
    }
  }

  const handleAreaCodeBlur = () => {
    // 失焦时触发校验
    form.trigger("phoneAreaCode")
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      setPhoneNumber(value)
    }
  }

  const areaCodeError = form.formState.errors.phoneAreaCode?.message

  return (
    <div className="space-y-2">
      <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 text-slate-700">
        联系电话
      </FormLabel>
      <div className="flex gap-2">
        <FormItem className="w-[120px]">
          <FormControl>
            <Input
              placeholder="+86"
              value={areaCode}
              onChange={handleAreaCodeChange}
              onBlur={handleAreaCodeBlur}
              className={`text-center ${areaCodeError ? 'border-red-500' : ''}`}
            />
          </FormControl>
          {areaCodeError && (
            <p className="text-sm text-red-500">{areaCodeError}</p>
          )}
        </FormItem>
        <FormItem className="flex-1">
          <FormControl>
            <Input
              placeholder="请输入电话号码"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              maxLength={11}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </div>
    </div>
  )
} 