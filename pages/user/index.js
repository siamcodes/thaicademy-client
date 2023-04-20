import { useState, useEffect } from "react";
import UserRoute from "../../components/routes/UserRoute";
import axios from "axios";
import { Avatar } from "antd";
import Link from "next/link";
import {
  SyncOutlined,
  PlayCircleFilled,
  PlayCircleOutlined,
} from "@ant-design/icons";

const UserIndex = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const { data } = await axios.get(`/api/user-courses`);
    console.log(data);
    setCourses(data);
  };

  return (
    <UserRoute>
      <h1 className="jumbotron text-center square p-3 mt-2 left-bottom-radius"> Courses </h1>
      {!courses.length && (
        <Link href="/">
          <a className="btn btn-primary float-right mt-2">Browse Courses</a>
        </Link>
      )}
      {loading && (
        <SyncOutlined
          spin
          className="d-flex justify-content-center display-1 text-primary p-5"
        />
      )}
      <div class="row row-cols-1 row-cols-md-2 g-4">
        {courses &&
          courses.map((course) => (
            <div className="d-flex" key={course._id}>
              <div className="me-auto d-flex">
                <Avatar
                  size={80}
                  shape="square"
                  src={course.image ? course.image.Location : "/course.png"}
                  className="me-3"
                />
                <div>
                  <Link href={`/user/course/${course.slug}`} className="pointer"  >
                    <a> <h5 className="text-primary">{course.name}</h5> </a>
                  </Link>
                  <p style={{ marginTop: "-10px" }}> {course.lessons.length} Lessons </p>
                  <p className="text-muted" style={{ marginTop: "-15px", fontSize: "12px" }}  >
                    By {course.instructor.name}
                  </p>
                </div>
              </div>
              <div className="ms-auto">
                <Link href={`/user/course/${course.slug}`} className="pointer">
                  <a><PlayCircleFilled className="h2 pointer text-primary" /></a>
                </Link>
              </div>
            </div>
          ))}
      </div>
    </UserRoute>
  );
};

export default UserIndex;
