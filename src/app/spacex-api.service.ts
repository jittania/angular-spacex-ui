import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { LaunchResponse, LaunchQueryOptions } from './models/launch.models';

@Injectable({ //  Makes service injectable
  providedIn: 'root' // Makes service available throughout project
})
export class SpacexApiService {
  private baseUrl = 'https://api.spacexdata.com/v4';

  constructor(private http: HttpClient) {}

  async queryLaunches(page: number, limit: number, sortOrder?: number): Promise<LaunchResponse> {
    const requestBody: LaunchQueryOptions = {
      query: {
        date_precision: { $in: ["year", "month", "day", "hour"] },
        tbd: false
      },
      options: {
        page, // Current page shown
        limit, // # Results per page
        sort: sortOrder ? { date_utc: sortOrder } : undefined,
        select: ["flight_number", "date_utc", "date_precision", "rocket", "details", "links"],
        populate: {
          path: "rocket",
          select: ["name"]
        }
      }
    };

    if (sortOrder !== undefined) {
      requestBody.options.sort = { date_utc: sortOrder };
    }

    try {
      const response = await lastValueFrom(
        this.http.post<LaunchResponse>(`${this.baseUrl}/launches/query`,
        requestBody)
      );
      return response;
    } catch (error) {
      console.error('Error while calling SpaceX API: ', error);
      throw error; // Throws error back to component
    }
  }

}
