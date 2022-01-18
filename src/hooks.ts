import { useSearch, useNavigate } from "react-location";
import { useKanbanDataQuery } from "./generated/graphql";
import { notEmpty } from "./kanbanHelpers";
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

function getMobileDetect(userAgent: string) {
  const isAndroid = (): boolean => Boolean(userAgent.match(/Android/i));
  const isIos = (): boolean => Boolean(userAgent.match(/iPhone|iPad|iPod/i));
  const isOpera = (): boolean => Boolean(userAgent.match(/Opera Mini/i));
  const isWindows = (): boolean => Boolean(userAgent.match(/IEMobile/i));
  const isSSR = (): boolean => Boolean(userAgent.match(/SSR/i));

  const isMobile = (): boolean =>
    Boolean(isAndroid() || isIos() || isOpera() || isWindows());
  const isDesktop = (): boolean => Boolean(!isMobile() && !isSSR());
  return {
    isMobile,
    isDesktop,
    isAndroid,
    isIos,
    isSSR,
  };
}

export function useMobileDetect() {
  const userAgent =
    typeof navigator === "undefined" ? "SSR" : navigator.userAgent;
  return getMobileDetect(userAgent);
}

export function useWorkflowStates() {
  const workflowStateResult = useKanbanDataQuery(undefined, {
    select: (data) => data?.allWorkflowStates?.filter(notEmpty),
  });
  return workflowStateResult;
}

export function useStatesOptions() {
  const workflowStateResult = useWorkflowStates();
  const cols =
    workflowStateResult?.data?.map((c) => {
      return {
        value: c.id,
        label: c.name,
      };
    }) || [];
  return cols;
}

export function useWorkflowState(id?: string) {
  const workflowStateResult = useKanbanDataQuery(undefined, {
    select: (data) =>
      data?.allWorkflowStates?.filter(notEmpty).find((c) => c.id === id),
  });
  return workflowStateResult;
}

export function useProjectOptions() {
  const kanbanDataQuery = useKanbanDataQuery(undefined, {
    select: (data) => data?.allProjects?.filter(notEmpty),
  });
  return (
    kanbanDataQuery?.data?.map((p) => {
      return {
        label: p.name,
        value: p.id,
      };
    }) ?? []
  );
}

export function useCurrentProject() {
  const projectId = useSearch<LocationGenerics>().filters?.projectId;
  const projectQuery = useKanbanDataQuery(undefined, {
    select: (data) =>
      data?.allProjects?.filter(notEmpty).find((p) => p.id === projectId),
  });
  return projectQuery;
}
