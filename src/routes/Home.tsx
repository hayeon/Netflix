import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMovies } from "./api";
import { posterURL } from "./poster";

const Wrapper = styled.div`
  background-color: black;
  height: 2000px;
`;
const Loader = styled.div`
  height: 20vh;
  width: 20vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPoster: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center; //상 *중* 하
  margin-left: 60px;
  background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 1),
      rgba(0, 0, 0, 0)
    ),
    url(${(props) => props.bgPoster});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  color: ${(props) => props.theme.white.lighter};
  margin-bottom: 20px;
`;

const OverView = styled.p`
  color: ${(props) => props.theme.white.lighter};
  font-size: 34px;
  width: 50%; //없으면 끝까지 줄줄줄
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const SliderRow = styled(motion.div)`
  background-color: white;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  position: center;
  width: 100%;
  align-items: center;
`;

const Item = styled(motion.div)<{bgPoster:string}>`
  background-color: white;
  background-image: url(${(props)=> props.bgPoster});
  background-size: cover;
  background-position: center center;
  height: 200px;
  color: red;
  font-size: 40px;
`;

const rowVariants = {
  hidden: { x: window.outerWidth + 5 },
  visible: { x: 0 },
  exit: { x: -window.outerWidth - 5 },
};

function Home() {
  const { data, isLoading } = useQuery<IGetMovies>(
    ["movies", "nowPlaying"],
    getMovies
  );

  const [index, setIndex] = useState(0);
  // const plusIdx = () => setIndex((prev) => prev + 1);
  //빠르게 클릭했을 때 행이 exit하는 도중 다음 row가 사라져 gap이 넓어지는 오류 방지
  const [slideNext, setSlideNext] = useState(false);
  const plusIdx = () => {
    //슬라이더 인덱스 추가 함수
    //SlideNext이면 그대로 return
    if (data) {
      if (slideNext) {
        return;
      }
      toggleSlideNext();
      const totalMovies = data.results.length - 1; //-1은 배너에서 사용됨

      const movieSix = 6;
      const maxIndx = Math.ceil(totalMovies / movieSix); // 총 영화 수 / 슬라이더 갯수 올림 page는 0에서 시작하므로,

      setSlideNext(true); //증가하고자 하는 인덱스가 max 이면 0으로 되돌림 
      setIndex((prev) => (prev === maxIndx ? 0 : prev + 1));
    }
  };
  const toggleSlideNext = () => setSlideNext((prev) => !prev);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>로딩중</Loader>
      ) : (
        <>
          <Banner
            onClick={plusIdx}
           bgPoster={posterURL(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <OverView>{data?.results[0].overview}</OverView>
          </Banner>
          <Slider>
            {/* exit될 때 실행되는 onExitComplete, SliderNext==false  */}

            <AnimatePresence initial={false} onExitComplete={toggleSlideNext}>
              <SliderRow
                key={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 0.5 }}
              >
                {data?.results
                  .slice(1) /* 배너 영화는 제외 */
                  .slice(6 * index, 6 * index + 6)
                  .map((movie) => (
                    <Item key={movie.id} bgPoster={posterURL(movie.backdrop_path || "w500")}></Item>
                  ))}
              </SliderRow>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
