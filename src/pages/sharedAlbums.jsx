import Navbar from "../components/myNavbarComponent";
import { ArrowUpDown } from "lucide-react";
import { Image } from "lucide-react";
import useFetch from "../utils/fetchDetails";
import AlbumCard from "../components/albumCard";
import { useEffect, useState } from "react";


const SharedAlbums = () => {
    const {data: albumData} = useFetch(`${import.meta.env.VITE_API_URL}/user/albums`)
    const {data: userData} = useFetch(`${import.meta.env.VITE_API_URL}/user/details`)

    const sharedAlbumData = albumData?.filter(album => album.ownerId !== userData?._id && album.sharedUsers.includes(userData?.email)) || []
    const [sharedAlbumFilterValue, setAlbumFilterValue] = useState("")
    const [sortedAlbums, setSortedAlbums] = useState([])
    const [searchedData, setSearchedData] = useState([])

    useEffect(() => {
        let filteredAlbums = [...searchedData]
        
        if(sharedAlbumFilterValue === "recent"){
            filteredAlbums = filteredAlbums.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
        }
        if(sharedAlbumFilterValue === "acending"){
            filteredAlbums = filteredAlbums.sort((a, b) => a.name.localeCompare(b.name))
        }
        if(sharedAlbumFilterValue === "decending"){
            filteredAlbums = filteredAlbums.sort((a, b) => b.name.localeCompare(a.name))
        }

        setSortedAlbums(filteredAlbums)
    },[sharedAlbumFilterValue, searchedData])

    return (
        <div>
            {albumData.length !== 0
            ?
            <div>
                <div className="sticky-header">
                    <Navbar page="sharedAlbums" setSearchedData={setSearchedData} data={sharedAlbumData}/>
                    <div className="container">
                        <div style={{marginTop: "1.5rem"}}>
                            <h3>Shared With Me</h3>
                            <p className="text-secondary">Albums shared by others with you.</p>
                        </div>
                        <div className="d-flex justify-content-end">
                            <div class="select-container">
                                <span class="select-icon"><ArrowUpDown size={20}/></span>
                                <select style={{fontSize: "0.85rem"}} value={sharedAlbumFilterValue} onChange={(e) => setAlbumFilterValue(e.target.value)}>
                                    <option value="">Sort Albums</option>
                                    <option value="recent">Recently Updated</option>
                                    <option value="acending">Album Name (A - Z)</option>
                                    <option value="decending">Album Name (Z - A)</option>
                                </select>
                            </div>
                        </div>
                        <p className="text-secondary d-flex align-items-center"><Image size={15} className="me-1"/>{sharedAlbumData.length} {sharedAlbumData.length > 1 ? "Albums" : "Album"}</p>
                    </div>
                </div>
                <div className="container">
                    <div className="row albumCardRow">
                        {sortedAlbums.length !== 0
                        ?
                        sortedAlbums?.map(album => (
                            <AlbumCard currAlbum={album}/>
                        ))
                        :
                        <p className="text-center text-secondary fs-5 mt-4">Albums not found.</p>
                        }
                    </div>
                </div>
            </div>
            :
            <p className="text-center mt-5 fs-5 text-secondary">Loading...</p>
            }
        </div>
    )
}

export default SharedAlbums;