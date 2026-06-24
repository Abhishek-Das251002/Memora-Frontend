import { useEffect } from "react"
import axios from "axios"
import { useState } from "react"
import Navbar from "./components/myNavbarComponent"
import mainLogoIcon from "./assets/icon.png"
import { RxAvatar } from "react-icons/rx";
import { FcGoogle } from "react-icons/fc"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import { useNavigate } from "react-router-dom"

function App() {
  const data = []
  const [searchedData, setSearchedData] = useState([])
  const navigate = useNavigate()

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
  }

  useEffect(() => {
    async function fetchData(){
      try {
        const userProfileDetails = await axios.get(`${import.meta.env.VITE_API_URL}/user/details`, {
          withCredentials: true
        })

        if(userProfileDetails){
          // may be here add only name email and img to local storage for convinience
          console.log(userProfileDetails)
          navigate("/dashboard")
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  },[])

  return (  
    <div>
      <Navbar page="login" setSearchedData={setSearchedData} data={data}/>
      <div className="mx-0 loginPageRow">
          <div className="homeBgSetting">
            <div className="homePageIntro">
              <div style={{display: "flex", alignItems: "center"}}>
                <img src={mainLogoIcon} alt="mainIcon" style={{width: "50px"}}/>
                <span className="ms-2" style={{fontSize: "2.5rem", fontWeight: "bolder"}}>Memora</span>
              </div>
              <p style={{fontSize: "1.2rem", color: "#4B5563"}}>Manage and share your memories securely.</p>
            </div>
          </div>
          <div className="loginCardCol" style={{background: "#F3F4F6"}}>
            <div class="card homeLoginCard">
              <div class="card-body d-flex flex-column align-items-center mt-md-5 mt-lg-0">
                <RxAvatar size={80} style={{margin: "1rem"}}/>
                <h2 class="card-title">Welcome!</h2>
                <h6 class="card-subtitle mb-2 text-body-secondary" style={{fontSize: "1.2rem", textAlign:"center"}}>Sign in to continue with Memora</h6>
                <button className="btn btn border border-2 my-3 pe-4" onClick={handleGoogleLogin}><FcGoogle size={30} className="mx-2"/> Sign in with Google</button>
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}

export default App;
