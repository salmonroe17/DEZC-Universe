function luminance(hex: string) {
  const channels = hex.replace('#', '').match(/.{2}/g)?.map((n) => {
    const c = parseInt(n, 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }) ?? [0, 0, 0]
  return channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722
}

export function contrastRatio(a: string, b: string) {
  const first = luminance(a)
  const second = luminance(b)
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05)
}
