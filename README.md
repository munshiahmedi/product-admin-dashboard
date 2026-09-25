# Product Admin Dashboard

A responsive Product Admin Dashboard built with **Next.js, React, Tailwind CSS, Axios, and DummyJSON API**.

The application allows users to log in, browse products, search and filter products, sort results, view product details, and perform add, edit, and delete operations.

## Features

* User login with DummyJSON authentication
* Protected product dashboard
* Logout functionality
* Product listing
* Responsive desktop table and mobile cards
* Product search with debounce
* Category filtering
* Sorting by:

  * Price
  * Rating
  * Title
* Pagination with page sizes:

  * 10
  * 20
  * 50
* URL-based search, filter, sorting, and pagination state
* Product details page
* Product reviews
* Add product form
* Edit product form
* Delete confirmation
* Form validation
* Loading states
* Error states with retry
* Empty search results state
* Invalid URL parameter handling
* Protection against stale search responses
* Shared Axios instance with request and response interceptors

## Tech Stack

* Next.js
* React
* JavaScript
* Tailwind CSS
* Axios
* DummyJSON API

## Project Structure

```text
src/
├── api/
│   ├── auth.js
│   └── products.js
│
├── lib/
│   └── axios.js
│
├── components/
│   ├── AuthGuard.js
│   ├── DeleteProductButton.js
│   └── Navbar.js
│
└── app/
    ├── page.js
    ├── login/
    │   └── page.js
    │
    └── products/
        ├── page.js
        ├── not-found.js
        ├── add/
        │   └── page.js
        │
        └── [id]/
            ├── page.js
            └── edit/
                └── page.js
```

## Getting Started

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Go to the project directory

```bash
cd product-admin-dashboard
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Login Credentials

The assignment uses the following DummyJSON test credentials:

```text
Username: emilys
Password: emilyspass
```

## API Endpoints Used

### Authentication

```text
POST /auth/login
```

### Products

```text
GET /products
GET /products/search
GET /products/categories
GET /products/category/{category}
GET /products/{id}
POST /products/add
PUT /products/{id}
DELETE /products/{id}
```

## Axios Setup

All API requests use a shared Axios instance located at:

```text
src/lib/axios.js
```

The Axios instance contains:

* Base API URL
* Common headers
* Authentication token handling
* Centralized response error handling

The login token is stored after successful authentication and is added to API requests through the Axios request interceptor.

## Search and Debouncing

Product search uses the DummyJSON search endpoint.

A **500ms debounce** is used so the application does not send a request for every keystroke.

For example, when the user types:

```text
laptop
```

the application waits until the user stops typing before sending the search request.

## Search + Category Behavior

DummyJSON provides separate endpoints for product search and category filtering.

Because there is no dedicated endpoint for combining both operations, this application gives **search priority** when both search and category are selected.

The behavior is:

```text
Search only
→ /products/search

Category only
→ /products/category/{category}

Search + category
→ /products/search
```

When both are selected, the category is ignored and the search endpoint is used.

This is an intentional implementation decision based on the available DummyJSON API.

## Pagination

Pagination uses the API's `limit` and `skip` parameters.

Example:

```text
Page 1, limit 10
skip = 0

Page 2, limit 10
skip = 10
```

The dashboard also displays the current range, for example:

```text
Showing 21–40 of 194
```

## URL State

Search, category, sorting, page, and page size are stored in the URL.

Example:

```text
/products?page=2&limit=20&search=laptop&sortBy=price&sortOrder=asc
```

This allows the current dashboard state to be preserved when the page is refreshed or shared.

Invalid values such as:

```text
?page=abc
?limit=999
```

are handled safely by falling back to valid default values.

## Race Condition Handling

Search requests can take different amounts of time to complete.

To prevent an older request from overwriting newer search results, the application tracks each request and ignores stale responses.

This ensures that fast typing does not cause outdated search results to replace newer results.

## Form Validation

The Add Product and Edit Product forms validate:

* Product title
* Description
* Price
* Stock
* Category

Examples:

```text
Product title is required.
Product description is required.
Price must be greater than 0.
Stock cannot be negative.
Category is required.
```

## Loading, Error and Empty States

The application handles:

### Loading

```text
Loading products...
```

### Error

```text
Failed to load products. Please try again.
```

A Retry button is provided when product loading fails.

### Empty State

When no products match the search or filter:

```text
No products found
Try changing your search or filters.
```

## DummyJSON Mutation Behavior

DummyJSON supports the Add, Update, and Delete API operations used in this assignment, but these mutation operations are simulated.

Therefore, a newly added, updated, or deleted product may not permanently change the remote DummyJSON dataset after another request or page refresh.

The UI still implements the required CRUD request flows and handles success/error states.

## Responsive Design

The dashboard uses responsive layouts:

* Desktop: product table
* Mobile: product cards

The interface is built using Tailwind CSS responsive utilities.

## Assignment Approach

The project keeps API calls separate from UI components.

API functions are located in:

```text
src/api/
```

Reusable application-level functionality such as Axios configuration and authentication protection is separated into:

```text
src/lib/
src/components/
```

This keeps the application easier to understand and maintain.

## Build

To create a production build:

```bash
npm run build
```

To run the production build locally:

```bash
npm start
```

## Notes

This project was developed as a frontend assignment using the provided DummyJSON API.

The implementation focuses on:

* Clear component structure
* Reusable API functions
* Responsive UI
* URL state management
* Form validation
* Error handling
* Reliable search behavior
* Understanding and documenting API limitations

```

### After pasting

Save `README.md`.

**Don't deploy yet.** First we'll do the **final code cleanup/check** so we don't push unnecessary code or mistakes to GitHub.

Tell me **“README done”** when you've saved it.
```
