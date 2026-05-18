export function calculatePaint(room) {
  const { length, width, height } = room
  const wallArea = 2 * (length + width) * height
  // Расход: 1 литр на 10 кв.м (пример)
  const liters = wallArea / 10
  return { wallArea, liters }
}

export function calculateBaseboard(room) {
  const { length, width } = room
  return 2 * (length + width)
}

export function calculatePlanks(room, plankLength = 0.6, plankWidth = 0.1) {
  const { length, width } = room
  const floorArea = length * width
  const plankArea = plankLength * plankWidth
  const total = Math.ceil(floorArea / plankArea)
  const withReserve = Math.ceil(total * 1.05)
  return { floorArea, plankArea, total, withReserve }
}