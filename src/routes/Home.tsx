import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMovies } from "./api";

const Wrapper = styled.div`
  background-color: black;
  width: 900px;
  height: 900px;
`;
const Loader = styled.div`
  height: 20vh;
  width: 20vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Home() {
  const { data, isLoading } = useQuery<IGetMovies>(
    ["movies", "nowPlaying"],
    getMovies
  );
  console.log(data, isLoading);

  return <Wrapper>{isLoading ? <Loader>로딩중</Loader> : null}</Wrapper>;
}

export default Home;
