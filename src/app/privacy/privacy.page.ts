import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavbarHeaderComponent } from '../navbar-header/navbar-header.component';
import { EventAggregatorService } from '../services/event-aggregator.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NavbarHeaderComponent],
})
export class PrivacyPage implements OnInit {
  constructor(private eventAggregator: EventAggregatorService, private router: Router) {}

  ngOnInit() {
    if (!this.eventAggregator.appStarted.getValue()) {
      this.router.navigate([''], { skipLocationChange: true });
    }
  }
}
