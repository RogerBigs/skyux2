import { SkySectionedFormComponent } from './sectioned-form.component';
import { TestBed } from '@angular/core/testing';
import {
  expect
} from '@blackbaud/skyux-builder/runtime/testing/browser';
import { SkySectionedFormFixturesModule } from './fixtures/sectioned-form-fixtures.module';
import { SkySectionedFormFixtureComponent } from './fixtures/sectioned-form.component.fixture';

import {
  SkySectionedFormNoSectionsFixtureComponent
} from './fixtures/sectioned-form-no-sections.component.fixture';

import {
  SkySectionedFormNoActiveFixtureComponent
} from './fixtures/sectioned-form-no-active.component.fixture';

import { MockSkyMediaQueryService } from './../testing/mocks/mock-media-query.service';
import { SkyMediaQueryService, SkyMediaBreakpoints } from '../media-queries';

function getVisibleContent(el: any) {
  return el.querySelectorAll('.sky-vertical-tab-content-pane:not(.sky-vertical-tab-hidden)');
}

function getActiveSection(el: any) {
  return el.querySelectorAll('sky-sectioned-form-section .sky-vertical-tab-active');
}

describe('Sectioned form component', () => {

  let mockQueryService: MockSkyMediaQueryService;

  beforeEach(() => {

    mockQueryService = new MockSkyMediaQueryService();

    TestBed.configureTestingModule({
      imports: [
        SkySectionedFormFixturesModule
      ],
      providers: [
        { provide: SkyMediaQueryService, useValue: mockQueryService}
      ]
    });
  });

  function createTestComponent() {
    return TestBed.overrideComponent(SkySectionedFormComponent, {
      add: {
        providers: [
          { provide: SkyMediaQueryService, useValue: mockQueryService }
        ]
      }
    })
    .createComponent(SkySectionedFormFixtureComponent);
  }

  it('active tab should be open', () => {
    const fixture = createTestComponent();
    const el = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();

    // check correct section tab is active
    const activeSection = getActiveSection(el);
    expect(activeSection.length).toBe(1);

    const heading = activeSection[0].querySelector('.sky-vertical-tab-heading-value');
    expect(heading.textContent.trim()).toBe('Information 1a');

    const count = activeSection[0].querySelector('.sky-vertical-tab-count');
    expect(count.textContent.trim()).toBe('(2)');

    // check correct section content is displayed
    const content = getVisibleContent(el);
    expect(content.length).toBe(1);
    expect(content[0].textContent.trim()).toBe('information 2');
  });

  it('clicking tab should show content', () => {
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    // click first tab
    const firstTab = el.querySelectorAll('.sky-vertical-tab');
    firstTab[0].click();

    fixture.detectChanges();

    // check correct section tab is active
    const activeSection = getActiveSection(el);
    expect(activeSection.length).toBe(1);

    const heading = activeSection[0].querySelector('.sky-vertical-tab-heading');
    expect(heading.textContent.trim()).toBe('Information 1');

    const count = activeSection[0].querySelector('.sky-vertical-tab-count');
    // tslint:disable-next-line:no-null-keyword
    expect(count).toBe(null);

    // check correct section content is displayed
    const content = getVisibleContent(el);
    expect(content.length).toBe(1);
    const informationContent = content[0].querySelector('.demo-content');
    expect(informationContent.textContent.trim()).toBe('information 1');
  });

  it('section should respect required field change', () => {
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    // check section is not required
    let tabs = el.querySelectorAll('sky-vertical-tab');
    expect(tabs.length).toBe(2);

    const activeTab = tabs[1];
    expect(activeTab.classList.contains('sky-tab-field-required')).toBe(false);

    // mark required
    const checkbox = el.querySelector('#requiredTestCheckbox input');
    checkbox.click();
    fixture.detectChanges();

    // check section is required
    tabs = el.querySelectorAll('sky-vertical-tab');
    const requiredTab = tabs[0];
    expect(requiredTab.classList.contains('sky-tab-field-required')).toBe(true);
  });

  it('section should respect required field change after switching tabs', () => {
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    // click first tab
    const firstTab = el.querySelectorAll('.sky-vertical-tab');
    firstTab[0].click();

    fixture.detectChanges();

    // check section is not required
    let tabs = el.querySelectorAll('sky-vertical-tab');
    expect(tabs.length).toBe(2);

    const activeTab = tabs[0];
    expect(activeTab.classList.contains('sky-tab-field-required')).toBe(false);

    // mark required
    const checkbox = el.querySelector('#requiredTestCheckbox input');
    checkbox.click();
    fixture.detectChanges();

    // check section is required
    tabs = el.querySelectorAll('sky-vertical-tab');
    const requiredTab = tabs[0];
    expect(requiredTab.classList.contains('sky-tab-field-required')).toBe(true);
  });

  it('active index should be raised when tab changed', () => {
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    const tabs = el.querySelectorAll('.sky-vertical-tab');
    tabs[0].click();

    fixture.detectChanges();

    const activeIndexEl = el.querySelector('#activeIndexDiv');
    expect(activeIndexEl.textContent.trim()).toBe('active index = 0');
  });

  it('should have a visible animation state on load in mobile', () => {
    mockQueryService.current = SkyMediaBreakpoints.xs;
    const fixture = createTestComponent();

    fixture.detectChanges();

    expect(fixture.componentInstance.sectionedForm.tabService.animationVisibleState).toBe('shown');
  });

  it('should hide content and show tabs on mobile after calling showtabs function', () => {
    mockQueryService.current = SkyMediaBreakpoints.xs;
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    // check tabs not visible and content visible
    let tabs = el.querySelectorAll('.sky-vertical-tab');
    expect(tabs.length).toBe(0);

    let content = getVisibleContent(el);
    expect(content.length).toBe(1);
    expect(content[0].textContent.trim()).toBe('information 2');

    fixture.componentInstance.sectionedForm.showTabs();

    fixture.detectChanges();

    // tabs should now be visible and content not visible
    content = getVisibleContent(el);
    expect(content.length).toBe(0);

    tabs = el.querySelectorAll('.sky-vertical-tab');
    expect(tabs.length).toBe(2);
  });

  it('section should respect invalid field change', () => {
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    // check section is not invalid
    let tabs = el.querySelectorAll('sky-vertical-tab');
    expect(tabs.length).toBe(2);

    const activeTab = tabs[1];
    expect(activeTab.classList.contains('sky-tab-field-invalid')).toBe(false);

    // mark invalid
    const checkbox = el.querySelector('#invalidTestCheckbox input');
    checkbox.click();
    fixture.detectChanges();

    // check section is required
    tabs = el.querySelectorAll('sky-vertical-tab');
    const invalidTab = tabs[0];
    expect(invalidTab.classList.contains('sky-tab-field-invalid')).toBe(true);
  });

  it('should show content after resizing screen', () => {
    mockQueryService.current = SkyMediaBreakpoints.xs;
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    // show tabs to hide content
    fixture.componentInstance.sectionedForm.showTabs();
    fixture.detectChanges();

    // resize screen out of mobile
    mockQueryService.current = SkyMediaBreakpoints.lg;
    fixture.componentInstance.sectionedForm.tabService.updateContent();
    fixture.detectChanges();

    // content should be visible
    let content = getVisibleContent(el);
    expect(content.length).toBe(1);
    expect(content[0].textContent.trim()).toBe('information 2');

    // resize back to mobile
    mockQueryService.current = SkyMediaBreakpoints.xs;
    fixture.componentInstance.sectionedForm.tabService.updateContent();
    fixture.detectChanges();

    // content should be hidden
    content = getVisibleContent(el);
    expect(content.length).toBe(0);

    // resize to widescreen
    mockQueryService.current = SkyMediaBreakpoints.lg;
    fixture.componentInstance.sectionedForm.tabService.updateContent();
    fixture.detectChanges();

    // content should be visible
    content = getVisibleContent(el);
    expect(content.length).toBe(1);
    expect(content[0].textContent.trim()).toBe('information 2');
  });
});

describe('Sectioned form component - no sections', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkySectionedFormFixturesModule
      ]
    });
  });

  function createTestComponent() {
    return TestBed.createComponent(SkySectionedFormNoSectionsFixtureComponent);
  }

  it('should not fail to load when no sections exist', () => {
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    const allTabs = el.querySelectorAll('.sky-sectioned-form-tabs');
    expect(allTabs.length).toBe(1);
    expect(allTabs[0].textContent.trim()).toBe('');
  });
});

describe('Sectioned form component - no active sections', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkySectionedFormFixturesModule
      ]
    });
  });

  function createTestComponent() {
    return TestBed.createComponent(SkySectionedFormNoActiveFixtureComponent);
  }

  it('should not fail to load when no active sections exist', () => {
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    const activeSection = getActiveSection(el);
    expect(activeSection.length).toBe(0);

    const tabs = el.querySelectorAll('sky-vertical-tab');
    expect(tabs.length).toBe(2);
  });
});
