# Roomly — Shared Space Management System

Roomly is a web-based platform developed as a **Final Graduation Project (TCC)** focused on managing and booking shared spaces within educational institutions. The system was designed to optimize room allocation for activities such as exams, meetings, and academic events, considering constraints like room capacity and resource availability.

The platform provides an integrated environment for administrators and users, enabling efficient space management and reservation workflows.

---

## 🚀 Technologies Used

- Next.js  
- React  
- TypeScript  
- MongoDB  
- Cloudinary (image storage)  
- Tailwind CSS  

---

## 🎯 Features

### For Administrators (Institutions)
- Institution registration and profile management  
- Space/room creation and management  
- Upload room and institution images  
- Reservation approval and rejection  
- View connected users  
- Dashboard with system overview  

### For Users
- User registration and authentication  
- Join institutions using invitation codes  
- View available spaces  
- Request room reservations  
- Manage personal profile  
- Track reservation status  

---

## 🗄 Database Collections

The system uses the following MongoDB collections:

- `usuarios` — User accounts  
- `instituicoes` — Institution data  
- `espacos` — Rooms and shared spaces  
- `reservas` — Reservation requests and status  

---

## 💻 Running the Project Locally

### Requirements
- Node.js  
- MongoDB  
- npm or yarn  

---

### Installation

1. Clone the repository:

```git clone https://github.com/your-username/roomly.git```

Install dependencies:

```npm install```

Configure environment variables:
Create a .env.local file and add:

``` MONGODB_URI=your_mongodb_connection_string```
```CLOUDINARY_URL=your_cloudinary_url```

Run the project:

```npm run dev```

Open in your browser:

```http://localhost:3000```

---

## 📌 Project Objective

Roomly was developed to solve real-world challenges related to shared space management in academic environments. The main goals of the project include:

   - Improving room allocation efficiency

   - Reducing scheduling conflicts

   - Automating reservation approval workflows

   - Providing a scalable and modern web solution
