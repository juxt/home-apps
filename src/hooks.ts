import { useSearch, useNavigate } from "react-location";
import { LocationGenerics } from "./types";

type ModalState = LocationGenerics["Search"]["modalState"];

export function useModalForm(
  modalState: ModalState
): [boolean, (shouldOpen: boolean) => void] {
  const { modalState: currentModalState, ...search } =
    useSearch<LocationGenerics>();
  const navigate = useNavigate();
  const isModalOpen =
    currentModalState?.formModalType === modalState.formModalType;

  const setIsModalOpen = (shouldOpen: boolean) => {
    if (shouldOpen) {
      navigate({
        replace: true,
        to: ".",
        search: {
          ...search,
          modalState: { ...currentModalState, ...modalState },
        },
      });
    } else {
      navigate({
        to: ".",
        replace: true,
        search: {
          ...search,
        },
      });
    }
  };
  return [isModalOpen, setIsModalOpen];
}
