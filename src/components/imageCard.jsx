import { MoreVertical } from "lucide-react";
import useFetch from "../utils/fetchDetails";
import { useRef, useState } from "react";
import { HeartIcon } from "lucide-react";
import { BiComment } from "react-icons/bi";
import { EyeIcon } from "lucide-react";
import { Trash } from "lucide-react";
import { BsHeartFill } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-toastify";
import { Link2Icon } from "lucide-react";
import { Download } from "lucide-react";
import { Bounce } from "react-toastify";

const ImageCard = ({currImage, albumId, currIndex, setActiveIndex, onSuccess, focus, setCurrAlbumId}) => {
    const {data: allUsers} = useFetch(`${import.meta.env.VITE_API_URL}/user/googleLogins`)
    const userUploadedImageDetails = allUsers?.find(user => user.email === currImage.uploadedBy)
    const {data: currUser} = useFetch(`${import.meta.env.VITE_API_URL}/user/details`)

    const isFav = currImage?.isFavorite.includes(currUser.email)
    const [currFavStatus, setCurrFavStatus] = useState(false)

    async function toggleFavorite(){
        try {
            const toggleFavState = await axios.post(`${import.meta.env.VITE_API_URL}/user/albums/${albumId || currImage?.albumId}/images/${currImage._id}/favorite`, null,
                {withCredentials: true}
            )

            if(toggleFavState){
                toast.success("Favorite status Changed.")
                onSuccess()
            }
        } catch (error) {
            console.error(error)
            toast.error("error occured while changing favorite status.")
        }
    }


    async function AddComment(){
        try {
            const addNewComment = await axios.post(`${import.meta.env.VITE_API_URL}/user/albums/${albumId || currImage?.albumId}/images/${currImage._id}/comments`, {comment: newComment}, {withCredentials: true})

            if(addNewComment){
                toast.success("Comment added successfully.")
                onSuccess()
            }
        } catch (error) {
            console.error(error)
            toast.error("error occured while adding comment.")
        }
    }


    async function handleImageDelete(){
        try {
            const deleteImage = await axios.delete(`${import.meta.env.VITE_API_URL}/user/albums/${albumId || currImage?.albumId}/images/${currImage?._id}`, {withCredentials: true})

            if(deleteImage){
                toast.success("Image deleted successfully.")
                onSuccess()

            }
        } catch (error) {
            if(error.response.status === 403){
                toast.warn("Only Album Owners are allowed to delete images.")
            }else{
                console.error(error)
                toast.error("error occured while adding deleting images")
            }
        }
    }

    async function downloadImage() {
        const response = await fetch(currImage?.imageUrl);
        const blob = await response.blob();

        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = currImage?.name || "image";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(blobUrl);
    }

    return (
        <>
        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12 mb-4 d-flex justify-content-center">
            <div className="card" style={{width: "18rem", height: "100%", position: "relative"}}>
            <img src={currImage?.imageUrl} className="card-img-top albumCoverImage" alt="imageCardPic" data-bs-toggle="modal" data-bs-target="#exampleModalImgPreview" style={{cursor: "pointer"}} onClick={() => {setActiveIndex(currIndex); setCurrAlbumId(albumId || currImage?.albumId)}}/>
            {isFav
            &&
            <BsHeartFill className="makeFavIcon" size={20} style={{color: "#FF4D4F"}}/>
            }
            <div className="card-body">
                <div className="d-flex justify-content-between">
                    <h5 className="card-title">{currImage?.name}</h5>
                    <div class="btn-group dropend">
                    <MoreVertical size={15} className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style={{cursor: "pointer"}}/>
                    <ul class="dropdown-menu" style={{minWidth: "200px"}}>
                        <li className="dropdown-item" style={{cursor: "pointer"}} data-bs-toggle="modal" data-bs-target="#exampleModalImgPreview"  onClick={() => {setActiveIndex(currIndex); setCurrAlbumId(albumId || currImage?.albumId)}}><EyeIcon size={20} className="me-2"/>View</li>
                        <li className="dropdown-item" style={{cursor: "pointer"}} onClick={() => toggleFavorite()}><HeartIcon size={20} className="me-2"/><span>{isFav? "Mark Unfavorite" : "Mark Favorite"}</span></li>
                        <li className="dropdown-item"  style={{cursor: "pointer"}} data-bs-toggle="modal" data-bs-target="#exampleModalImgPreview" onClick={() => {setActiveIndex(currIndex); focus.current = true; setCurrAlbumId(albumId || currImage?.albumId)}}><BiComment size={20} className="me-2"/> Add comment</li>
                        <li className="dropdown-item"  style={{cursor: "pointer"}} onClick={() => {navigator.clipboard.writeText(currImage?.imageUrl); toast('Link copied', {
                                position: "bottom-center",
                                autoClose: 1000,
                                hideProgressBar: false,
                                closeOnClick: false,
                                pauseOnHover: false,
                                draggable: false,
                                progress: undefined,
                                theme: "light",
                                transition: Bounce,
                        });}}><Link2Icon size={20} className="me-2"/>Copy link</li>
                        <li className="dropdown-item"  style={{cursor: "pointer"}} onClick={downloadImage}><Download size={20} className="me-2"/>Download image</li>
                        <li className="dropdown-item"  style={{cursor: "pointer"}} onClick={handleImageDelete}><Trash size={20} className="me-2"/> Delete</li>
                    </ul>
                    </div>
                </div>
                <div  className="my-2">
                    {currImage.tags.map(tag => (
                        <span className="rounded-pill px-3 py-1 me-2" style={{background: "#EEEEEE"}}>{tag}</span>
                    ))}
                </div>
                <div className="d-flex align-items-center my-3">
                    <img src={`${userUploadedImageDetails?.userPic}`} className="rounded-circle me-2" style={{width: "25px",height: "25px"}} alt="user Uploaded Image" referrerPolicy="no-referrer"/>
                    <span style={{fontSize: "0.8rem"}}>{userUploadedImageDetails?.name}<br/><span className="text-secondary">{new Date(currImage.uploadedAt).toLocaleString('en-US', {year: "numeric", month: "long", day: "numeric"})}</span></span>
                </div>
                <div className="d-flex align-items-center">
                    <span className="me-3 d-flex align-items-center text-secondary"><HeartIcon size={20} className="me-1"/>{currImage.isFavorite.length}</span>
                    <span className="d-flex align-items-center text-secondary"><BiComment size={20} className="me-1"/>{currImage.comments.length}</span>
                </div>
            </div>
            </div>
        </div>
        </>
    )
}

export default ImageCard;