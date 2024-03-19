export const OWNER_ACCESS_FALGS = {
  isShapesEditable: true,
  isMapEditable: true,
  showTools: true,
  showLayers: true,
  showShareOptions: true,
  showExportOptions: true,
  canDeleteProject: true,
  canChangeProjectName: true,
};

export const READ_ACCESS_FLAGS = {
  isShapesEditable: false,
  isMapEditable: false,
  showTools: false,
  showLayers: false,
  showShareOptions: false,
  showExportOptions: true,
  canDeleteProject: false,
  canChangeProjectName: false
};

export const WRITE_ACCESS_FLAGS = {
    isShapesEditable: true,
    isMapEditable: true,
    showTools: true,
    showLayers: true,
    showShareOptions: true,
    showExportOptions: true,
    canDeleteProject: false,
    canChangeProjectName: true
};

export default function intialState() {
  return {
    showImportModal: false,
    showMapSearch: false,
    // project access controls
    accessFlags: {...READ_ACCESS_FLAGS},
  };
}
