import { createRouter, ExpandedApiRequest } from '@common/api';

const { router, validate } = createRouter();

router.get((req, res) => {
  res.status(200).json({ message: 'Hello World!' });
});

router.post(
  validate({
    name: {
      type: 'string',
      min: 3,
      max: 255,
    },
  }),
  (req: ExpandedApiRequest<{ name: string }>, res) => {
    res.status(200).json({ message: `Hello, ${req.payload.name}!` });
  },
);

export default router;
