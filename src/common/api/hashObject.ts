import crypto from 'crypto';

export const hashObject = (obj: any) => {
  const md5HashedKey = crypto
    .createHash('md5')
    .update(
      JSON.stringify(obj, (k, v) => {
        if (k[0] === '_') return undefined; // remove api stuff
        else if (typeof v === 'function')
          // consider functions
          return v.toString();
        else return v;
      }),
    )
    .digest('hex');
  return md5HashedKey;
};
