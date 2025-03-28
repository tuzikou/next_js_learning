import { UseFormReturn } from "react-hook-form"
import { FormValues } from "@/types/form"
import { getWidthOptions, getDepthOptions } from "@/utils/elevator"
import { ProductTypeField } from "./product/ProductTypeField"
import { WeightField } from "./product/WeightField"
import { DimensionField } from "./product/DimensionField"

interface ProductInfoSectionProps {
  form: UseFormReturn<FormValues>
  selectedWeight: string
  setSelectedWeight: (weight: string) => void
  customWeight: boolean
  setCustomWeight: (custom: boolean) => void
}

export function ProductInfoSection({
  form,
  selectedWeight,
  setSelectedWeight,
  customWeight,
  setCustomWeight
}: ProductInfoSectionProps) {
  const productType = form.watch("productType")

  return (
    <div className="space-y-6 p-6 bg-slate-50/50 rounded-lg border border-slate-100">
      <ProductTypeField form={form} />

      {productType === "客梯" && (
        <>
          <WeightField
            form={form}
            selectedWeight={selectedWeight}
            setSelectedWeight={setSelectedWeight}
            customWeight={customWeight}
            setCustomWeight={setCustomWeight}
          />

          <DimensionField
            form={form}
            name="width"
            label="轿厢宽度（毫米）"
            options={getWidthOptions(selectedWeight)}
            placeholder="请输入宽度 (1000-2000)"
            range="1000-2000"
            min={1000}
            max={2000}
          />

          <DimensionField
            form={form}
            name="depth"
            label="轿厢深度（毫米）"
            options={getDepthOptions(selectedWeight, form.watch("width"))}
            placeholder="请输入深度 (1000-2500)"
            range="1000-2500"
            min={1000}
            max={2500}
          />
        </>
      )}
    </div>
  )
} 