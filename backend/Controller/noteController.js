import noteModel from "../Model/noteModel.js";

export const createNote = async (req, res) => {
    const { title, content, category, isPinned } = req.body;

    try {
        if (!title || !content) {
            return res.status(400).json({ success: false, message: "Title and Content are Required!" });
        }

        const allowedCategory = ["personal", "professional", "important"];
        if (category && !allowedCategory.includes(category)) {
            return res.status(400).json({ success: false, message: "Invalid Category!" })
        }
        const note = await noteModel.create({
            user: req.userId,
            title,
            content,
            category,
            isPinned: isPinned === true || isPinned === "true"
        })

        return res.status(201).json({ success: true, message: "Note Added Successfully", data: note });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error in Creating Note!", error: error.message });
    }
}

export const getAllAndCategoryNotes = async (req, res) => {
    const {
        category,
        page = 1,
        limit = 12,
        search,
        month,
        year,
        period
    } = req.query;

    try {
        const pageNum = Number(page);
        const limitNum = Number(limit);

        const query = {
            user: req.userId,
            isArchived: false,
            isDeleted: false
        }

        if (category) {
            const allowedCategory = ["personal", "professional", "important"];
            if (!allowedCategory.includes(category)) {
                return res.status(400).json({ success: false, message: "Invalid Category!" });
            }
            query.category = category;
        }

        if (search) {
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            query.title = {
                $regex: `\\b${escapedSearch}`,
                $options: "i"
            };
        }

        if (period && period !== "custom") {
            const now = new Date();
            let startDate;

            switch (period) {
                case 'today':
                    startDate = new Date(now);
                    startDate.setHours(0, 0, 0, 0);
                    break;

                case 'week':
                    startDate = new Date(now);
                    startDate.setDate(now.getDate() - 7);
                    startDate.setHours(0, 0, 0, 0);
                    break;

                case '15days':
                    startDate = new Date(now);
                    startDate.setDate(now.getDate() - 15);
                    startDate.setHours(0, 0, 0, 0);
                    break;

                case '30days':
                    startDate = new Date(now);
                    startDate.setDate(now.getDate() - 30);
                    startDate.setHours(0, 0, 0, 0);
                    break;

                case 'year':
                    startDate = new Date(now);
                    startDate.setFullYear(now.getFullYear() - 1);
                    startDate.setHours(0, 0, 0, 0);
                    break;

                default:
                    break;
            }

            if (startDate) {
                query.createdAt = { $gte: startDate };
            }
        }

        else if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59);

            query.createdAt = {
                $gte: startDate,
                $lte: endDate
            };
        }

        const skip = (pageNum - 1) * limitNum;

        const notes = await noteModel.find(query).sort({
            isPinned: -1,
            createdAt: -1
        }).skip(skip).limit(limitNum);

        const totalNotes = await noteModel.countDocuments(query);

        return res.status(200).json({
            success: true,
            data: notes,
            pagination: {
                totalNotes,
                currentPage: pageNum,
                totalPages: Math.ceil(totalNotes / limitNum)
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while getting All and Category Notes!",
            error: error.message
        });
    }
}

export const togglePinNote = async (req, res) => {
    const { noteId } = req.params;

    try {
        const note = await noteModel.findOne({
            _id: noteId,
            user: req.userId,
            isArchived: false,
            isDeleted: false
        });

        if (!note) {
            return res.status(404).json({ success: false, message: "Note not Found!" });
        }

        note.isPinned = !note.isPinned;
        await note.save();

        return res.status(200).json({
            success: true,
            message: note.isPinned ? "Note Pinned" : "Note Unpinned",
            data: note
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Pin toggle failed!", error: error.message });
    }
}

export const toggleArchiveNote = async (req, res) => {
    const { noteId } = req.params;

    try {
        const note = await noteModel.findOne({
            _id: noteId,
            user: req.userId,
            isDeleted: false
        });

        if (!note) {
            return res.status(404).json({ success: false, message: "Note not Found!" });
        }

        note.isArchived = !note.isArchived;
        if (note.isArchived) {
            note.isPinned = false;
        }
        await note.save();

        return res.status(200).json({
            success: true,
            message: note.isArchived ? "Note Archived" : "Note UnArchived",
            data: note
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Archive toggle failed!", error: error.message });
    }
}

export const softDeleteNote = async (req, res) => {
    const { noteId } = req.params;

    try {
        const note = await noteModel.findOne({
            _id: noteId,
            user: req.userId
        })

        if (!note) {
            return res.status(404).json({ success: false, message: "Note not Found!" });
        }

        note.isDeleted = true;
        note.isPinned = false;

        await note.save();

        return res.status(200).json({ success: true, message: "Note moved to deleted" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Delete Failed!", error: error.message });
    }
}

export const getArchivedNote = async (req, res) => {
    try {
        const notes = await noteModel.find({
            user: req.userId,
            isArchived: true,
            isDeleted: false
        })

        return res.status(200).json({ success: true, data: notes });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error while getting Archived Notes!", error: error.message });
    }
}

export const getDeletedNotes = async (req, res) => {
    try {
        const notes = await noteModel.find({
            user: req.userId,
            isDeleted: true
        });

        return res.status(200).json({ success: true, data: notes });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error while getting Deleted Notes!", error: error.message });
    }
}

export const restoreNotes = async (req, res) => {
    const { noteId } = req.params;

    try {
        const note = await noteModel.findOne({
            _id: noteId,
            user: req.userId,
            isDeleted: true
        })

        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found in Deleted!" });
        }

        note.isDeleted = false;

        await note.save();

        return res.status(200).json({ success: true, message: "Deleted Note is Restored" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Notes Restored Failed!", error: error.message });
    }
}

export const permanentDelete = async (req, res) => {
    const { noteId } = req.params;

    try {
        const note = await noteModel.findOne({
            _id: noteId,
            user: req.userId,
            isDeleted: true
        });

        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found!" });
        }

        await note.deleteOne();

        return res.status(200).json({ success: true, message: "Note Deleted Permanently" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Permanent Delete Failed!", error: error.message });
    }
}

export const updateNote = async (req, res) => {
    const { title, content, category, isPinned } = req.body;
    const { noteId } = req.params;

    try {
        const note = await noteModel.findOne({
            _id: noteId,
            user: req.userId,
            isDeleted: false
        });

        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found or Already Deleted!" });
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (category) {
            const allowedCategory = ["personal", "professional", "important"];

            if (!allowedCategory.includes(category)) {
                return res.status(400).json({ success: false, message: "Invalid Category!" });
            }

            note.category = category;
        }

        if (!note.isArchived && typeof isPinned === "boolean") {
            note.isPinned = isPinned;
        }

        await note.save();

        return res.status(200).json({ success: true, message: "Note Update Sucessfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Note Update Failed!", error: error.message });
    }
}