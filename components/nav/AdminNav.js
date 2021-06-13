import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Context } from "../../context";

const AdminNav = () => {
  const [current, setCurrent] = useState("");

  // context
  const {
    state: { user },
    dispatch,
  } = useContext(Context);
  // router
  const router = useRouter();


  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return (
    <div className="nav flex-column nav-pills mt-2">
      <Link href="/admin">
        <a className={`nav-link ${current === "/admin" && "active"}`}>
          Dashboard
        </a>
      </Link>

      <Link href="/admin/users">
        <a className={`nav-link ${current === "/admin/users" && "active"}`}>
          Users
        </a>
      </Link>

      <Link href="/admin/category">
        <a className={`nav-link ${current === "/admin/category" && "active"}`}>
          Categories
        </a>
      </Link>

      <Link href="/admin/issues">
        <a className={`nav-link ${current === "/admin/issues" && "active"}`}>
          Issues
        </a>
      </Link>

      <Link href="/admin/posts">
        <a className={`nav-link ${current === "/admin/posts" && "active"}`}>
          Posts
        </a>
      </Link>

      {user && user.role && user.role.includes("Author") ? (
        <></>
      ) : (
        <Link href="/user/become-author" key="/user/become-author">
          <a className={`nav-link ${current === "/user/become-author" && "active"}`}>Become Author</a>
        </Link>
      )}

      {user &&
        user.role &&
        user.stripe_seller &&
        user.role.includes("Instructor") &&
        user.stripe_seller.charges_enabled ? (
        <></>
      ) : (
        <Link href="/user/become-instructor" key="/user/become-instructor">
          <a className={`nav-link ${current === "/user/become-instructor" && "active"}`}>Become Instructor</a>
        </Link>
      )}

    </div>
  );
};

export default AdminNav;
