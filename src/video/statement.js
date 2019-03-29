const calculateCharge = (rental, movie) => {
  let totalCharge = 0
  switch (movie.code) {
  case 'regular':
    totalCharge = 2
    if (rental.days > 2)
      totalCharge += (rental.days - 2) * 1.5
    break
  case 'new':
    totalCharge = rental.days * 3
    break
  case 'childrens':
    totalCharge = 1.5
    if (rental.days > 3)
      totalCharge += (rental.days - 3) * 1.5
    break
  }
  return totalCharge
}

const calculateRenterPoints = (rental, movie) => {
  let totalRenterPoints = 1
  if (movie.code === 'new' && rental.days > 2) totalRenterPoints++
  return totalRenterPoints
}

const movie = (movies, rental) => movies[rental.movieID]

const calculateTotalCharge = (customer, movies) =>
  customer.rentals.reduce((total, rental) =>
    total + calculateCharge(rental, movie(movies, rental)), 0)

const calculateTotalRenterPoints = (customer, movies) =>
  customer.rentals.reduce((total, rental) =>
    total + calculateRenterPoints(rental, movie(movies, rental)), 0)

const detail = (movies, rental) =>
  `\t${movie(movies, rental).title}` +
  `\t${calculateCharge(rental, movie(movies, rental))}\n`

const header = customer => `Rental Record for ${customer.name}\n`

const footer = (customer, movies) =>
  `Amount owed is ${calculateTotalCharge(customer, movies)}\n` +
  `You earned ${calculateTotalRenterPoints(customer, movies)} frequent renter points\n`

export const statement = (customer, movies) => {
  let result = header(customer)
  for (let rental of customer.rentals)
    result += detail(movies, rental)
  result += footer(customer, movies)
  return result
}
