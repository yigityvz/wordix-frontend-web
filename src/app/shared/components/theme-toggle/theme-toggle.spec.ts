import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeToggle } from './theme-toggle';

describe('ThemeToggle', () => {
  let fixture: ComponentFixture<ThemeToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ThemeToggle] }).compileComponents();
    fixture = TestBed.createComponent(ThemeToggle);
    fixture.componentRef.setInput('theme', 'system');
    fixture.detectChanges();
  });

  it('renders all supported theme choices', () => {
    const buttons = fixture.nativeElement.querySelectorAll('[role="radio"]');

    expect(buttons).toHaveLength(3);
    expect(buttons[2].getAttribute('aria-checked')).toBe('true');
  });

  it('selects an explicit theme', () => {
    const selectedThemes: string[] = [];
    fixture.componentInstance.themeChange.subscribe((theme) => selectedThemes.push(theme));
    const darkButton: HTMLButtonElement =
      fixture.nativeElement.querySelectorAll('[role="radio"]')[1];
    darkButton.click();

    expect(selectedThemes).toEqual(['dark']);
  });
});
