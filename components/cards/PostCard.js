import { Card, Badge } from "antd";
import Link from "next/link";

const { Meta } = Card;

const PostCard = ({ post }) => {
  // destructure
  const { title, slug, categories, postedBy, updatedAt } = post;

  return (
    <>
      <Link href="/article/[slug]" as={`/article/${slug}`}>
        <a>
          <Card
            // style={{ height: "320px" }}
            className="mb-4"
            cover={
              <img
                src={post.image ? post.image.Location : "/default.jpg"}
                alt={title}
                style={{ objectFit: "cover" }}
                className="p-1"
              />
            }
          >
            <h2 className="h4 font-weight-bold text-shadow">
              {title && title.substring(0, 160)}
            </h2>
            <p>by {postedBy.name} | {new Date(updatedAt).toLocaleDateString()}</p>

            {categories.map((c) => (
              <>
                <Badge
                  key={c._id}
                  count={c.name}
                  style={{ backgroundColor: "#03a9f4" }}
                  className="pb-2 mr-2"
                />{' '}
              </>
            ))}
          </Card>
        </a>
      </Link>
    </>
  );
};

export default PostCard;
