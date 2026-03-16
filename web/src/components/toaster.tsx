'use client';

import {
  createToaster,
  Portal,
  Stack,
  Toaster as ChakraToaster,
  ToastCloseTrigger,
  ToastDescription,
  ToastIndicator,
  ToastTitle,
} from '@chakra-ui/react';

export const toaster = createToaster({ placement: 'bottom-end' });

export const Toaster = () => (
  <Portal>
    <ChakraToaster toaster={toaster}>
      {(toast) => (
        <Stack
          direction='row'
          p='4'
          bg='bg.panel'
          borderRadius='l3'
          boxShadow='md'
          width='sm'
        >
          <ToastIndicator />
          <Stack gap='1' flex='1'>
            {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
            {toast.description && (
              <ToastDescription>{toast.description}</ToastDescription>
            )}
          </Stack>
          <ToastCloseTrigger />
        </Stack>
      )}
    </ChakraToaster>
  </Portal>
);
