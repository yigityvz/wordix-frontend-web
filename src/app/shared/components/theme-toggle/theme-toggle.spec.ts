/** Verifies the compact theme control and its three-mode sequence. */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeToggle } from './theme-toggle';

describe('ThemeToggle', () => {
  let fixture: ComponentFixture<ThemeToggle>;

  /** Creates the single-button component in system mode for each test. */
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ThemeToggle] }).compileComponents();
    fixture = TestBed.createComponent(ThemeToggle);
    fixture.componentRef.setInput('theme', 'system');
    fixture.componentRef.setInput('resolvedTheme', 'dark');
    fixture.detectChanges();
  });

  /** Segmented selector yerine tek erisilebilir ikon butonu render eder. */
  it('renders one compact theme button', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0].getAttribute('aria-label')).toContain('System theme');
  });

  /** Verifies the intent emitted when system mode advances to light mode. */
  it('cycles to the next supported theme', () => {
    const selectedThemes: string[] = [];
    fixture.componentInstance.themeChange.subscribe((theme) => selectedThemes.push(theme));
    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    expect(selectedThemes).toEqual(['light']);
  });
});
