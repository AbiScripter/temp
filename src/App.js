import axios from "axios";
import "./App.css";
import { useEffect, useState } from "react";
import Loader from "./components/Loader";
import CategoryTabs from "./components/CategoryTabs";
import ArticleCard from "./components/ArticleCard";
import darkIcon from "./assets/9104269_night_night mode_moon_crescent_dark mode_icon.svg";
import lightIcon from "./assets/9104141_sun_bright_brightness_light mode_icon.svg";
//!news api
const API_KEY = `0ab57087d92b4d4292af2bb48b47bf60`;
const API_KEY_2 = `03d9bb4ae18c4c6aa9c39114cc4ed93e`;
const country = "in"; //INDIA
//!gnews
// const api_key = `a6eb36a186969ed8b33a82f908bdb58e`;
const headlinesUrl = `https://gnews.io/api/v4/top-headlines?country=in&lang=en&token=a6eb36a186969ed8b33a82f908bdb58e`;

//!newsdata.io
const api_key = "pub_44179f13e7f1d11c54f74ef34d7f2b17b6165";
// `https://newsdata.io/api/1/news?apikey=${api_key}&language=en&country=${country}&category=${category}`

function App() {
  const [data, setData] = useState({});
  const [category, setCategory] = useState("top");
  const [page, setPage] = useState(1);
  const [dark, setDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const darkModeHandler = () => {
    setDark(!dark);
    document.body.classList.toggle("dark");
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
    data[category].pageNumber = data[category].pageNumber + 1;
    fetchData();
  };

  const fetchData = async () => {
    console.log(data);
    if (!data[category] || (data[category] && data[category]?.pageNumber > 1)) {
      try {
        setIsLoading(true);
        // const response = await axios.get(`http://localhost:8000/articles`);
        const response = await axios.get(
          `https://newsdata.io/api/1/news?apikey=${api_key}&language=en&country=${country}&category=${category}${
            page > 1 ? `&page=${data[category]?.nextPageId}` : " "
          }`
        );
        console.log(response);
        const filtered = response.data.results.filter(
          (article) => article.image_url !== null
        );

        console.log(filtered);

        setData((prevData) => ({
          ...prevData,
          [category]: {
            articles:
              page > 1
                ? [...prevData[category]?.articles, ...filtered]
                : filtered,
            pageNumber: page > 1 ? prevData[category]?.pageNumber + 1 : 1,
            nextPageId: response.data.nextPage,
          },
        }));
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
        setPage(1);
      }
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  return (
    <div className="App  p-10 bg-beige dark:bg-dark-brown dark:text-beige">
      {/* dark light mode */}
      <div
        onClick={darkModeHandler}
        className={`w-6 md:w-8 absolute right-5 top-5`}
      >
        {dark ? (
          <img src={lightIcon} alt="icon" className="dark:text-beige" />
        ) : (
          <img src={darkIcon} alt="icon" />
        )}
      </div>

      <div className="text-4xl sm:text-6xl md:text-8xl text-center">
        India Times
      </div>

      {/* <div className="text-4xl">Latest News</div> */}
      <CategoryTabs category={category} setCategory={setCategory} />

      {/*! Articles */}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-10 min-h-[90vh] shadow-2xl rounded-xl dark:bg-slate-700 grid sm:grid-cols-2 lg:grid-cols-12 gap-1">
          {data[category]?.articles.map((article, index) => (
            <ArticleCard
              key={index}
              index={index}
              article={article}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}

      {/* Load more button */}
      <div className="mt-10 w-full bg-burgundy flex justify-center py-2  ">
        {!data[category]?.isCompleted ? (
          <button
            className="hover:text-beige border px-2 rounded-full"
            onClick={handleLoadMore}
          >
            Load More Articles
          </button>
        ) : (
          <p className="p-2">
            You have reached the end of the available {category} articles for
            now. Please check back after a while for new content
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
