import path from 'path';
import { generateApi } from 'swagger-typescript-api';

const GEN_FILE_DIR = 'src/types/generated';

async function main() {
  await generateApi({
    name: 'Api.ts',
    url: 'http://localhost:8888/api-json',
    output: path.resolve(process.cwd(), GEN_FILE_DIR),

    primitiveTypeConstructs: () => ({
      string: {
        'date-time': 'Date',
      },
    }),
  });
}

main().catch((error) => {
  console.error('Failed to generate API client:', error);
  process.exit(1);
});
