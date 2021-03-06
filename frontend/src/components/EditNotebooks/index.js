import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Redirect, useParams } from 'react-router-dom';
import { editNotebook, getAllNotebook } from '../../store/notebooks';

const EditNotebook = () => {
    const {notebookId} = useParams()
    const sessionUser = useSelector((state => state.session.user))
    const dispatch = useDispatch();
    const history = useHistory();
    const [errors, setErrors] = useState([]);
    const notebooks = useSelector((state => state.notebooks[notebookId]))
    const [title, setTitle] = useState(notebooks?.title);

    useEffect(() => {
          dispatch(getAllNotebook())
      }, [dispatch, notebookId, title])

    if (!sessionUser) {
        return <Redirect to="/login" />;
      }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        const notebook = await dispatch(editNotebook(notebookId, title)).catch(async (res) => {

          const data = await res.json();
          if (data && data.errors) {
            const filteredErrors = data.errors.filter(
              (error) => error !== 'Invalid value'
            );
            setErrors(filteredErrors);
          }
        });
        if (notebook) {
          return history.push('/notebooks');
        }
      };

    return (
        <>
            <h2 className="edit-notebook-header">Edit Notebook</h2>
                <form onSubmit={handleSubmit} className="add-notebook-form">
                <div className="error-div">
                    <p className="user-form-errors">
                         {errors.map((error, i) => (
                            <span key={i}>{error}</span>
                        ))}
                    </p>
                 </div>
                    <input
                        onChange ={(e) => setTitle(e.target.value)}
                        name="title"
                        placeholder="untitled notebook"
                        value={title}/>
                    <button className='submit-button' type="submit">
                        Edit Notebook
                    </button>

                </form>
        </>
    )
}

export default EditNotebook
