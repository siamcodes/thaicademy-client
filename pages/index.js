import { withRouter } from "next/router";
import axios from "axios";
import CourseCard from "../components/cards/CourseCard";
import Head from "next/head";

const Index = ({ courses, router }) => {
  const head = () => (
    <Head>
      <title>
        Courses online |{" "}
        {process.env.APP_NAME}
      </title>
      <meta
        name="description"
        content="Courses online Free and Paid"
      />
      <link rel="canonical" href={`${process.env.DOMAIN}${router.pathname}`} />
      <meta
        property="og:title"
        content={`Courses online | ${process.env.APP_NAME}`}
      />
      <meta
        property="og:description"
        content={`Courses online | Free and Paid | ${process.env.APP_NAME}`}
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${process.env.DOMAIN}/default.jpg`} />
      <meta property="og:site_name" content={process.env.APP_NAME} />
      <meta property="og:image" content={`${process.env.DOMAIN}/default.jpg`} />
      <meta
        property="og:image:secure_url"
        content={`${process.env.DOMAIN}/default.jpg`}
      />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="fb:app_id" content={process.env.NEXT_PUBLIC_FB_APP_ID} />
      <script data-ad-client="ca-pub-3283607139562325" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
    </Head>
  );

  return (
    <>
      {head()}
      <div className="jumbotron text-center bg-primary square p-5">
        <h1 style={{ color: "#FFF", paddingTop: '1px' }}>
          ระบบจัดการเรียนรู้ เรียนได้ทุกที่ทุกเวลาด้วยหลักสูตรที่ทันสมัย กับอาจารย์มืออาชีพ
        </h1>
      </div>
      <div className="container">
        <div className="row pt-2">
          {courses.map((course) => (
            <div key={course._id} className="col-md-4">
              <CourseCard key={course._id} course={course} />
              {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const { data } = await axios.get(`${process.env.API}/courses`);
  // console.log("DATA LENGTH =====> ", data.length);
  return {
    props: {
      courses: data,
    },
  };
}

export default withRouter(Index);

