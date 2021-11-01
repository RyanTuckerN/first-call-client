import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Container, IconButton } from "@mui/material";
import { Cancel, CancelOutlined } from "@mui/icons-material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  maxWidth: "90vw",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface BasicModalProps {
  children: any;
  modalTitle: string;
  open: boolean;
  setOpen: (b: boolean) => void;
}

export default function BasicModal({
  children,
  modalTitle,
  open,
  setOpen,
}: BasicModalProps) {
  // const [open, setOpen] = React.useState(open);
  const handleClose = () => setOpen(false);

  return (
    <Container maxWidth={"xl"}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby={`modal-${modalTitle}-title`}
        aria-describedby={`modal-${modalTitle}-description`}
        
      >
        {/* <> */}
          {/* <IconButton sx={{position: 'absolute', top: 30, right: 100, zIndex: 9999}}>
            <CancelOutlined  />
          </IconButton> */}
          <Box sx={style}>{children}</Box>
        {/* </> */}
      </Modal>
    </Container>
  );
}
