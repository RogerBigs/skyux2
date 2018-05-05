import {
  TestBed,
  async,
  ComponentFixture
} from '@angular/core/testing';
import {
  SkyLinkRecordsState,
  SkyLinkRecordsStateDispatcher,
  SkyLinkRecordsStateModel
} from './state/';
import { SkyLinkRecordsMatchModel } from './state/matches/match.model';
import { SkyLinkRecordsFieldsSetFieldsAction} from './state/fields/actions';
import { SkyLinkRecordsFieldModel} from './state/fields/field.model';
import { SkyCheckboxModule } from '../checkbox';
import { SkyLinkRecordsItemDiffComponent } from './link-records-item-diff.component';
import { SkyResourcesModule } from '../resources';
import { SKY_LINK_RECORDS_STATUSES } from './link-records-statuses';

describe('Component: SkyLinkRecordsItemDiffComponent', () => {
  let fixture: ComponentFixture<SkyLinkRecordsItemDiffComponent>,
    component: SkyLinkRecordsItemDiffComponent,
    dispatcher: SkyLinkRecordsStateDispatcher,
    state: SkyLinkRecordsState;

  beforeEach(async(() => {
    dispatcher = new SkyLinkRecordsStateDispatcher();
    state = new SkyLinkRecordsState(new SkyLinkRecordsStateModel(), dispatcher);

    TestBed.configureTestingModule({
      declarations: [
        SkyLinkRecordsItemDiffComponent
      ],
      imports: [
        SkyCheckboxModule,
        SkyResourcesModule
      ],
      providers: [
        { provide: SkyLinkRecordsState, useValue: state },
        { provide: SkyLinkRecordsStateDispatcher, useValue: dispatcher }
      ]
    });

    fixture = TestBed.createComponent(SkyLinkRecordsItemDiffComponent);
    component = fixture.componentInstance;
  }));

  it('error should be thrown on init if key is undefined', () => {
    component.key = undefined;
    try {
      fixture.detectChanges();
    } catch (error) {
      expect(error.message).toEqual("'key' is required.");
    }
  });

  it('setFieldSelected sets selected state when checked is true', async(() => {
    const item = {
      id: '1',
      address: '123',
      name: 'Kevin'
    };

    const linkRecordMatch = new SkyLinkRecordsMatchModel({
      key: '1',
      status: SKY_LINK_RECORDS_STATUSES.NoMatch,
      item: item
    });

    const fields = [{ key: 'none' }];

    component.key = '1';
    component.item = item;
    component.match = linkRecordMatch;
    component.fields = fields;

    fixture.detectChanges();

    const fieldKey = 'testKey';
    component.setFieldSelected(fieldKey, {checked: true});

    state.map((s: any) => s.selected.item).take(1)
      .subscribe((s: any) => {
        const selected = s['1']['testKey'];
        expect(selected).toBe(true);
      });

  }));

  it('setFieldSelected sets selected state when checked is false', async(() => {
    const item = {
      id: '1',
      address: '123',
      name: 'Kevin'
    };

    const linkRecordMatch = new SkyLinkRecordsMatchModel({
      key: '1',
      status: SKY_LINK_RECORDS_STATUSES.NoMatch,
      item: item
    });

    const fields = [{ key: 'none' }];

    component.key = '1';
    component.item = item;
    component.match = linkRecordMatch;
    component.fields = fields;

    fixture.detectChanges();

    const fieldKey = 'testKey';
    component.setFieldSelected(fieldKey, {checked: false});

    state.map((s: any) => s.selected.item).take(1)
      .subscribe((s: any) => {
        const selected = s['1']['testKey'];
        expect(selected).toBe(false);
      });
  }));

  it('field value returns empty array if component key does not exist in field state', async(() => {
    const item = {
      id: '1',
      address: 101,
      name: 'Apple',
      description: 'Anne eats apples'
    };

    const linkRecordMatch = new SkyLinkRecordsMatchModel({
      key: '1',
      status: SKY_LINK_RECORDS_STATUSES.Edit,
      item: { id: '11', address: 111, name: 'Big Apple', description: 'George and his apples' }
    });

    const fields = [{ key: 'none' }];

    component.item = item;
    component.key = 'testKey';
    component.match = linkRecordMatch;
    component.fields = fields;

    fixture.detectChanges();

    component.key = 'undefinedKey';

    fixture.detectChanges();

    component.fieldValues.take(1)
      .subscribe(f => {
        const field = f;
        expect(field).toEqual([]);
      });
  }));

  it('record state shows edits of matched fields with no value',
  async(() => {
    component.key = '1';
    component.showNewFieldValues = true;

    const filteredMatchFields = [
      new SkyLinkRecordsFieldModel({
        key: '1',
        label: 'name',
        currentValue: '',
        newValue: 'Apple'
      }),
      new SkyLinkRecordsFieldModel({
        key: '1',
        label: 'description',
        currentValue: '',
        newValue: 'Anne eats apples'
      })
    ];

    dispatcher.next(new SkyLinkRecordsFieldsSetFieldsAction(component.key, filteredMatchFields));

    fixture.detectChanges();

    component.fieldValues.take(1)
      .subscribe(f => {
        const field = f;
        expect(field.length).toEqual(2);
      });
  }));
});
