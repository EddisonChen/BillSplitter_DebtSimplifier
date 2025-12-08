import { useState } from "react"

const AddItem = ({users, setShowPopup}) => {

    console.log(users)

    const [involvedUsers, setInvolvedUsers] = useState([]);
    const [user, setUser] = useState(null);

    const userInputChange = () => {
        setUser(user);
    }

    const addUserToItem = (event) => {
        event.preventDefault();
        if (user !== null) {
            setInvolvedUsers(involvedUsers => [...involvedUsers, user])
        }
    }

    console.log(involvedUsers)
    return(
        <div>
            <form>
                <input type="text" placeholder="Item Name"></input>
                <input type="number" placeholder="Item Cost"></input>
                <select onChange={userInputChange}>
                    <option disabled>-- Select User --</option>
                    {users.map((party) => (
                        <option value={user}>{party}</option>
                    ))}
                </select>
                <button onClick={addUserToItem}>Add User to Transaction</button>
            </form>
        </div>
    )
}

export default AddItem;