import { PROJECT_ACCESS } from "@/models/Project.model";

export default function intialState() {
    return {
        activeProject: null,
        activeProjectAccess: PROJECT_ACCESS.READ,
        projectIds: [],
        projects: {}
    }
}