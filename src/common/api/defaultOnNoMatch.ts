export const onNoMatch = (req, res) => {
  res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
};
