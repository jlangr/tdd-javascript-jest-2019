const numberOfCharactersInString = (s, char) =>
  (s.match(new RegExp(char, 'g'))||[]).length;

const parts = name => name.trim().split(' ')

const last = name => parts(name)[parts(name).length - 1]

const first = name => parts(name)[0]

const initial = name =>
  (name.length === 1)
    ? ` ${name}`
    : ` ${name[0]}.`

const middleInitials = name =>
  parts(name).slice(1, -1).map(initial).join('')

const isMononym = name => parts(name).length === 1

const parse = name => {
  const [baseName, suffix] = name.split(',')
  return { name, baseName, suffix }
}

const throwOnExcessCommas = name => {
  if (numberOfCharactersInString(name, ',') > 1)
    throw new Error()
}

const suffix = parsedName => parsedName.suffix ? `,${parsedName.suffix}` : ''

const format = (parsedName) => {
  const baseName = parsedName.baseName
  if (isMononym(baseName)) return baseName
  return `${last(baseName)}, ${first(baseName)}${middleInitials(baseName)}${suffix(parsedName)}`
}

export const normalize = name => {
  throwOnExcessCommas(name)
  const parsedName = parse(name)
  return format(parsedName)
}
