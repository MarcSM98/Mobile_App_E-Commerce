import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SellerReviewPage } from './seller-review.page';

describe('SellerReviewPage', () => {
  let component: SellerReviewPage;
  let fixture: ComponentFixture<SellerReviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerReviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SellerReviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
