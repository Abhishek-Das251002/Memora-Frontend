import useFetch from "../utils/fetchDetails";
import noImageInAlbum from "../assets/addImageIcon3.png"
import { ImageIcon } from "lucide-react";
import { User2 } from "lucide-react";
import { ExternalLink } from "lucide-react"
import { Pencil } from "lucide-react";
import { RiDeleteBin6Line } from "react-icons/ri"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";


const AlbumCard = ({currAlbum, getAlbumDes, setAlbumIdForDes, onSuccess}) => {
    const {data: imageData} = useFetch(`${import.meta.env.VITE_API_URL}/user/albums/${currAlbum._id}/images`)
    const {data: userData} = useFetch(`${import.meta.env.VITE_API_URL}/user/details`)
    const {data: allUsers} = useFetch(`${import.meta.env.VITE_API_URL}/user/googleLogins`)

    const navigate = useNavigate()

    function findAlbumOwnerDetails(){
        const albumOwner = allUsers.find(user => user._id === currAlbum.ownerId)
        return albumOwner
    }

    function setAlbumDes(){
        getAlbumDes(currAlbum?.description);
        setAlbumIdForDes(currAlbum?._id)
    }

    async function handleAlbumDelete(){
        try {
            const deletedAlbum = await axios.delete(`${import.meta.env.VITE_API_URL}/user/albums/${currAlbum?._id}`, {withCredentials: true})

            if(deletedAlbum){
                toast.success("Album deleted successfully.")
                onSuccess()
            }
        } catch (error) {
            console.error(error)
            toast.error("Error occured while deleting album.")
        }
    }

    return (
        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12 mb-4 d-flex justify-content-center">
            {userData._id === currAlbum.ownerId
            ? 
            <div className="card" style={{width: "18rem", height: "100%"}}>
            {imageData.length !== 0 ?
            <img src={imageData[0].imageUrl} alt="albumCoverImg" className="albumCoverImage"/>
            :
            <img src={noImageInAlbum} style={{height: "161px", objectFit: "contain"}} alt="albumCoverImg"/>
            }
            <div className="card-body">
                <h5 className="card-title">{currAlbum.name}</h5>
                <p className="card-text text-secondary">{currAlbum.description}</p>
                <div className="row">
                    <div className="text-secondary d-flex align-items-center col-6">
                        <ImageIcon size={15} className="me-1"/> {imageData.length} {imageData.length > 1 ? "images" : "image"}    
                    </div>
                    <div className="col-6 text-secondary p-0">
                        <span className="d-flex align-items-center"><User2 size={15}/>Created by you</span>
                    </div>
                </div>
            </div>
            <div className="row my-2 mx-1 text-center">
                <div className="col-4 d-flex align-items-center" style={{color: "#3d61ff", cursor: "pointer"}} onClick={() => navigate(`/albumDetails/${currAlbum._id}`)}>
                    <ExternalLink size={15} className="me-1"/>Open
                </div>
                <div className="col-4 d-flex align-items-center" style={{color: "#3d61ff", cursor: "pointer"}} onClick={setAlbumDes} data-bs-toggle="modal" data-bs-target="#updateDesModal">
                    <Pencil size={15} className="me-1"/>Edit
                </div>
                <div className="col-4 d-flex align-items-center" style={{color: "#ff3d3d", cursor: "pointer"}} onClick={handleAlbumDelete}>
                    <RiDeleteBin6Line size={15} className="me-1"/>Delete
                </div>
            </div>
            </div>
            :
            <div className="card" style={{width: "18rem", height: "100%", position: "relative"}}>
            {imageData.length !== 0 ?
            <img src={imageData[0].imageUrl} alt="albumCoverImg" className="albumCoverImage"/>
            :
            <img src={noImageInAlbum} style={{height: "161px", objectFit: "contain"}} alt="albumCoverImg"/>
            }
            <span className="px-2 py-1 makeSharedBadge" style={{background: "#DFF7F5", color: "#0F766E", borderRadius: "5px"}}>
                Shared
            </span>
            <div className="card-body">
                <h5 className="card-title">{currAlbum.name}</h5>
                <p className="card-text text-secondary">{currAlbum.description}</p>
                <div className="d-flex align-items-center">
                    <img src={findAlbumOwnerDetails()?.userPic} className="rounded-circle" style={{height: "30px", width: "30px"}} alt="owner image" />
                    <div className="ms-2" style={{fontSize: "0.85rem"}}>
                        <span>Shared by {findAlbumOwnerDetails()?.name}</span><br />
                        <span className="text-secondary">{new Date(currAlbum.createdAt).toLocaleString('en-US', {year: "numeric", month: "long", day: "numeric"})}</span>
                    </div>
                </div>
                <div className="text-secondary d-flex align-items-center mt-3">
                    <ImageIcon size={15} className="me-1"/> {imageData.length} {imageData.length > 1 ? "images" : "image"}    
                </div>
            </div>
            <div className="row my-2 mx-1 text-center">
                <div className="d-flex justify-content-center align-items-center my-2" style={{color: "#3d61ff", cursor: "pointer"}} onClick={() => navigate(`/albumDetails/${currAlbum._id}`)}>
                    <ExternalLink size={15} className="me-1"/>Open
                </div>
            </div>
            </div>
            }
        </div>
    )
}

export default AlbumCard;