import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Redirect, useParams } from 'react-router-dom';
import { editNote, getNotes } from '../../store/notes';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const EditNote = () => {
    const { noteId } = useParams()
    const sessionUser = useSelector((state => state.session.user))
    const notes = useSelector((state => state.notes[noteId]))

    const [title, setTitle] = useState('');
    const [hookSize, setHookSize] = useState('')
    const [needleSize, setNeedleSize] = useState('')
    const [yarn, setYarn] = useState('')
    const [description, setDescription] = useState('')
    const dispatch = useDispatch();
    const history = useHistory();
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if(!notes){
            dispatch(getNotes())
        } else {
            setTitle(notes.title)
            setHookSize(notes.hookSize)
            setNeedleSize(notes.needleSize)
            setYarn(notes.yarn)
            setDescription(notes.description)
        }
    }, [dispatch, notes, noteId])


    if (!sessionUser) {
        return <Redirect to="/login" />;
      }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors([])
        const note = await dispatch(editNote(noteId, title, hookSize, needleSize, yarn, description)).catch(async (res) => {
            const data = await res.json()
            if (data && data.errors) {
                const filteredErrors = data.errors.filter(
                  (error) => error !== 'Invalid value'
                );
                setErrors(filteredErrors);
              }
        })
        if(note) {
            return history.push('/notes')
        }
    }

    return (
        <>
            <h2 className="edit-notebook-header">Edit Note</h2>
                <form onSubmit={handleSubmit} className="add-notebook-form">
                <div className="error-div">
                    <p className="user-form-errors">
                         {errors.map((error, i) => (
                            <span key={i}>{error}</span>
                        ))}
                    </p>
                 </div>
                    Title:
                    <input
                        onChange ={(e) => setTitle(e.target.value)}
                        className="title-input"
                        placeholder="Title"
                        value={title}/>
                    Hook Size:
                    <input
                        onChange ={(e) => setHookSize(e.target.value)}
                        className="hook"
                        placeholder="Hook size"
                        value={hookSize}/>
                    Needle Size:
                    <input
                        onChange ={(e) => setNeedleSize(e.target.value)}
                        className="needle"
                        placeholder="Needle size"
                        value={needleSize}/>
                    Yarn:
                    <input
                        onChange ={(e) => setYarn(e.target.value)}
                        className="yarn-input"
                        placeholder="Yarn"
                        value={yarn}/>
                    Description:
                    <div className="editor">
                        <CKEditor
                        editor={ClassicEditor}
                        data={description}
                        onChange={(e, editor) => {
                            const data = editor.getData()
                            setDescription(data)
                        }}/>
                    </div>
                    <button className='note-submit-button' type="submit">
                        Edit Note
                    </button>
                </form>
        </>

    )
}

export default EditNote
