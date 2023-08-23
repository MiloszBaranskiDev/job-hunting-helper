import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../container/container.component';

@Component({
  selector: 'jhh-shell',
  standalone: true,
  imports: [CommonModule, ContainerComponent],
  templateUrl: './jhh-client-shell.component.html',
  styleUrls: ['./jhh-client-shell.component.scss'],
})
export class JhhClientShellComponent {}
