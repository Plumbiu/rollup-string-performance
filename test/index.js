function isBuiltin(id) {
  if (typeof id === 'string' && id.startsWith('\t')) return true
  if (typeof id === 'string' && id.startsWith('\0world')) return false
  return id
}

console.log(isBuiltin('\0hello'))
