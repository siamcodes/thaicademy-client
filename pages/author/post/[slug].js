import { useEffect, useState } from "react";
import axios from "axios";
import AuthorRoute from "../../../components/routes/AuthorRoute";
import { Select, Button, Avatar, Badge } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import MarkdownCheetsheet from "../../../components/modal/MarkdownCheatsheet";
import ReactMarkdown from "react-markdown";
import CodeBlock from "../../../components/marked/CodeBlock";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const { Option } = Select;

const PostEdit = () => {
  const [postId, setPostId] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const [categories, setCategories] = useState([]);
  const [loadedCategories, setLoadedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  //-----
  const [values, setValues] = useState({ 
    _id: "",
    imageTitle: {},
    loading: false, 
  });
  const [imageTitle, setImageTitle] = useState({});
  const [preview, setPreview] = useState("");
  const [uploadButtonText, setUploadButtonText] = useState("Upload image");
  //------
  // markdown cheetsheet modal
  const [markdownCheetsheetModal, setMarkdownCheetsheetModal] = useState(false);
  // router
  const router = useRouter();
  const { slug } = router.query;

  // functions
  useEffect(() => {
    loadPost();
  }, [slug]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadPost = async () => {
    try {
      const { data } = await axios.get(`/api/post/${slug}`);
      console.log("SINGLE POST", data);
      setPostedBy(data.postedBy);
      setTitle(data.title);
      setBody(data.body);
      setPostId(data._id);
      setImageTitle(data.imageTitle); //
      // push category names
      let arr = [];
      data.categories.map((c) => arr.push(c.name));
      setCategories(arr);
    } catch (err) {
      console.log(err);
    }
  };

  const loadCategories = async () => {
    const { data } = await axios.get("/api/categories");
    // console.log(data);
    setLoadedCategories(data);
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleBody = (e) => {
    setBody(e.target.value);
  };

  const handleImage = (e) => {
    setUploading(true);
    // console.log(e.target.files[0]);
    let file = e.target.files[0];

    Resizer.imageFileResizer(
      file, // file
      720, // maxWidth
      500, // maxHeight
      "JPEG", // compressionFormat
      100, // quality
      0, // rotation
      async (uri) => {
        // post to s3
        try {
          let { data } = await axios.post("/api/post/upload-image", {
            image: uri,
          });
          console.log("image uploaded", data);
          setBody(`${body} ![${file.name.replace(/\.[^/.]+$/, "")}](${data})`);
          // update local storage with image
          localStorage.setItem(
            "body",
            JSON.stringify(
              `${body} ![${file.name.replace(/\.[^/.]+$/, "")}](${data})`
            )
          );
          setUploading(false);
        } catch (err) {
          setUploading(false);
          toast("Image upload failed. Try again.");
          console.log(err);
        }
      },
      "base64" // outputType
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await axios.put(`/api/post/${slug}`, {
        postId,
        title,
        body,
        categories,
        imageTitle  //
      });
      toast("Post updated");
      router.push("/author");
    } catch (err) {
      toast(err.response.data);
      setLoading(false);
    }
  };


  const handleImageTitle = async (e) => {
    // remove previous image
    if (values.imageTitle && values.imageTitle.Location) {
       console.log("YES VALUES IMAGE", values.imageTitle);
      let { data } = await axios.post(
        `/api/post/remove-image-title/${values._id}`,
        {
          imageTitle: values.imageTitle,
        }
      );
      // console.log("removed previous image", data);
    }

    console.log(e.target.files[0]);
    let file = e.target.files[0];
    setPreview(window.URL.createObjectURL(file));
    setUploadButtonText(file.name);
    setValues({ ...values, loading: true });

    Resizer.imageFileResizer(
      file, // file
      720, // maxWidth
      500, // maxHeight
      "JPEG", // compressionFormat
      100, // quality
      0, // rotation
      async (uri) => {
        // post to s3
        try {
          let { data } = await axios.post("/api/post/upload-image-title", {
            imageTitle: uri,
          });
          // console.log("image uploaded", data);
          setValues({ ...values, imageTitle: data, loading: false });
          setUploadButtonText("Upload image title");
        } catch (err) {
          setValues({ ...values, loading: false });
          setUploadButtonText("Upload image title");
          toast("Image title upload failed. Try again.");
          console.log(err);
        }
      },
      "base64" // outputType
    );
  };

  const handleImageRemove = async () => {
    try {
      console.log("remove image from s3 ===> ", imageTitle.Key);
      setValues({ ...values, loading: true });
      let { data } = await axios.post("/api/post/remove-image-title", { imageTitle });
      // console.log("Remove image ===> ", data);
      if (data.ok) {
        setImageTitle({});
        setPreview("");
        setUploadButtonText("Upload image");
        setValues({ ...values, loading: false });
      }
    } catch (err) {
      toast("Remove image failed");
      setValues({ ...values, loading: false });
    }
  };

  return (
    <AuthorRoute>
      <h1 className="jumbotron text-center square p-3 mt-2 left-bottom-radius">
        Update Post
      </h1>

      <div className="row pb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control pb-2"
            value={title}
            onChange={handleTitle}
            placeholder="Write post title"
            autoFocus
            required
          />

          <div className="row pt-2">
            <div className="col">
              <label className="btn btn-dark text-left p-3">
                {uploadButtonText}
                <input
                  name="image"
                  onChange={handleImageTitle}
                  type="file"
                  accept="image/*"
                  hidden
                />
              </label>
            </div>
            <div className="col">
              {values && (
                <Badge
                  count="X"
                  onClick={handleImageRemove}
                  style={{ cursor: "pointer" }}
                >
                  <Avatar
                    src={values.imageTitle && values.imageTitle.Location}
                    size={60}
                    shape="square"
                    className="ml-3"
                  />
                </Badge>
              )}
            </div>
          </div>

          <div
            onClick={() => setMarkdownCheetsheetModal(!markdownCheetsheetModal)}
            className="text-center mt-2 mb-2 pointer"
          >
            <b>Learn</b> to <i>write</i> in <code>markdown</code>
          </div>

          <textarea
            onChange={handleBody}
            value={body}
            placeholder="Write post content"
            className="form-control markdown-textarea"
            cols="20"
            rows="25"
            required
          ></textarea>

          <Select
            className="mt-3 mb-3"
            size="large"
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Select category"
            value={categories}
            onChange={(value) => setCategories(value)}
          >
            {loadedCategories.map((c) => (
              <Option key={c.name} value={c.name}>
                {c.name}
              </Option>
            ))}
          </Select>
          {/* upload */}
          <label className="btn btn-primary">
            {uploading ? <SyncOutlined spin className="h4" /> : "INSERT IMAGE"}
            <input onChange={handleImage} type="file" accept="image/*" hidden />
          </label>
          {/* save */}
          <button
            onClick={handleSave}
            className="btn btn-primary float-right"
            disabled={!title || !body || loading || uploading}
          >
            {loading ? <SyncOutlined spin className="h4" /> : "UPDATE"}
          </button>
        </div>
        <div
          className="col-md-4 markdown-preview"
          style={{ maxHeight: "85vh", overflowY: "scroll" }}
        >
          <p>Preview</p>
          <hr />
          <h1>{title}</h1>
          <hr />
          {/* <ReactMarkdown source={body} renderers={{ code: CodeBlock }} /> */}
          <ReactMarkdown source={body} renderers={{ code: CodeBlock }} />
        </div>
      </div>

      <MarkdownCheetsheet
        markdownCheetsheetModal={markdownCheetsheetModal}
        setMarkdownCheetsheetModal={setMarkdownCheetsheetModal}
        extra={true}
      />
    </AuthorRoute>
  );
};

export default PostEdit;
