import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: false, // ADD THIS
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'AssetManagementUI';
}
