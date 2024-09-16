# Inktale

Inktale is a fully responsive blog application built with Express, MongoDB, and EJS. It features a mobile-first design, user authentication, and a variety of functionalities for managing blogs and user profiles.


## Troubleshooting

- **Server Not Responding**: The Render free tier may cause slower response times if the server has been idle. Refresh the page or wait a few moments for it to start.

- **Live Demo**: [Inktale Blog](https://inktale-blog.onrender.com)


## Features

- **Responsive Design**: Designed with a mobile-first approach to ensure optimal viewing across all devices.

- **User Authentication**: Register and log in using sessions.

- **Blog Management**: Create, update, and delete blogs.

- **Dashboard**: View total visits, reactions, and published articles. Manage your blogs with options to edit or delete.

- **Blog Interaction**: See likes and bookmarks on each blog. Like and bookmark blogs.

- **Bookmark Page**: View and manage all the blogs you have bookmarked.

- **Settings Page**: Edit basic info including profile photo, full name, username, email, and short bio. Change your password or delete your account.

- **Markdown Support**: Create blogs with banner images and write content in Markdown format.

## Technical Details

- **Express Session**: Used for managing user sessions. Sessions are cleared on logout.

- **Image Validation**: Implemented both client-side and server-side validation for image uploads.

- **Mongoose**: Utilized for interacting with MongoDB.

- **Markdown Rendering**: Blogs are rendered with Markdown using `markdown-it` and `highlight.js`.

- **Performance Optimization**: Improved performance with `express-minify` and `compression`.

- **Cloudinary**: Used for storing images.

- **Route Security**: Secured routes with middleware, requiring login for access to certain routes.

- **CORS and Rate Limiting**: Implemented CORS and rate limiting to enhance security.

- **EJS Templating**: Used EJS for rendering dynamic pages with reusable components like header, footer, and cards.

- **MVC Architecture**: Organized code with a good folder structure following the MVC pattern.

## Installation

1. Clone the repository:
   ``` bash
   git clone https://github.com/billalben/inktale-blog.git
    ```

2. Navigate to the project directory
    ``` bash
    cd inktale-blog
    ```

3. Install dependencies
    ``` bash
    npm install
    ```

4. Create a .env file in the root directory and add the necessary environment variables:
    ``` bash

    MONGO_URI=your_mongodb_connection_string
    SESSION_SECRET=your_session_secret

    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret

    CORS_ORIGIN=your_website_link
    PORT=3000
    ```

5. Start the application:

    ```bash
    npm start
    ```

6. Open your browser and navigate to `http://localhost:3000`.

## Contributing

Feel free to fork the repository and submit pull requests. Contributions are welcome!