/** Bu dosya, dashboard'un gerçek profile/statistics lifecycle ve logout davranışını doğrular. */
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthFacade } from '@core/auth/auth.facade';
import { describe, expect, it, vi } from 'vitest';
import { ProfileFacade } from '../../../profile/facades/profile.facade';
import { Profile } from '../../../profile/models/profile.models';
import { StatisticsFacade } from '../../../statistics/facades/statistics.facade';
import { DifficultLearningItemsPage, UserLearningSummary } from '../../../statistics/models/statistics.models';
import { DashboardPage } from './dashboard-page';

/** Profile ve statistics facade mocklarıyla dashboard davranışını izole sınar. */
describe('DashboardPage', () => {
  /** İlk girişte profile ve gerçek dashboard statistics intentlerinin gönderildiğini doğrular. */
  it('loads profile and dashboard statistics on first entry', async () => {
    const context = await createDashboardFixture(null, null, null, false, false);
    context.fixture.detectChanges();

    expect(context.profileFacade.load).toHaveBeenCalledOnce();
    expect(context.statisticsFacade.loadLearningSummary).toHaveBeenCalledOnce();
    expect(context.statisticsFacade.loadDifficultItems).toHaveBeenCalledWith({
      pageNumber: 1,
      pageSize: 3,
      source: 'both',
      sortBy: 'confidenceAsc',
    });
  });

  /** Gerçek summary değerlerini gösterip Keycloak logout akışını başlattığını doğrular. */
  it('renders live summary and starts Keycloak logout', async () => {
    const profile: Profile = {
      isAuthenticated: true,
      username: 'wordix-user',
      email: 'user@wordix.test',
      roles: ['basic_user'],
    };
    const summary = {
      activeSavedItemCount: 42,
      reviewDueItemCount: 8,
      overallAccuracyRate: 76,
      averageConfidenceScore: 63,
      newItemCount: 5,
      learningItemCount: 10,
      reviewingItemCount: 12,
      masteredItemCount: 15,
      difficultItemCount: 3,
    } as UserLearningSummary;
    const difficult = {
      items: [],
      pageNumber: 1,
      pageSize: 3,
      totalCount: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    } as DifficultLearningItemsPage;
    const context = await createDashboardFixture(profile, summary, difficult, true, false);
    context.fixture.detectChanges();

    const buttons = Array.from(context.fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    const signOutButton = buttons.find((button) => button.textContent?.includes('Sign out'));
    signOutButton?.click();

    expect(context.fixture.nativeElement.textContent).toContain('wordix-user');
    expect(context.fixture.nativeElement.textContent).toContain('42');
    expect(context.fixture.nativeElement.textContent).toContain('76%');
    expect(context.profileFacade.clear).toHaveBeenCalledOnce();
    expect(context.statisticsFacade.clear).toHaveBeenCalledOnce();
    expect(context.authFacade.logout).toHaveBeenCalledOnce();
  });
});

/** Dashboard componentini verilen profile ve statistics state'leriyle oluşturur. */
async function createDashboardFixture(
  profile: Profile | null,
  summary: UserLearningSummary | null,
  difficultItems: DifficultLearningItemsPage | null,
  isLoaded: boolean,
  isLoading: boolean,
): Promise<{
  readonly fixture: ComponentFixture<DashboardPage>;
  readonly profileFacade: Record<string, unknown> & { load: ReturnType<typeof vi.fn>; clear: ReturnType<typeof vi.fn> };
  readonly statisticsFacade: Record<string, unknown> & { loadLearningSummary: ReturnType<typeof vi.fn>; loadDifficultItems: ReturnType<typeof vi.fn>; clear: ReturnType<typeof vi.fn> };
  readonly authFacade: { logout: ReturnType<typeof vi.fn> };
}> {
  const profileFacade = {
    profile: signal<Profile | null>(profile),
    isLoaded: signal(isLoaded),
    isLoading: signal(isLoading),
    error: signal<string | null>(null),
    load: vi.fn(),
    clear: vi.fn(),
  };
  const statisticsFacade = {
    learningSummary: signal<UserLearningSummary | null>(summary),
    learningSummaryStatus: signal(summary ? 'loaded' : 'idle'),
    learningSummaryError: signal<string | null>(null),
    difficultItems: signal<DifficultLearningItemsPage | null>(difficultItems),
    difficultItemsStatus: signal(difficultItems ? 'loaded' : 'idle'),
    difficultItemsError: signal<string | null>(null),
    loadLearningSummary: vi.fn(),
    loadDifficultItems: vi.fn(),
    clear: vi.fn(),
  };
  const authFacade = { logout: vi.fn() };

  await TestBed.configureTestingModule({
    imports: [DashboardPage],
    providers: [
      { provide: ProfileFacade, useValue: profileFacade },
      { provide: StatisticsFacade, useValue: statisticsFacade },
      { provide: AuthFacade, useValue: authFacade },
      provideRouter([]),
    ],
  }).compileComponents();

  return {
    fixture: TestBed.createComponent(DashboardPage),
    profileFacade,
    statisticsFacade,
    authFacade,
  };
}

