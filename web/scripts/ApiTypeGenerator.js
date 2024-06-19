const path = require('path');
const { generateApi } = require('swagger-typescript-api');

const GEN_FILE_DIR = 'src/types/generated';

generateApi({
  name: 'Api.ts',
  url: 'http://localhost:8888/api-json',
  output: path.resolve(process.cwd(), GEN_FILE_DIR),
});
