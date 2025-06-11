import { Expand, Shrink } from "lucide-react";

const NavBarToggle = ({ open }: { open: boolean }) => {
  return open ? <Expand />: <Shrink /> ;
};

export default NavBarToggle;
