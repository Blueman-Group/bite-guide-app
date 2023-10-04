import { Component, OnInit } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class MenuComponent implements OnInit {
  tabsPlacement: string = 'bottom';
  tabsLayout: string = 'icon-top';
  constructor(public platform: Platform) {
    if (!this.platform.is('mobile')) {

      this.tabsPlacement = 'top';

      this.tabsLayout = 'icon-start';
    }
  }

  ngOnInit() {}
}
