import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";
import { toast } from "sonner";

export const addNote = createAsyncThunk("notes/addNote",
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.post("/notes", data);
            return res.data;
        } catch (error) {
            return rejectWithValue(error?.message || { message: "Failed to add note" });
        }
    }
)

export const getAllNotes = createAsyncThunk("notes/getAllNotes",
    async (params, { rejectWithValue }) => {
        try {
            const res = await api.get("/notes", { params });
            return res.data;
        } catch (error) {
            return rejectWithValue(error?.message || { message: "Failed to fetch notes" })
        }
    }
)

export const togglePin = createAsyncThunk("notes/togglePin",
    async (noteId, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/notes/${noteId}/pin`);
            return res.data
        } catch (error) {
            return rejectWithValue(error?.message || "Pin toggle Failed!");
        }
    }
)

export const toggleArchive = createAsyncThunk("notes/toggleArchive",
    async (noteId, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/notes/${noteId}/archive`);
            return res.data
        } catch (error) {
            return rejectWithValue(error?.message || "Archive toggle Failed!");
        }
    }
)

export const softDelete = createAsyncThunk("notes/softDelete",
    async (noteId, { rejectWithValue }) => {
        try {
            const res = await api.delete(`/notes/${noteId}`);
            return res.data
        } catch (error) {
            return rejectWithValue(error?.message || "Soft Delete Failed!");
        }
    }
)

export const getArchivedNotes = createAsyncThunk("notes/getArchivedNotes",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/notes/archived");
            return res.data
        } catch (error) {
            return rejectWithValue(error?.message || "Archived Notes Fatching Failed!");
        }
    }
)

export const getDeletedNotes = createAsyncThunk("notes/getDeletedNotes",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/notes/deleted");
            return res.data
        } catch (error) {
            return rejectWithValue(error?.message || "Archived Notes Fatching Failed!");
        }
    }
)

export const updateNote = createAsyncThunk("notes/updateNote",
    async ({ noteId, data }, { rejectWithValue }) => {
        try {
            const res = await api.put(`/notes/${noteId}`, data);
            return res.data
        } catch (error) {
            return rejectWithValue(error?.message || "Note Update Failed!");
        }
    }
)

export const restoreNote = createAsyncThunk("notes/restoreNote",
    async (noteId, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/notes/${noteId}/restore`);
            return res.data
        } catch (error) {
            return rejectWithValue(error?.message || "Note Restored Failed!");
        }
    }
)

export const permanentDelete = createAsyncThunk("notes/permanentDelete",
    async (noteId, { rejectWithValue }) => {
        try {
            const res = await api.delete(`/notes/${noteId}/permanent`);
            return res.data
        } catch (error) {
            return rejectWithValue(error?.message || "Permanent Delete Failed!");
        }
    }
)

const initialState = {
    notes: [],
    archivedNotes: [],
    deletedNotes: [],
    pagination: {
        totalNotes: 0,
        currentPage: 1,
        totalPages: 1,
    },

    filters: {
        category: null,
        search: "",
        period: null,
        month: null,
        year: null,
        page: 1,
    },

    addLoading: false,
    getLoading: false,
    actionLoadingId: null,
    actionType: null,
    error: null,
    success: false,
}

const noteSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        clearNotes: (state) => {
            state.notes = [];
            state.pagination = {
                totalNotes: 0,
                currentPage: 1,
                totalPages: 1,
            };
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addNote.pending, (state) => {
            state.addLoading = true;
            state.error = null;
        })
            .addCase(addNote.fulfilled, (state, action) => {
                state.addLoading = false;
                state.notes.unshift(action.payload.data);
                toast.success(action.payload?.message || "Note Added SuccessFully")
            })
            .addCase(addNote.rejected, (state, action) => {
                state.addLoading = false;
                state.error = action.payload?.message;
                toast.error(state.error);
            })
            .addCase(getAllNotes.pending, (state) => {
                state.getLoading = true;
                state.error = null;
            })
            .addCase(getAllNotes.fulfilled, (state, action) => {
                state.getLoading = false;
                state.notes = action.payload.data;
                state.pagination = action.payload.pagination;
            })
            .addCase(getAllNotes.rejected, (state, action) => {
                state.getLoading = false;
                state.error = action.payload?.message || "Failed to fetch notes";
                toast.error(state.error);
            })
            .addCase(togglePin.pending, (state, action) => {
                state.actionLoadingId = action.meta.arg;
                state.actionType = "pin";
            })

            .addCase(togglePin.fulfilled, (state, action) => {
                state.actionLoadingId = null;
                state.actionType = null;

                const updatedNote = action.payload.data;

                state.notes = state.notes.map(note =>
                    note._id === updatedNote._id ? updatedNote : note
                );

                toast.success(action.payload?.message || "Pin updated");
            })
            .addCase(togglePin.rejected, (state, action) => {
                state.actionLoadingId = null;
                state.actionType = null;
                state.error = action.payload || "Pin toggle failed"
                toast.error(state.error);
            })
            .addCase(toggleArchive.pending, (state, action) => {
                state.actionLoadingId = action.meta.arg;
                state.actionType = "archive";
            })
            .addCase(toggleArchive.fulfilled, (state, action) => {
                state.actionLoadingId = null;
                state.actionType = null;

                const updatedNote = action.payload.data;

                state.notes = state.notes.filter(
                    note => note._id !== updatedNote._id
                );

                state.archivedNotes = state.archivedNotes.filter(
                    note => note._id !== updatedNote._id
                );

                toast.success(action.payload?.message || "Archive updated");
            })
            .addCase(toggleArchive.rejected, (state, action) => {
                state.actionLoadingId = null;
                state.actionType = null;
                state.error = action.payload || "Archive failed"
                toast.error(state.error);
            })
            .addCase(softDelete.pending, (state, action) => {
                state.actionLoadingId = action.meta.arg;
                state.actionType = "delete";
            })
            .addCase(softDelete.fulfilled, (state, action) => {
                state.actionLoadingId = null;
                state.actionType = null;

                const deletedId = action.meta.arg;

                state.notes = state.notes.filter(
                    note => note._id !== deletedId
                );

                toast.success(action.payload?.message || "Moved to deleted");
            })
            .addCase(softDelete.rejected, (state, action) => {
                state.actionLoadingId = null;
                state.actionType = null;
                state.error = action.payload || "Delete failed"
                toast.error(state.error);
            })
            .addCase(getArchivedNotes.pending, (state) => {
                state.getLoading = true;
                state.error = null;
            })

            .addCase(getArchivedNotes.fulfilled, (state, action) => {
                state.getLoading = false;
                state.archivedNotes = action.payload.data;
            })

            .addCase(getArchivedNotes.rejected, (state, action) => {
                state.getLoading = false;
                state.error = action.payload;
            })
            .addCase(getDeletedNotes.pending, (state) => {
                state.getLoading = true;
                state.error = null;
            })

            .addCase(getDeletedNotes.fulfilled, (state, action) => {
                state.getLoading = false;
                state.deletedNotes = action.payload.data;
            })

            .addCase(getDeletedNotes.rejected, (state, action) => {
                state.getLoading = false;
                state.error = action.payload;
            })
            .addCase(updateNote.pending, (state, action) => {
                state.actionLoadingId = action.meta.arg.noteId;
                state.actionType = "update";
            })
            .addCase(updateNote.fulfilled, (state, action) => {
                state.actionLoadingId = null;
                state.actionType = null;

                const updatedNote = action.payload?.data;

                if (!updatedNote || !updatedNote._id) return;

                state.notes = (state.notes || []).map(note =>
                    note && note._id === updatedNote._id ? updatedNote : note
                );

                state.archivedNotes = (state.archivedNotes || []).map(note =>
                    note && note._id === updatedNote._id ? updatedNote : note
                );
                toast.success(action.payload?.message || "Note updated successfully");
            })
            .addCase(updateNote.rejected, (state, action) => {
                state.actionLoadingId = null;
                state.actionType = null;
                state.error = action.payload || "Note update failed"
                toast.error(state.error);
            })
            .addCase(restoreNote.pending, (state, action) => {
                state.actionLoadingId = action.meta.arg;
                state.actionType = "restore";
            })
            .addCase(restoreNote.fulfilled, (state, action) => {
                state.actionLoadingId = null;
                state.actionType = null;

                const restoreId = action.meta.arg;

                state.deletedNotes = state.deletedNotes.filter(
                    note => note._id !== restoreId
                );

                toast.success(action.payload?.message || "Note restored");
            })
            .addCase(restoreNote.rejected, (state, action) => {
                state.actionLoadingId = null;
                state.actionType = null;
                state.error = action.payload || "Restore failed"
                toast.error(state.error);
            })
            .addCase(permanentDelete.pending, (state, action) => {
                state.actionLoadingId = action.meta.arg;
                state.actionType = "permanent";
            })
            .addCase(permanentDelete.fulfilled, (state, action) => {
                state.actionLoadingId = null;
                state.actionType = null;

                const permanentDeleteId = action.meta.arg;

                state.deletedNotes = state.deletedNotes.filter(
                    note => note._id !== permanentDeleteId
                );

                toast.success(action.payload?.message || "Note permanently deleted");
            })
            .addCase(permanentDelete.rejected, (state, action) => {
                state.actionLoadingId = null;
                state.actionType = null;
                state.error = action.payload || "Permanent delete failed"
                toast.error(state.error);
            })
    }
})

export const { clearNotes } = noteSlice.actions;
export default noteSlice.reducer;