import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Blog from "./pages/Blog";
import Blogs from "./pages/Blogs";
import Publish from "./pages/Publish";
import EditBlog from "./pages/EditBlog";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function NotFound() {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>404 - Page Not Found</h1>
    </div>
  );
}

function AuthGuard({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const publicPaths = ["/signup", "/signin"];

    if (token) {
      // If user is authenticated and tries to access auth pages, redirect to blogs
      if (publicPaths.includes(location.pathname)) {
        navigate("/blogs", { replace: true });
      }
    } else {
      // If user is not authenticated and tries to access protected pages
      if (!publicPaths.includes(location.pathname)) {
        navigate("/signin", { replace: true });
      }
    }
  }, [location, navigate]);

  return children;
}

function Root() {
  const token = localStorage.getItem("token");
  return <Navigate to={token ? "/blogs" : "/signin"} replace />;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthGuard>
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
        </AuthGuard>
      </BrowserRouter>
    </>
  );
}

export default App;
