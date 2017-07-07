import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

//this defines the global var window.crac_config which contains the server url
import "../config"

platformBrowserDynamic().bootstrapModule(AppModule);
