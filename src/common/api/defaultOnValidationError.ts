import { OnValidationErrorFunc } from './types';

export const onValidationError: OnValidationErrorFunc = (errors, req, res) => {
  return res.status(422).json({ errors });
};
