import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionHtml } from './selection.html';

describe('SelectionHtml', () => {
  let component: SelectionHtml;
  let fixture: ComponentFixture<SelectionHtml>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionHtml]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectionHtml);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
