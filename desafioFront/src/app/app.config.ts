import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { definePreset, updatePrimaryPalette } from '@primeng/themes';
import { provideRouter } from '@angular/router';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: definePreset(Aura, {
          semantic: {
            primary: {
              50: '{teal.50}',
              100: '{teal.100}',
              200: '{teal.200}',
              300: '{teal.300}',
              400: '{teal.400}',
              500: '{teal.500}',
              600: '{teal.600}',
              700: '{teal.700}',
              800: '{teal.800}',
              900: '{teal.900}',
              950: '{teal.950}'
            }
          }
        })
      },
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
  ],
};
