import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Validator, {
  SyncCheckFunction,
  AsyncCheckFunction,
  ValidationError,
} from 'fastest-validator';

import {
  ExpandedNextConnector,
  CreateRouterFunc,
  OnValidationErrorFunc,
} from './types';
import { onError } from './defaultOnError';
import { onNoMatch } from './defaultOnNoMatch';
import { onValidationError as defaultOnValidationError } from './defaultOnValidationError';
import { hashObject } from './hashObject';

export const createRouter: CreateRouterFunc = (options) => {
  const router: ExpandedNextConnector = nc<NextApiRequest, NextApiResponse>({
    onError,
    onNoMatch,
    ...(options ?? {}),
  }) as ExpandedNextConnector;

  router.use(mergeParamsMiddleware);

  const validator = new Validator({
    useNewCustomCheckerFunction: true,
  });

  router.routeValidatorsCache = {};
  router.validate = makeValidateFunc(
    router.routeValidatorsCache,
    validator,
    options?.onValidationError,
  );

  return { router, validate: router.validate };
};

const mergeParamsMiddleware = (req, res, next) => {
  req.payload = {
    ...(req.query ?? {}),
    ...(req.body ?? {}),
    ...(req.params ?? {}),
  };

  next();
};

const makeValidateFunc =
  (cache, validator, onValidationError?: OnValidationErrorFunc) => (schema) => {
    let check: SyncCheckFunction | AsyncCheckFunction;

    const schemaKey = hashObject(schema);

    if (cache[schemaKey]) {
      check = cache[schemaKey];
    } else {
      check = validator.compile(schema);
      cache[schemaKey] = check;
    }

    return async (req, res, next) => {
      const isValid = check.async
        ? await check(req.payload)
        : check(req.payload);

      if (isValid === true) {
        return next();
      }

      return (
        onValidationError?.(isValid as ValidationError[], req, res) ??
        defaultOnValidationError(isValid as ValidationError[], req, res)
      );
    };
  };
