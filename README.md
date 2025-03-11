## **Background**

This project is an Angular-based web application designed to display SpaceX launch data in a structured, interactive format. Using the SpaceX API, the application presents a sortable, paginated grid of past and upcoming launches. Users can explore key launch details, including flight number, launch year, rocket name, and additional information provided in the API. Clicking on a launch row reveals links to associated media, such as webcast replays and YouTube videos.

The project was developed with a focus on usability and performance, ensuring that users can efficiently browse and filter the extensive launch history. Considerations were made regarding data precision, handling of incomplete or unscheduled launches, and potential accessibility improvements. The implementation follows best practices in API querying, pagination, and Angular service architecture to ensure maintainability and responsiveness.

---

## **Application Features**

### **User Story 1:**
>_User should be able to use SpaceX launches in a grid with 4 columns corresponding to Flight Number, Launch Year, Rocket Name, and Details_

https://github.com/r-spacex/SpaceX-API/blob/master/docs/launches/v4/all.md
https://github.com/r-spacex/SpaceX-API/blob/master/docs/launches/v4/query.md
https://github.com/r-spacex/SpaceX-API/blob/master/docs/README.md#launch-date-faqs
https://github.com/r-spacex/SpaceX-API/blob/master/docs/launches/v4/schema.md

- **Flight Number:** `flight_number` --> integer
- **Launch Year:** Need to use the `date_precision` (string) field to ensure the precision is at least to the year (or better, meaning a smaller unit of time), then extract from `date_utc` (string, date in UTC/ISO 8601). Might also need to filter out launches where tbd is true or only include those where net is false
- **Rocket Name:** `rocket` --> use `id` (string) to get rocket `name` (string) from /v4/rockets collection
- **Details:** `details` --> string
- **Media links:** `links` --> object, links stored as key-value pairs

`POST https://api.spacexdata.com/v4/launches/query`

```json
{
  "query": {
    "date_precision": { "$in": ["year", "month", "day", "hour"] },
    "tbd": false
  },
  "options": {
    "select": ["flight_number", "date_utc", "date_precision", "rocket", "details", "links"],
    "populate": {
      "path": "rocket",
      "select": ["name"]
    }
  }
}
```

### **User Story 2:**
>_User can sort results by launch order_

https://github.com/r-spacex/SpaceX-API/blob/master/docs/launches/v4/query.md
https://github.com/r-spacex/SpaceX-API/blob/master/docs/queries.md
https://mongoosejs.com/docs/api/query.html#Query.prototype.sort()

### ***User Story 3:**
>_Results are paginated, and user can click through page views of results_

See some info here on pagination: https://github.com/r-spacex/SpaceX-API/blob/master/docs/queries.md

### **User Story 4:**
>_For each result, user can click on row to reveal media links associated with that launch_

Links scheme here: https://github.com/r-spacex/SpaceX-API/blob/9f56af14a75ae410c26eb0317971d51ae1574f6a/docs/launches/v5/schema.md?plain=1#L169

---

## **Local Setup Instructions**

1. Install Node.js and npm using preferred package manager (refer to https://nodejs.org/en/download/package-manager):

```bash
$ nvm install 22
$ node -v # should print v22.12.0
$ npm -v # should print v10.9.0
```

2. Install Angular CLI

```bash
$ npm install -g @angular/cli
$ ng version # should print v19.0.5 as of December 2024
```

1. `cd` into `spacex-launch-ts`

2. Install dependencies with `npm install`

3. Start the Angular development server with `ng serve` (the first time you run this, you may be prompted for your preferences re: enabling autocompletion and sharing usgae data)

4. Navigate to http://localhost:4200

5. Run linter with `ng lint`
