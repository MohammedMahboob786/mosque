# 🕌 Mosque Azan & Namaz Notification App

This is a full-stack web application designed to help mosques share **Azan** and **Namaz** (prayer) timings with the local Muslim community — especially in regions where loudspeaker announcements are restricted or prohibited.

The app allows **Mosque Admins** to register their mosque, update prayer timings, and lets **local users (Subscribers)** view and follow their preferred mosque’s timings from any device.

---

## 🌟 What This App Does

### 👤 For Mosque Admins:
- Register their mosque and receive a unique `mosque_id`
- Login securely with their credentials
- Update daily **Azan** and **Namaz** timings
- View existing prayer timings for their mosque

### 🙋‍♂️ For Subscribers:
- Browse all registered mosques
- Select a **preferred mosque**
- View real-time prayer timings from their selected mosque

---

## 🧩 How It Works

1. Mosque Admin visits the site and logs in  
   ⤷ If new, clicks "Register?" to create a mosque account

2. On successful login, admin is redirected to update timings  
   ⤷ Timings are stored in the backend and publicly accessible via mosque ID

3. Subscribers can browse mosques  
   ⤷ Choose a preferred mosque  
   ⤷ View its Azan & Namaz timings directly

This setup avoids the need for loudspeaker announcements — while still keeping the community in sync with accurate prayer times.

---

## ⚙️ Tech Used

- **Frontend**: React (with React Router)
- **Backend**: Django + Django REST Framework
- **Authentication**: JWT (admin login only)
- **Database**: MySQL

---

## 🚀 Quick Demo Flow

1. 🧑‍💼 Admin lands on login page  
2. 📝 Clicks **"Register?"** to create mosque account  
3. ✅ Receives confirmation and `mosque_id`  
4. 🔐 Logs in and updates prayer timings  
5. 🌍 Subscriber selects mosque and sees the schedule

---

## 🔗 Sample API Endpoints

| Endpoint                                 | Method | Access   | Purpose                      |
|------------------------------------------|--------|----------|------------------------------|
| `/api/mosque/register/`                  | POST   | Public   | Register a mosque            |
| `/api/mosque/mosque-login/`              | POST   | Public   | Login and get JWT token      |
| `/api/mosque/update-azan/`               | POST   | Private  | Update Azan timings          |
| `/api/mosque/update-namaz/`              | POST   | Private  | Update Namaz timings         |
| `/api/mosque/{mosque_id}/timings/`       | GET    | Public   | Get current prayer timings   |
| `/api/user/<str:user_id>/subscriptions`  | GET    | Public   | Get all mosques list for user|

---

## 📂 Local Setup (Frontend)