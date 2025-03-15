import { useSortable } from "@dnd-kit/sortable";
import { DeleteOutline } from "@mui/icons-material";
import { IconButton, useTheme } from "@mui/material";
import { CSS } from '@dnd-kit/utilities';


export default function PhotoItem({ id, upload, handleRemoveFile }: any) {

    const theme = useTheme();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div className='column compact left'
            ref={setNodeRef}

            key={upload.url}
            style={{
                width: "9rem",
                position: "relative",
                marginBottom: "0.5rem",
                cursor: isDragging ? 'grabbing' : 'grab',
                ...style
            }}>
            <div className="column compact"
                {...attributes}
                {...listeners}
            >
                <div style={{
                    width: '9rem',
                    height: '9rem',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    borderRadius: '0.5rem',
                    backgroundImage: upload ? `url(${upload.url})` : '',
                }}>

                </div>
            </div>
            <IconButton
                onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(upload.url, upload.isLocal)
                }}
                sx={{
                    position: "absolute",
                    top: "-1rem",
                    left: "-1rem",
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.error.main,
                    border: `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                        backgroundColor: `${theme.palette.divider} !important`
                    },
                }}>
                <DeleteOutline />
            </IconButton>
        </div>
    )
}