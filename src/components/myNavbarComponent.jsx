import mainLogoIcon from "../assets/icon.png"
import { IoFolderOpenOutline } from "react-icons/io5";
import { IoHeartOutline } from "react-icons/io5";
import { LogOut } from "lucide-react";
import { UserCircle, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import useFetch from "../utils/fetchDetails";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = ({page, setSearchedData, data}) => {
    const {data: userData} = useFetch(`${import.meta.env.VITE_API_URL}/user/details`)
    const [searchValue, setSearchValue] = useState("")
    const navigate = useNavigate()
    const isMobile = window.matchMedia("(max-width: 765px)");
    const isDesktop = window.matchMedia("(min-width: 1020px)")

    async function handleLogout(){
        try {
            const logout = await axios.get(`${import.meta.env.VITE_API_URL}/auth/logout`, {withCredentials: true})

            if(logout){
                navigate("/")
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        let searchData = [...data]

        if(page === "dashboard" || page === "sharedAlbums"){
            searchData = data?.filter(album => album.name.toLowerCase().includes(searchValue.toLowerCase()))
        }else{
            searchData = data?.filter(image => (image.name.toLowerCase().includes(searchValue.toLowerCase()) || image.person.map(person => person.toLowerCase()).includes(searchValue.toLowerCase()) || image.tags.map(tag => tag.toLowerCase()).includes(searchValue.toLowerCase())))
        }
        setSearchedData(searchData)
    },[searchValue, userData, data])

    const [isMobileScreen, setScreen] = useState(isMobile.matches)
    const [isLargeScreen, setLargeScreen] = useState(isDesktop.matches)

    isMobile.addEventListener("change", (e) => {
    if (e.matches) {
        setScreen(true)
    } else {
        setScreen(false)
    }
    });
    
    
    isDesktop.addEventListener("change", (e) => {
    if (e.matches) {
        setLargeScreen(true)
    } else {
        setLargeScreen(false)
    }
    });


    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary px-3">
            <div className="container navbarItems p-0">
                <div className="col-2 d-flex justify-content-start">
                    <NavLink className="navbar-brand" to={"/dashboard"} style={{fontSize: "2rem"}}>
                    <img src={mainLogoIcon} alt="main-logo" style={{width: "35px"}}/>
                    Memora
                    </NavLink>
                </div>
                {page !== "login" && !isMobileScreen &&
                <div className="col-xl-4 col-lg-4 col-md-6 ms-2">
                    <input type="text" className="form-control" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder={page === "dashboard" || page === "sharedAlbums" ? "Search albums by name..." : "Search images by name, person, and tags..."} style={{width: "100%"}}/>
                </div>
                }
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse col-4" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                    <NavLink className="nav-link d-flex align-items-center" to={"/dashboard"}><IoFolderOpenOutline size={20}/><span className="ms-1">Albums</span></NavLink>
                    </li>
                    <li className="nav-item">
                    <NavLink className="nav-link d-flex align-items-center" to={"/favorites"}><IoHeartOutline size={20}/><span className="ms-1">Favorites</span></NavLink>
                    </li>
                    <li className="nav-item">
                    <NavLink className="nav-link d-flex align-items-center" to={"/albums/shared"}><Users size={20}/><span className="ms-1">Shared with me</span></NavLink>
                    </li>
                    {page !== "login" && isLargeScreen
                    ?
                    <li className="nav-item ms-3">
                        <div className="dropstart">
                        <img src={userData?.userPic} style={{height: "35px", width: "35px", cursor: "pointer"}} alt="user image" className="dropdown-toggle rounded-circle" data-bs-toggle="dropdown" aria-expanded="false"/>
                        <ul className="dropdown-menu">
                            <li className="dropdown-item">{userData?.name}</li>
                            <li className="dropdown-item">{userData?.email}</li>
                            <li className="dropdown-item" style={{cursor: "pointer"}} onClick={handleLogout}><LogOut size={15} className="me-2"/>Logout</li>
                        </ul>
                        </div>
                    </li>
                    :
                    page !== "login" && isMobileScreen
                    ?
                    <li class="nav-item dropdown">
                    <span class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <UserCircle size={25}/> User Info
                    </span>
                    <ul class="dropdown-menu">
                        <li className="dropdown-item">{userData?.name}</li>
                        <li className="dropdown-item">{userData?.email}</li>
                        <li className="dropdown-item" style={{cursor: "pointer"}} onClick={handleLogout}><LogOut size={15} className="me-2"/>Logout</li>
                    </ul>
                    </li>
                    :
                    <li className="nav-item">
                        <UserCircle size={35} className="text-secondary"/>
                    </li>
                    }
                </ul>
                </div>
                {isMobileScreen && page !== "login" &&
                <div className="col-12 mt-2">
                    <input type="text" className="form-control" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder={page === "dashboard" || page === "sharedAlbums" ? "Search albums by name..." : "Search images by name, person, and tags..."} style={{width: "100%"}}/>
                </div>
                }
            </div>
            </nav>
        </div>
    )
}

export default Navbar;