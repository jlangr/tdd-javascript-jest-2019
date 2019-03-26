//const countOfChar = (s, c) => (s.match(new RegExp(c, 'g'))||[]).length;
const throwWhenNameUndefined = name => { if (name === undefined) throw new Error() }

const last = name => parts(name)[parts(name).length - 1]
const first = name => parts(name)[0]
const middleParts = name => parts(name).slice(1, -1)

const hasMiddleName = name => parts(name).length > 2

const initial = name => name.length === 1 ? ` ${name}` : ` ${name[0]}.`

const middleInitials = name => {
  if (!hasMiddleName(name)) return ''
  return middleParts(name).map(initial).join('') }

const isMononym = name => parts(name).length === 1

const parts = name => name.trim().split(' ')

export const normalize = name => {
  throwWhenNameUndefined(name)
  if (isMononym(name)) return name
  return `${last(name)}, ${first(name)}${middleInitials(name)}`
}
