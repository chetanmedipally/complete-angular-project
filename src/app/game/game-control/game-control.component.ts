import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-game-control',
  templateUrl: './game-control.component.html',
  styleUrls: ['./game-control.component.css']
})
export class GameControlComponent implements OnInit {

  interval: any;
  lastNumber = 0;
  @Output() intervalFired = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
  }

  OnTimerStart() {
    this.interval = setInterval(() => {
      this.intervalFired.emit(this.lastNumber + 1);
      this.lastNumber++;
    }, 1000);
  }

  onTimerStop() {
    clearInterval(this.interval);
  }

}
