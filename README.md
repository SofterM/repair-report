# Repair Report System

ระบบจัดการรายงานซ่อม (Repair Report) แยกฝั่ง Backend และ Frontend
รองรับการเชื่อมต่อฐานข้อมูล MongoDB พร้อมใช้งานผ่าน React

---

## 📦 ความต้องการของระบบ

ก่อนเริ่มใช้งาน กรุณาติดตั้งโปรแกรมเหล่านี้ก่อน

* [Node.js](https://nodejs.org/) (แนะนำเวอร์ชัน LTS)
* [MongoDB](https://www.mongodb.com/)
* MongoDB Compass
* Git
* Terminal / Command Prompt

---

## ⚙️ การติดตั้ง Backend

### 1. ติดตั้ง MongoDB และ MongoDB Compass

* ดาวน์โหลด MongoDB และติดตั้งให้เรียบร้อย
* เปิด MongoDB Compass เพื่อเช็คว่าฐานข้อมูลเชื่อมต่อได้ปกติ

### 2. เข้าโฟลเดอร์ Backend

```bash
cd backend
```

### 3. ติดตั้ง dependencies และรันเซิร์ฟเวอร์

```bash
npm install
npm start
```

Backend จะรันที่:

```
http://localhost:5000
```

(หรือ port ที่ตั้งไว้ในโปรเจกต์)

---

## 🎨 การติดตั้ง Frontend (React)

เนื่องจากโฟลเดอร์ frontend ไม่ได้อัปขึ้น GitHub เพราะไฟล์มีขนาดใหญ่
ให้ทำตามขั้นตอนนี้เพื่อสร้าง frontend ขึ้นมาใหม่

### 1. เข้าโฟลเดอร์ frontend

```bash
cd frontend
```

### 2. สร้าง React App

```bash
npx create-react-app .
```

### 3. ติดตั้ง dependencies เพิ่มเติม

```bash
npm install
npm install react-icons
```

### 4. รัน Frontend

```bash
npm start
```

Frontend จะรันที่:

```
http://localhost:3000
```

---

## 🔗 การเชื่อมต่อ Backend กับ Frontend

กรุณาตรวจสอบไฟล์ config หรือไฟล์ API ใน frontend
ให้ชี้ไปที่ Backend เช่น:

```
http://localhost:5000/api/...
```

---

## 🛠 เทคโนโลยีที่ใช้

* Backend: Node.js, Express
* Database: MongoDB
* Frontend: React
* UI: React Icons

---

## 📌 หมายเหตุ

* ต้องเปิด MongoDB ก่อนรัน Backend ทุกครั้ง
* ถ้า port ชน ให้แก้ในไฟล์ `.env` หรือ config

---

## 📞 ติดต่อผู้พัฒนา

หากพบปัญหาการใช้งาน สามารถติดต่อผู้พัฒนาได้ผ่าน GitHub Issues

---

> พัฒนาเพื่อการเรียนรู้และใช้งานภายในองค์กร
> สามารถนำไปต่อยอดได้ตามต้องการ 🚀
