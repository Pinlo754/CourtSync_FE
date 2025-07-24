export const generateTimeSlots = (): string[] => {
  const slots: string[] = []
  for (let hour = 5; hour < 24; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`)
    slots.push(`${hour.toString().padStart(2, "0")}:30`)
  }
  return slots
}

export const formatTime = (time: string): string => {
  const date = new Date(time)
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
}

export const isTimeSlotBooked = (
  timeSlot: string,
  bookedSlots: { start: string; end: string }[],
  selectedDate: string
): boolean => {
  
  const slotTime = new Date(`${selectedDate}T${timeSlot}:00`)

  return bookedSlots.some(({ start, end }) => {
    const startTime = new Date(start)
    const endTime = new Date(end)
    return slotTime >= startTime && slotTime < endTime
  })
}


export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0]
}

export const createDateTimeString = (date: string, time: string): string => {
  return `${date}T${time}:00.000Z`
}
