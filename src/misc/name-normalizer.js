const numberOfCharactersInString = (s, char) =>
  (s.match(new RegExp(char, 'g'))||[]).length;

const parts = name => name.trim().split(' ')

const last = name => parts(name)[parts(name).length - 1]

const first = name => parts(name)[0]

const middleNames = name => parts(name).slice(1, -1)

const middleInitial = midName =>
  midName.length > 1 ? midName[0] + '.' : midName[0]

const middleInitials = name => middleNames(name).map(middleInitial).join(' ')

const isMononym = name => parts(name).length === 1

const hasMiddleName = name => parts(name).length > 2

const hasSuffix = name => name.split(',').length > 1

const suffix = name => hasSuffix(name) ? `,${name.split(',')[1]}` : ""

let extractBaseNameAndSuffix = function (name) {
  return name.split(',')
}

const throwOnTooManyCommas = (name) => {
  if (numberOfCharactersInString(name,',') > 1)
    throw new Error()
}

export const normalize = name => {
  throwOnTooManyCommas(name)

  if (isMononym(name)) return name

  const [fullName] = extractBaseNameAndSuffix(name)

  if (hasMiddleName(fullName)) {
    return `${last(fullName)}, ${first(fullName)} ${middleInitials(fullName)}${suffix(name)}`
  }
  return `${last(fullName)}, ${first(fullName)}${suffix(name)}`
}
