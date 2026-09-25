# Product Admin Dashboard

A responsive Product Admin Dashboard built with **Next.js, React, Tailwind CSS, Axios, and DummyJSON API**.

The application allows users to log in, browse products, search and filter products, sort results, view product details, and perform add, edit, and delete operations.

## Features

* User login with DummyJSON authentication
* Protected product dashboard
* Logout functionality
* Product listing
* Responsive desktop table
* Responsive mobile product cards
* Product search with 500ms debounce
* Category filtering
* Sorting by:

  * Price
  * Rating
  * Title
* Ascending and descending sorting
* Pagination using `limit` and `skip`
* Page sizes:

  * 10
  * 20
  * 50
* Page numbers
* Previous and Next buttons
* URL-based pagination, search, category, and sorting state
* Product details page
* Product images
* Product reviews
* Add product form
* Edit product form
* Delete confirmation
* Form validation
* Loading states
* Error states with Retry
* Empty search/filter state
* Invalid URL parameter handling
* Protection against stale search responses
* Shared Axios instance
* Axios request and response interceptors
* API calls separated from UI components

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
    │
    ├── login/
    │   └── page.js
    │
    └── products/
        ├── page.js
        ├── not-found.js
        │
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
git clone https://github.com/munshiahmedi/product-admin-dashboard.git
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

The application uses the following DummyJSON test credentials:

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

## Shared Axios Setup

All API requests use a shared Axios instance located at:

```text
src/lib/axios.js
```

The shared Axios instance handles:

* Base API URL
* Common headers
* Authentication token handling
* Request interceptor
* Centralized response error handling

After successful login, the authentication token is stored in `localStorage`.

The Axios request interceptor automatically adds the token to subsequent API requests.

## Authentication and Route Protection

The login page sends credentials to:

```text
POST /auth/login
```

After successful authentication, the access token is stored and the user is redirected to the product dashboard.

Protected product pages use an `AuthGuard` component to check whether an authentication token exists.

If a user is not authenticated, they are redirected to the login page.

The logout button removes the stored token and redirects the user back to login.

## Product Listing

The product dashboard displays:

* Product image
* Product title
* Category
* Price
* Rating
* Stock

On desktop screens, products are displayed in a table.

On smaller screens, products are displayed as responsive cards.

## Pagination

Pagination uses the DummyJSON `limit` and `skip` parameters.

The skip value is calculated using:

```text
skip = (page - 1) * limit
```

For example:

```text
Page 1, limit 10
skip = 0

Page 2, limit 10
skip = 10

Page 3, limit 10
skip = 20
```

The dashboard also displays the current product range.

Example:

```text
Showing 21–40 of 194
```

Available page sizes:

```text
10
20
50
```

## Search and Debouncing

Product search uses:

```text
GET /products/search?q=
```

A 500ms debounce is used so that the application waits until the user stops typing before making the API request.

For example, when the user types:

```text
laptop
```

the application waits briefly after the last keystroke before sending the request.

When the search changes, pagination is reset to page 1.

## Search Race Condition

When users type quickly, multiple search requests can be in progress at the same time.

For example:

```text
Request A → laptop
Request B → laptops
```

Request A might finish after Request B.

To prevent old results from replacing newer results, the application tracks each request using a request ID.

Only the latest request is allowed to update the product state.

This prevents stale search responses from overwriting newer results.

The same logic can be tested with an API delay such as:

```text
&delay=2000
```

## Category Filtering

Categories are loaded from:

```text
GET /products/categories
```

Products can then be filtered using the category endpoint:

```text
GET /products/category/{category}
```

The selected category is stored in the URL.

Changing the category resets pagination to page 1.

## Search and Category Behavior

DummyJSON provides separate endpoints for search and category filtering and does not provide a combined search-and-category endpoint.

Therefore, this application gives search priority when both search and category are selected.

The behavior is:

```text
Search only
→ /products/search

Category only
→ /products/category/{category}

Search + category
→ /products/search
```

When both values are selected, the category filter is not applied to the search request.

This is an intentional implementation decision based on the available DummyJSON API.

## Sorting

Products can be sorted by:

* Price
* Rating
* Title

Both ascending and descending order are supported.

The sorting state is stored in the URL.

Example:

```text
/products?page=1&limit=20&sortBy=price&sortOrder=asc
```

## URL State

The product dashboard stores the following values in the URL:

* Page
* Page size
* Search
* Category
* Sort field
* Sort order

Example:

```text
/products?page=2&limit=20&search=laptop&sortBy=price&sortOrder=asc
```

This allows the dashboard state to remain available when the page is refreshed or when the URL is shared.

Invalid values are handled safely.

For example:

```text
/products?page=abc
/products?limit=999
```

The application falls back to valid default values instead of breaking.

## Product Details

Product details are available at:

```text
/products/[id]
```

The details page displays:

* Product images
* Product title
* Category
* Description
* Price
* Rating
* Stock
* Brand when available
* Reviews

If an invalid product ID is requested, the application displays a product not found page instead of crashing.

## Add Product

The Add Product page is available at:

```text
/products/add
```

The form contains:

* Title
* Description
* Price
* Stock
* Category

Validation includes:

```text
Product title is required.

Product description is required.

Price must be greater than 0.

Stock cannot be negative.

Category is required.
```

The form also prevents multiple Save requests while a request is already in progress.

The API request is handled through the separate product API module.

An image input is not included because the assignment requires product images to be displayed, but does not specifically require an image upload/input field for the Add/Edit form.

## Edit Product

The Edit Product page is available at:

```text
/products/[id]/edit
```

When the page loads, the existing product information is fetched and displayed in the form.

The same validation rules used by Add Product are applied to Edit Product.

The form prevents multiple Update requests while a request is already in progress.

## Delete Product

The product details page includes a Delete button.

Before deleting, the application displays a confirmation popup:

```text
Are you sure you want to delete this product?
```

If the user cancels, no delete request is sent.

If the user confirms, the application calls:

```text
DELETE /products/{id}
```

The Delete button also has a loading state to prevent multiple delete requests.

## DummyJSON Mutation Behavior

DummyJSON provides Add, Update, and Delete endpoints for this assignment, but these mutation operations are simulated and are not permanently persisted in the remote dataset.

Because of this limitation, an Add, Update, or Delete request can succeed while a later fresh API request may still return the original dataset.

The application implements the required mutation request flows, handles success and error responses, and redirects the user appropriately after the operation.

The README does not treat these simulated API mutations as permanently persisted database changes.

## Loading States

Loading states are provided for important asynchronous operations, including:

* Login
* Product loading
* Product details loading
* Add product
* Edit product
* Delete product

Example:

```text
Loading products...
```

## Error States

API errors are handled and displayed to the user.

For product loading failures, the dashboard displays an error message and a Retry button.

Example:

```text
Failed to load products. Please try again.
```

The Retry button triggers the product request again.

## Empty State

When a search or filter does not return any products, the dashboard displays:

```text
No products found

Try changing your search or filters.
```

## Form Validation

Both Add and Edit forms validate user input before sending API requests.

The application checks:

* Required title
* Required description
* Positive price
* Non-negative stock
* Required category

Validation errors are displayed directly in the form.

## Responsive Design

Tailwind CSS responsive utilities are used to provide different layouts for desktop and mobile devices.

Desktop:

```text
Product table
```

Mobile:

```text
Product cards
```

Forms and dashboard controls are also designed to work on smaller screens.

## Component and API Structure

API functions are kept separate from the UI.

API files:

```text
src/api/auth.js
src/api/products.js
```

Shared application functionality is separated into:

```text
src/lib/
src/components/
```

This keeps API logic, authentication logic, and UI responsibilities separated and makes the project easier to understand and maintain.

## Assignment Rules Followed

The project does not use:

* React Query
* SWR
* Ready-made table libraries
* Ready-made pagination libraries

Pagination, search debounce, URL state handling, and race-condition handling are implemented manually.

All API requests use Axios.

## Development Notes

### Design Choices

A shared Axios instance is used so authentication headers and common API error handling can be managed in one place.

API calls are separated into dedicated API files instead of being written directly inside UI components.

Pagination, search, category filtering, and sorting are stored in the URL so the current dashboard state can be refreshed or shared.

### Problem Faced

One problem was preventing older search requests from replacing newer search results when multiple requests were running at the same time.

This was solved by tracking each request with a request ID and only allowing the latest request to update the product state.

### AI Assistance

AI tools were used during development for implementation suggestions, debugging, code structure, and explaining technical issues.

The generated suggestions were reviewed, tested, and modified during development. The final implementation was tested locally and the production build was verified with:

```bash
npm run build
```

## Build and Production

To create a production build:

```bash
npm run build
```

To run the production build locally:

```bash
npm start
```

## GitHub Repository

Public repository:

https://github.com/munshiahmedi/product-admin-dashboard

## Notes

This project was developed as a frontend assignment using the provided DummyJSON API.

The implementation focuses on:

* Clear component structure
* Reusable API functions
* Shared Axios configuration
* Responsive UI
* URL-based state management
* Form validation
* Loading and error handling
* Search debouncing
* Race-condition prevention
* Manual pagination
* Documented API limitations
* Maintainable project structure
