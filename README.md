# School locator API

## Description
A common query type for location-based services, is finding things that are nearby your physical location. This API can be used as a general purpose API for returning the nearest data entries that represent real work locations.

This API will take a geolocation (x, y) and return the (e.g. 50) nearest schools from Japan's national school registry, ordered by distance from the query location.

The MVP will include a clickable map that queries the API and demonstrates the accuracy of the responses by displaying responses through a list, or map icons.

## Techologies Used
### Stack
Javascript, Mongo, Node.js, HTML, CSS

### 3rd Party services APIs
Google maps API (for displaying results)

## Getting Started

Open the map, and click a location to send a query. The results should be displayed prominently and available for further verification.

## Wireframe

## Data Model / ERD

The API is split into two parts: `geolocation` and `school_information`.

## Location API user stories
  1. As a user, I should be able to send my current location to see nearby schools, so that I can select my school easily from a list
  2. As a user, I should be able to filter the API response by grade and number of schools in the response
  3. As a user, I should be able to tap a "more" button to expand the list of schools, so that I can continue to search if the top response doesn't contain my school

#### Pseudo-code
  1. Calculate the distance for all geolocations
  2. Sort by distance
  3. Correlate the nearest (e.g. 25) `geolocation` -> `school_id` with `school_information` -> `school_id`
  4. return an array of `school_information`, ordered by distance, with an added `distance` parameter:

## Admin panel API user stories
  1. As a permissioned user, I should to be able to log in, so that I can access the database functions
  2. As a permissioned user, I should to be able to create, read, update, and delete schools in both `geolocations` and `school_information`, so that I can manage the database in a non-technical way
  3. As a permissioned user, I should to be able to verify that there is a 1-to-1 relationship between schools and locations, so that I can find issues easily
  4. As a permissioned user, I should to be able to view the API's event logs, so that I can track usage and make decisions about rate limiting and pricing

## Routes

| Method | Route        | Return type | Description |
| :----- | :----------: | :---------: | :---------: |
| `GET`    | `/api/schools` | Array[JSON] | Returns an array of `school_information` objects, filtered via options parameters

<details>
  <summary> Query parameters </summary>
  
  | key             | value    | description |
  | :-------------- | :------: | :---------: |
  | `start`	| 0-n	| return beginning at index n (Nth farthest away) instead of 0 |
  | `limit`	| 1-50	| Number of schools to return between	1-50 |
  | `page`	| 0-n	| The page number to use when Paginating through the images	0 |
  | `grade`	| 7-14  | filter for schools that teach the provided grade |
</details>

| Method  | Route             | Return type | Description |
| :------ | :-----------:     | :---------: | :---------: |
| `GET`     | `/admin/school`     | [JSON] | Read all `school_information` entries, or filter by optional parameters

<details>
  <summary> Query parameters </summary>
  
| key             | value    | description |
| :-------------- | :------: | :---------: |
| name	| String	| return beginning at index n (Nth farthest away) instead of 0 |
| type	| String	| Number of schools to return between	1-50 |
| grade	| Integer	| The page number to use when Paginating through the images	0 |

</details>

| Method  | Route             | Return type | Description |
| :------ | :-----------:     | :---------: | :---------: |
| `GET`     | `/admin/location`   | [JSON] | Read all `location` entries, or filter by optional parameters

<details>
  <summary> Query parameters </summary>
  
| key             | value    | description |
| :-------------- | :------: | :---------: |
| `school_id`
| `x`	| 0-n	| return beginning at index n (Nth farthest away) instead of 0 |
| `y`	| 1-50	| Number of schools to return between	1-50 |

</details>


| Method  | Route             | Return type | Description |
| :------ | :-----------:     | :---------: | :---------: |
| `PUT`     | `/admin/school`     | JSON   | Update a new `school_information` entry, returns the updated object
| `PUT`     | `/admin/location`   | JSON   | Update a new `geolocation` entry, returns the updated object
| `DELETE`  | `/admin/school`     | JSON   | Delete a new `school_information` entry, returns the deleted object
| `DELETE`  | `/admin/location`   | JSON   | Delete a new `geolocation` entry, returns the deleted object

<details>
  <summary> Query parameters </summary>
  
| key             | value    | description |
| :-------------- | :------: | :---------: |
| `school_id` | String | (Applies to all PUT & DELETE) Chooses the school id of the entry to Update or delete |

</details>


| Method  | Route             | Return type | Description |
| :------ | :-----------:     | :---------: | :---------: |
| `POST`    | `/admin/school`     | JSON   | Create a new `school_information` entry, filtered via options parameters
| `POST`    | `/admin/location`   | JSON   | Create a new `geolocation` entry, returns the object





- **Your game’s title**: A description of your game. Background info about why you chose the game is a nice touch.
- **Technologies Used**: List of the technologies used, for example: JavaScript, HTML, CSS, etc.
- **Getting Started**: Include a link to your deployed game and any instructions you deem important.
- **WireFrames/ Screenshots**: Screenshots of your website’s landing page/ gameplay. We need a preview of what to expect from you game with these screenshots.
- **Timeline**: Give us a table with all the project dates, MVP items meant for that day, whether you met your goal Y/N, and any notes about those items
- ************************Attributions************************: Include links to any external resources (such as libraries or assets) you used to develop your application.
- **Next Steps**: Planned future enhancements (icebox items).

- 
