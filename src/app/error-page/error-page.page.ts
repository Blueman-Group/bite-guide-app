import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { EventAggregatorService } from '../services/event-aggregator.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.page.html',
  styleUrls: ['./error-page.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class ErrorPagePage implements OnInit {
  constructor(private eventAggregator: EventAggregatorService, private router: Router) {}

  ngOnInit() {
    if (!this.eventAggregator.appStarted.getValue()) {
      this.router.navigate([''], { skipLocationChange: true });
    }
  }
}
