import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GapResultComponent } from './gap-result.component';

describe('GapResultComponent', () => {
  let component: GapResultComponent;
  let fixture: ComponentFixture<GapResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GapResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GapResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
