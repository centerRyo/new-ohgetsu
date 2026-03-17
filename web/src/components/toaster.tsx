'use client';

import {
  Toaster as ChakraToaster,
  createToaster,
  Portal,
  Stack,
  Toast,
} from '@chakra-ui/react';

export const toaster = createToaster({ placement: 'top' });

export const Toaster = () => (
  <Portal>
    <ChakraToaster toaster={toaster}>
      {(toast) => (
        <Toast.Root width={{ md: 'sm' }}>
          <Stack gap='1' flex='1' maxWidth='100%'>
            {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
            {toast.description && (
              <Toast.Description>{toast.description}</Toast.Description>
            )}
          </Stack>
          <Toast.CloseTrigger />
        </Toast.Root>
      )}
    </ChakraToaster>
  </Portal>
);
