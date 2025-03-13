import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LaunchesComponent } from './launches/launches.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [RouterOutlet, LaunchesComponent],
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-spacex-ui';
}
