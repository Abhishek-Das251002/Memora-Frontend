import { useParams } from "react-router-dom";
import Navbar from "../components/myNavbarComponent";
import useFetch from "../utils/fetchDetails";
import { useEffect, useRef } from "react";
import { ImageIcon } from "lucide-react";
import { User2 } from "lucide-react";
import { Calendar } from "lucide-react";
import { CloudUpload, Share2, SlidersHorizontal } from "lucide-react";
import ImageUpload from "../components/imageUploadModal";
import addImageIcon3 from "../assets/addImageIcon3.png"
import ImageCard from "../components/imageCard";
import ShareAlbum from "../components/shareAlbumModal";
import { useState } from "react";
import ImagePreview from "../components/imagePreviewModal";


const AlbumDetails = () => {
    const {albumId} = useParams()

    const {data: imageData, refetch} = useFetch(`${import.meta.env.VITE_API_URL}/user/albums/${albumId}/images`)
    const {data: albumData} = useFetch(`${import.meta.env.VITE_API_URL}/user/albums`)
    const {data: userData} = useFetch(`${import.meta.env.VITE_API_URL}/user/details`)

    const currAlbum = albumData?.find(album => album._id === albumId)
    const [imgFilterValue, setImgFilterValue] = useState("all")
    const [filteredImageData, setFilteredImageData] =  useState(imageData)
    const [sortValue, setSortValue] = useState("")
    const [sortedImageData, setSortedImageData] = useState(filteredImageData)
    const [activeIndex, setActiveIndex] = useState(0)
    const shouldFocusRef = useRef(false);
    const [searchedData, setSearchedData] = useState([])

    useEffect(() => {
        setSearchedData(imageData)
    },[imageData])

    useEffect(() => {
            let dataToFilter = [...searchedData];

            imgFilterValue !== "all" 
            ?
            dataToFilter = dataToFilter.filter(img => img.isFavorite.includes(userData.email))
            :
            dataToFilter

            setFilteredImageData(dataToFilter)
    },[imageData, imgFilterValue, searchedData])
    

    useEffect(() => {
        let dataToSort = [...filteredImageData];

        sortValue === "Recent"
        ?
        dataToSort.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
        :
        sortValue === "Oldest"
        ?
        dataToSort.sort((a, b) => new Date(a.uploadedAt) - new Date(b.createdAt))
        :
        dataToSort

        setSortedImageData(dataToSort)
    },[filteredImageData, sortValue, searchedData])

    return (
        <div>
            <ShareAlbum albumToShare={currAlbum}/>
            <ImageUpload id={albumId} onSuccess={refetch}/>
            <ImagePreview id={albumId} imageData={imageData} index={activeIndex} focus={shouldFocusRef} onSuccess={refetch}/>
            {albumData.length !== 0 && userData.length !==0 && imageData.length !==0
            ?
            <div>
                <div className="albumDetailNav">
                    <Navbar page="albumDetails" setSearchedData={setSearchedData} data={imageData}/>
                </div>
                <div className="container">
                    <div className="card my-4">
                    <div className="detailsMainCard">
                        <div className="col-xl-2 col-lg-3 col-sm-12">
                        {imageData.length !== 0 ? 
                        <img src={imageData[0].imageUrl} className="rounded-start albumDetailCoverImg" alt="albumCoverImg"/>
                        :
                        <img src={addImageIcon3} className="rounded-start albumDetailCoverImg border border-2" alt="albumCoverImg"/>
                        }
                        </div>
                        <div className="col-xl-10 col-lg-9 col-sm-12 mainCardInternal">
                        {currAlbum && 
                        <div className="card-body col-xl-4 col-12 pe-xl-0">
                            <h5 className="card-title">{currAlbum.name}</h5>
                            <p className="card-text text-secondary mb-0">{currAlbum.description}</p>
                            <div className="row text-secondary">
                                <span className="d-flex align-items-center justify-content-md-center justify-content-lg-start col-6 col-md-4 col-lg-3 col-xl-5 pt-2 pe-lg-0"><ImageIcon size={15} className="me-1"/>{imageData.length > 1 ? `${imageData.length} images`: `${imageData.length} image`}</span>
                                <span className="d-flex align-items-center justify-content-md-center justify-content-lg-start col-6 col-md-4 col-lg-3 col-xl-5 pt-2 px-lg-0 px-xl-0"><User2 size={15} className="me-1"/>{currAlbum.ownerId === userData._id ? "created by you": "created by others"}</span>
                                <span className="d-flex align-items-center justify-content-md-center justify-content-lg-start col-6 col-md-4 col-lg-3 col-xl-5 pt-2" px-lg-0><Calendar size={15} className="me-1"/>{new Date(currAlbum.createdAt).toLocaleString('en-US', {year: "numeric", month: "long", day: "numeric"})}</span>
                            </div>
                        </div>
                        }
                        <div className="row col-xl-7 d-flex justify-content-center align-items-xl-center justify-content-xl-start my-3 mx-3 ms-lg-0 mt-lg-0 my-xl-2">
                            <div className="col-sm-10 col-md-4 col-xl-4 d-flex justify-content-center mt-2 mt-md-0 mt-lg-2">
                                <button  style={{background: "#3d61ff", color: "#fff"}} className="btn btn d-flex justify-content-center w-100" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                    <span className="d-flex align-items-center"><CloudUpload size={20} className="me-1"/>Upload Image</span>
                                </button>
                            </div>
                            <div className="col-sm-10 col-md-4 col-xl-4 d-flex justify-content-center mt-2 mt-md-0 mt-lg-2"> 
                                <button className="btn btn border border-2 d-flex justify-content-center w-100" data-bs-toggle="modal" data-bs-target="#staticBackdropShare">
                                    <span className="d-flex align-items-center"><Share2 size={20} className="me-1"/>Share Album</span>
                                </button>
                            </div>
                            <div className="col-sm-10 col-md-4 col-xl-4 d-flex justify-content-center mt-2 mt-md-0 mt-lg-2">
                                <select className="mainCardSelect form-select border border-2 d-flex justify-content-center align-items-center w-100" value={sortValue} onChange={(e) => setSortValue(e.target.value)}>
                                    <option value="">Sort Images</option>
                                    <option value="Recent">Recent</option>
                                    <option value="Oldest">Oldest</option>
                                </select>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className="d-flex me-md-3" style={{borderBottom: "solid #EEEEEE 3px", fontWeight: "semibold"}}>
                        {imgFilterValue === "all" 
                        ? 
                        <>
                        <span className="col-xl-1 col-lg-2 col-md-2 col-sm-6 col-6 pb-1 d-flex justify-content-center" style={{color: "#3d61ff", borderBottom: "3px solid #3d61ff"}}><strong>All Images</strong></span>
                        <span className="col-xl-1 col-lg-2 col-md-2 col-sm-6 col-6  pb-1 d-flex justify-content-center text-secondary" style={{cursor: "pointer"}} onClick={() => {setImgFilterValue("favorite")}}><strong>Favorites</strong></span>
                        </>
                        :
                        <>
                        <span className="col-xl-1 col-lg-2 col-md-2 col-sm-6 col-6  pb-1 d-flex justify-content-center text-secondary" style={{cursor: "pointer"}} onClick={() => {setImgFilterValue("all")}}><strong>All Images</strong></span>
                        <span className="col-xl-1 col-lg-2 col-md-2 col-sm-6 col-6  pb-1 d-flex justify-content-center" style={{color: "#3d61ff", borderBottom: "3px solid #3d61ff"}}><strong>Favorites</strong></span>
                        </>
                        }
                    </div>
                </div>
                <div className="container">
                    <div className="row ImageCardRow mt-3">
                        {sortedImageData.length !== 0
                        ?
                        sortedImageData?.map((img, index) => (
                            <ImageCard currImage={img} albumId={albumId} currIndex={index} setActiveIndex={setActiveIndex} onSuccess={refetch} focus={shouldFocusRef}/>
                        ))
                        :
                        <p className="text-center text-secondary mt-4">Images not found. Please upload images to the album.</p>
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

export default AlbumDetails;