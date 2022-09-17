import { ExpandedApiRequest, ExpandedApiResponse } from './types';

export const onError = (
  error: Error,
  req: ExpandedApiRequest,
  res: ExpandedApiResponse,
) => {
  console.log('error: ', error);
  res
    .status(501)
    .json({ error: 'An unexpected error ocurred, please try again later.' });
};
