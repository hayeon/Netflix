import styled from "styled-components";
import Header from "../componets/Header";

const Back = styled.div`
    background-color: #000000;
    height: 200vh;
    `;

function Home() {
  return (
   <Back>
    <Header></Header>

   </Back>
  );
};

export default Home;
