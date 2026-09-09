const DEFAULT_PORT = 3000;

function parsePort(value: string | undefined): number {
  if (!value) return DEFAULT_PORT;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : DEFAULT_PORT;
}

export const config = {
  port: parsePort(process.env.PORT),
};
