import useFetch from "../utils/fetchDetails";
import { useMemo, useRef, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BsHeartFill } from "react-icons/bs";
import { HeartIcon } from "lucide-react";
import { Link2Icon } from "lucide-react";
import { Download } from "lucide-react";
import { MoreVertical } from "lucide-react";

const ImagePreview = ({id, index, focus, onSuccess, imageData}) => {
    const {data: allUsers} = useFetch(`${import.meta.env.VITE_API_URL}/user/googleLogins`)
    const {data: currUser} = useFetch(`${import.meta.env.VITE_API_URL}/user/details`)

    const [currentSlide, setCurrentSlide] = useState(0);
    const [newComment, setNewComment] = useState("")

    const inputRef = useRef(null)

    useEffect(() => {
    const modal = document.getElementById("exampleModalImgPreview");

    const handleShown = () => {
        if (focus.current) {
        inputRef.current?.focus();
        focus.current = false;
        }
    };

    modal.addEventListener("shown.bs.modal", handleShown);

    return () => {
        modal.removeEventListener("shown.bs.modal", handleShown);
    };
    }, []);


    useEffect(() => {
    const carouselEl = document.getElementById("carouselExampleIndicators");

    if (!carouselEl) return;

    const handleSlide = (event) => {
        console.log("Current slide:", event.to);
        setCurrentSlide(event.to);
    };

    carouselEl.addEventListener(
        "slid.bs.carousel",
        handleSlide
    );

    return () => {
        carouselEl.removeEventListener(
            "slid.bs.carousel",
            handleSlide
        );
    };
}, []);


  // Rearrange the array so the chosen image is ALWAYS at index 0
    const reorderedImages = useMemo(() => {
        if (index === 0) return imageData;
        
        const chosenItem = imageData[index];
        const before = imageData.slice(0, index);
        const after = imageData.slice(index + 1);
        
        // New array layout: [Chosen Image, everything after it, everything before it]
        return [chosenItem, ...after, ...before];
    }, [imageData,currentSlide, index]);

    function findUploadDetails(currImageDetails){
        const currUserDetails =  allUsers?.find(user => user.email === currImageDetails?.uploadedBy)

        return currUserDetails;
    }

    function userCommented(commentUserId){
        const commentedUserDetails = allUsers?.find(user => user._id === commentUserId)

        return commentedUserDetails
    }
    
    const currImage = reorderedImages[currentSlide]

    console.log("AlbumId", id)
    console.log("imageId", currImage?._id)

    async function addNewComment(currImgId){
        if(!newComment) return 

        try {
            const makeNewComment = await axios.post(`${import.meta.env.VITE_API_URL}/user/albums/${id}/images/${currImgId}/comments`, {comment: newComment}, {withCredentials: true})

            if(makeNewComment){
                toast.success("Comment added successfully.")
                onSuccess()
                setNewComment("")
            }
        } catch (error) {
            console.error(error)
            toast.error("Error occured while adding new comment.")
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

    const isFav = currImage?.isFavorite.includes(currUser.email)

    return (
        <div className="modal fade" id="exampleModalImgPreview" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered imgPreviewModal">
            <div className="modal-content imgPreviewContent">
            <div className="d-flex justify-content-end pt-2 pe-2">
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" style={{fontSize: "0.85rem"}}></button>
            </div>
            <div className="modal-body imgPreviewBody">
                <div className="imgPreviewRow">
                    <div className="imgPreviewCol">
                        <div id="carouselExampleIndicators" className="carousel slide">
                        <div className="carousel-indicators" style={{marginBottom: "0px"}}>
                            {reorderedImages.map((img, imgIndex) => (
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={imgIndex} className={imgIndex === index ? 'active' : ""} aria-current={imgIndex == index} aria-label="Slide 1"></button>
                            ))}
                        </div>
                        <div className="carousel-inner" style={{background: "#334155", borderRadius: "10px"}}>
                            {reorderedImages.map((img, imgIndex)=> (
                                <div className={`carousel-item ${imgIndex === 0 ? "active" : ""}`}>
                                    <img src={img?.imageUrl} className="d-block w-100" alt="carosel image"/>
                                </div>
                            ))}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                        </div>
                        <div className="d-flex justify-content-center my-3 gap-2 overflow-auto">
                            {reorderedImages.map((img, imgIndex) => (
                                <img
                                    key={img?._id}
                                    src={img?.imageUrl}
                                    alt=""
                                    width={70}
                                    height={70}
                                    style={{
                                        objectFit: "cover",
                                        cursor: "pointer",
                                        border:
                                            currentSlide === imgIndex
                                                ? "3px solid #3d61ff"
                                                : "2px solid transparent",
                                        borderRadius: "8px"
                                    }}
                                    onClick={() => {
                                        const carouselEl = document.getElementById(
                                            "carouselExampleIndicators"
                                        );

                                        const carousel =
                                            Carousel.getOrCreateInstance(carouselEl);

                                        carousel.to(imgIndex);

                                        setCurrentSlide(imgIndex)
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="imgPreviewInfoCol ms-3 text-secondary">
                        <div className="d-flex justify-content-between">
                            <h3 style={{color: "#334155"}}>{currImage?.name}</h3>
                            <div className="pe-3">
                                <span>{ isFav && <BsHeartFill size={20} className="me-2" style={{color: "#FF4D4F"}}/>}</span>
                                <div class="btn-group dropend">
                                <MoreVertical size={15} className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style={{cursor: "pointer"}}/>
                                <ul class="dropdown-menu ps-3" style={{minWidth: "200px"}}>
                                    <li className="d-flex align-items-center"  style={{cursor: "pointer"}} onClick={() => {navigator.clipboard.writeText(currImage?.imageUrl); toast('Link copied', {
                                            position: "top-center",
                                            autoClose: 1000,
                                            hideProgressBar: false,
                                            closeOnClick: false,
                                            pauseOnHover: false,
                                            draggable: false,
                                            progress: undefined,
                                            theme: "colored",
                                            transition: Bounce,
                                    })}} ><Link2Icon size={20} className="me-2"/>Copy link</li>
                                    <li className="d-flex align-items-center"  style={{cursor: "pointer"}} onClick={downloadImage}><Download size={20} className="me-2"/>Download image</li>
                                </ul>
                                </div>
                            </div>
                        </div>
                        <div className="my-3 row imgPreviewContent">
                            <span className="col-5 col-lg-4">Tags :</span>
                            <span className="col-7 col-lg-8">{currImage?.tags.map(tag => (
                                <span className="rounded-pill px-2 py-1 text-secondary me-2" style={{background: "#EEEEEE"}}>{tag}</span>
                            ))}</span>
                        </div>
                        <div className="my-3 row imgPreviewContent">
                            <span className="col-5 col-lg-4">Uploaded by :</span>
                            <div className="col-7 col-lg-8">
                                <span><img src={findUploadDetails(currImage)?.userPic} className="rounded-circle me-2" alt="uploader Pic" referrerPolicy="no-referrer" style={{height: "25px", width: "25px"}}/></span>
                                <span>{findUploadDetails(currImage)?.name}</span>
                            </div>
                        </div>
                        <div className="my-3 row pe-0 imgPreviewContent">
                            <span className="col-5 col-lg-4">Uploaded On :</span>
                            <span className="col-7 col-lg-8">{new Date(currImage?.uploadedAt).toLocaleString('en-US', {year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric"})}</span>
                        </div>
                        <div className="my-3 row imgPreviewContent">
                            <span className="col-5 col-lg-4">File Size :</span>
                            <span className="col-7 col-lg-8">{((currImage?.size)/1048576).toFixed(2)} MB</span>
                        </div>
                        <hr className="me-3"/>
                        <div className="pb-2">
                            <h3 style={{color: "#334155"}}>Comments ({currImage?.comments.length})</h3>
                            <div style={{height: "180px", overflowY: "auto"}}>
                                {currImage?.comments.length === 0
                                ?
                                <div className="text-secondary d-flex justify-content-center align-items-center">
                                    <p><em>"No comments yet, Add new comment."</em></p>
                                </div>
                                :
                                currImage?.comments.map(comment => (
                                    <div className="pe-3">
                                    <div className="d-flex align-items-center" style={{fontSize: "0.85rem"}}>
                                        <span><img src={userCommented(comment.user)?.userPic} className="rounded-circle me-2" alt="uploader Pic" referrerPolicy="no-referrer" style={{height: "35px", width: "35px"}}/></span>
                                        <div>
                                            <div><span className="text-dark"><strong>{userCommented(comment.user)?.name}</strong></span>  <span className="commentDate">{new Date(comment.createdAt).toLocaleString('en-US', {year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric"})}</span></div>
                                            <span className="text-dark">{comment.text}</span>
                                        </div>
                                    </div>
                                    <hr/>
                                    </div>
                                ))
                                }
                            </div>
                            <div className="me-3 pt-2">
                                <textarea name="" id="" className="form-control me-3" placeholder="Write a comment" ref={inputRef} value={newComment} onChange={(e) => setNewComment(e.target.value)}></textarea>
                            </div>
                            <div className="d-flex justify-content-end me-3 pt-2">
                                <button type="button" className="btn btn-primary" style={{background: "#3d61ff"}} onClick={() => addNewComment(currImage?._id)}>Add Comment</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    )
}

export default ImagePreview;

