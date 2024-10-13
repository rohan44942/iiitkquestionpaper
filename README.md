# IIIT Kota Student Resource Platform

This is a full-stack web application designed to help students from IIIT Kota upload and 
access previous year question papers and resources. The platform allows authenticated users
to upload PDFs or images of exam papers, which are subject to approval before being made
available for public viewing.Students can also view and download papers, filtered by year,
branch, and subject.

## Technologies Used

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with GridFS for file storage)
- **Authentication:** Auth0
- **Styling:** Tailwind CSS
- **File Uploading:** Multer and Multer-GridFS-Storage

## Features

- **User Authentication:** Users must log in through Auth0 to upload and mark papers as favorites.
- **File Uploading:** Users can upload question papers and other study resources as PDFs or images.
- **Grid View for Resources:** All resources are neatly displayed with options to filter by year, branch, and subject.
- **Metadata Handling:** Each file has associated metadata, such as year, branch, file name, and description.
- **Approval Process:** Uploaded resources are only made public after admin approval.

## Installation

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB set up locally or using MongoDB Atlas.
- Auth0 account for managing user authentication.

### Step to clone the repo

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/iiitk-resources-platform.git
   cd iiitk-resources-platform
## Usage

1. Once the app is running:
   - Go to [http://localhost:3000](http://localhost:3000) in your browser.
   - Log in using your Auth0 credentials.
2. Users can upload question papers or images via the upload page.
3. Browse and filter existing papers by year, branch, and subject.

## File Upload and Metadata

When uploading a file (PDF or image), you must fill in the following fields:

- **Year**: Choose between First, Second, Third, or Fourth Year.
- **Branch**: Select between CSE (Computer Science), ECE (Electronics), or AI (Artificial Intelligence).
- **File Name**: Provide a suitable name for the file.
- **Description**: Add a brief description of the file content (optional).

> **Note**: Uploaded files will only be available after admin approval.

## Screenshots

### Main Loading Page
This is the page users see when they first load the app.

![main loading page](https://github.com/user-attachments/assets/38c89b82-0b11-449f-b785-2ec438ce27e2)


### Main Data Page
This page displays all uploaded exam papers and resources in a grid format with filtering options.

![Screenshot 2024-10-06 002943](https://github.com/user-attachments/assets/7fbfa99e-a3f3-48c1-b6e8-5980d30731f1)


### Login Page
Users must log in through Auth0 before they can upload or mark papers as favorites.
![login](https://github.com/user-attachments/assets/5b3a1779-0a86-4135-99ab-5053ad3f3988)
![user main page](https://github.com/user-attachments/assets/8c3a349c-b82a-49c3-b863-2701798ec5f4)



### Upload Page
Users can upload exam papers and other resources using a form. Files are made public only after admin approval.

![document upload main page](https://github.com/user-attachments/assets/395f89e8-cf0c-449e-b872-b0bd6e216874)


## Features

- Upload PDFs and images with metadata (Year, Branch, File Name, and Description).
- Filter resources by Year, Branch, and Subject.
- Admin approval required for uploaded files.
- Mark files as favorites after logging in.
