import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NotifierModule } from 'angular-notifier';
import { AppComponent } from './app.component';
import { HeaderComponent } from './widgets/header/header.component';
import { SideBarComponent } from './widgets/side-bar/side-bar.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NotificationPanelComponent } from './widgets/notification-panel/notification-panel.component';
import { BadgeIconComponent } from './widgets/badge-icon/badge-icon.component';
import { HttpClientModule } from '@angular/common/http';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NotifierModule,
        HttpClientModule
      ],
      declarations: [
        AppComponent,
        SideBarComponent,
        HeaderComponent,
        FaIconComponent,
        NotificationPanelComponent,
        BadgeIconComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should close the window', () => {
  //   spyOn(component, 'onClickMore').and.callThrough();
  //   const ele = fixture.debugElement.nativeElement.querySelector('.more-text');
  //   ele.click();
  //   expect(component.onClickMore).toHaveBeenCalled();
  // });

});
