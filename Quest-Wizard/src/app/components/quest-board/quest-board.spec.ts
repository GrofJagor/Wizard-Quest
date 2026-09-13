import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestBoard } from './quest-board';

describe('QuestBoard', () => {
  let component: QuestBoard;
  let fixture: ComponentFixture<QuestBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestBoard],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestBoard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
