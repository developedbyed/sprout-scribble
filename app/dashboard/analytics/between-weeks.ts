export default function betweenWeeks(
  dateToCheck: Date,
  betweenDate1: number,
  betweenDate2: number
) {
  const today = new Date()

  const targetDate1 = new Date(today)
  const targetDate2 = new Date(today)

  targetDate1.setDate(targetDate1.getDate() - betweenDate1)
  targetDate2.setDate(targetDate2.getDate() - betweenDate2)

  return dateToCheck >= targetDate1 && dateToCheck <= targetDate2
}
