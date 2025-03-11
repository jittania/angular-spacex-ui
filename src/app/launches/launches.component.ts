import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpacexApiService } from '../spacex-api.service';
import { Launch, LaunchLinks, Pagination, LaunchResponse } from '../models/launch.models';

// Referred to https://github.com/r-spacex/SpaceX-API/blob/9f56af14a75ae410c26eb0317971d51ae1574f6a/docs/launches/v5/schema.md:
const linksMapping: Record<string, (links: LaunchLinks) => { label: string; path: string }[] | { label: string; path: string } | null> = {
  youtube_id: (links) => links.youtube_id ? [{ label: 'YouTube', path: `https://www.youtube.com/watch?v=${links.youtube_id}` }] : null,
  webcast: (links) => links.webcast ? [{ label: 'Webcast', path: links.webcast }] : null,
  article: (links) => links.article ? [{ label: 'Article', path: links.article }] : null,
  wikipedia: (links) => links.wikipedia ? [{ label: 'Wikipedia', path: links.wikipedia }] : null,
  presskit: (links) => links.presskit ? [{ label: 'Press Kit', path: links.presskit }] : null,
  patch: (links) => {
    const patchLinks = [];
    if (links.patch?.small) patchLinks.push({ label: 'Patch (Small)', path: links.patch.small });
    if (links.patch?.large) patchLinks.push({ label: 'Patch (Large)', path: links.patch.large });
    return patchLinks.length ? patchLinks : null;
  },
  reddit: (links) => {
    const redditLinks = [];
    if (links.reddit?.campaign) redditLinks.push({ label: 'Reddit (Campaign)', path: links.reddit.campaign });
    if (links.reddit?.launch) redditLinks.push({ label: 'Reddit (Launch)', path: links.reddit.launch });
    if (links.reddit?.media) redditLinks.push({ label: 'Reddit (Media)', path: links.reddit.media });
    if (links.reddit?.recovery) redditLinks.push({ label: 'Reddit (Recovery)', path: links.reddit.recovery });
    return redditLinks.length ? redditLinks : null;
  },
  flickr: (links) => {
    const flickrLinks = [];
    if (links.flickr?.small?.length) flickrLinks.push(...links.flickr.small.map((url) => ({ label: 'Flickr (Small)', path: url })));
    if (links.flickr?.original?.length) flickrLinks.push(...links.flickr.original.map((url) => ({ label: 'Flickr (Original)', path: url })));
    return flickrLinks.length ? flickrLinks : null;
  }
};

@Component({
  selector: 'app-launches',
  standalone: true,
  templateUrl: './launches.component.html',
  styleUrl: './launches.component.scss',
  imports: [CommonModule]
})
export class LaunchesComponent implements OnInit {
  launches: Launch[] = [];
  selectedLaunchId: string | null = null;
  allExpandedLaunches = new Set<string>();
  sortOrder?: number; // this means sortOrder is undefined by default (which means on inital load the page should display the results as the db organizes them) 
  pagination: Pagination = { // These are all the initial page load defaults - note that these will flash initially when the table is first loaded. A loading icon could be implemented to obscure this effect.
    totalDocs: 0,
    limit: 5, // # Results per page - currently a static value
    page: 1,
    totalPages: 0,
    hasPrevPage: false,
    hasNextPage: false,
  };

  constructor(private spacexApiService: SpacexApiService) {}

  async ngOnInit() {
    await this.querySortedLaunches();
  }

  async querySortedLaunches(page = 1) {
    try {
      const response: LaunchResponse = await this.spacexApiService.queryLaunches(page, this.pagination.limit, this.sortOrder);
      this.launches = response.docs;
      this.pagination = {
        totalDocs: response.totalDocs,
        limit: response.limit,
        page: response.page,
        totalPages: response.totalPages,
        hasPrevPage: response.hasPrevPage,
        hasNextPage: response.hasNextPage,
      };
    } catch (error) {
      console.error('Error encountered fetching launch data: ', error);
    }
  }

  async sortAscending() {
    this.sortOrder = 1;
    await this.querySortedLaunches();
  }

  async sortDescending() {
    this.sortOrder = -1;
    await this.querySortedLaunches();
  }

  async goToPreviousPage() {
    if (this.pagination.hasPrevPage) {
      await this.querySortedLaunches(this.pagination.page - 1);
    }
  }

  async goToNextPage() {
    if (this.pagination.hasNextPage) {
      await this.querySortedLaunches(this.pagination.page + 1);
    }
  }

  get startIndex(): number {
    return (this.pagination.page - 1) * this.pagination.limit + 1;
  }
  
  get endIndex(): number {
    return Math.min(this.pagination.page * this.pagination.limit, this.pagination.totalDocs);
  }

  toggleLinks(launchId: string): void {
    if (this.allExpandedLaunches.has(launchId)) {
      this.allExpandedLaunches.delete(launchId);
    } else {
      this.allExpandedLaunches.add(launchId);
    }
  }

  toggleRow(launchId: string) {
    this.selectedLaunchId = this.selectedLaunchId === launchId ? null : launchId;
  }

  getPopulatedLinksOnly(links: LaunchLinks): { label: string; path: string }[] {
    const launchLinks: { label: string; path: string }[] = [];
    // Using a seen DS to account for some links being stored twice under different fields
    // which seems to often? always? be the case for Webcast and YT links
    // In the event that youtube_id and webcast fields point to the same link, only
    // a YouTube link will be displayed. Otherwise, both will be displayed
    const seenPaths = new Set<string>();

    // NOTE: This is currently set up to assume each link field will only have one value
    for (const [key, linksMappingHandler] of Object.entries(linksMapping)) {
      const linksFromHandler = linksMappingHandler(links);
      let linksArray: { label: string; path: string }[] = [];

      // This check is necessary for the scenario where the launch has <= 1 media link field
      if (linksFromHandler) {
        linksArray = Array.isArray(linksFromHandler) ? linksFromHandler : [linksFromHandler];
      }

      for (const link of linksArray) {
        if (link && !seenPaths.has(link.path)) {
          launchLinks.push(link);
          seenPaths.add(link.path);
        }
      }

    }
    return launchLinks;
  }
  
}
