import { useState } from "react";
import checkEmail from "../utils/verifyEmail";
import { toast } from "react-toastify";
import { XIcon } from "lucide-react";
import axios from "axios";

const ShareAlbum = ({albumToShare}) => {
    const [sharedUsers, setSharedUsers] = useState([])
    const [currEmail, setCurrEmail] = useState("")

    function makePill(value){
        const validEmail = checkEmail(value)

        if(validEmail){
            setSharedUsers([...sharedUsers, value])
            setCurrEmail("")
        }else{
            toast.error("Enter valid email address to share album.")
        }
    }

    async function shareAlbumToUsers(){
        try {
            const shareAlbum = await axios.post(`${import.meta.env.VITE_API_URL}/user/albums/${albumToShare?._id}/share`, {sharedUsers: sharedUsers}, {
                withCredentials: true
            })

            if(shareAlbum){
                toast.success("Album Shared Successfully.")
                setSharedUsers([])
            }
        } catch (error) {
            console.error(error)
            toast.error("Error occured while sharing album.")
        }
    }

    return (
    <div className="modal fade" id="staticBackdropShare" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
        <div className="modal-header">
            <h1 className="modal-title fs-5" id="staticBackdropLabel">Share Album</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div className="modal-body">
            <label><strong>Album:</strong></label> <span>{albumToShare?.name}</span><br />
            <label><strong>Add people by email:</strong></label><br />
            <input type="text" className="form-control" placeholder="Enter email address and press Enter" value={currEmail} onChange={(e) => setCurrEmail(e.target.value)}  onKeyDown={(e) => {e.key === "Enter" && makePill(e.target.value)}} required/>
            <div className="d-flex flex-wrap">
                {sharedUsers.map(mail => (
                    <span className="me-2 py-1 px-2 mt-3" style={{background: "#EEEEEE", borderRadius: "5px"}}>{mail}<XIcon size={15} className="ms-1" onClick={() => setSharedUsers(sharedUsers.filter(email => email !== mail))} style={{cursor: "pointer"}}/></span>
                ))}
            </div>
        </div>
        <div className="modal-footer">
            <button type="button" className="btn btn border border-2" data-bs-dismiss="modal">Cancel</button>
            <button type="button" className="btn btn" style={{background: "#3d61ff", color: "#fff"}} onClick={shareAlbumToUsers}>Share Album</button>
        </div>
        </div>
    </div>
    </div>
    )
}

export default ShareAlbum;