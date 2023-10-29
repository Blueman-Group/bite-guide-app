import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.page.html',
  styleUrls: ['./error-page.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ErrorPagePage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
