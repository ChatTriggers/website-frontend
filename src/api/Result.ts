export type IResult<T, E = T> = {
  ok: true,
  value: T
} | {
  ok: false,
  error: E
};

export const Result = {
  Ok: <T>(value: T): IResult<T, never> => ({
    ok: true,
    value
  }),
  Err: <E>(error: E): IResult<never, E> => ({
    ok: false,
    error
  })
};
