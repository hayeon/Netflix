import { Item } from "framer-motion/types/components/Reorder/Item";
import styled from "styled-components";

const Nav = styled.nav `
    
`;

const NavIn = styled.div`
    
`;

const Logo = styled.svg`
    
`;

const Items = styled.ul`
`;

function Header() {

    return (
        <>
        <Nav>
            <NavIn>
                <Logo/>
                <Items>Home</Items>
                <Items>Tv Shows</Items>
            </NavIn>
            <NavIn>
                <button>Search</button>
            </NavIn>
            
        </Nav>
        </>
    );

};

export default Header;