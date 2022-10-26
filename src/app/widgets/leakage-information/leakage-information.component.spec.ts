import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeakageInformationComponent } from './leakage-information.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

fdescribe('LeakageInformationComponent', () => {
  let component: LeakageInformationComponent;
  let fixture: ComponentFixture<LeakageInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeakageInformationComponent ],
      providers: [NgbActiveModal]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeakageInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the window', () => {
    spyOn(component, 'close').and.callThrough();
    const ele = fixture.debugElement.nativeElement.querySelector('.close-button');
    ele.click();
    expect(component.close).toHaveBeenCalled();
  });
});
