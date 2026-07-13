/** Bu dosya, backend difficult-items sayfasını filtreler ve gerçek dictionary route bağlantılarıyla gösterir. */
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Badge } from '@shared/components/badge/badge';
import { Button } from '@shared/components/button/button';
import { EmptyState } from '@shared/components/empty-state/empty-state';
import { DifficultItemSort, DifficultItemSource } from '../../models/statistics-query.models';
import { DifficultLearningItemsPage } from '../../models/statistics.models';
/** Difficult item pagination/filter intentlerini parent facade akışına iletir. */
@Component({selector:'wx-difficult-items-table',imports:[Badge,Button,EmptyState,RouterLink],templateUrl:'./difficult-items-table.html',changeDetection:ChangeDetectionStrategy.OnPush})
export class DifficultItemsTable { readonly page=input.required<DifficultLearningItemsPage>(); readonly source=input<DifficultItemSource>('both'); readonly sortBy=input<DifficultItemSort>('confidenceAsc'); readonly pageRequested=output<number>(); readonly sourceRequested=output<DifficultItemSource>(); readonly sortRequested=output<DifficultItemSort>(); /** Önceki/geçerli sayfa numarasını parenta iletir. */ protected requestPage(value:number):void{this.pageRequested.emit(value);} /** Native select source değerini typesafe intent olarak iletir. */ protected requestSource(value:string):void{this.sourceRequested.emit(value as DifficultItemSource);} /** Native select sort değerini typesafe intent olarak iletir. */ protected requestSort(value:string):void{this.sortRequested.emit(value as DifficultItemSort);} }
