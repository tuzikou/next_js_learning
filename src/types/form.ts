import * as z from "zod"

// 表单验证模式
export const formSchema = z.object({
  companyName: z.string().min(1, "公司姓名为必填项"),
  phoneAreaCode: z.string()
    .min(1, "电话区号为必填项")
    .regex(/^\+\d{1,4}$/, "请输入有效的国际电话区号（例如：+86）"),
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

export type FormValues = z.infer<typeof formSchema> 