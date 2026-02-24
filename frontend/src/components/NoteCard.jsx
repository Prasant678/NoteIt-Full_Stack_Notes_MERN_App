import {
    ArchiveIcon,
    ArrowCounterClockwiseIcon,
    PencilSimpleIcon,
    PushPinIcon,
    TrashIcon,
    TrashSimpleIcon
} from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import Tooltip from "./Tooltip";

const NoteCard = ({
    note,
    screen,
    onPinToggle,
    onArchive,
    onUnarchive,
    onDelete,
    onRestore,
    onPermanentDelete,
    onUpdate
}) => {

    const { actionLoadingId, actionType } = useSelector((state) => state.notes);

    const isLoading = actionLoadingId === note._id;
    const isPinLoading = isLoading && actionType === "pin";
    const isArchiveLoading = isLoading && actionType === "archive";
    const isDeleteLoading = isLoading && actionType === "delete";

    const Spinner = (
        <div className="h-4 w-4 border-2 border-neutral-300 border-t-transparent rounded-full animate-spin" />
    );

    return (
        <div className="bg-[#1613139a] shadow-[0_4px_12px_rgba(0,0,0,0.45)] p-4 rounded border border-neutral-700 min-h-58 flex flex-col justify-between">

            <h2 className="text-lg font-bold text-neutral-200 truncate max-w-62">
                {note.title}
            </h2>

            <p className="text-sm text-neutral-400 mt-2 h-23 overflow-auto rounded">
                {note.content}
            </p>

            <p className="text-xs mt-3 text-blue-400 font-semibold">
                <span className="text-[14px] text-neutral-300 tracking-wider">
                    Category:
                </span>{" "}
                {note.category?.toUpperCase()}
            </p>
            <div className="flex gap-4 mt-4 text-neutral-400 text-lg">
                {screen === "all" && (
                    <div className="flex items-center justify-end gap-7 w-full">
                        {!note.isPinned ?
                            <Tooltip text="Pin">
                                {isPinLoading ? Spinner : (
                                    <PushPinIcon
                                        className="cursor-pointer"
                                        onClick={() => onPinToggle(note._id)}
                                        size={20}
                                        color="#FFD60A"
                                        weight="duotone" />
                                )}
                            </Tooltip> :
                            <Tooltip text="Unpin">
                                {isPinLoading ? Spinner : (
                                    <PushPinIcon
                                        className="cursor-pointer"
                                        onClick={() => onPinToggle(note._id)}
                                        size={20}
                                        color="#FFD60A"
                                        weight="fill" />
                                )}
                            </Tooltip>}

                        <Tooltip text="Archive">
                            {isArchiveLoading ? Spinner : (
                                <ArchiveIcon
                                    className="cursor-pointer"
                                    onClick={() => onArchive(note._id)}
                                    size={22}
                                    color="#22FF88"
                                    weight="duotone"
                                />
                            )}
                        </Tooltip>

                        <Tooltip text="Update">
                            <PencilSimpleIcon
                                className="cursor-pointer"
                                onClick={() => onUpdate(note)}
                                size={21}
                                weight="fill"
                                color="#3AB0FF"
                            />
                        </Tooltip>

                        <Tooltip text="Delete">
                            {isDeleteLoading ? Spinner : (
                                <TrashSimpleIcon
                                    className="cursor-pointer"
                                    onClick={() => onDelete(note._id)}
                                    size={21}
                                    weight="fill"
                                    color="#FF4D6D"
                                />
                            )}
                        </Tooltip>

                    </div>
                )}

                {screen === "archived" && (
                    <div className="flex items-center justify-end gap-7 w-full">

                        <Tooltip text="Unarchive">
                            <ArchiveIcon
                                className="cursor-pointer"
                                onClick={() => onUnarchive(note._id)}
                                size={22}
                                weight="fill"
                                color="#22FF88"
                            />
                        </Tooltip>

                        <Tooltip text="Update">
                            <PencilSimpleIcon
                                className="cursor-pointer"
                                onClick={() => onUpdate(note)}
                                size={21}
                                weight="fill"
                                color="#3AB0FF"
                            />
                        </Tooltip>

                        <Tooltip text="Delete">
                            {isDeleteLoading ? Spinner : (
                                <TrashSimpleIcon
                                    className="cursor-pointer"
                                    onClick={() => onDelete(note._id)}
                                    size={21}
                                    weight="fill"
                                    color="#FF4D6D"
                                />
                            )}
                        </Tooltip>

                    </div>
                )}

                {screen === "deleted" && (
                    <div className="flex items-center justify-end gap-7 w-full">

                        <Tooltip text="Restore">
                            <ArrowCounterClockwiseIcon
                                className="cursor-pointer"
                                onClick={() => onRestore(note._id)}
                                size={21}
                                weight="bold"
                                color="#6EF3FF"
                            />
                        </Tooltip>

                        <Tooltip text="Permanent Delete">
                            <TrashIcon
                                className="cursor-pointer"
                                onClick={() => onPermanentDelete(note._id)}
                                size={20}
                                weight="fill"
                                color="#FF4D6D"
                            />
                        </Tooltip>

                    </div>
                )}

            </div>
        </div>
    );
};

export default NoteCard;