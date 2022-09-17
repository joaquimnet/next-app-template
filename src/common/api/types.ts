import { NextConnect, Options } from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  SyncCheckFunction,
  AsyncCheckFunction,
  ValidationSchema,
  ValidationError,
} from 'fastest-validator';

export type ExpandedApiRequest<T = Record<string, any>> = NextApiRequest & {
  payload: T;
};

export type ExpandedApiResponse = NextApiResponse & {
  // Just a little helpful intellisense with common status codes.
  /**
   * 200 - OK
   *
   * 201 - Created
   *
   * 202 - Accepted
   *
   * 204 - No Content
   *
   * 400 - Bad Request
   *
   * 401 - Unauthorized
   *
   * 403 - Forbidden
   *
   * 404 - Not Found
   *
   * 405 - Method Not Allowed
   *
   * 406 - Not Acceptable
   *
   * 409 - Conflict
   *
   * 410 - Gone
   *
   * 422 - Unprocessable Entity
   *
   * 500 - Internal Server Error
   *
   * 501 - Not Implemented
   *
   * 502 - Bad Gateway
   *
   * 503 - Service Unavailable
   */
  status: (code: number) => ExpandedApiResponse;
};

export type ExpandedNextConnectorOptions = Options<
  NextApiRequest,
  NextApiResponse
> & {
  onValidationError?: OnValidationErrorFunc;
};

type ValidatorMiddleware = (
  req: ExpandedApiRequest,
  res: ExpandedApiResponse,
  next: () => void,
) => void | Promise<void>;

export type ValidatorFunction<T> = (
  schema: ValidationSchema<T>,
) => ValidatorMiddleware;

export type RouteValidatorsCache = Record<
  string,
  SyncCheckFunction | AsyncCheckFunction
>;

export type ExpandedNextConnector = NextConnect<
  ExpandedApiRequest,
  ExpandedApiResponse
> & {
  routeValidatorsCache: RouteValidatorsCache;
  validate: ValidatorFunction<Record<string, any>>;
};

export type OnValidationErrorFunc = (
  errors: ValidationError[],
  req: ExpandedApiRequest,
  res: ExpandedApiResponse,
) => void | Promise<void>;

export type CreateRouterFunc = (options?: ExpandedNextConnectorOptions) => {
  router: ExpandedNextConnector;
  validate: ValidatorFunction<Record<string, any>>;
};
