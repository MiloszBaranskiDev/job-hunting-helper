import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, Observable } from 'rxjs';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private readonly breakpointObserver: BreakpointObserver =
    inject(BreakpointObserver);

  private isBreakpointMobile: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private isSidebarOpened: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private isSidebarExpanded: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  breakpoint$: Observable<BreakpointState>;
  isBreakpointMobile$: Observable<boolean> =
    this.isBreakpointMobile.asObservable();
  isSidebarOpened$: Observable<boolean> = this.isSidebarOpened.asObservable();
  isSidebarExpanded$: Observable<boolean> =
    this.isSidebarExpanded.asObservable();

  constructor() {
    this.breakpoint$ = this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(distinctUntilChanged());

    this.handleBreakpoint();
  }

  handleBreakpoint(): void {
    this.breakpoint$.subscribe((val: BreakpointState) => {
      if (val.matches) {
        this.isBreakpointMobile.next(true);
        this.isSidebarOpened.next(false);
        this.isSidebarExpanded.next(false);
      } else {
        this.isBreakpointMobile.next(false);
        this.isSidebarOpened.next(true);
        this.isSidebarExpanded.next(true);
      }
    });
  }

  toggleSidebar(): void {
    this.breakpoint$
      .subscribe((val: BreakpointState) => {
        if (val.matches) {
          this.isSidebarOpened.next(!this.isSidebarOpened.getValue());
        } else {
          this.isSidebarExpanded.next(!this.isSidebarExpanded.getValue());
        }
      })
      .unsubscribe();
  }
}
