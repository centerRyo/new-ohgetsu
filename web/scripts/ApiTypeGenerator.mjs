import { execSync } from 'child_process';
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
        // format:byte(base64文字列)はstringとして扱う。
        // 既存のメニュー画像はbase64文字列でJSON送信しているため。
        byte: 'string',
      },
    }),
  });

  // 生成直後はダブルクォート等でprettier未整形のため、format:checkが落ちる。
  // リポジトリのprettier設定に合わせて整形しておく。
  execSync(`npx prettier --write ${GEN_FILE_DIR}/Api.ts`, {
    stdio: 'inherit',
  });
}

main().catch((error) => {
  console.error('Failed to generate API client:', error);
  process.exit(1);
});
