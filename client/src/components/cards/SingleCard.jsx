import React from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { Rating } from "@mui/material";
import dateFormat from "../../common/dateFormat";
import { toast } from "react-toastify";
import { useToggleFavoriteMutation } from "../../features/recipe/recipeApiSlice";
import { setCredentials } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import ShareButton from "../shareButton/ShareButton";
import useAuth from "../../hooks/useAuth";

const SingleCard = ({ singleData, type }) => {
  const user = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [toggleFavorite] = useToggleFavoriteMutation();
  const [showFullContent, setShowFullContent] = useState(false);

  const formattedDate = singleData?.createdAt
    ? dateFormat(singleData.createdAt)
    : singleData?.publishedAt
    ? dateFormat(singleData.publishedAt)
    : "N/A";
  const sumOfRatings = (singleData?.ratings || []).reduce(
    (sum, item) => sum + item.rating,
    0
  );
  const averageRating = singleData?.ratings?.length
    ? sumOfRatings / singleData.ratings.length
    : 0;

  const handleToggleFavorite = async () => {
    try {
      if (!user) {
        toast.error("You must sign in first");
        return navigate("/auth/signin");
      }
      const userData = await toast.promise(
        toggleFavorite({ recipeId: singleData.idMeal }).unwrap(),
        {
          pending: "Please wait...",
          success: "Favorites updated",
          error: "Unable to update favorites",
        }
      );
      dispatch(setCredentials({ ...userData }));
    } catch (error) {
      toast.error(error.data);
      console.error(error);
    }
  };

  const handleReadMore = () => {
    if (type === "recipe") {
      navigate(`/recipe/${singleData.idMeal}`); // Navigate to recipe detail page
    } else if (type === "blog") {
      setShowFullContent(true); // Toggle full content for blogs
    }
  };

  return (
    <div className="flex flex-col gap-1 justify-between shadow hover:shadow-lg rounded">
      <div className="flex flex-col justify-between h-full">
        <div className="relative h-full w-full">
          {type === "recipe" && (
            <div className="absolute top-2 right-0 flex flex-col gap-2 p-2 bg-light rounded-l-lg z-10">
              {user?.favorites?.some((ele) => ele === singleData.idMeal) ? (
                <AiFillHeart
                  className="text-2xl text-red-500 cursor-pointer"
                  onClick={handleToggleFavorite}
                />
              ) : (
                <AiOutlineHeart
                  className="text-2xl text-red-500 cursor-pointer"
                  onClick={handleToggleFavorite}
                />
              )}
              <ShareButton
                url={`${import.meta.env.VITE_BASE_URL}/recipe/${singleData.idMeal}`}
              />
            </div>
          )}
          <img
            src={singleData?.image}
            alt={singleData?.title}
            className="w-full object-cover object-center rounded-t"
          />
          <div className="absolute bottom-0 left-0 w-full backdrop-blur-sm bg-[#fffcf5d3] p-4 flex justify-between">
            <h4 className="font-bold">{singleData.author || "Unknown Author"}</h4>
            <span className="text-sm">{formattedDate}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 p-4">
          <h4 className="font-bold text-lg">{singleData?.title}</h4>
          <p className="text-sm">
            {singleData?.description.substring(0, 100)}...
          </p>
          {type === "recipe" && (
            <Rating value={averageRating} readOnly size={"medium"} />
          )}
        </div>
      </div>
      {showFullContent && type === "blog" && (
        <div className="p-4 bg-gray-100 rounded-b">
          <h4 className="font-bold">Full Article</h4>
          <p className="text-sm">{singleData.description}</p>
          <p className="text-xs text-gray-500">
            Source: <a href={singleData.url} target="_blank" rel="noopener noreferrer">{singleData.url}</a>
          </p>
          <button
            onClick={() => setShowFullContent(false)}
            className="mt-2 text-blue-500 underline"
          >
            Close
          </button>
        </div>
      )}
      <button
        onClick={handleReadMore}
        className="flex gap-2 items-center p-4 mt-4 max-w-max hover:border-primary hover:text-primary"
      >
        Read More
        <BsArrowUpRight />
      </button>
    </div>
  );
};

export default SingleCard;