/**
 * Browser entry point for the Wordix Angular application.
 * Keeps platform bootstrap separate from application configuration and the root component.
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
