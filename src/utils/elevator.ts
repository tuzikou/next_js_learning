// 获取可选的宽度选项
export const getWidthOptions = (weight: string) => {
  if (weight === "630") return ["1100"]
  if (weight === "1000") return ["1200"]
  if (weight === "1250") return ["1200", "1600"]
  return []
}

// 获取可选的深度选项
export const getDepthOptions = (weight: string, width: string) => {
  if (weight === "630") return ["1400"]
  if (weight === "1000") return ["2100"]
  if (weight === "1250") {
    if (width === "1200") return ["2100"]
    if (width === "1600") return ["1400"]
  }
  return []
} 