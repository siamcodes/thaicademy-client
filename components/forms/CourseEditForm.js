import { Select, Button, Avatar, Badge } from "antd";
import { useRouter } from "next/router";
import MarkdownCheetsheet from "../../components/modal/MarkdownCheatsheet";

const { Option } = Select;

const CourseEditForm = ({
  values,
  setValues,
  handleChange,
  handleImage,
  handleSubmit,
  categoryList,
  preview,
  uploadButtonText,
  selectedCategories,
  setSelectedCategories,
  markdownCheetsheetModal,
  setMarkdownCheetsheetModal = (f) => f,
}) => {
  // generate price
  const children = [];
  for (let i = 1.99; i <= 999.99; i++) {
    children.push(<Option key={i.toFixed(2)}>${i.toFixed(2)}</Option>);
  }

  // router
  const router = useRouter();

  return (
    <>
      {values && (
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Name"
                value={values.name}
                onChange={handleChange}
              />
            </div>

            <div className="col-sm-4">
              <Avatar
                src={values.image && values.image.Location}
                size={38}
                shape="square"
              />{' '}

              <label className="btn btn-dark text-left square">
                {uploadButtonText}
                <input
                  name="image"
                  onChange={handleImage}
                  type="file"
                  accept="image/*"
                  hidden
                />
              </label>
            </div>
          </div>

          <div
            onClick={() => setMarkdownCheetsheetModal(!markdownCheetsheetModal)}
            className="text-center mb-4 pointer"
            style={{ height: "10px" }}
          >
            <b>Learn</b> to <i>write</i> in <code>markdown</code>
          </div>
          <MarkdownCheetsheet
            markdownCheetsheetModal={markdownCheetsheetModal}
            setMarkdownCheetsheetModal={setMarkdownCheetsheetModal}
          />

          <div className="row mb-3">
            <div className="col">
              <textarea
                name="description"
                value={values.description}
                onChange={handleChange}
                className="form-control pt-4 markdown-textarea"
                placeholder="Description"
                cols="7"
                rows="7"
                required
              ></textarea>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <Select
                style={{ width: "100%" }}
                size="large"
                value={values.paid}
                onChange={(v) => setValues({ ...values, paid: !values.paid })}
              >
                <Option value={true}>Paid</Option>
                <Option value={false}>Free</Option>
              </Select>
            </div>

            {values.paid && (
              <div className="col-sm-2">
                <Select
                  defaultValue={values.price}
                  style={{ width: "100%" }}
                  onChange={(v) => setValues({ ...values, price: v })}
                  tokenSeparators={[","]}
                  size="large"
                >
                  {children}
                </Select>
              </div>
            )}
          </div>

          <div className="row mb-3">
            <div className="col">
              <Select
                mode="multiple"
                allowClear
                placeholder="Select categories"
                style={{ width: "100%" }}
                size="large"
                onChange={(v) => setSelectedCategories(v)}
                value={selectedCategories}
              >
                {categoryList.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <Button
                onClick={handleSubmit}
                disabled={values.loading}
                className="btn btn-primary"
                type="primary"
                size="large"
                shape="round"
                loading={values.loading}
              >
                Save & Continue
              </Button>

              <Button
                onClick={() =>
                  router.push(`/instructor/course/view/${values.slug}`)
                }
                disabled={values.loading}
                className="btn btn-warning float-right"
                size="large"
                shape="round"
              >
                Go back
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default CourseEditForm;
