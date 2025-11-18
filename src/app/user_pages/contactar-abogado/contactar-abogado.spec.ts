import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactarAbogado } from './contactar-abogado';

describe('ContactarAbogado', () => {
  let component: ContactarAbogado;
  let fixture: ComponentFixture<ContactarAbogado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactarAbogado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactarAbogado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
