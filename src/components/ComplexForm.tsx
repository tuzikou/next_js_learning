'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 表单验证模式
const formSchema = z.object({
  companyName: z.string().min(1, "公司姓名为必填项"),
  phoneAreaCode: z.string().min(1, "电话区号为必填项"),
  phoneNumber: z.string().regex(/^\d+$/, "电话号码必须是数字"),
  companyAddress: z.string().min(1, "公司地址为必填项"),
  sameAsBilling: z.boolean(),
  billingAddress: z.string().optional(),
  productType: z.enum(["客梯", "自动扶梯", "自动人行道"]),
  weight: z.union([
    z.enum(["630", "1000", "1250"]),
    z.string().regex(/^\d+$/).refine(
      (val) => {
        const num = parseInt(val);
        return num >= 200 && num <= 10000;
      },
      "自定义重量必须在200至10000之间"
    ),
  ]),
  width: z.string().refine(
    (val) => {
      const num = parseInt(val);
      return num >= 1000 && num <= 2000;
    },
    "宽度必须在1000至2000之间"
  ),
  depth: z.string().refine(
    (val) => {
      const num = parseInt(val);
      return num >= 1000 && num <= 2500;
    },
    "深度必须在1000至2500之间"
  ),
})

export default function ComplexForm() {
  const [showBillingAddress, setShowBillingAddress] = useState(false)
  const [selectedWeight, setSelectedWeight] = useState<string>("")
  const [customWeight, setCustomWeight] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sameAsBilling: true,
      productType: "客梯",
      weight: "",
      width: "",
      depth: "",
    },
    mode: "onChange",
  })

  const productType = form.watch("productType")

  // 获取可选的宽度选项
  const getWidthOptions = (weight: string) => {
    if (weight === "630") return ["1100"]
    if (weight === "1000") return ["1200"]
    if (weight === "1250") return ["1200", "1600"]
    return []
  }

  // 获取可选的深度选项
  const getDepthOptions = (weight: string, width: string) => {
    if (weight === "630") return ["1400"]
    if (weight === "1000") return ["2100"]
    if (weight === "1250") {
      if (width === "1200") return ["2100"]
      if (width === "1600") return ["1400"]
    }
    return []
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
  }

  return (
    <div className="p-8 bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* 公司信息 */}
          <div className="space-y-6 p-6 bg-slate-50/50 rounded-lg border border-slate-100">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem className="transition-all duration-200">
                  <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 text-slate-700">公司姓名</FormLabel>
                  <FormControl>
                    <Input {...field} className="transition-all duration-200 hover:border-slate-400 focus:border-slate-600" />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="phoneAreaCode"
                render={({ field }) => (
                  <FormItem className="flex-1 transition-all duration-200">
                    <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 text-slate-700">电话区号</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="例如: +86" className="transition-all duration-200 hover:border-slate-400 focus:border-slate-600" />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="flex-1 transition-all duration-200">
                    <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 text-slate-700">电话号码</FormLabel>
                    <FormControl>
                      <Input {...field} className="transition-all duration-200 hover:border-slate-400 focus:border-slate-600" />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="companyAddress"
              render={({ field }) => (
                <FormItem className="transition-all duration-200">
                  <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 text-slate-700">公司地址</FormLabel>
                  <FormControl>
                    <Input {...field} className="transition-all duration-200 hover:border-slate-400 focus:border-slate-600" />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sameAsBilling"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2 rounded-lg hover:bg-white transition-colors duration-200">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        setShowBillingAddress(!checked)
                      }}
                      className="transition-all duration-200 hover:border-slate-800"
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer text-slate-700">账单地址与公司地址相同</FormLabel>
                </FormItem>
              )}
            />

            {showBillingAddress && (
              <FormField
                control={form.control}
                name="billingAddress"
                render={({ field }) => (
                  <FormItem className="transition-all duration-200">
                    <FormLabel className="text-slate-700">账单地址</FormLabel>
                    <FormControl>
                      <Input {...field} className="transition-all duration-200 hover:border-slate-400 focus:border-slate-600" />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* 产品信息 */}
          <div className="space-y-6 p-6 bg-slate-50/50 rounded-lg border border-slate-100">
            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem className="transition-all duration-200">
                  <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 text-slate-700">产品类型</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-6"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0 px-4 py-2 rounded-lg hover:bg-white transition-colors duration-200">
                        <FormControl>
                          <RadioGroupItem value="客梯" className="transition-all duration-200 hover:border-slate-800" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          客梯
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0 px-4 py-2 rounded-lg hover:bg-white transition-colors duration-200">
                        <FormControl>
                          <RadioGroupItem value="自动扶梯" className="transition-all duration-200 hover:border-slate-800" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          自动扶梯
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0 px-4 py-2 rounded-lg hover:bg-white transition-colors duration-200">
                        <FormControl>
                          <RadioGroupItem value="自动人行道" className="transition-all duration-200 hover:border-slate-800" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          自动人行道
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />

            {productType === "客梯" && (
              <>
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem className="transition-all duration-200">
                      <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 text-slate-700">载重（千克）</FormLabel>
                      <div className="space-y-4">
                        <Select
                          defaultValue={field.value}
                          onValueChange={(value) => {
                            if (value === "custom") {
                              setCustomWeight(true)
                              field.onChange("")
                            } else {
                              setCustomWeight(false)
                              field.onChange(value)
                              setSelectedWeight(value)
                            }
                          }}
                        >
                          <SelectTrigger className="transition-all duration-200 hover:border-slate-400 focus:border-slate-600">
                            <SelectValue placeholder="选择载重" />
                          </SelectTrigger>
                          <SelectContent className="bg-white z-50 shadow-lg rounded-lg border-slate-200">
                            <SelectItem value="630">630</SelectItem>
                            <SelectItem value="1000">1000</SelectItem>
                            <SelectItem value="1250">1250</SelectItem>
                            <SelectItem value="custom">自定义</SelectItem>
                          </SelectContent>
                        </Select>
                        {customWeight && (
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="输入载重 (200-10000)"
                              onChange={(e) => {
                                field.onChange(e.target.value)
                                setSelectedWeight(e.target.value)
                              }}
                              className="transition-all duration-200 hover:border-slate-400 focus:border-slate-600"
                            />
                          </FormControl>
                        )}
                      </div>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="width"
                  render={({ field }) => (
                    <FormItem className="transition-all duration-200">
                      <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 text-slate-700">轿厢宽度（毫米）</FormLabel>
                      <FormControl>
                        {getWidthOptions(selectedWeight).length > 0 ? (
                          <Select
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="transition-all duration-200 hover:border-slate-400 focus:border-slate-600">
                              <SelectValue placeholder="选择宽度" />
                            </SelectTrigger>
                            <SelectContent className="bg-white z-50 shadow-lg rounded-lg border-slate-200">
                              {getWidthOptions(selectedWeight).map((width) => (
                                <SelectItem key={width} value={width}>
                                  {width}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            type="number"
                            placeholder="输入宽度 (1000-2000)"
                            {...field}
                            className="transition-all duration-200 hover:border-slate-400 focus:border-slate-600"
                          />
                        )}
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="depth"
                  render={({ field }) => (
                    <FormItem className="transition-all duration-200">
                      <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 text-slate-700">轿厢深度（毫米）</FormLabel>
                      <FormControl>
                        {getDepthOptions(selectedWeight, form.watch("width")).length > 0 ? (
                          <Select
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="transition-all duration-200 hover:border-slate-400 focus:border-slate-600">
                              <SelectValue placeholder="选择深度" />
                            </SelectTrigger>
                            <SelectContent className="bg-white z-50 shadow-lg rounded-lg border-slate-200">
                              {getDepthOptions(selectedWeight, form.watch("width")).map((depth) => (
                                <SelectItem key={depth} value={depth}>
                                  {depth}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            type="number"
                            placeholder="输入深度 (1000-2500)"
                            {...field}
                            className="transition-all duration-200 hover:border-slate-400 focus:border-slate-600"
                          />
                        )}
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

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
