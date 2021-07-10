import { Card, Badge } from "antd";
import Link from "next/link";
import { currencyFormatter } from "../../utils/helpers";

const { Meta } = Card;

const CourseCard = ({ course }) => {
  // destructure
  const { name, instructor, price, image, slug, paid, categories , category, updatedAt } = course;
  return (
     <Link href="/course/[slug]" as={`/course/${slug}`}> 
      <a>
        <Card
          className="mb-4"
          cover={
            <img
              //src={image.Location}
              src={course.image ? course.image.Location : "/course.png"}
              alt={name}
              style={{ height: "200px", objectFit: "cover" }}
              className="p-1"
            />
          }
        >
          <h2 className="h4 font-weight-bold text-shadow">{name}</h2>
          <p>by {instructor.name} | {new Date(updatedAt).toLocaleDateString()}</p>

         {categories.map((c) => (
           <>
            <Badge
              count={c.name}
              style={{ backgroundColor: "#03a9f4" }}
              className="pb-2 mr-2"
            /> {' '}
            </>
          ))}  

             {/* <Badge
              count={category}
              style={{ backgroundColor: "#03a9f4" }}
              className="pb-2 mr-2"
            /> */}

          <h4 className="pt-2">
            {paid
              ? currencyFormatter({
                amount: price,
                currency: "usd",
              })
              : "Free"}
          </h4>
        </Card>
      </a>
    </Link>
  );
};

export default CourseCard;