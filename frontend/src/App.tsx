import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Blog from "./pages/Blog";
import Blogs from "./pages/Blogs";
import Publish from "./pages/Publish";
import EditBlog from "./pages/EditBlog";

function NotFound() {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>404 - Page Not Found</h1>
    </div>
  );
}

function Root() {
  return <Blogs />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/edit/:id" element={<EditBlog />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/publish" element={<Publish />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;