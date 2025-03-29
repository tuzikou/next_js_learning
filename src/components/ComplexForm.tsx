'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { formSchema, FormValues } from "@/types/form"
import { CompanyInfoSection } from "./form/CompanyInfoSection"
import { ProductInfoSection } from "./form/ProductInfoSection"

export default function ComplexForm() {
  const [showBillingAddress, setShowBillingAddress] = useState(false)
  const [selectedWeight, setSelectedWeight] = useState<string>("")
  const [customWeight, setCustomWeight] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sameAsBilling: true,
      productType: "客梯",
      weight: "",
      width: "",
      depth: "",
      companyName: "",
      phoneAreaCode: "",
      phoneNumber: "",
      companyAddress: "",
      billingAddress: "",
    },
    mode: "onChange",
  })

  const onSubmit = (values: FormValues) => {
    console.log(values)
  }

  return (
    <div className="p-8 bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CompanyInfoSection
            form={form}
            showBillingAddress={showBillingAddress}
            setShowBillingAddress={setShowBillingAddress}
          />
          
          <ProductInfoSection
            form={form}
            selectedWeight={selectedWeight}
            setSelectedWeight={setSelectedWeight}
            customWeight={customWeight}
            setCustomWeight={setCustomWeight}
          />

          <Button 
            type="submit" 
            className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            提交
          </Button>
        </form>
      </Form>
    </div>
  )
}
