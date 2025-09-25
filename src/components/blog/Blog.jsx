// Blog images removed - Blog section not used
// import img1 from "../../assets/images/blog/blog-1.jpg";
// import img2 from "../../assets/images/blog/blog-2.jpg";
// import img3 from "../../assets/images/blog/blog-3.jpg";
// import img4 from "../../assets/images/blog/blog-4.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import MonoBlog from "./MonoBlog";
import "swiper/css";
import "swiper/css/pagination";
import "./blog.css";

// Breakpoints for swiperJS
const custom_breakpoints = {
  640: {
    slidesPerView: 2,
    spaceBetween: 15,
  },
  768: {
    slidesPerView: 3,
    spaceBetween: 15,
  },
  1220: {
    slidesPerView: 4,
    spaceBetween: 24,
  },
};

const blogData = [
  {
    id: 1,
    image: img1,
    date: "22 Oct, 2020",
    comments: 246,
    title: "Designing Engaging User Interfaces for Modern Web Apps",
    link: "#!",
  },
  {
    id: 2,
    image: img2,
    date: "22 Oct, 2020",
    comments: 246,
    title: "Tips for Effective Dashboard Layouts and Usability",
    link: "#!",
  },
  {
    id: 3,
    image: img3,
    date: "22 Oct, 2020",
    comments: 246,
    title: "How to Visualize Data for Better Product Decisions",
    link: "#!",
  },
  {
    id: 4,
    image: img4,
    date: "22 Oct, 2020",
    comments: 246,
    title: "Responsive Design: Adapting to All Devices Seamlessly",
    link: "#!",
  },
  {
    id: 5,
    image: img2,
    date: "22 Oct, 2020",
    comments: 246,
    title: "Streamlining Workflows with UI/UX Best Practices",
    link: "#!",
  },
  {
    id: 6,
    image: img1,
    date: "22 Oct, 2020",
    comments: 246,
    title: "Optimizing Interface Components for Performance",
    link: "#!",
  },
];

const Blog = () => {
  return (
    <div className="content py-25 px-2 relative" id="blog">
      <div className="max-w-135 text-center mx-auto pb-17.5">
        <p className="section-title pb-6">Blog</p>
        <p className="text-xs xs:text-[16px] md:text-lg text-gray-400">
          Check out my recent blog posts where I share insights on design,
          development, and the latest industry trends.
        </p>
      </div>
      <Swiper
        grabCursor={true}
        breakpoints={custom_breakpoints}
        pagination={{ clickable: true }}
        modules={[Pagination]}
      >
        {blogData?.map((data, index) => (
          <SwiperSlide
            key={index}
            className="mb-10" /* pagination margin bottom to 40px */
            style={{ backgroundColor: "rgba(0,0,0,0)" }}
          >
            <MonoBlog data={data} key={index} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Blog;
