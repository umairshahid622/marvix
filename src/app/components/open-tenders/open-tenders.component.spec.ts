import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenTendersComponent } from './open-tenders.component';

describe('OpenTendersComponent', () => {
  let component: OpenTendersComponent;
  let fixture: ComponentFixture<OpenTendersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenTendersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenTendersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
