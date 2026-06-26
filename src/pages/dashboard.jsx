import Navbar from "../components/myNavbarComponent";
import { Plus } from "lucide-react";
import useFetch from "../utils/fetchDetails";
import AlbumCard from "../components/albumCard";
import NewAlbumModal from "../components/createNewAlbumModal";
import UpdateDescription from "../components/updateDesModal";
import { useEffect, useState } from "react";

// #3d61ff → slightly royal/premium
const Dashboard = () => {
    const {data: albumData,loading: albumDataLoading, error: albumError, refetch} = useFetch(`${import.meta.env.VITE_API_URL}/user/albums`)
    const [currAlbumDes, setCurrAlbumDes] = useState("")
    const [currAlbumIdToChangeDes, setAlbumIdForDes] = useState(null)
    const [searchedData, setSearchedData] = useState([])

    useEffect(() => {
        setSearchedData(albumData)
    },[albumData])

    return (
        <div>
            <NewAlbumModal onSuccess={refetch}/>
            <UpdateDescription description={currAlbumDes} albumId={currAlbumIdToChangeDes} onSuccess={refetch}/>
            {albumDataLoading
            ?
            <p className="text-secondary text-center mt-5">Loading...</p>
            :
            <div>
                <div className="sticky-header">
                    <Navbar page="dashboard" setSearchedData={setSearchedData} data={albumData}/>
                    <div className="d-flex justify-content-between my-4 container">
                        <h3>Albums</h3>
                        <button className="d-flex align-items-center btn btn" style={{background: "#3d61ff", color: "#fff"}} data-bs-toggle="modal" data-bs-target="#staticBackdrop"><Plus size={20}/> <span className="ms-2">Create Album</span></button>
                    </div>
                </div>
                <div className="container">
                    <div className="row albumCardRow">
                        {searchedData.length !== 0
                        ?
                        searchedData.map(album => (
                            <AlbumCard currAlbum={album} getAlbumDes={setCurrAlbumDes} setAlbumIdForDes={setAlbumIdForDes} onSuccess={refetch}/>
                        ))
                        :
                        <p className="text-center text-secondary fs-5 mt-4">Albums not found, please create Album.</p>
                        }
                    </div>
                </div>  
            </div>
            }
        </div>  
    )
}

export default Dashboard;