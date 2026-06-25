import {useEffect, useState} from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateDescription = ({description, albumId, onSuccess}) => {
    const [des, setNewDes] = useState(description)
    
    useEffect(() => {
        setNewDes(description)
    },[description])

    async function updateDescription(){
        try {
            const updatedDes = await axios.post(`${import.meta.env.VITE_API_URL}/user/albums/${albumId}`, {description: des}, {withCredentials: true})

            if(updatedDes){
                setNewDes("")
                toast.success("Description updated successfully.")
                onSuccess()
            }
        } catch (error) {
            console.error(error)
            toast.error("Error occured while updating comment.")
        }
    }

    return (
        <div className="modal fade" id="updateDesModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
            <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Update album description</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <label>Description: </label>
                <textarea className="form-control" placeholder="Enter description" value={des} onChange={(e) => setNewDes(e.target.value)}></textarea>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn border border-2" data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn" style={{background: "#3d61ff", color: "#ffffff"}} onClick={updateDescription}>Update Description</button>
            </div>
            </div>
        </div>
        </div>
    )
}

export default UpdateDescription;