const numberOfCharactersInString = (s, char) =>
  (s.match(new RegExp(char, 'g'))||[]).length;

const parts = name => name.split(' ')

const last = name => name.parts[name.parts.length - 1]

const first = name => name.parts[0]

const initial = name =>
  name.length === 1 ? ` ${name}` : ` ${name[0]}.`

const hasMiddleName = name => name.parts.length > 2

const middleNames = name => name.parts.slice(1, -1)

const middleInitials = name => {
  if (!hasMiddleName(name)) return ''
  return middleNames(name).map(initial).join('')
}

const isMononym = name => name.parts.length === 1

const removeSuffix = name => name.split(',')[0]

const suffix = name => {
  const [, suffix] = name.fullName.split(',')
  return suffix ? `,${suffix}` : ``
}

const throwOnTooManyCommas = fullName => {
  if (numberOfCharactersInString(fullName, ',') > 1)
    throw new Error()
}

const parse = fullName => {
  throwOnTooManyCommas(fullName)
  const name = fullName.trim()
  const baseName = removeSuffix(name)
  return { fullName: name, baseName, parts: parts(baseName) }
}

export const normalize = fullName => {
  const name = parse(fullName)
  if (isMononym(name)) return name.fullName
  return `${last(name)}, ${first(name)}${middleInitials(name)}${suffix(name)}`
}
