const numberOfCharactersInString = (s, char) =>
 (s.match(new RegExp(char, 'g'))||[]).length;

const parts = name => name.split(' ')

const last = name => name.parts[name.parts.length - 1]

const first = name => name.parts[0]

const isMononym = name => name.parts.length === 1

const initial = name => name.length === 1 ? ` ${name}` : ` ${name[0]}.`

const middleParts = name => name.parts.slice(1, -1)

const middleInitials = name => middleParts(name).map(initial).join('')

const suffixless = name => {
  const [baseName] = name.split(',')
  return baseName
}

const suffix = name => {
  const [_, afterComma] = name.fullName.split(',')
  return afterComma ? `,${afterComma}` : ''
}

const throwOnExcessCommas = name => {
  if (numberOfCharactersInString(name, ',') > 1) throw new Error()
}

const parse = fullName => {
  throwOnExcessCommas(fullName)

  const trimmedName = fullName.trim()
  const baseName = suffixless(trimmedName)
  return { baseName, trimmedName, fullName, parts: parts(baseName) }
}

const formatMononym = name => name.trimmedName
const formatWestern = name => `${last(name)}, ${first(name)}${middleInitials(name)}${suffix(name)}`

export const normalize = fullName => {
  const name = parse(fullName)
  if (isMononym(name)) return formatMononym(name)
  return formatWestern(name)
}
