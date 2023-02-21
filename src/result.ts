export type ResultType<T, E> = { ok: true; val: T } | { ok: false; err: E }

export const Ok = <T>(val: T): Result<T, any> => new Result({ ok: true, val })
export const Err = <E>(err: E): Result<any, E> => new Result({ ok: false, err })

export class Result<T, E> {
  private inner: ResultType<T, E>

  constructor(inner: ResultType<T, E>) {
    this.inner = inner
  }

  public get ok(): boolean {
    return this.inner.ok
  }

  public match<V>(matchers: { Ok: (val: T) => V; Err: (err: E) => V }): V {
    if (this.inner.ok) return matchers.Ok(this.inner.val)
    else return matchers.Err(this.inner.err)
  }

  /** Unwrap the result or throw an error */
  public try() {
    if (this.inner.ok) return this.inner.val
    else throw this.inner.err
  }

  /** Catch errors from a function and wrap them in a Result. */
  static wrap<F extends (...args: any) => any>(
    f: F,
    args?: Parameters<F>
  ): ReturnType<F> extends Result<any, any>
    ? ReturnType<F>
    : Result<ReturnType<F>, any> {
    try {
      const result = f(args)
      if (result instanceof Result) return result as ReturnType<F>
      else return Ok(result) as unknown as any
    } catch (err) {
      return Err(err) as unknown as any
    }
  }
}
