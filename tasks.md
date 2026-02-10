# Implementation Level Tasks

## Phase 1: Backend (The Engine)
*Focus: Node.js, Express, MongoDB*

### Day 1: Server Initialization
- [X] **Project Setup**
    - [X] Create root folder `my-mern-project`.
    - [X] Create `backend` folder inside it.
    - [X] Run `npm init -y` inside `backend` folder.
- [X] **Install Dependencies**
    - [X] Run `npm install express mongoose cors dotenv`.
    - [X] Run `npm install -D nodemon` (for auto-restarting server).
- [X] **Create Basic Server**
    - [X] Create `backend/index.js`.
    - [X] Import express, set up `app`, and listen on port `8080`.
    - [X] Add a test route: `app.get('/', (req, res) => res.send('Server Running'))`.
    - [X] Test in browser: Visit `http://localhost:8080`.

### Day 2: Database Connection
- [X] **MongoDB Atlas Setup**
    - [X] Create free account on MongoDB Atlas.
    - [X] Create a Cluster.
    - [X] **Network Access:** Whitelist IP `0.0.0.0/0` (Allow all).
    - [X] **Database Access:** Create a user (remember password!).
    - [X] Get Connection String (URI).
- [X] **Connect App to DB**
    - [X] Create `.env` file in `backend` folder. Add `MONGO_URI=your_string_here`.
    - [X] In `index.js`, use `mongoose.connect(process.env.MONGO_URI)` to connect.
    - [X] Verify "MongoDB Connected" logs in terminal.
- [X] **Create Model (Schema)**
    - [X] Create folder `backend/models`.
    - [X] Create file `Item.js` (or `Task.js`, `user.js` depending on project).
    - [X] Define Mongoose Schema (structure of your data).

### Day 3: API Routes (CRUD)
- [X] **Setup Router**
    - [X] Create folder `backend/routes`.
    - [X] Create file `api.js`.
- [ ] **Implement Endpoints**
    - [ ] **POST** `/save`: Receive JSON body, save to MongoDB using `.create()`.
    - [ ] **GET** `/all`: Fetch all data using `.find()`, return JSON.
    - [ ] **DELETE** `/delete/:id`: Delete item using `.findByIdAndDelete()`.
    - [ ] **PUT** `/update/:id`: Update item using `.findByIdAndUpdate()`.
- [ ] **Testing (Crucial)**
    - [X] Install **Thunder Client** (VS Code extension) or Postman.
    - [ ] Test all 4 routes manually. Ensure data appears in MongoDB Atlas.

---

## Phase 2: Frontend (The Interface)
*Focus: React, Vite, Axios*

### Day 4: React Initialization
- [ ] **Setup Vite**
    - [ ] Go to root folder. Run `npm create vite@latest client -- --template react`.
    - [ ] Run `cd frontend` and `npm install`.
    - [ ] Install Axios: `npm install axios` (for calling backend).
- [ ] **Cleanup**
    - [ ] Delete default boilerplate code in `App.jsx` and `App.css`.
    - [ ] Create components folder: `frontend/src/components`.

### Day 5: Fetch & Display Data (Read)
- [ ] **Setup State**
    - [ ] Import `useState` and `useEffect` in `App.jsx`.
    - [ ] Create state variable: `const [data, setData] = useState([])`.
- [ ] **Fetch Data**
    - [ ] Use `useEffect` to call `axios.get('http://localhost:5000/api/all')`.
    - [ ] Handle **CORS Error**: Go back to `backend/index.js` and add `app.use(cors())`.
    - [ ] Update state with fetched data: `setData(res.data)`.
- [ ] **Render List**
    - [ ] Use `.map()` function to loop through `data` and display HTML elements.

### Day 6: Send Data (Create)
- [ ] **Create Form Component**
    - [ ] Create input fields for your data.
    - [ ] Create state to hold input values (`currText`, etc.).
- [ ] **Submit Logic**
    - [ ] Create function `handleSubmit`.
    - [ ] Use `axios.post('http://localhost:5000/api/save', payload)`.
    - [ ] On success, refresh the list (fetch data again) or append new item locally.

### Day 7: Interaction (Delete/Update)
- [ ] **Add Delete Buttons**
    - [ ] Add a button to each list item.
    - [ ] On click, call `axios.delete('.../delete/' + item._id)`.
    - [ ] Filter the item out of the local state array to update UI instantly.

---

## Phase 3: Final Polish
*Focus: Styling, Cleanup*

### Day 8: CSS & Cleanup
- [ ] **Styling**
    - [ ] Use basic CSS Grid/Flexbox to center the app.
    - [ ] Make inputs and buttons look decent (padding, margin).
- [ ] **Code Cleanup**
    - [ ] Remove `console.log` statements.
    - [ ] Delete unused files.
- [ ] **Final Test**
    - [ ] Verify full flow: Open app → Add item → Refresh page (item should stay) → Delete item.

### Day 9-10: Buffer/Documentation
- [ ] **Readme.md**
    - [ ] Write simple instructions: "How to run".
      1. `cd backend` -> `npm run dev`
      2. `cd frontend` -> `npm run dev`