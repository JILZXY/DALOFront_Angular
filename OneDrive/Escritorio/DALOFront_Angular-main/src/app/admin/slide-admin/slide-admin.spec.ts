import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideAdmin } from './slide-admin';

describe('SlideAdmin', () => {
  let component: SlideAdmin;
  let fixture: ComponentFixture<SlideAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlideAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
