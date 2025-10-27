import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideAb } from './slide-ab';

describe('SlideAb', () => {
  let component: SlideAb;
  let fixture: ComponentFixture<SlideAb>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideAb]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlideAb);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
