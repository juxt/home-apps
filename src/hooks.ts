import { useSearch, useNavigate } from "react-location";
import { LocationGenerics } from "./types";

type ModalState = LocationGenerics["Search"]["modalState"];

export function useModalForm(
  modalState: ModalState
): [boolean, (shouldOpen: boolean) => void] {
  const search = useSearch<LocationGenerics>();
  const navigate = useNavigate();
  const isModalOpen =
    search?.modalState?.formModalType === modalState.formModalType;

  const setIsModalOpen = (shouldOpen: boolean) => {
    if (shouldOpen) {
      navigate({
        to: ".",
        search: {
          ...search,
          modalState: { ...search?.modalState, ...modalState },
        },
      });
    } else {
      navigate({
        to: ".",
        search: {
          ...search,
          modalState: null,
        },
      });
    }
  };
  return [isModalOpen, setIsModalOpen];
}
