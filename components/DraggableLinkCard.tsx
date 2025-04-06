import { Category } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { DeleteOutline, DragHandleOutlined } from "@mui/icons-material";
import { Button, ButtonBase, IconButton, Typography } from "@mui/material";
import { CSS } from '@dnd-kit/utilities';


export default function DraggableLinkCard({ id, variant = 'flipped', item, onDelete, onClick }:
    { id: string; variant?: string; item: Category; onDelete?: any, onClick?: any }) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };


    return (
        <div ref={setNodeRef} style={style} {...attributes} >
            <div className="flex" >
                <ButtonBase
                    className="flex between middle"
                    sx={{
                        padding: "0.5rem 0",
                        fontWeight: 600,
                        // textTransform: "uppercase",
                        height: "2.75rem"
                    }} >
                    <Typography>{item.name}</Typography>
                   <div className="flex snug fit">
                   <IconButton sx={{ color: "error" }}
                        onClick={e => {
                            e.stopPropagation();
                            onDelete();
                        }}
                    ><DeleteOutline /></IconButton>
                    <IconButton sx={{ color: "inherit" }} {...listeners}><DragHandleOutlined /></IconButton>
                   </div>
                </ButtonBase>
            </div>
        </div>
    );
}