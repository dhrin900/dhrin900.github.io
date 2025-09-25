const MonoBlog = ({ data }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-100 hover:shadow-2xl bg-white shadow-gray-300 transition-all duration-300">
      <a href={data?.link}>
        <img
          src={data?.image}
          alt="Blog"
          className="w-full h-56.5 object-cover "
        />
        <div className="m-6">
          <p className="text-[10px] xs:text-[14px] font-normal text-gray-400 ">
            {data?.date} / {data?.comments} Comments
          </p>
          <p className="text-[14px] xs:text-lg font-medium text-[#333333]">
            {data?.title.length > 40
              ? `${data?.title.slice(0, 40)}...`
              : data?.title}
          </p>
        </div>
      </a>
    </div>
  );
};

export default MonoBlog;
