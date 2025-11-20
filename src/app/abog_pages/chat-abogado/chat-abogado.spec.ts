import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatAbogado } from './chat-abogado';

describe('ChatAbogado', () => {
  let component: ChatAbogado;
  let fixture: ComponentFixture<ChatAbogado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatAbogado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatAbogado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

