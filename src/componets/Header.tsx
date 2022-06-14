import styled from "styled-components";

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 80px;
  top: 0;
  background-color: white;
  font-size: 12px;
`;

const NavIn = styled.div`
    display: flex;
    align-items: center;
    `;

const Logo = styled.img`
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/799px-Netflix_2015_logo.svg.png?20190206123158";
  margin-right: 50px;
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled.li`
  margin-right: 20px;
`;

function Header() {
  return (
    <>
      <Nav>
        <NavIn>
          <Logo />
          <Items>
            <Item>Home</Item>
            <Item>Tv Shows</Item>
          </Items>
        </NavIn>
        <NavIn>
          <button>Search</button>
        </NavIn>
      </Nav>
    </>
  );
}

export default Header;
