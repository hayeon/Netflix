import { useLocation } from "react-router-dom";

function Search() {
    const location = useLocation(); //지금 있는 곳에 관한 정보
    const keyword = new URLSearchParams(location.search).get("keyword");
    console.log("현재 내 위치는",location);
    console.log("현재 내 키워드는",keyword);
    return (
        <h1>안녕 나는 검색~</h1>
    );

};

export default Search;