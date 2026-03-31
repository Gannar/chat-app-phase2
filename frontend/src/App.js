
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <h1>Dashboard (Protected)</h1>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
