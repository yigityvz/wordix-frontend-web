/**
 * Verifies that settings exposes only the supported theme preference.
 * Theme changes must use the existing persistence facade rather than fake save state.
 */
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeFacade } from '@core/theme/theme.facade';
import { SettingsPage } from './settings-page';

describe('SettingsPage', () => {
  /** Creates the page with observable theme facade behavior. */
  async function createPage(): Promise<{
    fixture: ComponentFixture<SettingsPage>;
    setTheme: ReturnType<typeof vi.fn>;
  }> {
    const setTheme = vi.fn();

    // The mock keeps tests focused on the page-to-theme contract.
    await TestBed.configureTestingModule({
      imports: [SettingsPage],
      providers: [
        {
          provide: ThemeFacade,
          useValue: {
            theme: signal('system'),
            resolvedTheme: signal('dark'),
            setTheme,
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(SettingsPage);
    fixture.detectChanges();
    return { fixture, setTheme };
  }

  /** Renders exactly the light, dark, and system choices from the product decision. */
  it('renders the three canonical theme options', async () => {
    const { fixture } = await createPage();
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('[aria-label="Theme preference"] button'),
    ) as HTMLButtonElement[];
    expect(buttons.map((button) => button.textContent?.trim())).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Light'),
        expect.stringContaining('Dark'),
        expect.stringContaining('System'),
      ]),
    );
    expect(buttons).toHaveLength(3);
  });

  /** Sends a selected option directly to the real theme facade contract. */
  it('applies the selected theme through ThemeFacade', async () => {
    const { fixture, setTheme } = await createPage();
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('[aria-label="Theme preference"] button'),
    ) as HTMLButtonElement[];
    buttons.find((button) => button.textContent?.includes('Dark'))?.click();
    expect(setTheme).toHaveBeenCalledWith('dark');
  });
});
