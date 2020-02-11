const numberOfCharactersInString = (s, char) =>
  (s.match(new RegExp(char, 'g'))||[]).length;

const last = parsedName => parsedName.parts[parsedName.parts.length - 1]

const first = parsedName => parsedName.parts[0]

const isMononym = parsedName => parsedName.parts.length === 1

const isDuonym = parsedName => parsedName.parts.length === 2

const initial = namePart => namePart.length === 1 ? namePart : `${namePart[0]}.`

const formatDuonym = parsedName => `${last(parsedName)}, ${first(parsedName)}`

const middleNames = parsedName => parsedName.parts.slice(1, -1)

const middleInitials = parsedName => middleNames(parsedName).map(initial).join(' ')

const optionalSuffix = parsedName => parsedName.suffix ? `,${parsedName.suffix}` : ''

const formatCanonicalName = parsedName =>
  `${last(parsedName)}, ${first(parsedName)} ${middleInitials(parsedName)}${optionalSuffix(parsedName)}`

const throwOnExcessCommas = name => {
  if (numberOfCharactersInString(name, ',') > 1) throw new Error()
}

const parse = name => {
  throwOnExcessCommas(name)
  const [baseName, suffix] = name.trim().split(',')
  return {
    name: baseName,
    suffix: suffix,
    parts: baseName.split(' ')
  }
}

const formatMononym = parsedName => `${parsedName.name}${optionalSuffix(parsedName)}`

export const normalize = name => {
  const parsedName = parse(name)
  if (isMononym(parsedName)) return formatMononym(parsedName)
  if (isDuonym(parsedName)) return formatDuonym(parsedName)
  return formatCanonicalName(parsedName)
}
