import { Component, OnInit } from '@angular/core';
import { Subject, Subscription, timer } from "rxjs";
import { pairwise, map, scan, startWith, bufferTime, filter } from "rxjs/operators";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private myTimerSub: Subscription;
  public currentNumber = 0;
  public subj = new Subject();
  public buttonStatus: Boolean = true;
  public coefficient = 1;

  ngOnInit(): void {
    this.subj.asObservable().pipe(
        bufferTime(300),
        filter((i: any) => i.length === 2)
    ).subscribe(v => {
      console.log(v);
      this.pauseTimer();
    });
  }

  waitTimer() {
    this.subj.next(null)
  }

  displayTime(ms: number, type: string): string {
    let totalSeconds = ms;
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const result = (type === 'seconds') ?
      seconds < 10 ? `0${seconds}` : seconds.toString() :
      (type === 'minutes') ?
        minutes < 10 ? `0${minutes}` : minutes.toString() :
        hours < 10 ? `0${hours}` : hours.toString();

    return result;
  }

  startTimer() {
    this.buttonStatus = !this.buttonStatus;

    const ti = timer(0, 1000 / Math.abs(this.coefficient)).pipe(
      startWith(this.currentNumber),
      scan((acc: number) => acc + 1)
    );
    this.myTimerSub = ti.subscribe(t => {
      this.currentNumber = t;

    });
  }

  pauseTimer() {
    this.buttonStatus = true;
    this.myTimerSub.unsubscribe();
  }

  resetTimer() {
    this.currentNumber = 0;
    if (this.myTimerSub.closed === false) {
      this.myTimerSub.unsubscribe();
      this.startTimer();
      this.buttonStatus = false;
    } else {
      this.myTimerSub.unsubscribe();
    }
  }
  //It was the first method to make this task.
  // ngOnInit() {
  //   const clicks = fromEvent(document.querySelector('.wait'), 'click');
  //   const pairs = clicks.pipe(pairwise());
  //
  //   const difference = pairs.pipe(
  //     map(pair => {
  //       const first = pair[0].timeStamp;
  //       const second = pair[1].timeStamp;
  //       return second-first;
  //     }),
  //   );
  //
  //   difference.subscribe(x => {
  //     this.timedifference = x;
  //   });
  //   if (this.timedifference < 300) {
  //     return false;
  //   } else {
  //     return false;
  //   }
  // }


}


