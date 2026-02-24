import React, { useEffect, useState } from 'react'
import NoteCard from '../components/NoteCard';
import { useDispatch, useSelector } from 'react-redux';
import { getDeletedNotes, permanentDelete, restoreNote } from '../redux/features/noteSlice';
import ConfirmModal from '../components/ConfirmModal';

const Deleted = () => {
  const dispatch = useDispatch();
  const { deletedNotes, getLoading, actionLoadingId, actionType } = useSelector((state) => state.notes);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [action, setAction] = useState("");

  useEffect(() => {
    dispatch(getDeletedNotes());
  }, [dispatch]);

  const handleDelete = (note) => {
    setSelectedNote(note);
    setAction("delete");
    setOpenConfirm(true);
  };

  const handleRestore = (note) => {
    setSelectedNote(note);
    setAction("restore");
    setOpenConfirm(true);
  };

  const handleConfirm = async () => {
    if (!selectedNote) return;

    if (action === "delete") {
      await dispatch(permanentDelete(selectedNote)).unwrap();
    }

    if (action === "restore") {
      await dispatch(restoreNote(selectedNote)).unwrap();
    }

    dispatch(getDeletedNotes());
    setOpenConfirm(false);
  };

  return (
    <div className="md:px-32 px-6 py-6 pt-25">
      <h1 className="text-3xl font-bold tracking-widest mb-7 text-center">
        Deleted Notes
      </h1>

      {getLoading ? (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
          {deletedNotes?.map(note => (
            <NoteCard
              key={note._id}
              note={note}
              screen="deleted"
              onRestore={handleRestore}
              onPermanentDelete={handleDelete}
            />
          ))}
        </div>
      )}
      <ConfirmModal
        isOpen={openConfirm}
        onClose={() => setOpenConfirm(false)}
        message={
          action === "delete"
            ? "Are you sure you want to permanently delete?"
            : "Are you sure you want to restore this note?"
        }
        btnText={action === "delete" ? "Delete" : "Restore"}
        loading={
          actionLoadingId === selectedNote?._id &&
          (actionType === "delete" || actionType === "restore")
        }
        onConfirm={handleConfirm}
        btnColor={action === "delete" ? "bg-red-600" : "bg-blue-500"}
        btnHover={action === "delete" ? "hover:bg-red-700" : "hover:bg-blue-600"}
        color={action === "delete" ? "text-white" : "text-black"}
        spinColor={action === "delete" ? "border-white" : "border-black"}
      />
    </div>
  );
}

export default Deleted