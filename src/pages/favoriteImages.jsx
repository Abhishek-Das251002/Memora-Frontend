import Navbar from "../components/myNavbarComponent"
import { Filter } from "lucide-react"
import { Image } from "lucide-react"
import useFetch from "../utils/fetchDetails"
import ImageCard from "../components/imageCard"
import { useEffect, useState, useRef } from "react"
import ImagePreview from "../components/imagePreviewModal"

const Favorites = () => {
    const {data: allUserImages, refetch} = useFetch(`${import.meta.env.VITE_API_URL}/user/albums/images`)
    const {data: userData} = useFetch(`${import.meta.env.VITE_API_URL}/user/details`)
    const {data: allUserAlbums} = useFetch(`${import.meta.env.VITE_API_URL}/user/albums`)

    const favImages = allUserImages?.filter(img => img.isFavorite.includes(userData.email))
    const [albumFilterValue, setAlbumFilterValue] = useState("")
    const [imageFilteredData, setImageFilteredData] = useState([])
    const [activeIndex, setActiveIndex] = useState(0)
    const shouldFocusRef = useRef(false);
    const [currAlbumId, setCurrAlbumId] = useState("")
    const [searchedData, setSearchedData] = useState([])

    useEffect(() => {
        setSearchedData(allUserImages)
    },[allUserImages])

    useEffect(() => {
        let filteredData = [...searchedData]

        if(albumFilterValue){
            filteredData = filteredData.filter(img => img.albumId === albumFilterValue)
        }

        setImageFilteredData(filteredData)
    },[albumFilterValue, allUserImages, userData, searchedData])

    console.log("albumId on fav Page", currAlbumId)
    return (
        <div>
            <ImagePreview id={currAlbumId} imageData={favImages} index={activeIndex} focus={shouldFocusRef} onSuccess={refetch}/>
            <div>
                <div className="sticky-header">
                    <Navbar page="favoriteImages" setSearchedData={setSearchedData} data={favImages}/>
                    <div className="container">
                        <div style={{marginTop: "1.5rem"}}>
                            <h3>Favorites</h3>
                            <p className="text-secondary">All your favorite photos from all albums.</p>
                        </div>
                        <div className="d-flex justify-content-end">
                            <div class="select-container">
                                <span class="select-icon"><Filter/></span>
                                <select style={{fontSize: "0.85rem"}} value={albumFilterValue} onChange={(e) => setAlbumFilterValue(e.target.value)}>
                                    <option value="">All Albums</option>
                                    {allUserAlbums?.map(album => (
                                        <option value={album._id}>{album.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <p className="text-secondary d-flex align-items-center"><Image size={15} className="me-1"/>{favImages.length} {favImages.length > 1 ? "Images" : "Image"}</p>
                    </div>
                </div>
                <div className="container">
                    <div className="row ImageCardRow mt-3">
                        {imageFilteredData.length !== 0
                        ?
                        imageFilteredData?.map((img, index) => (
                        <ImageCard currImage={img} currIndex={index} setActiveIndex={setActiveIndex} onSuccess={refetch} focus={shouldFocusRef} setCurrAlbumId={setCurrAlbumId}/>
                        ))
                        :
                        <p className="text-center text-secondary mt-4">Images not found</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Favorites