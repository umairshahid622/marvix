import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificKeywordsComponent } from './specific-keywords.component';

describe('SpecificKeywordsComponent', () => {
  let component: SpecificKeywordsComponent;
  let fixture: ComponentFixture<SpecificKeywordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecificKeywordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificKeywordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
