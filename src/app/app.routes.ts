import { Routes } from '@angular/router';
import { CreateComponent } from './features/create/create.component';
import { PlayComponent } from './features/play/play.component';
import { HomeComponent } from './features/home/home.component';

const routes: Routes = [
  { path: 'create', component: CreateComponent },
  { path: 'play', component: PlayComponent },
  { path: 'home', component: HomeComponent }
];

export { routes };
