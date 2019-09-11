const numberOfCharactersInString = (s, char) =>
  (s.match(new RegExp(char, 'g'))||[]).length;

const last = name => name.parts[name.parts.length - 1]

const first = name => name.parts[0]

const isMononym = name => name.parts.length === 1

const initial = name =>
  name.length === 1 ? ` ${name}` : ` ${name[0]}.`

const middleInitials = name =>
  name.parts.slice(1, -1).map(initial).join('')

const suffix = name => name.suffix ? `,${name.suffix}` : ''

const parse = fullName => {
  const name = fullName.trim()
  const [baseName, suffix] = name.split(',')
  const parts = baseName.split(' ')
  return { name, baseName, parts, suffix }
}

const throwOnTooManyCommas = name => {
  if (numberOfCharactersInString(name, ',') > 1)
    throw new Error()
}

export const normalize = fullName => {
  throwOnTooManyCommas(fullName)
  const parsedName = parse(fullName)
  if (isMononym(parsedName)) return parsedName.name
  return `${last(parsedName)}, ${first(parsedName)}${middleInitials(parsedName)}${suffix(parsedName)}`
}
