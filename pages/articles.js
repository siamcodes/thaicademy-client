import { withRouter } from "next/router";
import axios from "axios";
import PostCard from "../components/cards/PostCard";
import Head from "next/head";

const Articles = ({ posts, router }) => {
  const head = () => (
    <Head>
      <meta charset="UTF-8" />
      <title>
        Articles |{" "}
        {process.env.APP_NAME}
      </title>
      <meta
        name="description"
        content="Articles  Free and Paid"
      />
      <link rel="canonical" href={`${process.env.DOMAIN}${router.pathname}`} />
      <meta
        property="og:title"
        content={`Articles  | ${process.env.APP_NAME}`}
      />
      <meta
        property="og:description"
        content={`Articles | Free and Paid | ${process.env.APP_NAME}`}
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
      {/* <h1 className="jumbotron text-center bg-primary square">
        Online Education Marketplace
      </h1> */}
      <div className="container">
        <div className="row pt-2">
          {posts.map((post) => (
            <div key={post._id} className="col-md-3">
              <PostCard post={post} />
              {/* <pre>{JSON.stringify(post, null, 4)}</pre> */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const { data } = await axios.get(`${process.env.API}/posts`);
  // console.log("DATA LENGTH =====> ", data.length);
  return {
    props: {
      posts: data,
    },
  };
}

export default withRouter(Articles);
