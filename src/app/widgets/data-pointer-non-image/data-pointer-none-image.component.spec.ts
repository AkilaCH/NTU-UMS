import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPointerNoneImageComponent } from './data-pointer-none-image.component';

describe('DataPointerNoneImageComponent', () => {
  let component: DataPointerNoneImageComponent;
  let fixture: ComponentFixture<DataPointerNoneImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataPointerNoneImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPointerNoneImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
