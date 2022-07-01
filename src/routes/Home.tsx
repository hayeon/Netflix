import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
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

const Banner = styled.div<{ bgposter: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center; //상 *중* 하
  padding: 60px;
  background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 1),
      rgba(0, 0, 0, 0)
    ),
    url(${(props) => props.bgposter});
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
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  align-items: center;
`;

const Item = styled(motion.div)<{ bgposter: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgposter});
  background-size: cover;
  background-position: center center;
  height: 200px;
  cursor: pointer;
  color: ${(props) => props.theme.white.lighter};
  font-size: 40px;
  //양 쪽 끝 포스터 잘림 방지
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const MovieInfo = styled(motion.div)`
  padding: 20px;
  width: 100%;
  bottom: 0;
  height: 60px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  h4 {
    font-size: 20px;
    text-align: center;
  }
`;

const rowVariants = {
  //슬라이드 애니메이션
  hidden: { x: window.outerWidth + 5 },
  visible: { x: 0 },
  exit: { x: -window.outerWidth - 5 },
};

const itemsVariants = {
  hover: {
    scale: 1.4,
    y: -50,
    transition: { type: "transition", duration: 0.3, delay: 0.3 },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: { type: "transition", duration: 0.3, delay: 0.3 },
  },
};

const Overlay = styled(motion.div)`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
`

function Home() {
  const history = useHistory(); //여러 route 사이를 이동
  const movieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId"); ///movies/:movieId에 있으면 movieMatch는 존재, 아니면 null
  console.log(movieMatch);
  // 영화  api 정보 가져옴
  const { data, isLoading } = useQuery<IGetMovies>(
    ["movies", "nowPlaying"],
    getMovies
  );

  const [page, setPage] = useState(0);
  // const onClcikSlid = () => setPage((prev) => prev + 1);
  //빠르게 클릭했을 때 행이 exit하는 도중 다음 row가 사라져 gap이 넓어지는 오류 방지
  const [slideNext, setSlideNext] = useState(false);

  //슬라이드 onClick함수: 클릭스 인덱스가 +1
  const onClcikSlid = () => {
    if (data) {
      if (slideNext) return;
      toggleSlideNext(); //slideNext false로
      const totalMovies = data.results.length - 1; //-1은 배너에서 사용됨
      const maxIndx = Math.floor(totalMovies / 6); // [총 영화 수/슬라이더 갯수] 내림차순 page는 0에서 시작하므로,
      setSlideNext(true);
      setPage((prev) => (prev === maxIndx ? 0 : prev + 1)); //증가하고자 하는 인덱스가 max면, 0으로 되돌림 , 아니라면 인덱스에 +1
    }
  };
  const toggleSlideNext = () => setSlideNext((prev) => !prev);
  const onItemClick = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };


  
  const onOverlayClick = () => history.goBack()
  
  
  
  
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>로딩중</Loader>
      ) : (
        <>
          <Banner
            onClick={onClcikSlid}
            bgposter={posterURL(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <OverView>{data?.results[0].overview}</OverView>
          </Banner>
          <Slider>
            {/* exit될 때 실행되는 onExitComplete, SliderNext==false  */}
            <AnimatePresence initial={false} onExitComplete={toggleSlideNext}>
              <SliderRow
                variants={rowVariants}
                key={page} //키가 변경될 떄 마다 새로운 row가 만들어짐
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 0.5 }}
              >
                {data?.results
                  .slice(1) /* 배너 영화는 제외 */
                  .slice(6 * page, 6 * page + 6) //0~5, 6~12씩 잘라줌
                  .map((movie) => (
                    <Item
                      layoutId={movie.id + ""}
                      // onItemClick에 movie.id 전달
                      onClick={() => onItemClick(movie.id)}
                      variants={itemsVariants}
                      key={movie.id}
                      whileHover="hover"
                      bgposter={posterURL(movie.backdrop_path || "w500")}
                    >
                      <MovieInfo variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </MovieInfo>
                    </Item>
                  ))}
              </SliderRow>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {movieMatch ? (
              <>
              <Overlay>
              
                <motion.div
                  layoutId={movieMatch.params.movieId}
                  style={{
                    position: "absolute",
                    width: "50vw",
                    height: "50vh",
                    backgroundColor: "red",
                    top: 50,
                    left: 0,
                    right: 0,
                    margin: "0, auto",
                  }}
                />
                 </Overlay>
              </>
             
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
