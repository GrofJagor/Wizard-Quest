import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestCreation } from './quest-creation';

describe('QuestCreation', () => {
  let component: QuestCreation;
  let fixture: ComponentFixture<QuestCreation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestCreation],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestCreation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
