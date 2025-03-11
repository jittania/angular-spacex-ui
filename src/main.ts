/**
 * Note: Because the app is bootstrapped here, there's no need for an app.module.ts
 * file and Angular assumes standalone components are being used.
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()]
}).catch(err => console.error(err));
