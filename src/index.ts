import { Ok, Result } from './result'

function myThrowFunc(bool: boolean) {
  if (bool) throw new Error('asdf')
  else return 'asdf'
}

function a(): Result<string, Error> {
  return Ok('asdf')
}

function b() {
  const result = a()

  // Problem #1: Rust try (`?`) operator
  const val = Result.from(myThrowFunc, [true]).try()
  const newVal = val.toUpperCase()

  // Problem #2: Rust match
  result.match({
    Ok: console.log,
    Err: console.error,
  })

  return Ok(newVal)
}

function c() {
  const result = Result.from(b)
}
