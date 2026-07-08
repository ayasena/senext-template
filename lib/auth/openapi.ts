import { auth } from './index';

type Schema = Awaited<ReturnType<typeof auth.api.generateOpenAPISchema>>;
let _schema: Schema | undefined;
const getSchema = async () => {
  if (!_schema) _schema = await auth.api.generateOpenAPISchema();
  return _schema;
};

export const authOpenAPI = {
  getPaths: async (prefix = '/api/auth') => {
    const { paths } = await getSchema();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reference: Record<string, any> = Object.create(null);
    for (const path of Object.keys(paths)) {
      const key = prefix + path;
      reference[key] = paths[path];
      const ops = reference[key];
      for (const method of Object.keys(ops)) {
        ops[method].tags = ['Auth'];
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return reference as Record<string, any>;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components: (await getSchema()).components as Record<string, any>,
};
