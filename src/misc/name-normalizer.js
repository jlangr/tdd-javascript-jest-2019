const numberOfCharactersInString = (s, char) =>
  (s.match(new RegExp(char, 'g'))||[]).length;

const parts = name => name.split(' ')

const last = name => parts(name)[parts(name).length - 1]

const first = name => parts(name)[0]

const hasMiddleName = name => parts(name).length > 2

const initial = name =>
  name.length === 1 ? ` ${name}` : ` ${name[0]}.`

const middleNames = name =>
  parts(name).slice(1, -1)


const middleInitials = name => {
  if (!hasMiddleName(name)) return ''
  const middle = middleNames(name)
  return middle.map(initial).join('')
}

const removeSuffix = name => {
  return name.split(',')[0]
}

const suffix = name => {
  const [, suffixPart] = name.split(',')
  return suffixPart ? `,${suffixPart}` : ''
}

const isMononym = name => parts(name).length === 1


const throwOnExcessCommas = name => {
  if (numberOfCharactersInString(name, ',') > 1)
    throw new Error()
}

export const normalize = fullName => {
  throwOnExcessCommas(fullName)
  const name = fullName.trim()
  const baseName = removeSuffix(name)
  if (isMononym(baseName)) return baseName
  return `${last(baseName)}, ${first(baseName)}${middleInitials(baseName)}${suffix(name)}`
}
