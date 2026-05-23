import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendResultComponent } from './recommend-result.component';

describe('RecommendResultComponent', () => {
  let component: RecommendResultComponent;
  let fixture: ComponentFixture<RecommendResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecommendResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
