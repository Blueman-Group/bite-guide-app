import { Component, EnvironmentInjector } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, MenuComponent],
})
export class AppComponent {
  constructor(public environmentInjector: EnvironmentInjector) {}
}
