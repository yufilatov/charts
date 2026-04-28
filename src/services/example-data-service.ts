import { map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

export interface SeasonData {
    club: string;
    twoLinesName: string;
    goals: {
        for: {
            home: number;
            away: number;
        },
        against: {
            home: number;
            away: number;
        }
    };
}

interface SeasonRawData {
    info: string;
    data: SeasonData[];
}
@Injectable({
    providedIn: 'root'
})
export class ExampleDataService {
    constructor(private http: HttpClient) { }

    getData(season: string): Observable<SeasonData[]> {
        return this.http
            .get<SeasonRawData>(`assets/epl${season}.json`)
            .pipe(map(data => data.data));
    }

    getHistoryData(): Observable<any> {
        return this.http
            .get<any>(`assets/chelsea.json`)
            .pipe(map(data => data));
    }

    getMapData(): Observable<any> {
        return this.http
            .get<any>(`assets/england.json`)
            .pipe(map(data => data));
    }

    getStatistics(): Observable<any> {
        return this.http
            .get<any>(`https://v3.football.api-sports.io/teams/statistics?league=39&team=50&season=2024`);
    }

    getStandings(): Observable<any> {
        return this.http.get<any>(`https://v3.football.api-sports.io/standings?league=39&team=50&season=2024`);
    }

    getTeams(): Observable<any> {
        return this.http
            .get<any>(`assets/2024.json`)
            .pipe(map(data => data?.response));
    }
}
