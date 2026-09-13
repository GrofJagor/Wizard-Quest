import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestDetails } from './quest-details';

describe('Quest', () => {
  let component: QuestDetails;
  let fixture: ComponentFixture<QuestDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
