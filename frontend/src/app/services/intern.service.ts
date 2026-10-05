import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IdCardType, Intern, InternRequest, InternUpdateRequest } from '../models/intern.model';

export interface InternFilters {
  name?: string;
  batchId?: number | null;
  idCardType?: IdCardType | '' | null;
}

@Injectable({ providedIn: 'root' })
export class InternService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/interns`;

  search(filters: InternFilters = {}): Observable<Intern[]> {
    let params = new HttpParams();
    if (filters.name?.trim()) params = params.set('name', filters.name.trim());
    if (filters.batchId) params = params.set('batchId', filters.batchId);
    if (filters.idCardType) params = params.set('idCardType', filters.idCardType);
    return this.http.get<Intern[]>(this.url, { params });
  }

  create(request: InternRequest): Observable<Intern> {
    return this.http.post<Intern>(this.url, request);
  }

  update(id: number, request: InternUpdateRequest): Observable<Intern> {
    return this.http.put<Intern>(`${this.url}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}