import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
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
  height: 90vh;
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

const SliderTitle = styled.h2`
  padding-left: 40px;
  padding-bottom: 20px;
  font-size: 30px;
  font-weight: bold;
  color: ${(props) => props.theme.white.lighter};
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

//슬라이더

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


const SliderLeft = styled(motion.div)`
  position: absolute;
  width: 50px;
  height: 400px;
  color: red;
  opacity: 0.3; 
  cursor: pointer;
  z-index: 2;
  svg {
    transition: transform 0.15s;
  }
  &:hover {
    background-color: white;
    opacity: 0.8;
    svg {
      transform: scale(1.5);
    }
  }
`;

const SliderRight = styled(motion.div)`
  position: absolute;
  /* bottom: 0; */
  right: 0; 
  display: flex;
  align-items: center;
  width: 50px;
  height: 400px;
  color: red;
  opacity: 0.3; 
  cursor: pointer;
  svg {
    transition: transform 0.15s;
  }
  &:hover {
    background-color: white;
    opacity: 0.8;
    svg {
      transform: scale(1.5);
    }
  }
`;
const RightSvg = styled(motion.svg)`
   margin-left: 50px;
  margin-right: 50px;
  width: 95px;
  height: 25px;
  fill: ${(props) => props.theme.red};
  path {
    stroke-width: 6px;
  }
`;

const Item = styled(motion.div)<{ bgposter: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgposter});
  background-size: cover;
  background-position: center center;
  height: 400px;
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

const RankingNumber = styled(motion.h1)`
  font-size: 68px;
  color: transparent;
  -webkit-text-stroke: 3px white;
`;

const MovieInfo = styled(motion.div)`
  //영화 정보
  width: 100%;
  bottom: 0;
  height: 80px;
  background-color: black;
  opacity: 0;
  position: absolute;
  h4 {
    font-size: 13px;
    text-align: left;
    margin-left: 10px;
    padding-bottom: 3px;
  }
  h3 {
    font-size: 18px;
    text-align: left;
    margin-left: 10px;
    font-weight: bold;
  }

  display: inline;
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
  opacity: 0;
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ClickMoive = styled(motion.div)`
  position: absolute;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 20px;
  overflow: hidden;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
`;

const ClickMoiveImage = styled(motion.div)`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const ClickMoiveTitle = styled(motion.h3)`
  color: ${(props) => props.theme.white.lighter};
  font-weight: bold;
  font-size: 46px;
  position: relative;
  padding: 10px;
  padding-left: 20px;
  top: -80px;
`;

const ClickMoiveOverview = styled(motion.h3)`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  top: -80px;
  font-size: 20px;
  position: relative;
`;

function Home() {
  const history = useHistory(); //여러 route 사이를 이동
  const movieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId"); ///movies/:movieId에 있으면 movieMatch는 존재, 아니면 null
  // 영화  api 정보 가져옴
  const { data, isLoading } = useQuery<IGetMovies>(
    ["movies", "nowPlaying"],
    getMovies
  ); //클릭한 영화의 ID가 존재한다면, 클릭한 영화 ID와 API로부터 가져온 영화 ID가 같은 걸 찾는다.
  const clickedMovie =
    movieMatch?.params.movieId &&
    data?.results.find((movie) => movie.id + "" === movieMatch?.params.movieId);

  const [page, setPage] = useState(0);
  // const onClcikSlid = () => setPage((prev) => prev + 1);
  //빠르게 클릭했을 때 행이 exit하는 도중 다음 row가 사라져 gap이 넓어지는 오류 방지
  const [slideNext, setSlideNext] = useState(false);
  //슬라이드 onClick함수: 클릭스 인덱스가 +1
  const onClcikSlid = () => {
    if (data) {
      if (slideNext) return;
      toggleSlideNext(); //slideNext false로000
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

  const onClcikLeft = () => {
  setPage((prev) => prev -1);
  };


  //오버레이 클릭시 발생
  const onOverlayClick = () => history.goBack();
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>로딩중</Loader>
      ) : (
        <>
          <Banner
            bgposter={posterURL(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <OverView>{data?.results[0].overview}</OverView>
          </Banner>
          <Slider id="weeklyBest">
            <SliderTitle>Weekly Best</SliderTitle>
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
                      bgposter={posterURL(movie.poster_path || "w500")}
                    >
                      <MovieInfo variants={infoVariants}>
                        <h3>
                          {movie?.name && movie?.name}
                          {movie?.title && movie?.title}
                        </h3>
                        <h4>{movie.media_type}</h4>
                        <h4 style={{ color: "red" }}> {movie.vote_average}</h4>
                      </MovieInfo>
                    </Item>
                  ))}
                  <SliderLeft onClick={onClcikLeft}></SliderLeft>
                  <SliderRight onClick={onClcikSlid}>
                    <RightSvg 
                     xmlns="http://www.w3.org/2000/svg"
                     width="1024"
                     height="276.742"
                     viewBox="0 0 1024 276.742"
                   >
                     <motion.path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
                    </RightSvg>
                  </SliderRight>
              </SliderRow>
            </AnimatePresence>
            
          </Slider>

          <AnimatePresence>
            {movieMatch ? ( //movieMatch가 생기면
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <ClickMoive
                    style={{}}
                    layoutId={movieMatch.params.movieId} //링크에 있을 때만 발생
                  >
                    {clickedMovie && (
                      <>
                        <ClickMoiveImage
                          style={{
                            backgroundImage: `linear-gradient(to top ,black, transparent), 
                            url(${posterURL(clickedMovie.backdrop_path)})`,
                          }}
                        />
                        <ClickMoiveTitle>
                          {clickedMovie.original_title}
                          {clickedMovie.name}
                        </ClickMoiveTitle>
                        <ClickMoiveOverview>
                          {clickedMovie.overview}
                          {clickedMovie.overview}
                        </ClickMoiveOverview>
                      </>
                    )}
                  </ClickMoive>
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
