import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhhClientShellComponent } from '@jhh/jhh-client/shell';

@Component({
  standalone: true,
  imports: [RouterModule, JhhClientShellComponent],
  selector: 'jhh-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'jhh-client';
}
