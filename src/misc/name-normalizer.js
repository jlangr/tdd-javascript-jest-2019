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

const splitSuffix = name => {
  const [baseName, suffix] = name.split(',')
  return [baseName, suffix ? `,${suffix}` : '']
}

const throwOnExcessCommas = name => {
  if (numberOfCharactersInString(name, ',') > 1)
    throw new Error()
}

const format = (baseName, suffix) => {
  if (isMononym(baseName)) return baseName
  return `${last(baseName)}, ${first(baseName)}${middleInitials(baseName)}${suffix}`
}

export const normalize = name => {
  throwOnExcessCommas(name)
  const [baseName, suffix] = splitSuffix(name)
  return format(baseName, suffix)
}
