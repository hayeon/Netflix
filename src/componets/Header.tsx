import styled from "styled-components";
import { motion, useAnimation, useViewportScroll } from "framer-motion";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Nav = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 80px;
  top: 0;
  font-size: 14px;
`;

const HoverCircle = styled(motion.span)`
  position: absolute;
  border-radius: 5px;
  height: 10px;
  width: 10px;
  background-color: ${(props) => props.theme.red};
  bottom: -15px;
  //정중앙에 위치하게 하는 left right margin
  left: 0;
  right: 0;
  margin: 0 auto;
`;

const Search = styled.form`
  color: white;
  svg {
    margin-top: 10px;
    height: 23px;
  }
  margin-right: 105px;
`;

const SearchBar = styled(motion.input)`
  transform-origin: right center;
  margin-right: 50px;
  height: 40px;
  width: 270px;
  position: absolute;
  right: 0px;
  padding: 5px 30px;
  z-index: -1;
  font-size: 16px;
  color: white;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.white.lighter};
`;

const NavIn = styled.div`
  display: flex;
  align-items: center;
`;

const navScrollVar = {
  top: { backgroundColor: "rgba(0,0,0,0)" },
  scroll: { backgroundColor: "rgba(0,0,0,1)" },
};

const Logo = styled(motion.svg)`
  margin-left: 50px;
  margin-right: 50px;
  width: 95px;
  height: 25px;
  fill: ${(props) => props.theme.red};
  path {
    stroke-width: 6px;
  }
`;

const logoVariants = {
  normal: {
    fillOpacity: 1,
  },
  active: {
    fillOpacity: [0, 1, 0, 1],
    transition: {
      repeat: Infinity,
    },
  },
};
// 아이템 리스트
const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled.li`
  margin-right: 20px;
  color: ${(props) => props.theme.white.darker};
  transition: color 0.3s ease-in-out;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  &:hover {
    color: ${(props) => props.theme.white.lighter};
  }
`;

interface IForm {
  keyword: string;
}

function Header() {
  const [serachOpen, setSearchOpen] = useState(false);
  //useRouteMatch를 통해 현재 위치가 어디인지
  //만약에 "/"에 있다면 , HoverMatch가 위치해야함
  const homeMatch = useRouteMatch("/");
  const tvMatch = useRouteMatch("/tv");
  const serachBarAnimation = useAnimation();
  const navAnimation = useAnimation();
  const { scrollY } = useViewportScroll();
  //검색바 열었을 때 애니메이션
  const toggleSearch = () => {
    if (serachOpen) {
      //서치바가 열려 있으면 닫힘 애니메이션
      serachBarAnimation.start({ scaleX: 0 });
    } else {
      //서치바가 닫혀있다면열림 애니메이션
      serachBarAnimation.start({ scaleX: 1 });
    }
    setSearchOpen((prev) => !prev);
  };
  useEffect(() => {
    //헤더 흐려지는 애니메이션
    scrollY.onChange(() => {
      if (scrollY.get() > 10) {
        navAnimation.start("scroll");
      } else {
        navAnimation.start("top");
      }
    });
  }, [scrollY, navAnimation]);

  const history = useHistory();
  const { register, handleSubmit } = useForm<IForm>();
  //검색 함수
  const onVaild = (data: IForm) => {
    history.push(`/search?keyword=${data.keyword}`); //검색한 사이트로 이동
  };
  return (
    <>
      <Nav variants={navScrollVar} animate={navAnimation} initial={"top"}>
        <NavIn>
          <Logo
            variants={logoVariants}
            whileHover="active"
            initial="nomarl"
            xmlns="http://www.w3.org/2000/svg"
            width="1024"
            height="276.742"
            viewBox="0 0 1024 276.742"
          >
            <motion.path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
          </Logo>
          <Items>
            <Item>
              <Link to="/">
                {/* 만약 homeMatch의 isExact이 not nul(true)라면 Circle 표시 */}
                Home {homeMatch?.isExact && <HoverCircle />}
              </Link>
            </Item>
            <Item>
              <Link to="/tv">Tv Shows{tvMatch && <HoverCircle />} </Link>
            </Item>
          </Items>
        </NavIn>
        <NavIn>
          {/* 첫번째 인자: 데이터가 유효하면 실행할 함수 */}
          <Search onSubmit={handleSubmit(onVaild)}>
            <motion.svg
              onClick={toggleSearch}
              animate={{ x: serachOpen ? -185 : 0 }}
              transition={{ type: "linear" }}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </motion.svg>
            <SearchBar
          // form으로 감싸줘야함
            {...register("keyword", { required: true, minLength: 1 })}
            animate={serachBarAnimation}
            initial={{ scaleX: 0 }}
            transition={{ type: "linear" }}
            placeholder=" TV, 시리즈를 검색하세요."
          />
          </Search>
         
        </NavIn>
      </Nav>
    </>
  );
}

export default Header;
