export const getReviewAverage = (reviews: number[]) => {
  if (!reviews.length) return 0
  return reviews.reduce((acc, review) => acc + review, 0) / reviews.length
}
