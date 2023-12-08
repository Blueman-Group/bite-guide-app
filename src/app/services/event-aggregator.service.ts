import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventAggregatorService {
  public appStarted = new BehaviorSubject<boolean>(false);
  public mealPlanInjected = new BehaviorSubject<boolean>(false);
}
