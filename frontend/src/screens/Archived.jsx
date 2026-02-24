import React, { useEffect, useState } from "react";
import NoteCard from "../components/NoteCard";
import EditNoteModal from "../components/EditNoteModal";
import ConfirmModal from "../components/ConfirmModal";
import { useDispatch, useSelector } from "react-redux";
import { getArchivedNotes, softDelete, toggleArchive } from "../redux/features/noteSlice";

const ArchivedNotes = () => {
  const dispatch = useDispatch();
  const { archivedNotes, getLoading, actionLoadingId, actionType } = useSelector((state) => state.notes);

  const [openModal, setOpenModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    dispatch(getArchivedNotes());
  }, [dispatch]);

  const handleUnarchive = (note) => {
    setSelectedNote(note);
    setOpenConfirm(true);
  };

  const confirmUnarchive = async () => {
    if (!selectedNote) return;

    await dispatch(toggleArchive(selectedNote)).unwrap();
    dispatch(getArchivedNotes());
    setOpenConfirm(false);
  }

  const handleDelete = async (noteId) => {
    await dispatch(softDelete(noteId)).unwrap();
    dispatch(getArchivedNotes());
  };

  const handleUpdate = (note) => {
    setSelectedNote(note);
    setOpenModal(true);
  };

  const refreshArchiveNotes = () => {
    dispatch(getArchivedNotes());
  }

  return (
    <div className="md:px-32 px-6 py-6 pt-25">
      <h1 className="text-3xl font-bold tracking-widest mb-7 text-center">
        Archived Notes
      </h1>

      {getLoading ? (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
          {archivedNotes?.map(note => (
            <NoteCard
              key={note._id}
              note={note}
              screen="archived"
              onUnarchive={handleUnarchive}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
      <EditNoteModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        note={selectedNote}
        screen="archive"
        onRefresh={refreshArchiveNotes}
      />
      <ConfirmModal
        isOpen={openConfirm}
        onClose={() => setOpenConfirm(false)}
        message="Are you sure you want to unarchive?"
        btnText="Unarchive"
        onConfirm={confirmUnarchive}
        loading={
          actionLoadingId === selectedNote?._id &&
          actionType === "archive"
        }
        btnColor={"bg-green-600"}
        btnHover={"hover:bg-green-700"}
        color={"text-black"}
      />
    </div>
  );
};

export default ArchivedNotes;