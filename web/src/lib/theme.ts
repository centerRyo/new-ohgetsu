import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  globalCss: {
    body: {
      fontFamily:
        "'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN','Hiragino Sans', Meiryo, sans-serif",
    },
  },
});

const system = createSystem(defaultConfig, config);

export default system;
