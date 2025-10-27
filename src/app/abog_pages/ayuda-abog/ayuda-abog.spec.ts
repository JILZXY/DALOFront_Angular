import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AyudaAbogHtml } from './ayuda-abog';

describe('AyudaAbogHtml', () => {
  let component: AyudaAbogHtml;
  let fixture: ComponentFixture<AyudaAbogHtml>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AyudaAbogHtml]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AyudaAbogHtml);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
